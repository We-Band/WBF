import styled from 'styled-components';

export const OnBoardingLiteContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;

  margin-top: 72px;
  gap: 72px;
`;

//instructions
export const InstructionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: start;

  padding: 12px 0px 12px 48px;
  gap: 16px;
`;

export const InstructionsHeader = styled.h1`
  ${({ theme }) => theme.fontStyles.T04_Medium};
`;

export const InstructionsText = styled.p`
  ${({ theme }) => theme.fontStyles.S02_Regular};
  color: ${({ theme }) => theme.colors.Gray.gray500};
`;

// date picker
export const DatePickerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  width: 300px;

  margin: 0 auto;
  gap: auto;
`;

export const YearToggle = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  background: transparent;
  cursor: pointer;

  gap: 8px;
`;

export const YearText = styled.h2`
  ${({ theme }) => theme.fontStyles.T04_Bold};
`;

export const MonthPicker = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: max-content;
  cursor: pointer;

  gap: 16px;
`;

export const DatePicker = styled(MonthPicker)`
  justify-content: flex-start;
  width: max-content;
`;

export const MonthText = styled.h2`
  ${({ theme }) => theme.fontStyles.T04_Bold};
`;

export const DateText = styled.h2`
  ${({ theme }) => theme.fontStyles.T03_Bold};
`;

//date picker boxes
export const MonthDropBox = styled.div`
  background: ${({ theme }) => theme.colors.Gray.gray50};

  margin-top: 230px;
  margin-right: -25px;

  display: flex;
  position: absolute;
  height: 200px;
  width: 154px;
  flex-direction: column;
  align-items: center;
  overflow: scroll;

  z-index: 1;
  padding: 8px;
  gap: 8px;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
`;

interface MonthDropItemProps {
  iscurrent: boolean;
}

export const MonthDropItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'iscurrent',
})<MonthDropItemProps>`
  ${({ theme }) => theme.fontStyles.B03};

  display: flex;
  position: relative;
  height: 44px;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;

  padding: 12px 36px;
  gap: 10px;
  margin-right: 4px;
  border-radius: 8px;

  background-color: ${({ iscurrent, theme }) =>
    iscurrent ? theme.colors.WBOrange.wbo200 : theme.colors.Gray.gray200};
  border: 1px solid
    ${({ iscurrent, theme }) =>
      iscurrent ? theme.colors.WBOrange.wbo500 : 'none'};
`;

export const DateInput = styled.input`
  ${({ theme }) => theme.fontStyles.T03_Bold};
  background: ${({ theme }) => theme.colors.Gray.gray100};

  display: flex;
  width: 72px;
  height: 48px;
  justify-content: center;
  align-items: center;
  text-align: center;

  border-radius: 8px;
  padding: 8px 12px;
  gap: 10px;
`;

// button
export const DateSummary = styled.p<{ $warning: boolean }>`
  ${({ theme }) => theme.fontStyles.S02_Medium};
  color: ${({ theme, $warning }) =>
    $warning ? theme.colors.AlertColor.red500 : theme.colors.Gray.gray600};
  margin-top: -48px;
  text-align: center;
  word-break: keep-all;
`;

export const MakeScheduleButton = styled.button`
  ${({ theme }) => theme.fontStyles.T02_Bold};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  background: ${({ theme }) => theme.colors.WBOrange.wbo600};
  color: ${({ theme }) => theme.colors.Gray.gray50};

  display: flex;
  width: 306px;
  justify-content: center;
  align-items: center;

  gap: 10px;
  padding: 16px 80px;
  border-radius: 8px;
`;
