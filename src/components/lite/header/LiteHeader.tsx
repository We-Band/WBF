import * as S from './LiteHeader.styled';
import { CopyUrlLite } from '@icons/CopyUrl';
import { LiteUserAddIcon } from '@icons/AddIcon';
import { LiteTrash } from '@icons/Trash';
import { ArrowDownPickUser, ArrowUpPickUser } from '@icons/Arrows';
import { useEffect, useState } from 'react';
import { LiteEditSchedule, InputUserName } from '@icons/Input';

import { useNavigate } from 'react-router-dom';
import { useLiteContext } from '@components/lite/LiteHome';
import UserTable from '../userTable/UserTable';
import { CANNOTUSESPECIALCHAR, SETSCHEDULE, URLCOPIED } from '@constants/alert';
import AlertUrlCopy from '../alertUrlCopy/AlertUrlCopy';
import useAlertStore from '@store/alert';
import { USER_SCHEDULE_SEPARATOR } from '@utils/urlHandle';

interface LiteHeaderProps {
  userToggle: boolean;
  setUserToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const LiteHeader: React.FC<LiteHeaderProps> = ({
  userToggle,
  setUserToggle,
}) => {
  const currentUrl = decodeURI(window.location.href);
  const [url, setUrl] = useState(currentUrl);

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const { encodedSchedule, selectedUser } = useLiteContext();
  const [toggleUserBox, setToggleUserBox] = useState(false);
  const [modalCopyUrl, setAlertCopyUrl] = useState(false);

  const setAlert = useAlertStore((state) => state.setAlert);
  const setAlertMessage = useAlertStore((state) => state.setAlertMessage);

  const removeUserScheduleFromPath = (
    path: string,
    encodedUserName: string,
  ): string => {
    const escapedUserName = encodedUserName.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );

    return path.replace(
      new RegExp(
        `/${escapedUserName}${USER_SCHEDULE_SEPARATOR === '.' ? '\\.' : USER_SCHEDULE_SEPARATOR}[^/]+`,
      ),
      '',
    );
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setAlert(true);
        setAlertMessage(URLCOPIED);
      })
      .catch((err) => {
        console.error('Error copying text: ', err);
      });
  };

  const handleAddUser = () => {
    const reg = /[\s\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    const safeUserName = userName.replace(reg, '');

    if (userName !== safeUserName) {
      setAlert(true);
      setAlertMessage(CANNOTUSESPECIALCHAR);
      return;
    }

    // 현재 URL 가져오기
    const currentPath = window.location.pathname;
    const encodedUserName = encodeURIComponent(userName); // userName을 URL 인코딩

    // 기존 사용자 일정 세그먼트를 제거한 뒤 다시 추가
    const updatedPath = removeUserScheduleFromPath(
      currentPath,
      encodedUserName,
    );

    const resultPath = decodeURI(
      `${updatedPath}/${userName}${USER_SCHEDULE_SEPARATOR}${encodedSchedule}`,
    );

    setUrl(resultPath);
    setAlertCopyUrl(true);
    // 새로운 경로 생성 및 이동
    // navigate();
  };

  const handleDeleteUser = () => {
    // 현재 URL 가져오기
    const currentPath = window.location.pathname;
    const encodedUserName = encodeURIComponent(userName); // userName을 URL 인코딩

    // 기존 사용자 일정 세그먼트를 제거
    const updatedPath = removeUserScheduleFromPath(
      currentPath,
      encodedUserName,
    );

    // 새로운 경로 생성 및 이동
    navigate(`${updatedPath}`);
  };

  const handleToggle = () => {
    setUserToggle((prev) => !prev);
  };

  useEffect(() => {
    if (userToggle) {
      setAlert(true);
      setAlertMessage(SETSCHEDULE);
    }
    console.log();
  }, [userToggle]);

  useEffect(() => {
    setUserName(selectedUser);
  }, [selectedUser]);

  return (
    <S.LiteHeaderContainer>
      {modalCopyUrl && <AlertUrlCopy url={url} />}
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
            <S.AddUserButton onClick={handleAddUser}>완료</S.AddUserButton>
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
