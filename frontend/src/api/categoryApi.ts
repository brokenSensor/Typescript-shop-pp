import { shopApi } from '.'
import { Category } from '../types'

const categoryApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllCategories: build.query<Category[], void>({
			query: () => `/category`,
		}),
	}),
	overrideExisting: false,
})

export const { useGetAllCategoriesQuery } = categoryApi
