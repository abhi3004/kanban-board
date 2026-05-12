import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { TaskDraft, TaskUpdate } from '../types/kanban'
import {
  toApiColumnName,
  toAppBoard,
  type ApiBoard,
  type ApiSubtask,
  type ApiTask,
} from './kanbanMappers'

const apiBaseUrl = import.meta.env.VITE_KANBAN_API_BASE_URL ?? '/api'

type CreateBoardRequest = {
  name: string
}

type UpdateBoardRequest = {
  id: string
  columns: string[]
}

type CreateTaskRequest = {
  boardId: string
  task: TaskDraft
}

type UpdateTaskRequest = {
  boardId: string
  taskId: string
  update: TaskUpdate
}

type MoveTaskRequest = {
  boardId: string
  taskId: string
  columnId: string
}

export const kanbanApi = createApi({
  reducerPath: 'kanbanApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  tagTypes: ['Board', 'Boards'],
  endpoints: (builder) => ({
    getBoards: builder.query<ApiBoard[], void>({
      query: () => '/boards',
      providesTags: ['Boards'],
    }),
    getBoard: builder.query<ReturnType<typeof toAppBoard>, string>({
      query: (boardId) => `/boards/${boardId}`,
      transformResponse: (board: ApiBoard) => toAppBoard(board),
      providesTags: (_result, _error, boardId) => [{ type: 'Board', id: boardId }],
    }),
    createBoard: builder.mutation<ApiBoard, CreateBoardRequest>({
      query: (body) => ({
        url: '/boards',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Boards'],
    }),
    updateBoardColumns: builder.mutation<ApiBoard, UpdateBoardRequest>({
      query: ({ id, columns }) => ({
        url: `/boards/${id}`,
        method: 'PATCH',
        body: { columns },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Boards',
        { type: 'Board', id },
      ],
    }),
    createTask: builder.mutation<ApiTask, CreateTaskRequest>({
      async queryFn({ boardId, task }, _api, _extraOptions, baseQuery) {
        const taskResult = await baseQuery({
          url: `/boards/${boardId}/tasks`,
          method: 'POST',
          body: {
            title: task.title,
            column: 'Todo',
          },
        })

        if (taskResult.error) {
          return { error: taskResult.error }
        }

        const createdTask = taskResult.data as ApiTask

        for (const subtask of task.subtasks) {
          const trimmedTitle = subtask.title.trim()
          if (!trimmedTitle) {
            continue
          }

          const subtaskResult = await baseQuery({
            url: `/tasks/${createdTask.id}/subtasks`,
            method: 'POST',
            body: { name: trimmedTitle },
          })

          if (subtaskResult.error) {
            return { error: subtaskResult.error }
          }

          if (subtask.isDone) {
            const createdSubtask = subtaskResult.data as ApiSubtask
            const updateResult = await baseQuery({
              url: `/subtasks/${createdSubtask.id}`,
              method: 'PATCH',
              body: { isDone: true },
            })

            if (updateResult.error) {
              return { error: updateResult.error }
            }
          }
        }

        return { data: createdTask }
      },
      invalidatesTags: (_result, _error, { boardId }) => [
        'Boards',
        { type: 'Board', id: boardId },
      ],
    }),
    updateTask: builder.mutation<ApiTask, UpdateTaskRequest>({
      async queryFn({ taskId, update }, _api, _extraOptions, baseQuery) {
        const taskResult = await baseQuery({
          url: `/tasks/${taskId}`,
          method: 'PATCH',
          body: { title: update.title },
        })

        if (taskResult.error) {
          return { error: taskResult.error }
        }

        for (const subtask of update.subtasks) {
          const trimmedTitle = subtask.title.trim()
          if (!trimmedTitle) {
            continue
          }

          const isDraft = subtask.id.startsWith('draft-')
          const subtaskResult = isDraft
            ? await baseQuery({
                url: `/tasks/${taskId}/subtasks`,
                method: 'POST',
                body: { name: trimmedTitle },
              })
            : await baseQuery({
                url: `/subtasks/${subtask.id}`,
                method: 'PATCH',
                body: {
                  name: trimmedTitle,
                  isDone: subtask.isDone,
                },
              })

          if (subtaskResult.error) {
            return { error: subtaskResult.error }
          }
        }

        return { data: taskResult.data as ApiTask }
      },
      invalidatesTags: (_result, _error, { boardId }) => [
        'Boards',
        { type: 'Board', id: boardId },
      ],
    }),
    moveTask: builder.mutation<ApiTask, MoveTaskRequest>({
      query: ({ taskId, columnId }) => ({
        url: `/tasks/${taskId}`,
        method: 'PATCH',
        body: { column: toApiColumnName(columnId) },
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        'Boards',
        { type: 'Board', id: boardId },
      ],
    }),
  }),
})

export const {
  useCreateBoardMutation,
  useCreateTaskMutation,
  useGetBoardQuery,
  useGetBoardsQuery,
  useMoveTaskMutation,
  useUpdateBoardColumnsMutation,
  useUpdateTaskMutation,
} = kanbanApi
