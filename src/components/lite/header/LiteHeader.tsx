import * as S from './LiteHeader.styled';
import { CopyUrlLite } from '@icons/CopyUrl';
import { LiteUserAddIcon } from '@icons/AddIcon';
import { LiteTrash } from '@icons/Trash';
import { ArrowDownPickUser, ArrowUpPickUser } from '@icons/Arrows';
import { useEffect, useState } from 'react';
import { LiteEditSchedule, InputUserName } from '@icons/Input';

import { useLiteContext } from '@components/lite/LiteHome';
import UserTable from '../userTable/UserTable';
import {
  CANNOTUSESPECIALCHAR,
  NAMETOOLONG,
  REQUESTFAILED,
  SETSCHEDULE,
  TEAMFULL,
  URLCOPIED,
} from '@constants/alert';
import AlertUrlCopy from '../alertUrlCopy/AlertUrlCopy';
import useAlertStore from '@store/alert';
import useTeamStore from '@store/team';
import { ApiError, deleteMember, saveMember } from '@api/team';

const MAX_NAME_LENGTH = 20;

interface LiteHeaderProps {
  userToggle: boolean;
  setUserToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const LiteHeader: React.FC<LiteHeaderProps> = ({
  userToggle,
  setUserToggle,
}) => {
  const { teamId, editingSchedule, selectedUser, setSelectedUser } =
    useLiteContext();
  const shareUrl = `${window.location.origin}/lite/${teamId}`;

  const [userName, setUserName] = useState('');
  const [toggleUserBox, setToggleUserBox] = useState(false);
  const [modalCopyUrl, setAlertCopyUrl] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTeam = useTeamStore((state) => state.fetchTeam);
  const setAlert = useAlertStore((state) => state.setAlert);
  const setAlertMessage = useAlertStore((state) => state.setAlertMessage);

  const showAlert = (messages: string[]) => {
    setAlert(true);
    setAlertMessage(messages);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => showAlert(URLCOPIED))
      .catch((err) => {
        console.error('Error copying text: ', err);
      });
  };

  const handleAddUser = async () => {
    const reg = /[\s\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    const safeUserName = userName.replace(reg, '');

    if (userName !== safeUserName) {
      showAlert(CANNOTUSESPECIALCHAR);
      return;
    }

    if (userName.length > MAX_NAME_LENGTH) {
      showAlert(NAMETOOLONG);
      return;
    }

    if (saving) return;
    setSaving(true);

    try {
      await saveMember(teamId, userName, editingSchedule);
      await fetchTeam(teamId);
      setAlertCopyUrl(true);
    } catch (err) {
      console.error('Failed to save schedule: ', err);
      showAlert(
        err instanceof ApiError && err.status === 409
          ? TEAMFULL
          : REQUESTFAILED,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSavedModal = () => {
    setAlertCopyUrl(false);
    setUserToggle(false);
    setSelectedUser('');
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || saving) return;
    setSaving(true);

    try {
      await deleteMember(teamId, selectedUser);
      await fetchTeam(teamId);
      setSelectedUser('');
    } catch (err) {
      console.error('Failed to delete member: ', err);
      showAlert(REQUESTFAILED);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = () => {
    setUserToggle((prev) => !prev);
  };

  useEffect(() => {
    if (userToggle) {
      setAlert(true);
      setAlertMessage(SETSCHEDULE);
    }
  }, [userToggle]);

  useEffect(() => {
    setUserName(selectedUser);
  }, [selectedUser]);

  return (
    <S.LiteHeaderContainer>
      {modalCopyUrl && (
        <AlertUrlCopy url={shareUrl} onClose={handleCloseSavedModal} />
      )}
      {userToggle ? (
        <>
          <S.UserNameInputContainer>
            <S.UserNameInput
              type=""
              placeholder="이름을 입력해 주세요."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {userName == '' ? <InputUserName /> : ''}
          </S.UserNameInputContainer>
          {userName == '' ? (
            <S.CancleButton onClick={() => setUserToggle((prev) => !prev)}>
              취소
            </S.CancleButton>
          ) : (
            <S.AddUserButton onClick={handleAddUser} disabled={saving}>
              {saving ? '저장 중' : '완료'}
            </S.AddUserButton>
          )}
        </>
      ) : (
        <>
          {selectedUser ? (
            <LiteTrash onClick={handleDeleteUser} />
          ) : (
            <CopyUrlLite onClick={handleCopy} />
          )}
          <S.UserContainer>
            <S.AddUserContainer onClick={handleToggle}>
              <S.AddUserText>
                {selectedUser ? '일정 수정' : '인원 추가'}
              </S.AddUserText>

              {selectedUser ? <LiteEditSchedule /> : <LiteUserAddIcon />}
            </S.AddUserContainer>
            <S.PickUserContainer
              onClick={() => setToggleUserBox(!toggleUserBox)}
            >
              <S.PickUserText>
                {selectedUser == '' ? '전체 보기' : selectedUser}
              </S.PickUserText>
              {toggleUserBox ? (
                <>
                  <UserTable />
                  <ArrowUpPickUser />
                </>
              ) : (
                <ArrowDownPickUser />
              )}
            </S.PickUserContainer>
          </S.UserContainer>
        </>
      )}
    </S.LiteHeaderContainer>
  );
};

export default LiteHeader;
