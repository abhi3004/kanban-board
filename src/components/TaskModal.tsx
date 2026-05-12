import { useState } from 'react'
import { useTaskActions } from '../hooks/useTaskActions'
import type { Subtask, Task } from '../types/kanban'
import { Modal } from './Modal'

type TaskModalProps = {
  boardId: string
  task?: Task
  onClose: () => void
}

const createDraftSubtask = (title: string): Subtask => ({
  id: `draft-${crypto.randomUUID()}`,
  title,
  isDone: false,
})

export function TaskModal({ boardId, task, onClose }: TaskModalProps) {
  const { addTask, updateTask } = useTaskActions()
  const [title, setTitle] = useState(task?.title ?? '')
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks ?? [])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const addSubtask = () => {
    const trimmedTitle = newSubtaskTitle.trim()
    if (!trimmedTitle) {
      return
    }

    setSubtasks((currentSubtasks) => [
      ...currentSubtasks,
      createDraftSubtask(trimmedTitle),
    ])
    setNewSubtaskTitle('')
  }

  const handleSave = async () => {
    setIsSaving(true)
    const result = task
      ? updateTask(boardId, task.id, { title, subtasks })
      : addTask(boardId, { title, subtasks })
    const resolvedResult = await result
    setIsSaving(false)

    if (!resolvedResult.ok) {
      setError(resolvedResult.error)
      return
    }

    onClose()
  }

  return (
    <Modal onClose={onClose} title={task ? 'Edit Task' : 'Add New Task'}>
      <form
        className="modal-form"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSave()
        }}
      >
        <label htmlFor="task-title">Task name</label>
        <input
          autoFocus
          id="task-title"
          onChange={(event) => {
            setTitle(event.target.value)
            setError('')
          }}
          disabled={isSaving}
          value={title}
        />

        <fieldset className="subtask-fieldset">
          <legend>Subtasks</legend>
          {subtasks.length ? (
            subtasks.map((subtask) => (
              <label className="subtask-row" key={subtask.id}>
                <input
                  checked={subtask.isDone}
                  disabled={isSaving}
                  onChange={(event) => {
                    setSubtasks((currentSubtasks) =>
                      currentSubtasks.map((item) =>
                        item.id === subtask.id
                          ? { ...item, isDone: event.target.checked }
                          : item,
                      ),
                    )
                  }}
                  type="checkbox"
                />
                <input
                  aria-label={`Subtask title ${subtask.title}`}
                  disabled={isSaving}
                  onChange={(event) => {
                    setSubtasks((currentSubtasks) =>
                      currentSubtasks.map((item) =>
                        item.id === subtask.id
                          ? { ...item, title: event.target.value }
                          : item,
                      ),
                    )
                  }}
                  value={subtask.title}
                />
              </label>
            ))
          ) : (
            <p className="empty-copy">No subtasks yet.</p>
          )}
        </fieldset>

        <div className="inline-add">
          <label htmlFor="new-subtask">New subtask</label>
          <div>
            <input
              id="new-subtask"
              disabled={isSaving}
              onChange={(event) => setNewSubtaskTitle(event.target.value)}
              value={newSubtaskTitle}
            />
            <button
              className="secondary-button"
              disabled={isSaving}
              onClick={addSubtask}
              type="button"
            >
              Add Subtask
            </button>
          </div>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-button full-width" disabled={isSaving} type="submit">
          {isSaving ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
        </button>
      </form>
    </Modal>
  )
}
