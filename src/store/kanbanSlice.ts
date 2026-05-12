import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type KanbanState = {
  activeBoardId: string | null
}

const initialState: KanbanState = {
  activeBoardId: null,
}

export const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    selectBoard(state, action: PayloadAction<string | null>) {
      state.activeBoardId = action.payload
    },
  },
})

export const kanbanActions = kanbanSlice.actions
export const kanbanReducer = kanbanSlice.reducer
