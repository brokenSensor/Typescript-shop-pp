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
				url: '/api/auth/login',
				method: 'POST',
				body: loginCredentials,
				credentials: 'include',
			}),
		}),
		registerUser: build.mutation<TokensAndUser, RegisterRequest>({
			query: registerCredentials => ({
				url: '/api/auth/register',
				method: 'POST',
				body: registerCredentials,
				credentials: 'include',
			}),
		}),
		logoutUser: build.mutation<void, void>({
			query: () => ({
				url: '/api/auth/logout',
				method: 'POST',
				credentials: 'include',
			}),
		}),
		updateUser: build.mutation<void, UpdateUserDto>({
			query: updateUserDto => ({
				url: '/api/users/me',
				method: 'PUT',
				body: updateUserDto,
				credentials: 'include',
			}),
		}),
		getUser: build.query<UserDto, void>({
			query: () => `/api/users/me`,
		}),
		getGoogleClientId: build.query<{ googleClientId: string }, void>({
			query: () => `/api/auth/googleId`,
		}),
		resendActivation: build.mutation<void, void>({
			query: () => `/api/auth/emailActivation`,
		}),
		getGoogleLoginURL: build.query<{ URL: string }, void>({
			query: () => `/api/auth/googleURL`,
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
	useResendActivationMutation,
	useGetGoogleLoginURLQuery,
	useGetGoogleClientIdQuery,
} = authApi
