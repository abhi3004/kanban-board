export type ColumnKind = 'todo' | 'doing' | 'done' | 'custom'

export type Subtask = {
  id: string
  title: string
  isDone: boolean
}

export type Task = {
  id: string
  title: string
  columnId: string
  subtasks: Subtask[]
}

export type Column = {
  id: string
  name: string
  kind: ColumnKind
}

export type Board = {
  id: string
  name: string
  columns: Column[]
  tasks: Task[]
}

export type TaskDraft = {
  title: string
  subtasks: Array<Pick<Subtask, 'title' | 'isDone'>>
}

export type TaskUpdate = {
  title: string
  subtasks: Subtask[]
}
