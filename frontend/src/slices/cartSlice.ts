import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem } from '../types/product'

export type CartState = {
	items: CartItem[]
}

const cartSlice = createSlice({
	name: 'auth',
	initialState: {
		items: JSON.parse(localStorage.getItem('cart') || '[]'),
	} as CartState,
	reducers: {
		addToCart: (state, { payload }: PayloadAction<CartItem>) => {
			state.items.push(payload)
			localStorage.setItem('cart', JSON.stringify(state.items))
		},
	},
})

export const { addToCart } = cartSlice.actions

export default cartSlice.reducer
