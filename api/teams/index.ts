import { nanoid } from 'nanoid';
import { sql } from '../_lib/db.js';
import {
  SCHEDULE_DAYS,
  TEAM_TTL_DAYS,
  error,
  isValidDate,
  json,
  readJson,
} from '../_lib/http.js';

const TEAM_ID_LENGTH = 10;

/** POST /api/teams  { startDate: 'YYYY-MM-DD' } -> 201 { id, startDate, expiresAt } */
export async function POST(request: Request) {
  const body = (await readJson(request)) as { startDate?: unknown } | null;
  const startDate = body?.startDate;

  if (!isValidDate(startDate)) {
    return error(400, 'startDate must be YYYY-MM-DD');
  }

  const id = nanoid(TEAM_ID_LENGTH);

  // 생성 후 2주 뒤 만료. 단, 보드의 7일이 끝나기 전(KST 기준 마지막 날 자정까지)에는 지우지 않는다.
  const [team] = await sql<
    { id: string; startDate: string; expiresAt: Date }[]
  >`
    insert into teams (id, start_date, expires_at)
    select ${id}, d, greatest(
      now() + make_interval(days => ${TEAM_TTL_DAYS}),
      (d + ${SCHEDULE_DAYS}::int)::timestamp at time zone 'Asia/Seoul'
    )
    from (select ${startDate}::date as d) as input
    where d between current_date - interval '1 year' and current_date + interval '2 years'
    returning id, to_char(start_date, 'YYYY-MM-DD') as "startDate", expires_at as "expiresAt"
  `;

  if (!team) {
    return error(400, 'startDate is out of range');
  }

  return json(team, 201);
}
