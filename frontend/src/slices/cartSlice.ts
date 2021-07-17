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
			const isAlreadyInCart = state.items.find(item => {
				return item.productId === payload.productId
			})

			if (isAlreadyInCart) {
				state.items.map((item, index) => {
					if (item.productId === payload.productId) {
						state.items[index].qty = payload.qty
						return true
					} else {
						return false
					}
				})
			} else {
				state.items.push(payload)
			}

			localStorage.setItem('cart', JSON.stringify(state.items))
		},
		removeFromCartByIndex: (state, { payload }: PayloadAction<number>) => {
			state.items.splice(payload, 1)
			localStorage.setItem('cart', JSON.stringify(state.items))
		},
	},
})

export const { addToCart, removeFromCartByIndex } = cartSlice.actions

export default cartSlice.reducer
