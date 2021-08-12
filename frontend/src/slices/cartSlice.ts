import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, CartState, PaymentMethod, ShippingAddress } from '../types'

const cartSlice = createSlice({
	name: 'auth',
	initialState: {
		items: JSON.parse(localStorage.getItem('cart') || '[]'),
		shippingAddress: JSON.parse(
			localStorage.getItem('shippingAddress') || '{}'
		),
		paymentMethod: localStorage.getItem('paymentMethod') || '',
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
		savePaymentMethod: (state, { payload }: PayloadAction<PaymentMethod>) => {
			state.paymentMethod = payload
			localStorage.setItem('paymentMethod', JSON.stringify(payload))
		},
	},
})

export const {
	addToCart,
	removeFromCartByIndex,
	saveShippingAddress,
	savePaymentMethod,
} = cartSlice.actions

export default cartSlice.reducer
