import {
  useCreateTaskMutation,
  useMoveTaskMutation,
  useUpdateTaskMutation,
} from '../services/kanbanApi'
import type { TaskDraft, TaskUpdate } from '../types/kanban'

export const useTaskActions = () => {
  const [createTask] = useCreateTaskMutation()
  const [updateTaskMutation] = useUpdateTaskMutation()
  const [moveTaskMutation] = useMoveTaskMutation()

  const addTask = async (boardId: string, task: TaskDraft) => {
    if (!task.title.trim()) {
      return { ok: false, error: 'Task name is required.' }
    }

    try {
      await createTask({ boardId, task }).unwrap()
      return { ok: true, error: '' }
    } catch {
      return { ok: false, error: 'Unable to create task. Please try again.' }
    }
  }

  const updateTask = async (boardId: string, taskId: string, update: TaskUpdate) => {
    if (!update.title.trim()) {
      return { ok: false, error: 'Task name is required.' }
    }

    try {
      await updateTaskMutation({ boardId, taskId, update }).unwrap()
      return { ok: true, error: '' }
    } catch {
      return { ok: false, error: 'Unable to save task. Please try again.' }
    }
  }

  const moveTask = async (boardId: string, taskId: string, columnId: string) => {
    try {
      await moveTaskMutation({ boardId, taskId, columnId }).unwrap()
      return { ok: true, error: '' }
    } catch {
      return { ok: false, error: 'Unable to move task. Please try again.' }
    }
  }

  return {
    addTask,
    updateTask,
    moveTask,
  }
}
