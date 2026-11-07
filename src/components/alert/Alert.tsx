import { useEffect, useCallback } from 'react';
import * as S from './Alert.styled';

const Alert = ({
  messages,
  onClose,
}: {
  messages: Array<string>;
  onClose: () => void;
}) => {
  const stableOnClose = useCallback(onClose, []);

  useEffect(() => {
    const timer = setTimeout(stableOnClose, 3000); // 3초 후 닫기
    return () => clearTimeout(timer);
  }, [stableOnClose, messages]); // messages가 변경될 때마다 타이머 리셋

  return (
    <S.AlertContainer role="status" aria-live="polite">
      {messages.map((message, idx) => (
        <S.AlertText key={idx} $highlight={idx % 2 === 0}>
          {message}
        </S.AlertText>
      ))}
    </S.AlertContainer>
  );
};

export default Alert;
