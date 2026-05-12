import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { useBoards } from '../hooks/useBoards'
import { useTaskActions } from '../hooks/useTaskActions'
import { ColumnView } from './ColumnView'

type BoardViewProps = {
  onAddColumn: () => void
  onOpenTask: (taskId: string) => void
}

export function BoardView({ onAddColumn, onOpenTask }: BoardViewProps) {
  const { activeBoard } = useBoards()
  const { moveTask } = useTaskActions()

  const handleDragEnd = (event: DragEndEvent) => {
    if (!activeBoard) {
      return
    }

    const taskId = String(event.active.data.current?.taskId ?? '')
    const columnId = String(event.over?.data.current?.columnId ?? event.over?.id ?? '')

    if (taskId && columnId) {
      void moveTask(activeBoard.id, taskId, columnId)
    }
  }

  if (!activeBoard) {
    return (
      <main className="board-canvas empty-board" aria-label="No board selected">
        <div>
          <h2>No boards yet</h2>
          <p>Create a board from the sidebar to start adding columns and tasks.</p>
        </div>
      </main>
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="board-canvas" aria-label={`${activeBoard.name} tasks`}>
        {activeBoard.columns.map((column) => (
          <ColumnView
            column={column}
            key={column.id}
            onOpenTask={onOpenTask}
            tasks={activeBoard.tasks.filter((task) => task.columnId === column.id)}
          />
        ))}
        <button className="new-column-button" onClick={onAddColumn} type="button">
          + New Column
        </button>
      </main>
    </DndContext>
  )
}
