import { shopApi } from '.'
import {
	GoogleProfile,
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
		googleAuth: build.mutation<TokensAndUser, GoogleProfile>({
			query: googleProfile => ({
				url: `/auth/google/`,
				method: 'POST',
				credentials: 'include',
				body: googleProfile,
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
				url: '/users/me',
				method: 'PUT',
				body: updateUserDto,
				credentials: 'include',
			}),
		}),
		getUser: build.query<UserDto, void>({
			query: () => `/users/me`,
		}),
		getGoogleClientId: build.query<{ googleClientId: string }, void>({
			query: () => `/auth/googleId`,
		}),
		resendActivation: build.mutation<void, void>({
			query: () => `/auth/emailActivation`,
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
	useGoogleAuthMutation,
	useGetGoogleClientIdQuery,
} = authApi
