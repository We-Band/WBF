import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
`;

export const AlertContainer = styled.div`
  background: ${({ theme }) => theme.colors.BlackAlpha[700]};
  position: fixed;

  display: flex;
  flex-wrap: wrap;
  width: min(360px, calc(100vw - 32px));
  z-index: 20;
  justify-content: center;
  align-items: center;
  align-self: center;
  bottom: 36px;

  padding: 8px 24px;
  border-radius: 12px;

  animation: ${fadeInOut} 3s ease-in-out;
  left: 50%;
  transform: translateX(-50%);
`;

export const AlertText = styled.p<{ $highlight: boolean }>`
  ${({ theme }) => theme.fontStyles.S02_Bold}
  color: ${({ theme, $highlight }) =>
    $highlight
      ? theme.colors.WBOrange.wbo300
      : theme.colors.BlackAndWhite.white};
  white-space: pre-wrap;
`;
