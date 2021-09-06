import { shopApi } from '.'
import { Category } from '../types'

const categoryApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllCategories: build.query<Category[], void>({
			query: () => `/category`,
		}),
		getCategoryById: build.query<Category, number>({
			query: id => `/category/${id}`,
		}),
	}),
	overrideExisting: false,
})

export const { useGetAllCategoriesQuery, useGetCategoryByIdQuery } = categoryApi
