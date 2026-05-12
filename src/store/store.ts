import { configureStore } from '@reduxjs/toolkit'
import { kanbanApi } from '../services/kanbanApi'
import { kanbanReducer } from './kanbanSlice'

export const setupStore = () =>
  configureStore({
    reducer: {
      [kanbanApi.reducerPath]: kanbanApi.reducer,
      kanban: kanbanReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(kanbanApi.middleware),
  })

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
