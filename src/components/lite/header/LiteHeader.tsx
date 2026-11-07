import * as S from './LiteHeader.styled';
import { CopyUrlLite } from '@icons/CopyUrl';
import { LiteUserAddIcon } from '@icons/AddIcon';
import { LiteTrash } from '@icons/Trash';
import { ArrowDownPickUser, ArrowUpPickUser } from '@icons/Arrows';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { LiteEditSchedule } from '@icons/Input';

import { useLiteContext } from '@components/lite/LiteHome';
import UserTable from '../userTable/UserTable';
import {
  CANNOTUSESPECIALCHAR,
  NAMETOOLONG,
  REQUESTFAILED,
  TEAMFULL,
} from '@constants/alert';
import { NOSCHEDULE } from '@constants/time';
import AlertUrlCopy from '../alertUrlCopy/AlertUrlCopy';
import ConfirmDialog from '@components/dialog/ConfirmDialog';
import useAlertStore from '@store/alert';
import useTeamStore from '@store/team';
import { ApiError, deleteMember, saveMember } from '@api/team';
import useShareLink from '@hooks/useShareLink';

const MAX_NAME_LENGTH = 20;
// 경로 구분자(/, \)와 제어 문자만 막는다. 띄어쓰기·하이픈이 들어간 이름은 허용.
const FORBIDDEN_NAME_CHARS = /[/\\\u0000-\u001f\u007f]/;

type PendingConfirm =
  | { kind: 'discard' }
  | { kind: 'overwrite'; name: string }
  | { kind: 'empty'; name: string }
  | { kind: 'delete'; name: string };

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

  const members = useTeamStore((state) => state.team?.members);
  const fetchTeam = useTeamStore((state) => state.fetchTeam);
  const setHasUnsavedChanges = useTeamStore(
    (state) => state.setHasUnsavedChanges,
  );
  const setAlert = useAlertStore((state) => state.setAlert);
  const setAlertMessage = useAlertStore((state) => state.setAlertMessage);
  const share = useShareLink();

  const [userName, setUserName] = useState('');
  const [toggleUserBox, setToggleUserBox] = useState(false);
  const [modalCopyUrl, setAlertCopyUrl] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null);
  const pickUserRef = useRef<HTMLDivElement>(null);

  const originalSchedule =
    members?.find((member) => member.name === selectedUser)?.schedule ??
    NOSCHEDULE;
  const trimmedName = userName.trim();
  const isDirty =
    userToggle &&
    (editingSchedule !== originalSchedule || trimmedName !== selectedUser);

  const showAlert = (messages: string[]) => {
    setAlert(true);
    setAlertMessage(messages);
  };

  // 편집 중 새로고침/탭 닫기, 로고 클릭 시 경고
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, setHasUnsavedChanges]);

  useEffect(() => () => setHasUnsavedChanges(false), [setHasUnsavedChanges]);

  // 사용자 목록 바깥을 누르면 닫기
  useEffect(() => {
    if (!toggleUserBox) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!pickUserRef.current?.contains(e.target as Node)) {
        setToggleUserBox(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toggleUserBox]);

  useEffect(() => {
    setUserName(selectedUser);
  }, [selectedUser, userToggle]);

  const exitEditMode = () => {
    setConfirm(null);
    setUserToggle(false);
    setUserName(selectedUser);
  };

  const handleCancel = () => {
    if (isDirty) {
      setConfirm({ kind: 'discard' });
      return;
    }
    exitEditMode();
  };

  const save = async (name: string) => {
    setConfirm(null);
    if (saving) return;
    setSaving(true);

    try {
      await saveMember(teamId, name, editingSchedule);
      // 수정 모드에서 이름을 바꿨다면 예전 이름의 일정은 지운다 (이름 변경).
      if (selectedUser && selectedUser !== name) {
        await deleteMember(teamId, selectedUser);
      }
      await fetchTeam(teamId);
      setHasUnsavedChanges(false);
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!trimmedName || saving) return;

    if (FORBIDDEN_NAME_CHARS.test(trimmedName)) {
      showAlert(CANNOTUSESPECIALCHAR);
      return;
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      showAlert(NAMETOOLONG);
      return;
    }

    // 다른 사람의 이름과 겹치면 덮어쓰기 전에 확인한다.
    const takenByOther =
      trimmedName !== selectedUser &&
      members?.some((member) => member.name === trimmedName);

    if (takenByOther) {
      setConfirm({ kind: 'overwrite', name: trimmedName });
      return;
    }

    if (!editingSchedule.includes('1')) {
      setConfirm({ kind: 'empty', name: trimmedName });
      return;
    }

    save(trimmedName);
  };

  const handleCloseSavedModal = () => {
    setAlertCopyUrl(false);
    setUserToggle(false);
    setSelectedUser('');
  };

  const handleDeleteUser = async (name: string) => {
    setConfirm(null);
    if (saving) return;
    setSaving(true);

    try {
      await deleteMember(teamId, name);
      await fetchTeam(teamId);
      setSelectedUser('');
      showAlert(['', '', name, '님의 일정을 삭제했어요.']);
    } catch (err) {
      console.error('Failed to delete member: ', err);
      showAlert(REQUESTFAILED);
    } finally {
      setSaving(false);
    }
  };

  const renderConfirm = () => {
    if (!confirm) return null;

    switch (confirm.kind) {
      case 'discard':
        return (
          <ConfirmDialog
            title="입력을 그만둘까요?"
            description="표시한 시간이 저장되지 않아요."
            cancelLabel="계속 입력"
            confirmLabel="그만두기"
            onCancel={() => setConfirm(null)}
            onConfirm={exitEditMode}
          />
        );
      case 'overwrite':
        return (
          <ConfirmDialog
            title={`'${confirm.name}' 이름이 이미 있어요`}
            description="저장하면 기존 일정이 이 일정으로 바뀌어요. 다른 사람이라면 이름을 바꿔 주세요."
            cancelLabel="이름 바꾸기"
            confirmLabel="덮어쓰기"
            onCancel={() => setConfirm(null)}
            onConfirm={() => save(confirm.name)}
          />
        );
      case 'empty':
        return (
          <ConfirmDialog
            title="표시한 시간이 없어요"
            description="이대로 저장하면 '가능한 시간 없음'으로 집계돼요."
            cancelLabel="시간 표시하기"
            confirmLabel="그대로 저장"
            onCancel={() => setConfirm(null)}
            onConfirm={() => save(confirm.name)}
          />
        );
      case 'delete':
        return (
          <ConfirmDialog
            title={`${confirm.name}님의 일정을 삭제할까요?`}
            description="삭제하면 되돌릴 수 없어요."
            confirmLabel="삭제"
            onCancel={() => setConfirm(null)}
            onConfirm={() => handleDeleteUser(confirm.name)}
          />
        );
    }
  };

  return (
    <S.LiteHeaderContainer>
      {modalCopyUrl && (
        <AlertUrlCopy url={shareUrl} onClose={handleCloseSavedModal} />
      )}
      {renderConfirm()}
      {userToggle ? (
        <S.UserNameForm onSubmit={handleSubmit}>
          <S.UserNameInputContainer>
            <S.UserNameInput
              type="text"
              aria-label="이름"
              placeholder="이름을 입력해 주세요."
              value={userName}
              maxLength={MAX_NAME_LENGTH}
              enterKeyHint="done"
              autoComplete="nickname"
              autoFocus={!selectedUser}
              onChange={(e) => setUserName(e.target.value)}
            />
          </S.UserNameInputContainer>
          <S.CancleButton type="button" onClick={handleCancel}>
            취소
          </S.CancleButton>
          <S.AddUserButton type="submit" disabled={!trimmedName || saving}>
            {saving ? '저장 중' : '완료'}
          </S.AddUserButton>
        </S.UserNameForm>
      ) : (
        <>
          <S.IconButtons>
            <S.IconButton
              type="button"
              aria-label="링크 공유"
              title="링크 공유"
              onClick={() => share(shareUrl)}
            >
              <CopyUrlLite aria-hidden />
            </S.IconButton>
            {selectedUser && (
              <S.IconButton
                type="button"
                aria-label={`${selectedUser}님 일정 삭제`}
                title="일정 삭제"
                disabled={saving}
                onClick={() =>
                  setConfirm({ kind: 'delete', name: selectedUser })
                }
              >
                <LiteTrash aria-hidden />
              </S.IconButton>
            )}
          </S.IconButtons>
          <S.UserContainer>
            <S.AddUserContainer
              type="button"
              onClick={() => setUserToggle(true)}
            >
              <S.AddUserText>
                {selectedUser ? '일정 수정' : '내 시간 입력'}
              </S.AddUserText>

              {selectedUser ? (
                <LiteEditSchedule aria-hidden />
              ) : (
                <LiteUserAddIcon aria-hidden />
              )}
            </S.AddUserContainer>
            <S.PickUserWrapper ref={pickUserRef}>
              <S.PickUserContainer
                type="button"
                aria-haspopup="listbox"
                aria-expanded={toggleUserBox}
                onClick={() => setToggleUserBox(!toggleUserBox)}
              >
                <S.PickUserText>
                  {selectedUser == ''
                    ? `전체 보기 (${members?.length ?? 0}명)`
                    : selectedUser}
                </S.PickUserText>
                {toggleUserBox ? (
                  <ArrowUpPickUser aria-hidden />
                ) : (
                  <ArrowDownPickUser aria-hidden />
                )}
              </S.PickUserContainer>
              {toggleUserBox && (
                <UserTable onSelect={() => setToggleUserBox(false)} />
              )}
            </S.PickUserWrapper>
          </S.UserContainer>
        </>
      )}
    </S.LiteHeaderContainer>
  );
};

export default LiteHeader;
