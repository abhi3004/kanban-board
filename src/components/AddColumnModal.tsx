import { useState } from 'react'
import { useBoardActions } from '../hooks/useBoards'
import { Modal } from './Modal'

type AddColumnModalProps = {
  boardId: string
  onClose: () => void
}

export function AddColumnModal({ boardId, onClose }: AddColumnModalProps) {
  const { addColumn } = useBoardActions()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async () => {
    setIsSaving(true)
    const result = await addColumn(boardId, name)
    setIsSaving(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    onClose()
  }

  return (
    <Modal onClose={onClose} title="Add New Column">
      <form
        className="modal-form"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSubmit()
        }}
      >
        <label htmlFor="column-name">Column name</label>
        <input
          autoFocus
          id="column-name"
          onChange={(event) => {
            setName(event.target.value)
            setError('')
          }}
          disabled={isSaving}
          value={name}
        />
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-button full-width" disabled={isSaving} type="submit">
          {isSaving ? 'Creating...' : 'Create Column'}
        </button>
      </form>
    </Modal>
  )
}
