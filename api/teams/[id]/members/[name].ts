import { sql } from '../../../_lib/db.js';
import {
  MAX_MEMBERS_PER_TEAM,
  error,
  isValidName,
  isValidSchedule,
  isValidTeamId,
  json,
  pathSegments,
  readJson,
} from '../../../_lib/http.js';

const parseParams = (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const [, , id = searchParams.get('id'), , name = searchParams.get('name')] =
    pathSegments(request);
  return { id, name };
};

const teamExists = async (id: string) => {
  const rows = await sql`
    select 1 from teams where id = ${id} and expires_at > now()
  `;
  return rows.length > 0;
};

/** PUT /api/teams/:id/members/:name  { schedule: '0101…' (210자) } -> { name, schedule } */
export async function PUT(request: Request) {
  const { id, name } = parseParams(request);

  if (!isValidTeamId(id)) return error(404, 'team not found');
  if (!isValidName(name)) return error(400, 'invalid name');

  const body = (await readJson(request)) as { schedule?: unknown } | null;
  const schedule = body?.schedule;

  if (!isValidSchedule(schedule)) {
    return error(400, 'schedule must be a 210-length bit string');
  }

  const [member] = await sql<{ name: string; schedule: string }[]>`
    insert into members (team_id, name, schedule)
    select t.id, ${name}, ${schedule}
    from teams t
    where t.id = ${id}
      and t.expires_at > now()
      and (
        (select count(*) from members where team_id = t.id) < ${MAX_MEMBERS_PER_TEAM}
        or exists (select 1 from members where team_id = t.id and name = ${name})
      )
    on conflict (team_id, name)
      do update set schedule = excluded.schedule, updated_at = now()
    returning name, schedule
  `;

  if (member) return json(member);

  return (await teamExists(id))
    ? error(409, `a team can have at most ${MAX_MEMBERS_PER_TEAM} members`)
    : error(404, 'team not found');
}

/** DELETE /api/teams/:id/members/:name -> 204 */
export async function DELETE(request: Request) {
  const { id, name } = parseParams(request);

  if (!isValidTeamId(id) || !(await teamExists(id))) {
    return error(404, 'team not found');
  }

  if (typeof name === 'string') {
    await sql`delete from members where team_id = ${id} and name = ${name}`;
  }

  return new Response(null, { status: 204 });
}
