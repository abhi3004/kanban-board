import type { PropsWithChildren } from 'react'

type ModalProps = PropsWithChildren<{
  title: string
  onClose: () => void
}>

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal"
        role="dialog"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            aria-label="Close modal"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
