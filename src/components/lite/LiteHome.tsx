import { ReactNode, useContext, useEffect } from 'react';
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LiteHeader from './header/LiteHeader';
import LiteCalendar from '@components/calendar/LiteCalendar';
import * as S from './LiteHome.styled';
import { useState } from 'react';
import { NOSCHEDULE } from '@constants/time';
import useTeamStore from '@store/team';

interface LiteContextType {
  teamId: string;
  /** 편집 중인 일정 비트열 (210자) */
  editingSchedule: string;
  setEditingSchedule: React.Dispatch<React.SetStateAction<string>>;
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
}

export const LiteContext = createContext<LiteContextType>({
  teamId: '',
  editingSchedule: NOSCHEDULE,
  setEditingSchedule: () => {},
  selectedUser: '',
  setSelectedUser: () => {},
});

export const useLiteContext = () => {
  const context = useContext(LiteContext);
  if (!context) {
    throw new Error('useLiteContext must be used within a LiteProvider');
  }
  return context;
};

const LiteProvider = ({
  teamId,
  children,
}: {
  teamId: string;
  children: ReactNode;
}) => {
  const [editingSchedule, setEditingSchedule] = useState(NOSCHEDULE);
  const [selectedUser, setSelectedUser] = useState('');

  return (
    <LiteContext.Provider
      value={{
        teamId,
        editingSchedule,
        setEditingSchedule,
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </LiteContext.Provider>
  );
};

const LiteHome = ({ teamId }: { teamId: string }) => {
  const [userToggle, setUserToggle] = useState(false);
  // 아직 이 팀을 요청하기 전이면(이전 팀의 상태가 남아 있으면) 로딩으로 본다.
  const status = useTeamStore((state) =>
    state.teamId === teamId ? state.status : 'loading',
  );
  const fetchTeam = useTeamStore((state) => state.fetchTeam);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeam(teamId);
  }, [teamId, fetchTeam]);

  if (status === 'notFound' || status === 'error') {
    return (
      <S.LiteMessageContainer>
        <S.LiteMessageTitle>
          {status === 'notFound'
            ? '일정을 찾을 수 없어요.'
            : '일정을 불러오지 못했어요.'}
        </S.LiteMessageTitle>
        <S.LiteMessageText>
          {status === 'notFound'
            ? '만든 지 2주가 지난 일정은 자동으로 삭제돼요.'
            : '잠시 후 다시 시도해 주세요.'}
        </S.LiteMessageText>
        <S.LiteMessageButton
          onClick={() =>
            status === 'notFound' ? navigate('/lite') : fetchTeam(teamId)
          }
        >
          {status === 'notFound' ? '새 시간 약속 만들기' : '다시 시도'}
        </S.LiteMessageButton>
      </S.LiteMessageContainer>
    );
  }

  if (status !== 'ready') {
    return (
      <S.LiteMessageContainer>
        <S.LiteMessageText>일정을 불러오는 중...</S.LiteMessageText>
      </S.LiteMessageContainer>
    );
  }

  return (
    <S.LiteHomeContainer>
      <LiteProvider teamId={teamId}>
        <LiteHeader userToggle={userToggle} setUserToggle={setUserToggle} />
        <LiteCalendar userToggle={userToggle} />
      </LiteProvider>
    </S.LiteHomeContainer>
  );
};

export default LiteHome;
