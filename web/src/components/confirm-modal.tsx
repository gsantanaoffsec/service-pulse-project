import { useEffect } from 'react'
import Button from './button'
import Icon from './icon'

interface ConfirmModalProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  isDeleting?: boolean
  error?: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Excluir',
  isDeleting = false,
  error = '',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isDeleting) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isDeleting, onCancel, open])

  if (!open) {
    return null
  }

  return (
    <div
      aria-labelledby="confirm-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Fechar modal"
        className="absolute inset-0"
        disabled={isDeleting}
        onClick={onCancel}
        type="button"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-modal sm:p-7">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-danger-soft text-danger">
            <Icon name="trash" size={21} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-text" id="confirm-modal-title">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button disabled={isDeleting} onClick={onCancel} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            disabled={isDeleting}
            icon="trash"
            onClick={onConfirm}
            type="button"
            variant="danger"
          >
            {isDeleting ? 'Excluindo...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
