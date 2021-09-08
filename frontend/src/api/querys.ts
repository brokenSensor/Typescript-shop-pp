import {
	BaseQueryFn,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { logout, refresh } from '../slices/authSlice'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
	baseUrl: '/',
	prepareHeaders: (headers, { getState }) => {
		const access_token = (getState() as RootState).authReducer.access_token

		if (access_token) {
			headers.set('authorization', `Bearer ${access_token}`)
		}

		return headers
	},
})
export const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions)
	if (result.error && result.error.status === 401) {
		// try to get a new token
		const refreshResult = await baseQuery(
			'/api/auth/refresh',
			api,
			extraOptions
		)
		if (refreshResult.data) {
			// store the new token
			api.dispatch(refresh(refreshResult.data))
			// retry the initial query
			result = await baseQuery(args, api, extraOptions)
		} else {
			api.dispatch(logout())
		}
	}
	return result
}
