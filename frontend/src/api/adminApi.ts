import { shopApi } from '.'
import { Order, UpdateUserDto, User } from '../types'

const adminApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllUsers: build.query<User[], void>({
			query: () => `/users`,
		}),
		getAllOrders: build.query<Order[], void>({
			query: () => `/order`,
		}),
		getUserById: build.query<User, string>({
			query: id => `/users/id/${id}`,
		}),
		updateUserById: build.mutation<void, UpdateUserDto>({
			query: updateUserDto => ({
				url: `/users/admin/`,
				method: 'PUT',
				body: updateUserDto,
				credentials: 'include',
			}),
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetAllUsersQuery,
	useGetAllOrdersQuery,
	useGetUserByIdQuery,
	useUpdateUserByIdMutation,
} = adminApi
