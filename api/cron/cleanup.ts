import { sql } from '../_lib/db.js';
import { error, json } from '../_lib/http.js';

/**
 * GET /api/cron/cleanup
 * Vercel Cron이 하루 한 번 호출한다. 만료된 팀을 삭제하고, members는 cascade로 함께 지워진다.
 * CRON_SECRET 환경변수가 있으면 Vercel이 `Authorization: Bearer <CRON_SECRET>`을 붙여 보낸다.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return error(401, 'unauthorized');
  }

  const deleted = await sql`delete from teams where expires_at <= now()`;

  return json({ deletedTeams: deleted.count });
}
