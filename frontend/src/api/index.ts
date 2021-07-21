import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './querys'

export const shopApi = createApi({
	reducerPath: 'shopApi',
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({}),
})
