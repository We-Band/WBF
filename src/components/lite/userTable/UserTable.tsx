import * as S from './UserTable.styled';
import { useLiteContext } from '@components/lite/LiteHome';
import useTeamStore from '@store/team';

const UserTable = ({ onSelect }: { onSelect?: () => void }) => {
  const members = useTeamStore((state) => state.team?.members);
  const { selectedUser, setSelectedUser } = useLiteContext();

  const select = (name: string) => {
    setSelectedUser(name);
    onSelect?.();
  };

  return (
    <S.UserTableContainer role="listbox" aria-label="응답한 사람">
      <S.UserButton
        type="button"
        role="option"
        aria-selected={!selectedUser}
        $selected={!selectedUser}
        onClick={() => select('')}
      >
        전체 보기
      </S.UserButton>
      {members?.map(({ name }) => (
        <S.UserButton
          type="button"
          role="option"
          aria-selected={selectedUser === name}
          $selected={selectedUser === name}
          key={name}
          title={name}
          onClick={() => select(name)}
        >
          {name}
        </S.UserButton>
      ))}
    </S.UserTableContainer>
  );
};

export default UserTable;
