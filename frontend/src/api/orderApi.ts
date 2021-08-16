import { shopApi } from '.'
import { CreateOrderDto, Order, PaymentResult } from '../types'

const orderApi = shopApi.injectEndpoints({
	endpoints: build => ({
		createOrder: build.mutation<Order, CreateOrderDto>({
			query: createOrderDto => ({
				url: '/order',
				method: 'POST',
				body: createOrderDto,
				credentials: 'include',
			}),
		}),
		getPayPalConfig: build.query<{ clientId: string }, void>({
			query: () => `/order/paypalconfig`,
		}),
		getOrderById: build.query<Order, number>({
			query: id => `/order/${id}`,
		}),
		updateOrderToPayed: build.mutation<
			Order,
			{ orderId: number; paymentResult: PaymentResult }
		>({
			query: arg => ({
				url: `/order/pay/${arg.orderId}`,
				method: 'PUT',
				body: arg.paymentResult,
				credentials: 'include',
			}),
		}),
	}),
	overrideExisting: false,
})

export const {
	useCreateOrderMutation,
	useGetOrderByIdQuery,
	useUpdateOrderToPayedMutation,
	useGetPayPalConfigQuery,
} = orderApi
