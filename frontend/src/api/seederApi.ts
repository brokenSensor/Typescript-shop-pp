import { shopApi } from '.'

const seederApi = shopApi.injectEndpoints({
	endpoints: build => ({
		reseedDB: build.mutation<void, void>({
			query: () => ({
				url: `/seeder`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
	}),
	overrideExisting: false,
})

export const { useReseedDBMutation } = seederApi
