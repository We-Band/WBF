import { ArrowDownOnBoardingLite } from '@icons/Arrows';
import * as S from './OnBoardingLite.styled';

import { useEffect, useRef, useState } from 'react';
import {
  MONTHNAMES,
  FIRSTDAY,
  MonthToNum,
  NumToMonth,
  toIsoDate,
  NumToDay,
} from '@utils/date';
import { useNavigate } from 'react-router-dom';
import { ToggleOffOnBoardingLite, ToggleOnOnBoardingLite } from '@icons/Button';
import { ApiError, createTeam } from '@api/team';
import useAlertStore from '@store/alert';
import { DATEINVALID, REQUESTFAILED } from '@constants/alert';

const getMaxDaysInMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const monthLabel = (monthName: string) => `${MonthToNum(monthName) + 1}월`;

const formatDay = (d: Date) =>
  `${d.getMonth() + 1}월 ${d.getDate()}일(${NumToDay(d.getDay())})`;

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
    if (e.target.value === '') {
      setDate(0); // 지우고 다시 입력할 수 있게 빈 값 허용
      return;
    }

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
    const nextMaxDay = getMaxDaysInMonth(year, numericMonth);
    setMaxDay(nextMaxDay);
    setDate((prev) => Math.min(prev, nextMaxDay)); // 2월 31일 같은 없는 날짜 방지
  }, [year, month]);

  useEffect(() => {
    const currentYear = today.getFullYear();
    setYear(toggle ? currentYear : currentYear + 1);
  }, [toggle]);

  const startDay = new Date(year, monthNum, date < FIRSTDAY ? FIRSTDAY : date);
  const endDay = new Date(year, monthNum, startDay.getDate() + 6);
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const isPast = startDay < todayStart;
  const isEmpty = date < FIRSTDAY;

  const handleClick = async () => {
    if (creating || isPast || isEmpty) return;

    const startDate = toIsoDate(year, monthNum + 1, date);

    setCreating(true);

    try {
      const team = await createTeam(startDate);
      navigate(`/lite/${team.id}`);
    } catch (err) {
      console.error('Failed to create team: ', err);
      setAlert(true);
      setAlertMessage(
        err instanceof ApiError && err.status === 400
          ? DATEINVALID
          : REQUESTFAILED,
      );
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
        <S.YearToggle
          as="button"
          type="button"
          aria-label={`연도: ${toggle ? '올해' : '내년'} (${year}년). 눌러서 바꾸기`}
          onClick={() => setToggle((prev) => !prev)}
        >
          <S.YearText>{toggle ? '올해' : '내년'}</S.YearText>
          {toggle ? (
            <ToggleOffOnBoardingLite aria-hidden />
          ) : (
            <ToggleOnOnBoardingLite aria-hidden />
          )}
        </S.YearToggle>

        <S.MonthPicker
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={dropBoxToggle}
          aria-label={`월: ${monthLabel(month)}`}
          onClick={() => setDropBoxToggle(!dropBoxToggle)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setDropBoxToggle(!dropBoxToggle);
            }
          }}
        >
          <S.MonthText>{month}</S.MonthText>
          {dropBoxToggle && (
            <S.MonthDropBox ref={monthDropBoxRef} role="listbox">
              {MONTHNAMES.map((monthName) => (
                <S.MonthDropItem
                  key={monthName}
                  role="option"
                  aria-selected={monthName === month}
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
          <ArrowDownOnBoardingLite aria-hidden />
        </S.MonthPicker>

        <S.DatePicker>
          <S.DateInput
            min={1}
            max={maxDay}
            type="number"
            inputMode="numeric"
            aria-label="시작일"
            value={date < FIRSTDAY ? '' : date.toString()}
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

      <S.DateSummary $warning={isPast} role="status" aria-live="polite">
        {isEmpty
          ? '시작일을 입력해 주세요.'
          : isPast
            ? "지난 날짜예요. '내년'으로 바꾸거나 다른 날짜를 골라 주세요."
            : `${year}년 ${formatDay(startDay)} ~ ${formatDay(endDay)}`}
      </S.DateSummary>

      <S.MakeScheduleButton
        type="button"
        onClick={handleClick}
        disabled={creating || isPast || isEmpty}
      >
        {creating ? '만드는 중...' : '시간 약속 만들기'}
      </S.MakeScheduleButton>
    </>
  );
};

export default DatePicker;
