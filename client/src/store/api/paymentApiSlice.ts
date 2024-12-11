import { apiSlice } from "./apiSlice"


const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createCheckoutSession: builder.mutation({
            query: ({products}: {products: ProductsCartFormatTypes}) => ({
                url: '/stripe/create-checkout-session',
                method: 'POST',
                body: {
                    products: products,
                }
            })
        })
    })
})
export const { useCreateCheckoutSessionMutation } = paymentApiSlice
