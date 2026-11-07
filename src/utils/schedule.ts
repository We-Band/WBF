import { STARTHOUR, WEEK } from '@constants/time';
import { DAYNAMES, parseIsoDate } from '@utils/date';

/** 하루 칸 수 (09:00~24:00, 30분 단위) */
export const SLOTS_PER_DAY = 30;
export const SLOT_MINUTES = 30;

/** 한 칸에 표시할 수 있는 최대 인원 수 (36진수 한 글자: 0-9a-z). 서버의 MAX_MEMBERS_PER_TEAM 이하로 유지. */
export const COUNT_RADIX = 36;

export interface Cell {
  day: number;
  slot: number;
}

export const cellIndex = ({ day, slot }: Cell) => day * SLOTS_PER_DAY + slot;

export const indexToCell = (index: number): Cell => ({
  day: Math.floor(index / SLOTS_PER_DAY),
  slot: index % SLOTS_PER_DAY,
});

/** 두 칸을 꼭짓점으로 하는 직사각형(요일 범위 × 시간 범위) 안에 있는지 */
export const isInRect = (a: Cell, b: Cell, target: Cell) =>
  target.day >= Math.min(a.day, b.day) &&
  target.day <= Math.max(a.day, b.day) &&
  target.slot >= Math.min(a.slot, b.slot) &&
  target.slot <= Math.max(a.slot, b.slot);

/**
 * 직사각형 범위를 칠하거나 지운다.
 * 시작 칸이 비어 있으면 범위 전체를 '가능'으로, 칠해져 있으면 범위 전체를 지운다.
 */
export const paintRect = (schedule: string, anchor: Cell, end: Cell) => {
  const value = schedule[cellIndex(anchor)] === '1' ? '0' : '1';

  return schedule
    .split('')
    .map((char, i) => (isInRect(anchor, end, indexToCell(i)) ? value : char))
    .join('');
};

/** 칸 하나의 문자(비트 '0'/'1' 또는 인원 수)를 숫자로 바꾼다. */
export const parseCount = (char: string | undefined) =>
  parseInt(char || '0', COUNT_RADIX);

/**
 * 사용자별 비트열을 자리별로 더해 "그 시간에 가능한 인원 수" 문자열을 만든다.
 * 10명 이상이어도 한 칸이 한 글자가 되도록 36진수로 기록한다.
 */
export const sumBinaryStrings = (schedules: string[]): string => {
  if (schedules.length === 0) return '0';

  const maxLength = Math.max(...schedules.map((s) => s.length));
  const padded = schedules.map((s) => s.padStart(maxLength, '0'));

  let result = '';

  for (let i = 0; i < maxLength; i++) {
    let sum = 0;

    for (const schedule of padded) {
      sum += Number(schedule[i]);
    }

    result += sum.toString(COUNT_RADIX);
  }

  return result;
};

const formatMinutes = (minutes: number) =>
  `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}`;

/** 'M/D(요일)' */
export const dayLabel = (startDate: string, day: number) => {
  const { year, month, date } = parseIsoDate(startDate);
  const current = new Date(year, month - 1, date + day);
  return `${current.getMonth() + 1}/${current.getDate()}(${DAYNAMES[current.getDay()]})`;
};

/** 'H:MM–H:MM' (slotEnd 포함) */
export const slotRangeLabel = (slotStart: number, slotEnd = slotStart) =>
  `${formatMinutes(STARTHOUR * 60 + slotStart * SLOT_MINUTES)}–${formatMinutes(
    STARTHOUR * 60 + (slotEnd + 1) * SLOT_MINUTES,
  )}`;

export interface TimeRange {
  day: number;
  slotStart: number;
  slotEnd: number;
}

/** 가장 많은 인원이 겹치는 시간대들 (같은 날 연속된 칸은 하나로 묶음) */
export const findBestRanges = (counts: string) => {
  const values = Array.from({ length: WEEK * SLOTS_PER_DAY }, (_, i) =>
    parseCount(counts[i]),
  );
  const max = Math.max(0, ...values);
  const ranges: TimeRange[] = [];

  if (max === 0) return { max, ranges };

  for (let day = 0; day < WEEK; day++) {
    let start: number | null = null;

    for (let slot = 0; slot <= SLOTS_PER_DAY; slot++) {
      const isBest =
        slot < SLOTS_PER_DAY && values[day * SLOTS_PER_DAY + slot] === max;

      if (isBest && start === null) start = slot;
      if (!isBest && start !== null) {
        ranges.push({ day, slotStart: start, slotEnd: slot - 1 });
        start = null;
      }
    }
  }

  return { max, ranges };
};
