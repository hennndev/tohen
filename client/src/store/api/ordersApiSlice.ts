import { apiSlice } from "./apiSlice"


export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrders: builder.query({
            query: (queries: string) => `/orders${queries}`,
            providesTags: ['Orders']
        }),
        getOrder: builder.query({
            query: (orderId: string) => `/orders/${orderId}`,
            providesTags: ['Order']
        }),
        postNewOrder: builder.mutation({
            query: ({order}: {order: any}) => ({
                url: '/orders',
                method: 'POST',
                body: order
            }),
            invalidatesTags: ['Orders']
        }),
        changeStatusOrder: builder.mutation({
            query: ({orderId, status}: {orderId: string, status: string}) => ({
                url: `/orders/${orderId}`,
                method: 'PATCH',
                body: {
                    status
                }
            }),
            invalidatesTags: ['Orders', 'Order']
        })
    })
})


export const { useGetOrdersQuery, useGetOrderQuery, usePostNewOrderMutation, useChangeStatusOrderMutation } = ordersApiSlice