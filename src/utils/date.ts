export const FIRSTDAY = 1;

export const MONTHNAMES = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

export const MonthToNum = (month: string): number => {
  return MONTHNAMES.indexOf(month);
};

// 2 => 'MAR', 0 => 'JAN'
export const NumToMonth = (month: number): string => {
  return MONTHNAMES[month];
};

export const DAYNAMES = ['일', '월', '화', '수', '목', '금', '토'];

export const NumToDay = (day: number): string => {
  return DAYNAMES[day];
};

/** (2025, 3, 9) -> '2025-03-09' */
export const toIsoDate = (year: number, month: number, date: number): string =>
  `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

/** '2025-03-09' -> { year: 2025, month: 3, date: 9 } */
export const parseIsoDate = (
  iso: string,
): { year: number; month: number; date: number } => {
  const [year, month, date] = iso.split('-').map(Number);
  return { year, month, date };
};

export const getWeekDates = (year: number, month: number, date: number) => {
  const week: { month: number; date: number; day: string }[] = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(year, month - 1, date + i);
    week.push({
      month: current.getMonth() + 1,
      date: current.getDate(),
      day: NumToDay(current.getDay()),
    });
  }

  return week;
};
