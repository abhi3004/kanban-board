type BoardHeaderProps = {
  boardName: string
  isAddTaskDisabled?: boolean
  onAddTask: () => void
  onOpenMenu: () => void
}

export function BoardHeader({
  boardName,
  isAddTaskDisabled = false,
  onAddTask,
  onOpenMenu,
}: BoardHeaderProps) {
  return (
    <header className="board-header">
      <div className="board-title-group">
        <button
          aria-label="Open board menu"
          className="mobile-menu-button"
          onClick={onOpenMenu}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
        <h1>{boardName}</h1>
      </div>
      <div className="header-actions">
        <button
          aria-label="Add New Task"
          className="primary-button"
          disabled={isAddTaskDisabled}
          onClick={onAddTask}
          type="button"
        >
          + Add New Task
        </button>
        <button aria-label="Board options" className="options-button" type="button">
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
