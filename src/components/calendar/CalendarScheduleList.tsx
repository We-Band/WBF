import React from 'react';
import * as S from './Calendar.styled';
import { BLOCKNUM, WEEK } from '@constants/time';
import { Cell, cellIndex, isInRect, parseCount } from '@utils/schedule';

interface CalendarScheduleProps {
  /** 칸마다 '0'/'1' 비트 또는 인원 수(36진수) */
  scheduleString: string;
  /** 색 농도 계산 기준 인원 수 */
  totalUser: number;
  /** 편집 중 범위 선택의 시작 칸 */
  anchor?: Cell | null;
  /** 편집 중 마우스가 올라간 칸 (범위 미리보기용) */
  hover?: Cell | null;
  /** 미리보기가 지우기인지 */
  erasing?: boolean;
  /** 강조할 칸 인덱스 (가장 많이 겹치는 시간) */
  bestIndexes?: Set<number>;
  /** 눌러서 살펴보는 중인 칸 */
  inspectedIndex?: number | null;
  onCellClick: (cell: Cell) => void;
  onCellHover?: (cell: Cell) => void;
}

const CalendarScheduleList: React.FC<CalendarScheduleProps> = ({
  scheduleString,
  totalUser,
  anchor = null,
  hover = null,
  erasing = false,
  bestIndexes,
  inspectedIndex = null,
  onCellClick,
  onCellHover,
}) => {
  const renderCell = (cell: Cell) => {
    const index = cellIndex(cell);
    const inPreview =
      anchor !== null && isInRect(anchor, hover ?? anchor, cell);

    return (
      <S.CalendarSchedule
        key={cell.slot}
        $num={parseCount(scheduleString[index])}
        $total={totalUser}
        $preview={inPreview ? (erasing ? 'erase' : 'add') : undefined}
        $best={bestIndexes?.has(index)}
        $inspected={inspectedIndex === index}
        onClick={() => onCellClick(cell)}
        onMouseEnter={() => onCellHover?.(cell)}
      />
    );
  };

  return (
    <S.CalendarScheduleGrid>
      {Array.from({ length: WEEK }).map((_, day) => (
        <S.CalendarScheduleLine key={day}>
          {Array.from({ length: BLOCKNUM }).map((_, hour) => (
            <S.CalendarScheduleSection key={hour}>
              {renderCell({ day, slot: hour * 2 })}
              {renderCell({ day, slot: hour * 2 + 1 })}
            </S.CalendarScheduleSection>
          ))}
        </S.CalendarScheduleLine>
      ))}
    </S.CalendarScheduleGrid>
  );
};

export default CalendarScheduleList;
