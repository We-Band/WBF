import { sql } from '../../_lib/db.js';
import { error, isValidTeamId, json, pathSegments } from '../../_lib/http.js';

/** GET /api/teams/:id -> { id, startDate, expiresAt, members: [{ name, schedule }] } */
export async function GET(request: Request) {
  const [, , id = new URL(request.url).searchParams.get('id')] =
    pathSegments(request);

  if (!isValidTeamId(id)) {
    return error(404, 'team not found');
  }

  const [team] = await sql<
    { id: string; startDate: string; expiresAt: Date }[]
  >`
    select id, to_char(start_date, 'YYYY-MM-DD') as "startDate", expires_at as "expiresAt"
    from teams
    where id = ${id} and expires_at > now()
  `;

  if (!team) {
    return error(404, 'team not found');
  }

  const members = await sql<{ name: string; schedule: string }[]>`
    select name, schedule
    from members
    where team_id = ${id}
    order by updated_at, name
  `;

  return json({ ...team, members });
}
