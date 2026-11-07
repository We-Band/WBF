import styled from 'styled-components';
import { transparentize } from 'polished';

//Lite Container
export const LiteCalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;

  padding: 0px 12px 0px 0px;
  margin: 0 auto;
`;

// Date List
export const CalendarDateListContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;

  position: sticky;
  top: var(--lite-header-height, 0px);
  z-index: 2;
  background: ${({ theme }) => theme.colors.BlackAndWhite.white};

  padding: 8px;
  gap: 16px;
`;

export const CalendarDateSection = styled.div`
  display: flex;
  width: 28px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 4px;
`;

export const CalendarDate = styled.h6`
  ${({ theme }) => theme.fontStyles.S01_Bold};
  color: ${({ theme }) => theme.colors.Gray.gray700};
`;

export const CalendarText = styled.h6`
  ${({ theme }) => theme.fontStyles.S01_Bold};
  color: ${({ theme }) => theme.colors.Gray.gray600};
  text-align: center;
`;

//Time List
export const CalendarTimeListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  align-self: flex-start;

  padding: 0px 8px 16px 8px;
  gap: 16px;
`;

export const CalendarTimeSection = styled.div`
  color: ${({ theme }) => theme.colors.Gray.gray600};
  ${({ theme }) => theme.fontStyles.S01_Regular};

  display: flex;
  width: 24px;
  height: 24px;
  flex-direction: column;
  align-items: center;

  gap: 10px;
`;

// Schedule List
export const CalendarScheduleContainer = styled.div`
  display: flex;
`;

export const CalendarScheduleGrid = styled.div`
  display: flex;

  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
`;

export const CalendarScheduleLine = styled.div``;

export const CalendarScheduleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid ${({ theme }) => theme.colors.Gray.gray100};
`;

/** 1명이라도 가능하면 최소 20% 농도는 보이게 한다. */
const MIN_ALPHA = 0.2;

export const CalendarSchedule = styled.div<{
  $num: number;
  $total: number;
  $preview?: 'add' | 'erase';
  $best?: boolean;
  $inspected?: boolean;
}>`
  width: 43px;
  height: 19.5px;
  margin-left: 1px;

  background-color: ${({ theme, $num, $total, $preview }) => {
    if ($preview === 'add') return theme.colors.WBOrange.wbo200;
    if ($preview === 'erase') return theme.colors.Gray.gray300;
    if ($total <= 0 || $num <= 0) return 'transparent';
    const ratio = Math.min($num / $total, 1);
    return transparentize(
      1 - (MIN_ALPHA + (1 - MIN_ALPHA) * ratio),
      theme.colors.Alpha.alpha,
    );
  }};

  box-shadow: ${({ theme, $best, $inspected }) =>
    $inspected
      ? `inset 0 0 0 2px ${theme.colors.Gray.gray800}`
      : $best
        ? `inset 0 0 0 2px ${theme.colors.WBOrange.wbo600}`
        : 'none'};
`;

// Info bar (안내 / 요약)
export const CalendarInfoBar = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  /* 안내 문구 길이가 그리드 폭을 넓히지 않도록 컨테이너 폭에 맞춘다 */
  width: 0;
  min-width: 100%;

  margin: 0 0 4px;
  padding: 10px 12px;
  gap: 4px;

  border-radius: 8px;
  background: ${({ theme }) => theme.colors.Gray.gray100};
`;

export const CalendarInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const CalendarInfoText = styled.p`
  ${({ theme }) => theme.fontStyles.S02_Medium};
  color: ${({ theme }) => theme.colors.Gray.gray700};
  word-break: keep-all;
`;

export const CalendarInfoStrong = styled.strong`
  ${({ theme }) => theme.fontStyles.S02_Bold};
  color: ${({ theme }) => theme.colors.WBOrange.wbo600};
`;

export const CalendarInfoSub = styled.p`
  ${({ theme }) => theme.fontStyles.S01_Regular};
  color: ${({ theme }) => theme.colors.Gray.gray600};
  word-break: keep-all;
`;

export const CalendarInfoButton = styled.button`
  ${({ theme }) => theme.fontStyles.S01_Bold};
  color: ${({ theme }) => theme.colors.Gray.gray700};
  background: ${({ theme }) => theme.colors.BlackAndWhite.white};

  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.Gray.gray300};
  cursor: pointer;
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const LegendBar = styled.span`
  display: inline-block;
  width: 72px;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    ${({ theme }) => transparentize(1 - MIN_ALPHA, theme.colors.Alpha.alpha)},
    ${({ theme }) => theme.colors.Alpha.alpha}
  );
`;

export const LegendBest = styled.span`
  display: inline-block;
  width: 12px;
  height: 8px;
  box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.WBOrange.wbo600};
`;
