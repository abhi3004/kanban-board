import { useState } from 'react'
import { useBoardActions, useBoards } from '../hooks/useBoards'
import { useTheme } from '../context/useTheme'

type MenuProps = {
  isOpen: boolean
  onClose: () => void
}

export function Menu({ isOpen, onClose }: MenuProps) {
  const { boards, activeBoardId } = useBoards()
  const { createBoard, selectBoard } = useBoardActions()
  const { theme, toggleTheme } = useTheme()
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [boardName, setBoardName] = useState('')
  const [error, setError] = useState('')

  const handleCreateBoard = async () => {
    setIsSaving(true)
    const result = await createBoard(boardName)
    setIsSaving(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setBoardName('')
    setError('')
    setIsCreating(false)
    onClose()
  }

  return (
    <>
      <button
        aria-label="Close board menu"
        className={`sidebar-scrim ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
        type="button"
      />
      <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
        <div>
          <div className="brand" aria-label="Kanban">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>kanban</span>
          </div>

          <p className="sidebar-eyebrow">ALL BOARDS ({boards.length})</p>
          <nav className="board-list" aria-label="Boards">
            {boards.map((board) => (
              <button
                className={`board-nav-item ${
                  board.id === activeBoardId ? 'is-active' : ''
                }`}
                key={board.id}
                onClick={() => {
                  selectBoard(board.id)
                  onClose()
                }}
                type="button"
              >
                <span className="board-icon" aria-hidden="true" />
                {board.name}
              </button>
            ))}
          </nav>

          {isCreating ? (
            <form
              className="sidebar-form"
              onSubmit={(event) => {
                event.preventDefault()
                void handleCreateBoard()
              }}
            >
              <label htmlFor="new-board-name">Board name</label>
              <input
                autoFocus
                id="new-board-name"
                onChange={(event) => {
                  setBoardName(event.target.value)
                  setError('')
                }}
                disabled={isSaving}
                value={boardName}
              />
              {error ? <p className="form-error">{error}</p> : null}
              <div className="form-actions">
                <button className="primary-button compact" disabled={isSaving} type="submit">
                  {isSaving ? 'Creating...' : 'Create'}
                </button>
                <button
                  className="ghost-button compact"
                  onClick={() => {
                    setIsCreating(false)
                    setBoardName('')
                    setError('')
                  }}
                  disabled={isSaving}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              className="create-board-button"
              onClick={() => setIsCreating(true)}
              type="button"
            >
              <span className="board-icon" aria-hidden="true" />+ Create New Board
            </button>
          )}
        </div>

        <div className="theme-panel">
          <span aria-hidden="true">Light</span>
          <button
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
          >
            <span />
          </button>
          <span aria-hidden="true">Dark</span>
        </div>
      </aside>
    </>
  )
}
