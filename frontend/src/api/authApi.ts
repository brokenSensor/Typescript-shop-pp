import { shopApi } from '.'
import {
	LoginRequest,
	RegisterRequest,
	TokensAndUser,
	UpdateUserDto,
	UserDto,
} from '../types'

const authApi = shopApi.injectEndpoints({
	endpoints: build => ({
		loginUser: build.mutation<TokensAndUser, LoginRequest>({
			query: loginCredentials => ({
				url: '/auth/login',
				method: 'POST',
				body: loginCredentials,
				credentials: 'include',
			}),
		}),
		registerUser: build.mutation<TokensAndUser, RegisterRequest>({
			query: registerCredentials => ({
				url: '/auth/register',
				method: 'POST',
				body: registerCredentials,
				credentials: 'include',
			}),
		}),
		logoutUser: build.mutation<void, void>({
			query: () => ({
				url: '/auth/logout',
				method: 'POST',
				credentials: 'include',
			}),
		}),
		updateUser: build.mutation<void, UpdateUserDto>({
			query: updateUserDto => ({
				url: '/users',
				method: 'PUT',
				body: updateUserDto,
				credentials: 'include',
			}),
		}),
		getUser: build.query<UserDto, void>({
			query: () => `/users/me`,
		}),
	}),
	overrideExisting: false,
})

export const {
	useLoginUserMutation,
	useRegisterUserMutation,
	useLogoutUserMutation,
	useUpdateUserMutation,
	useGetUserQuery,
} = authApi
