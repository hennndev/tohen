import { RootState } from "../store"
import { logout, setCredentials } from "../features/authSlice"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query'

// For query   
const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_DOMAIN_URL}/api`,
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as RootState).auth.accessToken
        if(token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

// For query but with authorization
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if(result?.error?.status === 403) {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        if(refreshResult?.data) {
            api.dispatch(setCredentials({...refreshResult.data as {accessToken: string}}))
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Products', 'Product', 'User', 'Categories', 'Category', 'Brands', 'Brand', 'Orders', 'Order'],
    endpoints: () => ({})
})
