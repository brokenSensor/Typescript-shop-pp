import { shopApi } from '.'
import {
	CreateCategoryDto,
	CreateProductDto,
	PaginatedCategories,
	PaginatedOrders,
	PaginatedUsers,
	UpdateCategoryDto,
	UpdateProductDto,
	UpdateUserDto,
	User,
} from '../types'

const adminApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllUsers: build.query<
			PaginatedUsers,
			{ pageNumber?: string; keyword?: string }
		>({
			query: ({ keyword, pageNumber }) =>
				`/users?keyword=${keyword}&pageNumber=${pageNumber}`,
		}),
		getAllOrders: build.query<
			PaginatedOrders,
			{ pageNumber?: string; keyword?: string }
		>({
			query: ({ keyword, pageNumber }) =>
				`/order?keyword=${keyword}&pageNumber=${pageNumber}`,
		}),
		getUserById: build.query<User, string>({
			query: id => `/users/id/${id}`,
		}),
		getAllCategoriesForAdmin: build.query<
			PaginatedCategories,
			{ pageNumber?: string; keyword?: string }
		>({
			query: ({ keyword, pageNumber }) =>
				`/category/admin?keyword=${keyword}&pageNumber=${pageNumber}`,
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
		updateCategoryById: build.mutation<void, UpdateCategoryDto>({
			query: updateCategoryDto => ({
				url: `/category`,
				method: 'PUT',
				body: updateCategoryDto,
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
		createCategory: build.mutation<void, CreateCategoryDto>({
			query: createCategoryDto => ({
				url: `/category`,
				method: 'POST',
				body: createCategoryDto,
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
		deleteUserById: build.mutation<void, number>({
			query: id => ({
				url: `/users/${id}`,
				method: 'DELETE',
				credentials: 'include',
			}),
		}),
		deleteOrderById: build.mutation<void, number>({
			query: id => ({
				url: `/order/${id}`,
				method: 'DELETE',
				credentials: 'include',
			}),
		}),
		deleteProductById: build.mutation<void, number>({
			query: id => ({
				url: `/product/${id}`,
				method: 'DELETE',
				credentials: 'include',
			}),
		}),
		deleteCategoryById: build.mutation<void, number>({
			query: id => ({
				url: `/category/${id}`,
				method: 'DELETE',
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
	useDeleteOrderByIdMutation,
	useDeleteProductByIdMutation,
	useDeleteUserByIdMutation,
	useCreateCategoryMutation,
	useGetAllCategoriesForAdminQuery,
	useDeleteCategoryByIdMutation,
	useUpdateCategoryByIdMutation,
} = adminApi
