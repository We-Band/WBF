import { useEffect, useId, useRef } from 'react';
import * as S from './Dialog.styled';

interface ConfirmDialogProps {
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 되돌릴 수 없는 동작 전에 띄우는 확인창. 기본 포커스는 안전한 쪽(취소)에 둔다. */
const ConfirmDialog = ({
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <S.DialogBackground onClick={onCancel}>
      <S.DialogContainer
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <S.DialogTitle id={titleId}>{title}</S.DialogTitle>
        {description && (
          <S.DialogDescription>{description}</S.DialogDescription>
        )}
        <S.DialogButtons>
          <S.DialogButton
            ref={cancelRef}
            type="button"
            $variant="secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </S.DialogButton>
          <S.DialogButton
            type="button"
            $variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </S.DialogButton>
        </S.DialogButtons>
      </S.DialogContainer>
    </S.DialogBackground>
  );
};

export default ConfirmDialog;
