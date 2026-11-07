import { Outlet } from 'react-router';
import * as S from './LiteLayout.styled';
import { useNavigate } from 'react-router-dom';
import LiteLogo from '@assets/logo/lite-logo.svg?react';
import FooterLogo from '@assets/logo/footer-logo.svg?react';
import useTeamStore from '@store/team';

const LEAVE_MESSAGE = '표시한 시간이 저장되지 않아요. 페이지를 떠날까요?';

const LiteLayout = () => {
  const navigate = useNavigate();

  const hasUnsavedChanges = useTeamStore((state) => state.hasUnsavedChanges);

  const confirmLeave = () =>
    !hasUnsavedChanges || window.confirm(LEAVE_MESSAGE);

  const handleClick = () => {
    if (confirmLeave()) navigate(`/lite`);
  };

  const handleClickHome = () => {
    if (confirmLeave()) navigate(`/`);
  };

  return (
    <S.LiteLayoutContainer>
      <S.LogoContainer>
        <S.LogoPadding />
        <S.LogoButton
          type="button"
          aria-label="새 시간 약속 만들기"
          onClick={handleClick}
        >
          <LiteLogo aria-hidden />
        </S.LogoButton>
      </S.LogoContainer>

      <S.MainContentContainer>
        <Outlet />
      </S.MainContentContainer>

      <S.FooterBackground>
        <S.FooterContainer>
          <S.LogoButton
            type="button"
            aria-label="WeBand 홈"
            onClick={handleClickHome}
          >
            <FooterLogo aria-hidden />
          </S.LogoButton>

          <S.FooterLinkContainer>
            <S.FooterLink
              href="https://glacier-borogovia-7b5.notion.site/We-Band-Lite-1ccdf3d703f28039b961c72d95d691d3"
              target="_blank"
            >
              WeBand 더 알아보기
            </S.FooterLink>
            <S.FooterLink
              href="mailto:qktjwl123@gmail.com?subject=WeBand 관련 문의드립니다."
              target="_blank"
            >
              문의 및 버그제보
            </S.FooterLink>
          </S.FooterLinkContainer>
        </S.FooterContainer>
      </S.FooterBackground>
    </S.LiteLayoutContainer>
  );
};

export default LiteLayout;
