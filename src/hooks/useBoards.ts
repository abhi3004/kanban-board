import { kanbanActions } from '../store/kanbanSlice'
import { useAppDispatch, useAppSelector } from '../store/reduxHooks'
import {
  useCreateBoardMutation,
  useGetBoardQuery,
  useGetBoardsQuery,
  useUpdateBoardColumnsMutation,
} from '../services/kanbanApi'
import { toAppBoard } from '../services/kanbanMappers'

const normalizeName = (name: string) => name.trim().toLowerCase()

export const useBoards = () => {
  const boardListQuery = useGetBoardsQuery()
  const boards = (boardListQuery.data ?? []).map(toAppBoard)
  const selectedBoardId = useAppSelector((state) => state.kanban.activeBoardId)
  const activeBoardId =
    selectedBoardId && boards.some((board) => board.id === selectedBoardId)
      ? selectedBoardId
      : boards[0]?.id ?? null
  const activeBoardSummary =
    boards.find((board) => board.id === activeBoardId) ?? boards[0] ?? null
  const activeBoardQuery = useGetBoardQuery(activeBoardId ?? '', {
    skip: !activeBoardId,
  })
  const activeBoard = activeBoardQuery.data ?? activeBoardSummary

  return {
    activeBoard,
    activeBoardId,
    boards,
    error: boardListQuery.error ?? activeBoardQuery.error,
    isError: boardListQuery.isError || activeBoardQuery.isError,
    isLoading:
      boardListQuery.isLoading || (Boolean(activeBoardId) && activeBoardQuery.isLoading),
    refetch: () => {
      void boardListQuery.refetch()
      if (activeBoardId) {
        void activeBoardQuery.refetch()
      }
    },
  }
}

export const useBoardActions = () => {
  const dispatch = useAppDispatch()
  const { boards } = useBoards()
  const [createBoardMutation] = useCreateBoardMutation()
  const [updateBoardColumnsMutation] = useUpdateBoardColumnsMutation()

  const createBoard = async (name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { ok: false, error: 'Board name is required.' }
    }

    const exists = boards.some(
      (board) => normalizeName(board.name) === normalizeName(trimmedName),
    )
    if (exists) {
      return { ok: false, error: 'A board with this name already exists.' }
    }

    try {
      const createdBoard = await createBoardMutation({ name: trimmedName }).unwrap()
      dispatch(kanbanActions.selectBoard(createdBoard.id))
      return { ok: true, error: '' }
    } catch {
      return { ok: false, error: 'Unable to create board. Please try again.' }
    }
  }

  const selectBoard = (boardId: string) => {
    dispatch(kanbanActions.selectBoard(boardId))
  }

  const addColumn = async (boardId: string, name: string) => {
    const trimmedName = name.trim()
    const board = boards.find((item) => item.id === boardId)

    if (!trimmedName) {
      return { ok: false, error: 'Column name is required.' }
    }

    const exists = board?.columns.some(
      (column) => normalizeName(column.name) === normalizeName(trimmedName),
    )
    if (exists) {
      return { ok: false, error: 'A column with this name already exists.' }
    }

    if (!board) {
      return { ok: false, error: 'Board not found.' }
    }

    try {
      await updateBoardColumnsMutation({
        id: boardId,
        columns: [...board.columns.map((column) => column.name), trimmedName],
      }).unwrap()
      return { ok: true, error: '' }
    } catch {
      return { ok: false, error: 'Unable to create column. Please try again.' }
    }
  }

  return {
    createBoard,
    selectBoard,
    addColumn,
  }
}
