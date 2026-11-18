import styled from 'styled-components';

export const LiteLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const LogoContainer = styled.div`
  display: flex;
  max-width: 400px;
  width: 100%;
  height: 80px;
  align-items: center;
  align-self: center;
`;

export const LogoPadding = styled.div`
  padding-left: 32px;
`;

export const MainContentContainer = styled.main`
  flex: 1;
  max-width: 400px;
  width: 100%;
  align-self: center;
`;

export const FooterBackground = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.Gray.gray200};
`;

export const FooterContainer = styled.div`
  display: flex;
  height: 120px;
  padding: 28px 36px;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 400px;
  width: 100%;
`;

export const FooterLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
`;

export const FooterLink = styled.a`
  ${({ theme }) => theme.fontStyles.S01_Medium};
  color: ${({ theme }) => theme.colors.Gray.gray500};
`;

export const LogoButton = styled.button`
  display: flex;
  padding: 0;
  background: transparent;
  cursor: pointer;
`;
