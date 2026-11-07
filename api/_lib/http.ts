export const TEAM_TTL_DAYS = 14;
export const SCHEDULE_DAYS = 7;
export const SCHEDULE_BIT_LENGTH = 210;
export const MAX_NAME_LENGTH = 20;
// 프론트는 칸마다 인원 수를 36진수 한 글자로 표시하므로 35명을 넘으면 안 된다.
export const MAX_MEMBERS_PER_TEAM = 30;

const TEAM_ID_PATTERN = /^[A-Za-z0-9_-]{8,32}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SCHEDULE_PATTERN = new RegExp(`^[01]{${SCHEDULE_BIT_LENGTH}}$`);
// 프론트와 동일: 공백/특수문자 금지
const NAME_FORBIDDEN = /[\s{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/;

export const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });

export const error = (status: number, message: string) =>
  json({ error: message }, status);

/** `/api/teams/:id/members/:name` 형태의 경로에서 세그먼트를 꺼낸다. */
export const pathSegments = (request: Request) =>
  new URL(request.url).pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment; // 잘못된 % 인코딩은 그대로 두고 검증에서 걸러지게 한다.
      }
    });

export const isValidTeamId = (id: unknown): id is string =>
  typeof id === 'string' && TEAM_ID_PATTERN.test(id);

export const isValidDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

export const isValidName = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length >= 1 &&
  value.length <= MAX_NAME_LENGTH &&
  !NAME_FORBIDDEN.test(value);

export const isValidSchedule = (value: unknown): value is string =>
  typeof value === 'string' && SCHEDULE_PATTERN.test(value);

export const readJson = async (request: Request): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};
