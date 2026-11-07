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
  text-align: center;
  word-break: keep-all;
`;

export const DialogButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

/** primary = 기존 저장 완료창의 '확인' 버튼, secondary = 헤더의 '취소' 버튼과 같은 스타일 */
export const DialogButton = styled.button<{
  $variant: 'primary' | 'secondary';
}>`
  ${({ theme }) => theme.fontStyles.S02_Bold};
  background: ${({ theme, $variant }) =>
    $variant === 'secondary'
      ? theme.colors.Gray.gray300
      : theme.colors.WBOrange.wbo400};
  color: ${({ theme, $variant }) =>
    $variant === 'secondary'
      ? theme.colors.Gray.gray600
      : theme.colors.Gray.gray50};

  display: flex;
  width: 120px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;

  border-radius: 4px;
  cursor: pointer;
`;
