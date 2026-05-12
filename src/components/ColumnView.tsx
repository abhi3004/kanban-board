import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Column, Task } from '../types/kanban'
import { TaskCard } from './TaskCard'

const columnClassByKind: Record<Column['kind'], string> = {
  todo: 'status-todo',
  doing: 'status-doing',
  done: 'status-done',
  custom: 'status-custom',
}

type ColumnViewProps = {
  column: Column
  tasks: Task[]
  onOpenTask: (taskId: string) => void
}

export function ColumnView({ column, tasks, onOpenTask }: ColumnViewProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      columnId: column.id,
    },
  })

  return (
    <section
      aria-label={`${column.name} column`}
      className={`kanban-column ${isOver ? 'is-over' : ''}`}
      ref={setNodeRef}
    >
      <h2>
        <span className={`status-dot ${columnClassByKind[column.kind]}`} />
        {column.name.toUpperCase()} ({tasks.length})
      </h2>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              onOpen={() => onOpenTask(task.id)}
              task={task}
            />
          ))}
        </div>
      </SortableContext>
    </section>
  )
}
