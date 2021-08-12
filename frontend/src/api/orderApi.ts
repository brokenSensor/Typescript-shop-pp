import { shopApi } from '.'
import { CreateOrderDto, Order } from '../types'

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
	}),
	overrideExisting: false,
})

export const { useCreateOrderMutation } = orderApi
