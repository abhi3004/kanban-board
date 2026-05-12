import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types/kanban'

type TaskCardProps = {
  task: Task
  onOpen: () => void
}

export function TaskCard({ task, onOpen }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        taskId: task.id,
        columnId: task.columnId,
      },
    })
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: `card-${task.id}`,
    data: {
      columnId: task.columnId,
    },
  })
  const done = task.subtasks.filter((subtask) => subtask.isDone).length

  return (
    <article
      className={`task-card ${isDragging ? 'is-dragging' : ''}`}
      ref={(node) => {
        setNodeRef(node)
        setDroppableNodeRef(node)
      }}
      style={{ transform: CSS.Translate.toString(transform) }}
    >
      <button
        aria-label={`Open task ${task.title}`}
        className="task-open-button"
        onClick={onOpen}
        type="button"
      >
        <strong>{task.title}</strong>
        <span>
          {done} of {task.subtasks.length} subtasks
        </span>
      </button>
      <button
        aria-label={`Drag task ${task.title}`}
        className="task-drag-handle"
        type="button"
        {...listeners}
        {...attributes}
      >
        <span />
        <span />
        <span />
      </button>
    </article>
  )
}
