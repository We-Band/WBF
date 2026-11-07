import * as S from './UserTable.styled';
import { useLiteContext } from '@components/lite/LiteHome';
import useTeamStore from '@store/team';

const UserTable = () => {
  const members = useTeamStore((state) => state.team?.members);
  const { selectedUser, setSelectedUser } = useLiteContext();

  return (
    <S.UserTableContainer>
      <S.UserButton
        $selected={!selectedUser}
        onClick={() => setSelectedUser('')}
      >
        전체보기
      </S.UserButton>
      {members?.map(({ name }) => (
        <S.UserButton
          $selected={selectedUser === name}
          key={name}
          onClick={() => setSelectedUser(name)}
        >
          {name}
        </S.UserButton>
      ))}
    </S.UserTableContainer>
  );
};

export default UserTable;
