import styled from 'styled-components';

export const LiteHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  width: 100%;
  padding: 12px 16px;
  gap: 8px;
`;

export const IconButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const UserContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-end;

  gap: 8px;
`;

export const AddUserContainer = styled.button`
  background: ${({ theme }) => theme.colors.Gray.gray200};
  display: flex;
  align-items: center;
  cursor: pointer;

  padding: 4px 4px 4px 8px;
  gap: 4px;
  border-radius: 4px;
`;

export const AddUserText = styled.h6`
  ${({ theme }) => theme.fontStyles.S03_Bold};
  color: ${({ theme }) => theme.colors.Gray.gray700};
`;

export const PickUserWrapper = styled.div`
  position: relative;
`;

export const PickUserContainer = styled(AddUserContainer)`
  background: ${({ theme }) => theme.colors.BlackAndWhite.white};
  gap: 16px;
`;

export const PickUserText = styled.h6`
  ${({ theme }) => theme.fontStyles.T01_Bold};
  color: ${({ theme }) => theme.colors.Gray.gray600};
`;

// Add User
export const UserNameForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

export const UserNameInputContainer = styled.div`
  background: ${({ theme }) => theme.colors.Gray.gray100};

  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  justify-content: space-between;

  border-radius: 8px;
  padding: 12px 20px;
`;

export const UserNameInput = styled.input`
  color: ${({ theme }) => theme.colors.Gray.gray700};
  background: ${({ theme }) => theme.colors.Gray.gray100};
  width: 100%;
  min-width: 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.Gray.gray400};
  }
`;

export const AddUserButton = styled.button`
  ${({ theme }) => theme.fontStyles.S02_Bold}
  background: ${({ theme }) => theme.colors.WBOrange.wbo600};
  color: ${({ theme }) => theme.colors.Gray.gray50};

  display: flex;
  align-items: center;

  gap: 4px;
  flex-shrink: 0;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const CancleButton = styled.button`
  ${({ theme }) => theme.fontStyles.S02_Bold}
  background: ${({ theme }) => theme.colors.Gray.gray300};
  color: ${({ theme }) => theme.colors.Gray.gray600};

  display: flex;
  align-items: center;

  gap: 4px;
  flex-shrink: 0;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
