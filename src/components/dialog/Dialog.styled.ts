import styled from 'styled-components';

export const DialogBackground = styled.div`
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 10;
  justify-content: center;
  align-items: center;
  padding: 16px;

  background: ${({ theme }) => theme.colors.BlackAlpha[600]};
`;

export const DialogContainer = styled.div`
  display: flex;
  width: min(360px, 100%);
  padding: 20px 24px;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  border-radius: 12px;
  background: ${({ theme }) => theme.colors.Gray.gray50};
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
`;

export const DialogTitle = styled.h3`
  ${({ theme }) => theme.fontStyles.T03_Bold};
  color: ${({ theme }) => theme.colors.Gray.gray800};
  text-align: center;
  word-break: keep-all;
`;

export const DialogDescription = styled.p`
  ${({ theme }) => theme.fontStyles.S02_Medium};
  color: ${({ theme }) => theme.colors.Gray.gray600};
  text-align: center;
  word-break: keep-all;
`;

export const DialogButtons = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
`;

export const DialogButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'danger';
}>`
  ${({ theme }) => theme.fontStyles.S02_Bold};
  flex: 1;
  padding: 10px 12px;
  border-radius: 4px;
  cursor: pointer;

  background: ${({ theme, $variant }) =>
    $variant === 'secondary'
      ? theme.colors.Gray.gray300
      : $variant === 'danger'
        ? theme.colors.AlertColor.red500
        : theme.colors.WBOrange.wbo600};
  color: ${({ theme, $variant }) =>
    $variant === 'secondary'
      ? theme.colors.Gray.gray700
      : theme.colors.BlackAndWhite.white};
`;
