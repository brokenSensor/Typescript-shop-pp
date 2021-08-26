import { shopApi } from '.'
import { Order, UpdateProductDto, UpdateUserDto, User } from '../types'

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
		updateProductById: build.mutation<void, UpdateProductDto>({
			query: updateProductDto => ({
				url: `/product`,
				method: 'PUT',
				body: updateProductDto,
				credentials: 'include',
			}),
		}),
		uploadFile: build.mutation<{ filePath: string }, FormData>({
			query: formData => ({
				url: `/product/upload`,
				method: 'POST',
				body: formData,
				credentials: 'include',
				headers: [['Content-Type', 'multipart/form-data']],
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
	useUploadFileMutation,
} = adminApi
