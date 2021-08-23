import { shopApi } from '.'
import { Order, User } from '../types'

const adminApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllUsers: build.query<User[], void>({
			query: () => `/users`,
		}),
		getAllOrders: build.query<Order[], void>({
			query: () => `/order`,
		}),
	}),
	overrideExisting: false,
})

export const { useGetAllUsersQuery, useGetAllOrdersQuery } = adminApi
