import { configureStore } from '@reduxjs/toolkit'
import { shopApi } from './api'
import authSlice from './slices/authSlice'

export const store = configureStore({
	reducer: {
		[shopApi.reducerPath]: shopApi.reducer,
		authReducer: authSlice,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(shopApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
