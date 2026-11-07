import React, { useEffect, useState } from 'react';
import * as S from './Calendar.styled';
import { BLOCKNUM, WEEK } from '@constants/time';
import { useLiteContext } from '@components/lite/LiteHome';
import { parseCount } from '@utils/schedule';

interface CalendarScheduleProps {
  totalUser: number;
  scheduleString: string;
  edit: boolean;
}

const CalendarScheduleList: React.FC<CalendarScheduleProps> = ({
  totalUser,
  scheduleString: initialScheduleString,
  edit,
}) => {
  const [scheduleString, setScheduleString] = useState(initialScheduleString);
  const { setEditingSchedule } = useLiteContext();
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const getIndex = (weekIdx: number, sectionIdx: number, pos: number) =>
    weekIdx * 30 + sectionIdx * 2 + pos;

  const handleTouch = (weekIdx: number, sectionIdx: number, pos: number) => {
    const index = getIndex(weekIdx, sectionIdx, pos);

    if (startIndex === null) {
      setStartIndex(index); // 첫 클릭
      setCurrentIndex(index); // 현재 위치도 설정
    } else {
      const [from, to] = [startIndex, index].sort((a, b) => a - b);
      const updated = scheduleString
        .split('')
        .map((char, i) =>
          i >= from && i <= to ? (char === '0' ? '1' : '0') : char,
        )
        .join('');

      setScheduleString(updated);
      setStartIndex(null);
      setCurrentIndex(null);
    }
  };

  const handleHover = (weekIdx: number, sectionIdx: number, pos: number) => {
    if (startIndex !== null) {
      const index = getIndex(weekIdx, sectionIdx, pos);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    setScheduleString(initialScheduleString);
    setStartIndex(null);
    setCurrentIndex(null);
  }, [edit]);

  useEffect(() => {
    if (edit) {
      setEditingSchedule(scheduleString);
    }
  }, [scheduleString]);

  return (
    <>
      {Array.from({ length: WEEK }).map((_, weekIdx) => {
        // Extract 30 characters for the current day
        const daySchedule = scheduleString.slice(
          weekIdx * 30,
          (weekIdx + 1) * 30,
        );

        return (
          <S.CalendarScheduleLine key={weekIdx}>
            {Array.from({ length: BLOCKNUM }).map((_, sectionIdx) => {
              const num1 = parseCount(daySchedule[sectionIdx * 2]);
              const num2 = parseCount(daySchedule[sectionIdx * 2 + 1]);

              const index1 = getIndex(weekIdx, sectionIdx, 0);
              const index2 = getIndex(weekIdx, sectionIdx, 1);

              const isSelected1 =
                startIndex !== null &&
                currentIndex !== null &&
                Math.min(startIndex, currentIndex) <= index1 &&
                index1 <= Math.max(startIndex, currentIndex);

              const isSelected2 =
                startIndex !== null &&
                currentIndex !== null &&
                Math.min(startIndex, currentIndex) <= index2 &&
                index2 <= Math.max(startIndex, currentIndex);

              return (
                <S.CalendarScheduleSection key={sectionIdx}>
                  <S.CalendarSchedule
                    $num={num1}
                    $total={totalUser}
                    onMouseEnter={() =>
                      edit && handleHover(weekIdx, sectionIdx, 0)
                    }
                    onClick={() => edit && handleTouch(weekIdx, sectionIdx, 0)}
                    $selected={isSelected1}
                  />
                  <S.CalendarSchedule
                    $num={num2}
                    $total={totalUser}
                    onClick={() => edit && handleTouch(weekIdx, sectionIdx, 1)}
                    onMouseEnter={() =>
                      edit && handleHover(weekIdx, sectionIdx, 1)
                    }
                    $selected={isSelected2}
                  />
                </S.CalendarScheduleSection>
              );
            })}
          </S.CalendarScheduleLine>
        );
      })}
    </>
  );
};

export default CalendarScheduleList;
