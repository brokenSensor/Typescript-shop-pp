import { configureStore } from '@reduxjs/toolkit'
import { AnyAction } from 'redux'
import thunk, { ThunkAction } from 'redux-thunk'
import productListSlice from './slices/productListSlice'

const initialState = {}

const middleware = [thunk]

const store = configureStore({
	reducer: {
		productList: productListSlice,
	},
})

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	AnyAction
>
