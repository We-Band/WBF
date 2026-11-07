import { AlertCopyUrlLite } from '@icons/CopyUrl';
import * as S from './AlertUrlCopy.styled';
import { useEffect } from 'react';
import { URLCOPIED } from '@constants/alert';
import useAlertStore from '@store/alert';

interface AlertUrlCopyProps {
  url: string;
  onClose: () => void;
}

const AlertUrlCopy = ({ url, onClose }: AlertUrlCopyProps) => {
  const setAlert = useAlertStore((state) => state.setAlert);
  const setAlertMessage = useAlertStore((state) => state.setAlertMessage);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setAlert(true);
        setAlertMessage(URLCOPIED);
      })
      .catch((err) => {
        console.error('Error copying text: ', err);
      });
  };

  useEffect(() => {
    handleCopy();
  }, []);

  return (
    <S.AlertCopyUrlBackgroud>
      <S.AlertCopyUrlContainer>
        <S.AlertCopyUrlTitle>일정 저장 완료!</S.AlertCopyUrlTitle>
        <S.UrlContainer onClick={handleCopy}>
          <S.UrlText>{url}</S.UrlText>
          <AlertCopyUrlLite />
        </S.UrlContainer>
        <S.UrlInstructionContainer>
          <S.UrlInstruction>링크는 바뀌지 않아요.</S.UrlInstruction>
          <S.UrlInstruction>
            <S.UrlInstructionSpan>
              같은 링크로 팀원들과 일정을 공유
            </S.UrlInstructionSpan>
            해 보세요!
          </S.UrlInstruction>
        </S.UrlInstructionContainer>
        <S.AlertUrlButton onClick={onClose}>확인</S.AlertUrlButton>
      </S.AlertCopyUrlContainer>
    </S.AlertCopyUrlBackgroud>
  );
};
export default AlertUrlCopy;
