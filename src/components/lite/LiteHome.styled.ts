import styled from 'styled-components';

export const LiteHomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 360px;
`;

export const LiteMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 360px;

  margin-top: 120px;
  gap: 16px;
`;

export const LiteMessageTitle = styled.h1`
  ${({ theme }) => theme.fontStyles.T04_Medium};
`;

export const LiteMessageText = styled.p`
  ${({ theme }) => theme.fontStyles.S02_Regular};
  color: ${({ theme }) => theme.colors.Gray.gray500};
`;

export const LiteMessageButton = styled.button`
  ${({ theme }) => theme.fontStyles.T02_Bold};

  background: ${({ theme }) => theme.colors.WBOrange.wbo400};
  color: ${({ theme }) => theme.colors.Gray.gray50};

  width: 306px;
  margin-top: 40px;
  padding: 16px 0;
  border-radius: 8px;
`;

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 3;
  background: ${({ theme }) => theme.colors.BlackAndWhite.white};
`;

export const ExpiryText = styled.p`
  ${({ theme }) => theme.fontStyles.S01_Regular};
  color: ${({ theme }) => theme.colors.Gray.gray500};
  text-align: center;
  padding: 16px 16px 24px;
`;
