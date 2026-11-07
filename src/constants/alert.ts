const BLANK = '\u00A0';

export const CANNOTUSESPECIALCHAR = [
  '',
  `이름에${BLANK}`,
  '특수문자',
  `,${BLANK}`,
  `공백`,
  '은 사용할 수 없습니다.',
];

export const URLCOPIED = ['URL', '이 복사되었어요. 일정을 공유해 보세요.'];

export const SETSCHEDULE = [
  '',
  `가능한 시간대를${BLANK}`,
  '시작',
  `과${BLANK}`,
  '끝',
  '으로 표시하세요',
];

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
