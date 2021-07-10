import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
	access_token: string | null
}

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		access_token: null,
	} as AuthState,
	reducers: {
		setCredentials: (
			state,
			{ payload: { access_token } }: PayloadAction<{ access_token: string }>
		) => {
			state.access_token = access_token
		},
	},
})

export const { setCredentials } = authSlice.actions

export default authSlice.reducer
