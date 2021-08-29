import { shopApi } from '.'
import {
	CreateProductDto,
	PaginatedOrders,
	PaginatedUsers,
	UpdateProductDto,
	UpdateUserDto,
	User,
} from '../types'

const adminApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllUsers: build.query<
			PaginatedUsers,
			{ pageNumber: string; keyword: string }
		>({
			query: ({ keyword, pageNumber }) =>
				`/users?keyword=${keyword}&pageNumber=${pageNumber}`,
		}),
		getAllOrders: build.query<
			PaginatedOrders,
			{ pageNumber: string; keyword: string }
		>({
			query: ({ keyword, pageNumber }) =>
				`/order?keyword=${keyword}&pageNumber=${pageNumber}`,
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
		updateProductById: build.mutation<void, UpdateProductDto>({
			query: updateProductDto => ({
				url: `/product`,
				method: 'PUT',
				body: updateProductDto,
				credentials: 'include',
			}),
		}),
		createProduct: build.mutation<void, CreateProductDto>({
			query: createProductDto => ({
				url: `/product`,
				method: 'POST',
				body: createProductDto,
				credentials: 'include',
			}),
		}),
		updateOrderToDelivered: build.mutation<void, number>({
			query: id => ({
				url: `/order/delivered/${id}`,
				method: 'PUT',
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
	useUpdateProductByIdMutation,
	useCreateProductMutation,
	useUpdateOrderToDeliveredMutation,
} = adminApi
