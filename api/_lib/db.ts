import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// 서버리스 함수 인스턴스마다 커넥션 1개만 유지한다.
// prepare: false 는 Neon 풀러(PgBouncer transaction mode)와 호환되도록.
export const sql = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  prepare: false,
});
