import { AlertCopyUrlLite } from '@icons/CopyUrl';
import * as S from './AlertUrlCopy.styled';
import { useEffect, useId, useRef } from 'react';
import useShareLink from '@hooks/useShareLink';

interface AlertUrlCopyProps {
  url: string;
  onClose: () => void;
}

/** 저장 완료 후 공유 링크를 보여 주는 대화상자. 클립보드는 사용자가 버튼을 눌렀을 때만 쓴다. */
const AlertUrlCopy = ({ url, onClose }: AlertUrlCopyProps) => {
  const share = useShareLink();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <S.AlertCopyUrlBackgroud onClick={onClose}>
      <S.AlertCopyUrlContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <S.AlertCopyUrlTitle id={titleId}>일정 저장 완료!</S.AlertCopyUrlTitle>
        <S.UrlContainer
          type="button"
          aria-label="링크 복사"
          onClick={() => share(url)}
        >
          <S.UrlText>{url}</S.UrlText>
          <AlertCopyUrlLite aria-hidden />
        </S.UrlContainer>
        <S.UrlInstructionContainer>
          <S.UrlInstruction>
            <S.UrlInstructionSpan>
              같은 링크로 팀원들과 일정을 공유
            </S.UrlInstructionSpan>
            해 보세요!
          </S.UrlInstruction>
        </S.UrlInstructionContainer>
        <S.AlertUrlButton ref={closeRef} type="button" onClick={onClose}>
          확인
        </S.AlertUrlButton>
      </S.AlertCopyUrlContainer>
    </S.AlertCopyUrlBackgroud>
  );
};
export default AlertUrlCopy;
