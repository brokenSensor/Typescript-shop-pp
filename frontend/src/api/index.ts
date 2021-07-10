import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const shopApi = createApi({
	reducerPath: 'shopApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
	endpoints: () => ({}),
})
