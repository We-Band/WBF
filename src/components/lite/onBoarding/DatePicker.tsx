import { ArrowDownOnBoardingLite } from '@icons/Arrows';
import * as S from './OnBoardingLite.styled';

import { useEffect, useRef, useState } from 'react';
import {
  MONTHNAMES,
  FIRSTDAY,
  MonthToNum,
  NumToMonth,
  toIsoDate,
} from '@utils/date';
import { useNavigate } from 'react-router-dom';
import { ToggleOffOnBoardingLite, ToggleOnOnBoardingLite } from '@icons/Button';
import { createTeam } from '@api/team';
import useAlertStore from '@store/alert';
import { REQUESTFAILED } from '@constants/alert';

const getMaxDaysInMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const DatePicker: React.FC = () => {
  const today = new Date();
  const navigate = useNavigate();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(NumToMonth(today.getMonth()));
  const [date, setDate] = useState(today.getDate());
  const [dropBoxToggle, setDropBoxToggle] = useState(false);
  const [monthNum, setMonthNum] = useState(MonthToNum(month));
  const [maxDay, setMaxDay] = useState(getMaxDaysInMonth(year, monthNum));
  const [toggle, setToggle] = useState(true);
  const monthDropBoxRef = useRef<HTMLDivElement>(null);
  const [creating, setCreating] = useState(false);
  const setAlert = useAlertStore((state) => state.setAlert);
  const setAlertMessage = useAlertStore((state) => state.setAlertMessage);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (value >= 1 && value <= maxDay) {
      setDate(value);
    } else if (value < 1) {
      setDate(0);
    } else if (value > maxDay) {
      setDate(maxDay);
    }
  };

  useEffect(() => {
    const numericMonth = MonthToNum(month);
    setMonthNum(numericMonth);
    setMaxDay(getMaxDaysInMonth(year, numericMonth));
  }, [year, month]);

  useEffect(() => {
    const currentYear = today.getFullYear();
    setYear(toggle ? currentYear : currentYear + 1);
  }, [toggle]);

  const handleClick = async () => {
    if (creating) return;

    const startDate = toIsoDate(
      year,
      MonthToNum(month) + 1,
      date < FIRSTDAY ? FIRSTDAY : date,
    );

    setCreating(true);

    try {
      const team = await createTeam(startDate);
      navigate(`/lite/${team.id}`);
    } catch (err) {
      console.error('Failed to create team: ', err);
      setAlert(true);
      setAlertMessage(REQUESTFAILED);
      setCreating(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropBoxToggle &&
        monthDropBoxRef.current &&
        !monthDropBoxRef.current.contains(e.target as Node)
      ) {
        setDropBoxToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropBoxToggle]);

  return (
    <>
      <S.DatePickerContainer>
        <S.YearToggle onClick={() => setToggle((prev) => !prev)}>
          <S.YearText>{toggle ? '올해' : '내년'}</S.YearText>
          {toggle ? <ToggleOffOnBoardingLite /> : <ToggleOnOnBoardingLite />}
        </S.YearToggle>

        <S.MonthPicker onClick={() => setDropBoxToggle(!dropBoxToggle)}>
          <S.MonthText>{month}</S.MonthText>
          {dropBoxToggle && (
            <S.MonthDropBox ref={monthDropBoxRef}>
              {MONTHNAMES.map((monthName) => (
                <S.MonthDropItem
                  key={monthName}
                  iscurrent={monthName === month}
                  onClick={() => {
                    setMonth(monthName);
                    setDropBoxToggle(false);
                  }}
                >
                  {monthName}
                </S.MonthDropItem>
              ))}
            </S.MonthDropBox>
          )}
          <ArrowDownOnBoardingLite />
        </S.MonthPicker>

        <S.DatePicker>
          <S.DateInput
            max={maxDay}
            type="number"
            value={date.toString()}
            onChange={(e) => handleDateChange(e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleClick();
              }
            }}
          />
          <S.DateText>일</S.DateText>
        </S.DatePicker>
      </S.DatePickerContainer>

      <S.MakeScheduleButton onClick={handleClick} disabled={creating}>
        {creating ? '만드는 중...' : '시간 약속 만들기'}
      </S.MakeScheduleButton>
    </>
  );
};

export default DatePicker;
