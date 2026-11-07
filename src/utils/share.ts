export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(pointer: coarse)').matches;

const copyWithExecCommand = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
};

/**
 * 모바일에서는 공유 시트를 먼저 띄우고, 안 되면 클립보드 → execCommand 순으로 복사한다.
 */
export const shareLink = async (url: string): Promise<ShareResult> => {
  if (isTouchDevice() && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'WeBand 시간 약속', url });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'cancelled';
      }
      // 공유 시트를 못 띄우면 복사로 넘어간다.
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return copyWithExecCommand(url) ? 'copied' : 'failed';
  }
};
