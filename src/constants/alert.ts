const BLANK = '\u00A0';

export const CANNOTUSESPECIALCHAR = [
  '',
  `이름에${BLANK}`,
  '/ 와 \\',
  `는 사용할 수 없어요.`,
];

export const URLCOPIED = ['URL', '이 복사되었어요. 일정을 공유해 보세요.'];

export const REQUESTFAILED = [
  '',
  `요청에 실패했어요.${BLANK}`,
  '잠시 후',
  `${BLANK}다시 시도해 주세요.`,
];

export const TEAMFULL = [
  '',
  `한 일정에는 최대${BLANK}`,
  '30명',
  '까지 참여할 수 있어요.',
];

export const NAMETOOLONG = [
  '',
  `이름은${BLANK}`,
  '20자',
  `${BLANK}이하로 입력해 주세요.`,
];

export const COPYFAILED = [
  '',
  `복사에 실패했어요.${BLANK}`,
  '링크를 길게 눌러',
  `${BLANK}복사해 주세요.`,
];

export const DATEINVALID = ['', `날짜를${BLANK}`, '다시 확인', '해 주세요.'];
