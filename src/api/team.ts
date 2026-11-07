export interface Member {
  name: string;
  /** 210자 비트열 (7일 x 30칸) */
  schedule: string;
}

export interface Team {
  id: string;
  /** YYYY-MM-DD */
  startDate: string;
  expiresAt: string;
  members: Member[];
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error ?? res.statusText);
  }

  return (res.status === 204 ? undefined : await res.json()) as T;
};

const memberPath = (teamId: string, name: string) =>
  `/api/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(name)}`;

export const createTeam = (startDate: string) =>
  request<Omit<Team, 'members'>>('/api/teams', {
    method: 'POST',
    body: JSON.stringify({ startDate }),
  });

export const getTeam = (teamId: string) =>
  request<Team>(`/api/teams/${encodeURIComponent(teamId)}`);

export const saveMember = (teamId: string, name: string, schedule: string) =>
  request<Member>(memberPath(teamId, name), {
    method: 'PUT',
    body: JSON.stringify({ schedule }),
  });

export const deleteMember = (teamId: string, name: string) =>
  request<void>(memberPath(teamId, name), { method: 'DELETE' });
