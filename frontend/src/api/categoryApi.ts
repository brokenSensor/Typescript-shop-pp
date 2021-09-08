import { shopApi } from '.'
import { Category } from '../types'

const categoryApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllCategories: build.query<Category[], void>({
			query: () => `/api/category`,
		}),
		getCategoryById: build.query<Category, number>({
			query: id => `/api/category/${id}`,
		}),
	}),
	overrideExisting: false,
})

export const { useGetAllCategoriesQuery, useGetCategoryByIdQuery } = categoryApi
