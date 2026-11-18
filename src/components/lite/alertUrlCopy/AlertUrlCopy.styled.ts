import styled from 'styled-components';

export const AlertCopyUrlBackgroud = styled.div`
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 10;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  padding: 16px;

  background: ${({ theme }) => theme.colors.BlackAlpha[600]};
`;

export const AlertCopyUrlContainer = styled.div`
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

export const AlertCopyUrlTitle = styled.h3`
  ${({ theme }) => theme.fontStyles.T03_Bold};
  color: ${({ theme }) => theme.colors.Gray.gray800};
`;

export const UrlContainer = styled.button`
  display: flex;
  max-width: 100%;
  cursor: pointer;
  padding: 4px 12px 4px 20px;
  justify-content: center;
  align-items: center;
  gap: 16px;

  border-radius: 8px;
  background: ${({ theme }) => theme.colors.Gray.gray200};
`;

export const UrlText = styled.span`
  width: 220px;
  color: ${({ theme }) => theme.colors.WBOrange.wbo400};
  ${({ theme }) => theme.fontStyles.S02_Bold};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UrlInstructionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const UrlInstruction = styled.p`
  ${({ theme }) => theme.fontStyles.S02_Medium};
`;

export const UrlInstructionSpan = styled.span`
  ${({ theme }) => theme.fontStyles.S02_Medium};
  color: ${({ theme }) => theme.colors.WBOrange.wbo400};
`;

export const AlertUrlButton = styled.button`
  background: ${({ theme }) => theme.colors.WBOrange.wbo400};
  ${({ theme }) => theme.fontStyles.S02_Bold};
  color: ${({ theme }) => theme.colors.Gray.gray50};

  display: flex;
  width: 160px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  border-radius: 4px;
`;
