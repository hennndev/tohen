import { apiSlice } from "./apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users'
        }),
        getUser: builder.query({
            query: (userId: string) => `/users/${userId}`, 
            providesTags: ['User']
        }),
        getUserInfo: builder.query({
            query: (userId: string) => `/users/${userId}/user-info`,
            providesTags: ['User']
        }),
        getWishlist: builder.query({
            query: (userId: string) => `/users/${userId}/wishlist`,
            providesTags: ['User']
        }),
        getOrdersHistory: builder.query({
            query: (userId: string) => `/users/${userId}/orders-history`,
            providesTags: ['User']
        }),
        handleWishlist: builder.mutation({
            query: ({userId, productId, method}: {userId: string, productId: string | null, method: 'add' | 'delete' | 'clear'}) => ({
                url: `/users/${userId}/wishlist/${method}`,
                method: 'PATCH',
                body: {productId}
            }),
            invalidatesTags: ['User']
        }),
        changePhotoProfile: builder.mutation({
            query: ({userId, oldPhotoId, photoProfile: {photoUrl, photoId}}: {userId: string, oldPhotoId: string | null, photoProfile: {photoUrl: string | null, photoId: string | null}}) => ({
                url: `/users/${userId}/change-photo`,
                method: 'PATCH',
                body: {oldPhotoId, photoUrl, photoId}
            }),
            invalidatesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: ({userId, userData}: {userId: string, userData: any}) => ({
                url: `/users/${userId}`,
                method: 'PUT',
                body: {...userData}
            }),
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation({
            query: ({userId, isUsername}: {userId: string, isUsername: string}) => ({
                url: `/users/${userId}`,
                method: 'DELETE',
                body: {isUsername}
            })
        }),
        changePassword: builder.mutation({
            query: ({userId, password, newPassword}: {userId: string, password: string, newPassword: string}) => ({
                url: `/users/${userId}/change-password`,
                method: 'PATCH',
                body: {password, newPassword}
            })
        })
    })
})

export const { useGetUsersQuery, useGetUserQuery, useGetUserInfoQuery, useGetWishlistQuery, useGetOrdersHistoryQuery, useHandleWishlistMutation, useDeleteUserMutation, useChangePasswordMutation, useUpdateUserMutation, useChangePhotoProfileMutation } = usersApiSlice

