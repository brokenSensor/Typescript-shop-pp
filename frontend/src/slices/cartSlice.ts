import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, ShippingAddress } from '../types/product'

export type CartState = {
	items: CartItem[]
	shippingAddress: ShippingAddress
}

const cartSlice = createSlice({
	name: 'auth',
	initialState: {
		items: JSON.parse(localStorage.getItem('cart') || '[]'),
		shippingAddress: JSON.parse(
			localStorage.getItem('shippingAddress') || '{}'
		),
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

		saveShippingAddress: (
			state,
			{ payload }: PayloadAction<ShippingAddress>
		) => {
			state.shippingAddress = payload
			localStorage.setItem('shippingAddress', JSON.stringify(payload))
		},
	},
})

export const { addToCart, removeFromCartByIndex, saveShippingAddress } =
	cartSlice.actions

export default cartSlice.reducer
