/** 한 칸에 표시할 수 있는 최대 인원 수 (36진수 한 글자: 0-9a-z). 서버의 MAX_MEMBERS_PER_TEAM 이하로 유지. */
export const COUNT_RADIX = 36;

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
