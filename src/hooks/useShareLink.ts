import { COPYFAILED, URLCOPIED } from '@constants/alert';
import useAlertStore from '@store/alert';
import { shareLink } from '@utils/share';

/** 링크를 공유(모바일) 또는 복사하고, 결과를 토스트로 알려 준다. */
const useShareLink = () => {
  const setAlert = useAlertStore((state) => state.setAlert);
  const setAlertMessage = useAlertStore((state) => state.setAlertMessage);

  return async (url: string) => {
    const result = await shareLink(url);

    if (result === 'copied') {
      setAlert(true);
      setAlertMessage(URLCOPIED);
    } else if (result === 'failed') {
      setAlert(true);
      setAlertMessage(COPYFAILED);
    }
  };
};

export default useShareLink;
