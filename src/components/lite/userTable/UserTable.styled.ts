import styled from 'styled-components';

export const UserTableContainer = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  width: 154px;
  max-height: 240px;
  height: fit-content;
  top: calc(100% + 4px);
  right: 0;
  z-index: 5;
  overflow-y: auto;

  flex-shrink: 0;
  padding: 8px;
  gap: 4px;

  border-radius: 8px;
  background: ${({ theme }) => theme.colors.Gray.gray50};
  box-shadow: 0px 0px 1px 0px rgba(87, 85, 85, 0.25);
`;

export const UserButton = styled.button<{ $selected: boolean }>`
  ${({ theme }) => theme.fontStyles.B03}

  display: block;
  flex-shrink: 0;
  height: 44px;
  width: 100%;
  text-align: center;
  cursor: pointer;

  padding: 12px;

  border-radius: 8px;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.WBOrange.wbo200 : theme.colors.Gray.gray200};

  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.WBOrange.wbo500 : 'transparent'};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
