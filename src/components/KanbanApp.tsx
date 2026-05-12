import { useState } from 'react'
import { useTheme } from '../context/useTheme'
import { useBoards } from '../hooks/useBoards'
import { AddColumnModal } from './AddColumnModal'
import { BoardHeader } from './BoardHeader'
import { BoardView } from './BoardView'
import { Menu } from './Menu'
import { TaskModal } from './TaskModal'

type ActiveModal =
  | { type: 'task'; taskId?: string }
  | { type: 'column' }
  | null

export function KanbanApp() {
  const { activeBoard, isError, isLoading, refetch } = useBoards()
  const { theme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const selectedTask =
    activeModal?.type === 'task' && activeModal.taskId
      ? activeBoard.tasks.find((task) => task.id === activeModal.taskId)
      : undefined

  return (
    <div className="kanban-app" data-theme={theme}>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="workspace">
        <BoardHeader
          boardName={activeBoard?.name ?? 'No Board Selected'}
          isAddTaskDisabled={!activeBoard}
          onAddTask={() => setActiveModal({ type: 'task' })}
          onOpenMenu={() => setIsMenuOpen(true)}
        />
        {isError ? (
          <main className="board-canvas empty-board" aria-label="Kanban service error">
            <div>
              <h2>Could not reach kanban-service</h2>
              <p>Make sure the backend is running on port 5001, then retry.</p>
              <button className="primary-button" onClick={refetch} type="button">
                Retry
              </button>
            </div>
          </main>
        ) : isLoading && !activeBoard ? (
          <main className="board-canvas empty-board" aria-label="Loading boards">
            <div>
              <h2>Loading boards...</h2>
            </div>
          </main>
        ) : (
          <BoardView
            onAddColumn={() => setActiveModal({ type: 'column' })}
            onOpenTask={(taskId) => setActiveModal({ type: 'task', taskId })}
          />
        )}
      </section>

      {activeModal?.type === 'task' && activeBoard ? (
        <TaskModal
          boardId={activeBoard.id}
          key={selectedTask?.id ?? 'new-task'}
          onClose={() => setActiveModal(null)}
          task={selectedTask}
        />
      ) : null}

      {activeModal?.type === 'column' && activeBoard ? (
        <AddColumnModal
          boardId={activeBoard.id}
          onClose={() => setActiveModal(null)}
        />
      ) : null}
    </div>
  )
}
