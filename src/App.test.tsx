import { Provider } from 'react-redux'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { KanbanApp } from './components/KanbanApp'
import { ThemeProvider } from './context/ThemeProvider'
import { useBoards } from './hooks/useBoards'
import { useTaskActions } from './hooks/useTaskActions'
import { setupStore } from './store/store'

function renderKanban() {
  const store = setupStore()
  const user = userEvent.setup()

  render(
    <Provider store={store}>
      <ThemeProvider>
        <KanbanApp />
      </ThemeProvider>
    </Provider>,
  )

  return { store, user }
}

function renderWithStore(ui: React.ReactElement) {
  const store = setupStore()
  const user = userEvent.setup()

  render(
    <Provider store={store}>
      <ThemeProvider>{ui}</ThemeProvider>
    </Provider>,
  )

  return { store, user }
}

describe('Kanban app', () => {
  it('mounts the app providers', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Platform Launch' }),
    ).toBeInTheDocument()
  })

  it('renders boards and switches the active board', async () => {
    const { user } = renderKanban()

    expect(
      screen.getByRole('heading', { name: 'Platform Launch' }),
    ).toBeInTheDocument()
    expect(screen.getByText('ALL BOARDS (3)')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /marketing plan/i }))

    expect(
      screen.getByRole('heading', { name: 'Marketing Plan' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Draft launch announcement')).toBeInTheDocument()
  })

  it('validates and creates boards from the sidebar', async () => {
    const { user } = renderKanban()

    await user.click(screen.getByRole('button', { name: /\+ create new board/i }))
    await user.type(screen.getByLabelText(/board name/i), 'Roadmap')
    await user.click(screen.getByRole('button', { name: /^create$/i }))

    expect(
      screen.getByText('A board with this name already exists.'),
    ).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/board name/i))
    await user.type(screen.getByLabelText(/board name/i), 'Design Ops')
    await user.click(screen.getByRole('button', { name: /^create$/i }))

    expect(screen.getByRole('heading', { name: 'Design Ops' })).toBeInTheDocument()
    expect(screen.getByText('ALL BOARDS (4)')).toBeInTheDocument()
  })

  it('toggles between dark and light mode through context', async () => {
    const { user } = renderKanban()

    const toggle = screen.getByRole('button', { name: /switch to light mode/i })
    await user.click(toggle)

    expect(
      screen.getByRole('button', { name: /switch to dark mode/i }),
    ).toBeInTheDocument()
  })

  it('validates duplicate columns and adds a custom column', async () => {
    const { user } = renderKanban()

    await user.click(screen.getByRole('button', { name: /\+ new column/i }))
    await user.type(screen.getByLabelText(/column name/i), 'Todo')
    await user.click(screen.getByRole('button', { name: /create column/i }))

    expect(
      screen.getByText('A column with this name already exists.'),
    ).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/column name/i))
    await user.type(screen.getByLabelText(/column name/i), 'Blocked')
    await user.click(screen.getByRole('button', { name: /create column/i }))

    expect(screen.getByLabelText('Blocked column')).toBeInTheDocument()
  })

  it('adds a task through the task modal', async () => {
    const { user } = renderKanban()

    await user.click(screen.getByRole('button', { name: /add new task/i }))
    await user.type(screen.getByLabelText(/task name/i), 'Write release notes')
    await user.type(screen.getByLabelText(/new subtask/i), 'Draft copy')
    await user.click(screen.getByRole('button', { name: /add subtask/i }))
    await user.click(screen.getByRole('button', { name: /create task/i }))

    const todoColumn = screen.getByLabelText('Todo column')
    expect(within(todoColumn).getByText('Write release notes')).toBeInTheDocument()
    expect(
      within(screen.getByRole('button', { name: /open task write release notes/i }))
        .getByText('0 of 1 subtasks'),
    ).toBeInTheDocument()
  })

  it('edits a task title and moves it when subtasks are completed', async () => {
    const { user } = renderKanban()

    await user.click(
      screen.getByRole('button', { name: /open task build ui for onboarding flow/i }),
    )
    await user.clear(screen.getByLabelText(/task name/i))
    await user.type(screen.getByLabelText(/task name/i), 'Build onboarding screens')
    await user.click(screen.getAllByRole('checkbox')[0])
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    const doingColumn = screen.getByLabelText('Doing column')
    expect(within(doingColumn).getByText('Build onboarding screens')).toBeInTheDocument()
    expect(
      within(screen.getByRole('button', { name: /open task build onboarding screens/i }))
        .getByText('1 of 3 subtasks'),
    ).toBeInTheDocument()
  })

  it('moves a done task back to Doing when a new incomplete subtask is added', async () => {
    const { user } = renderKanban()

    await user.click(
      screen.getByRole('button', { name: /open task conduct 5 wireframe tests/i }),
    )
    await user.type(screen.getByLabelText(/new subtask/i), 'Follow up notes')
    await user.click(screen.getByRole('button', { name: /add subtask/i }))
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    const doingColumn = screen.getByLabelText('Doing column')
    expect(within(doingColumn).getByText('Conduct 5 wireframe tests')).toBeInTheDocument()
    expect(
      within(screen.getByRole('button', { name: /open task conduct 5 wireframe tests/i }))
        .getByText('1 of 2 subtasks'),
    ).toBeInTheDocument()
  })

  it('moves tasks between columns through the custom task hook', async () => {
    function MoveTaskHarness() {
      const { activeBoard } = useBoards()
      const { moveTask } = useTaskActions()
      const task = activeBoard.tasks.find((item) =>
        item.title.includes('Build UI for search'),
      )
      const doneColumn = activeBoard.columns.find((column) => column.kind === 'done')
      const taskColumn = activeBoard.columns.find(
        (column) => column.id === task?.columnId,
      )

      return (
        <div>
          <p>Current column: {taskColumn?.name}</p>
          <button
            onClick={() => {
              if (task && doneColumn) {
                moveTask(activeBoard.id, task.id, doneColumn.id)
              }
            }}
            type="button"
          >
            Move by hook
          </button>
        </div>
      )
    }

    const { user } = renderWithStore(<MoveTaskHarness />)

    expect(screen.getByText('Current column: Todo')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /move by hook/i }))

    expect(await screen.findByText('Current column: Done')).toBeInTheDocument()
  })
})
