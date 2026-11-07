import { NOSCHEDULE } from '@constants/time';
import * as S from './Calendar.styled';
import CalendarDateList from './CalendarDateList';
import CalendarTimeList from './CalendarTimeList';
import {
  Cell,
  cellIndex,
  dayLabel,
  findBestRanges,
  indexToCell,
  paintRect,
  slotRangeLabel,
  SLOTS_PER_DAY,
  sumBinaryStrings,
} from '@utils/schedule';
import CalendarScheduleList from './CalendarScheduleList';
import { useLiteContext } from '@components/lite/LiteHome';
import { useEffect, useMemo, useState } from 'react';
import useTeamStore from '@store/team';
import { Member } from '@api/team';

const NO_MEMBERS: Member[] = [];
const HISTORY_LIMIT = 30;

const LiteCalendar = ({ userToggle }: { userToggle: boolean }) => {
  const members = useTeamStore((state) => state.team?.members ?? NO_MEMBERS);
  const startDate = useTeamStore((state) => state.team?.startDate ?? '');
  const { selectedUser, editingSchedule, setEditingSchedule } =
    useLiteContext();

  const selectedSchedule = selectedUser
    ? (members.find((member) => member.name === selectedUser)?.schedule ??
      NOSCHEDULE)
    : NOSCHEDULE;

  const [anchor, setAnchor] = useState<Cell | null>(null);
  const [hover, setHover] = useState<Cell | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [inspectedIndex, setInspectedIndex] = useState<number | null>(null);

  // 편집 모드에 들어갈 때 원래 일정으로 초안을 시작하고, 나올 때 선택 상태를 정리한다.
  useEffect(() => {
    if (userToggle) setEditingSchedule(selectedSchedule);
    setAnchor(null);
    setHover(null);
    setHistory([]);
    setInspectedIndex(null);
  }, [userToggle]);

  useEffect(() => setInspectedIndex(null), [selectedUser]);

  // 범위 선택 중 Esc로 취소
  useEffect(() => {
    if (!anchor) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAnchor(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [anchor]);

  const counts = useMemo(
    () => sumBinaryStrings(members.map((m) => m.schedule)),
    [members],
  );
  const best = useMemo(() => findBestRanges(counts), [counts]);
  const bestIndexes = useMemo(() => {
    // 모두가 같은 칸 하나만 고른 게 아니라면 의미 있는 강조만 한다 (최소 2명 이상).
    if (best.max < 2) return new Set<number>();
    return new Set(
      best.ranges.flatMap(({ day, slotStart, slotEnd }) =>
        Array.from(
          { length: slotEnd - slotStart + 1 },
          (_, i) => day * SLOTS_PER_DAY + slotStart + i,
        ),
      ),
    );
  }, [best]);

  const handleCellClick = (cell: Cell) => {
    if (!userToggle) {
      if (selectedUser) return;
      const index = cellIndex(cell);
      setInspectedIndex((prev) => (prev === index ? null : index));
      return;
    }

    if (!anchor) {
      setAnchor(cell);
      setHover(cell);
      return;
    }

    setHistory((prev) => [...prev, editingSchedule].slice(-HISTORY_LIMIT));
    setEditingSchedule(paintRect(editingSchedule, anchor, cell));
    setAnchor(null);
    setHover(null);
  };

  const handleUndo = () => {
    const previous = history[history.length - 1];
    if (previous === undefined) return;
    setHistory((prev) => prev.slice(0, -1));
    setEditingSchedule(previous);
    setAnchor(null);
  };

  const renderInfo = () => {
    if (userToggle) {
      return anchor ? (
        <S.CalendarInfoRow>
          <S.CalendarInfoText>
            <S.CalendarInfoStrong>끝 칸</S.CalendarInfoStrong>을 눌러 주세요.
            같은 칸을 한 번 더 누르면 그 칸만{' '}
            {editingSchedule[cellIndex(anchor)] === '1'
              ? '지워져요'
              : '칠해져요'}
            .
          </S.CalendarInfoText>
          <S.CalendarInfoButton type="button" onClick={() => setAnchor(null)}>
            선택 취소
          </S.CalendarInfoButton>
        </S.CalendarInfoRow>
      ) : (
        <S.CalendarInfoRow>
          <S.CalendarInfoText>
            가능한 시간의 <S.CalendarInfoStrong>시작 칸</S.CalendarInfoStrong>을
            누르고, <S.CalendarInfoStrong>끝 칸</S.CalendarInfoStrong>을
            누르세요. 칠한 칸에서 시작하면 지워져요.
          </S.CalendarInfoText>
          {history.length > 0 && (
            <S.CalendarInfoButton type="button" onClick={handleUndo}>
              되돌리기
            </S.CalendarInfoButton>
          )}
        </S.CalendarInfoRow>
      );
    }

    if (selectedUser) {
      return (
        <S.CalendarInfoText>
          <S.CalendarInfoStrong>{selectedUser}</S.CalendarInfoStrong>님이 가능한
          시간이에요.
        </S.CalendarInfoText>
      );
    }

    if (members.length === 0) {
      return (
        <S.CalendarInfoText>
          아직 응답한 사람이 없어요.{' '}
          <S.CalendarInfoStrong>내 시간 입력</S.CalendarInfoStrong>을 눌러
          가능한 시간을 알려 주세요.
        </S.CalendarInfoText>
      );
    }

    if (inspectedIndex !== null) {
      const { day, slot } = indexToCell(inspectedIndex);
      const available = members.filter(
        (m) => m.schedule[inspectedIndex] === '1',
      );

      return (
        <>
          <S.CalendarInfoText>
            {dayLabel(startDate, day)} {slotRangeLabel(slot)} ·{' '}
            <S.CalendarInfoStrong>
              {available.length}/{members.length}명
            </S.CalendarInfoStrong>{' '}
            가능
          </S.CalendarInfoText>
          <S.CalendarInfoSub>
            {available.length > 0
              ? available.map((m) => m.name).join(', ')
              : '이 시간에 가능한 사람이 없어요.'}
          </S.CalendarInfoSub>
        </>
      );
    }

    const [first, ...rest] = best.ranges;

    return (
      <>
        <S.CalendarInfoText>
          응답 <S.CalendarInfoStrong>{members.length}명</S.CalendarInfoStrong>
          {best.max > 0 && first && (
            <>
              {' '}
              · 가장 많이 겹치는 시간{' '}
              <S.CalendarInfoStrong>
                {dayLabel(startDate, first.day)}{' '}
                {slotRangeLabel(first.slotStart, first.slotEnd)}
              </S.CalendarInfoStrong>{' '}
              ({best.max}명{rest.length > 0 ? `, 외 ${rest.length}곳` : ''})
            </>
          )}
        </S.CalendarInfoText>
        <S.CalendarInfoRow>
          <S.CalendarInfoSub>
            칸을 누르면 가능한 사람이 보여요.
          </S.CalendarInfoSub>
          <S.Legend aria-hidden>
            <S.CalendarInfoSub>1명</S.CalendarInfoSub>
            <S.LegendBar />
            <S.CalendarInfoSub>{members.length}명</S.CalendarInfoSub>
            {bestIndexes.size > 0 && (
              <>
                <S.LegendBest />
                <S.CalendarInfoSub>최다</S.CalendarInfoSub>
              </>
            )}
          </S.Legend>
        </S.CalendarInfoRow>
      </>
    );
  };

  const isEditing = userToggle;
  const erasing =
    isEditing && anchor !== null && editingSchedule[cellIndex(anchor)] === '1';

  return (
    <S.LiteCalendarContainer>
      <S.CalendarInfoBar role="status" aria-live="polite">
        {renderInfo()}
      </S.CalendarInfoBar>
      <CalendarDateList />
      <S.CalendarScheduleContainer>
        <CalendarTimeList />
        <CalendarScheduleList
          scheduleString={
            isEditing
              ? editingSchedule
              : selectedUser
                ? selectedSchedule
                : counts
          }
          totalUser={isEditing || selectedUser ? 1 : members.length}
          anchor={isEditing ? anchor : null}
          hover={hover}
          erasing={erasing}
          bestIndexes={isEditing || selectedUser ? undefined : bestIndexes}
          inspectedIndex={isEditing || selectedUser ? null : inspectedIndex}
          onCellClick={handleCellClick}
          onCellHover={(cell) => anchor && setHover(cell)}
        />
      </S.CalendarScheduleContainer>
    </S.LiteCalendarContainer>
  );
};

export default LiteCalendar;
