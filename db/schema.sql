-- WeBand 팀 일정 저장소
-- Neon(또는 아무 Postgres) SQL 에디터에서 한 번 실행하면 됩니다.

create table if not exists teams (
  id          text        primary key,               -- nanoid (추측 불가능한 랜덤 ID)
  start_date  date        not null,                  -- 일정 보드 시작일 (7일)
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null                   -- 이 시각 이후 조회 불가 + cron이 삭제
);

create index if not exists teams_expires_at_idx on teams (expires_at);

create table if not exists members (
  team_id     text        not null references teams (id) on delete cascade,
  name        text        not null check (char_length(name) between 1 and 20),
  schedule    text        not null check (schedule ~ '^[01]{210}$'), -- 7일 x 30칸 비트열
  updated_at  timestamptz not null default now(),
  primary key (team_id, name)
);
