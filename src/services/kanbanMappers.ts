import type { Board, Column, ColumnKind, Subtask, Task } from '../types/kanban'

export type ApiSubtask = {
  id: string
  taskId: string
  name: string
  isDone: boolean
}

export type ApiTask = {
  id: string
  boardId: string
  title: string
  description?: string | null
  column: string
  type: string
  subtasks: ApiSubtask[]
}

export type ApiBoard = {
  id: string
  name: string
  columns: string[]
  tasks?: ApiTask[]
}

const defaultKindByName: Record<string, Exclude<ColumnKind, 'custom'>> = {
  todo: 'todo',
  doing: 'doing',
  done: 'done',
}

const getColumnKind = (name: string): ColumnKind =>
  defaultKindByName[name.trim().toLowerCase()] ?? 'custom'

export const toApiColumnName = (columnId: string) => columnId

export const toAppSubtask = (subtask: ApiSubtask): Subtask => ({
  id: subtask.id,
  title: subtask.name,
  isDone: subtask.isDone,
})

export const toAppColumn = (name: string): Column => ({
  id: name,
  name,
  kind: getColumnKind(name),
})

export const toAppTask = (task: ApiTask): Task => ({
  id: task.id,
  title: task.title,
  columnId: task.type || task.column,
  subtasks: [...task.subtasks]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(toAppSubtask),
})

export const toAppBoard = (board: ApiBoard): Board => ({
  id: board.id,
  name: board.name,
  columns: board.columns.map(toAppColumn),
  tasks: (board.tasks ?? []).map(toAppTask),
})
