import type { Board, Column, ColumnKind, Subtask, Task } from '../types/kanban'

const defaultColumnMeta: Array<{ kind: Exclude<ColumnKind, 'custom'>; name: string }> =
  [
    { kind: 'todo', name: 'Todo' },
    { kind: 'doing', name: 'Doing' },
    { kind: 'done', name: 'Done' },
  ]

const makeId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const createDefaultColumns = (boardId: string): Column[] =>
  defaultColumnMeta.map(({ kind, name }) => ({
    id: `${boardId}-${kind}`,
    name,
    kind,
  }))

const subtasks = (prefix: string, total: number, done: number): Subtask[] =>
  Array.from({ length: total }, (_, index) => ({
    id: `${prefix}-subtask-${index + 1}`,
    title: `Subtask ${index + 1}`,
    isDone: index < done,
  }))

const task = (
  boardId: string,
  columnKind: Exclude<ColumnKind, 'custom'>,
  title: string,
  total: number,
  done: number,
): Task => {
  const id = `${boardId}-${makeId(title)}`

  return {
    id,
    title,
    columnId: `${boardId}-${columnKind}`,
    subtasks: subtasks(id, total, done),
  }
}

const createBoard = (
  id: string,
  name: string,
  tasks: Task[],
): Board => ({
  id,
  name,
  columns: createDefaultColumns(id),
  tasks,
})

export const seedBoards: Board[] = [
  createBoard('platform-launch', 'Platform Launch', [
    task('platform-launch', 'todo', 'Build UI for onboarding flow', 3, 0),
    task('platform-launch', 'todo', 'Build UI for search', 1, 0),
    task('platform-launch', 'todo', 'Build settings UI', 2, 0),
    task('platform-launch', 'todo', 'QA and test all major user journeys', 2, 0),
    task('platform-launch', 'doing', 'Design settings and search pages', 3, 1),
    task('platform-launch', 'doing', 'Add account management endpoints', 3, 2),
    task('platform-launch', 'doing', 'Design onboarding flow', 3, 1),
    task('platform-launch', 'doing', 'Add search endpoints', 2, 1),
    task('platform-launch', 'doing', 'Add authentication endpoints', 2, 1),
    task(
      'platform-launch',
      'doing',
      'Research pricing points of various competitors and trial different business models',
      3,
      1,
    ),
    task('platform-launch', 'done', 'Conduct 5 wireframe tests', 1, 1),
    task('platform-launch', 'done', 'Create wireframe prototype', 1, 1),
    task(
      'platform-launch',
      'done',
      'Review results of usability tests and iterate',
      3,
      3,
    ),
    task(
      'platform-launch',
      'done',
      'Create paper prototypes and conduct 10 usability tests with potential customers',
      2,
      2,
    ),
    task('platform-launch', 'done', 'Market discovery', 1, 1),
    task('platform-launch', 'done', 'Competitor analysis', 2, 2),
    task('platform-launch', 'done', 'Research the market', 2, 2),
  ]),
  createBoard('marketing-plan', 'Marketing Plan', [
    task('marketing-plan', 'todo', 'Draft launch announcement', 2, 0),
    task('marketing-plan', 'doing', 'Schedule social posts', 3, 1),
    task('marketing-plan', 'done', 'Approve campaign brief', 2, 2),
  ]),
  createBoard('roadmap', 'Roadmap', [
    task('roadmap', 'todo', 'Collect feature requests', 2, 0),
    task('roadmap', 'doing', 'Prioritize beta feedback', 4, 2),
    task('roadmap', 'done', 'Define MVP scope', 3, 3),
  ]),
]
