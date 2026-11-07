import { create } from 'zustand/react';
import { ApiError, getTeam, Team } from '@api/team';

type TeamStatus = 'idle' | 'loading' | 'ready' | 'notFound' | 'error';

interface TeamStore {
  /** status가 가리키는 팀 ID */
  teamId: string | null;
  team: Team | null;
  status: TeamStatus;
  fetchTeam: (teamId: string) => Promise<void>;
}

const useTeamStore = create<TeamStore>((set, get) => ({
  teamId: null,
  team: null,
  status: 'idle',
  fetchTeam: async (teamId) => {
    // 다른 팀으로 이동할 때만 로딩 화면을 보여주고, 같은 팀 새로고침은 화면을 유지한다.
    if (get().team?.id !== teamId) {
      set({ teamId, team: null, status: 'loading' });
    }

    try {
      const team = await getTeam(teamId);
      if (get().teamId !== teamId) return; // 그 사이 다른 팀으로 이동함
      set({ team, status: 'ready' });
    } catch (err) {
      if (get().teamId !== teamId) return;
      set({
        team: null,
        status:
          err instanceof ApiError && err.status === 404 ? 'notFound' : 'error',
      });
    }
  },
}));

export default useTeamStore;
