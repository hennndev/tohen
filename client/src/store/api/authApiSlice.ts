import { apiSlice } from "./apiSlice"
import { logout, setCredentials } from "../features/authSlice"


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials: {email: string, password: string}) => ({
                url: '/auth/login',
                method: 'POST',
                body: {...credentials}
            })
        }),
        register: builder.mutation({
            query: (credentials: {fullname: string, username: string, email: string, password: string}) => ({
                url: '/auth/register',
                method: 'POST',
                body: {...credentials}
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled
                    dispatch(logout())
                    dispatch(authApiSlice.util.resetApiState())
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    const { accessToken } = data
                    dispatch(setCredentials({accessToken: accessToken}))
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useSendLogoutMutation, useRefreshMutation } = authApiSlice