import { apiSlice } from "./apiSlice"


const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createCheckoutSession: builder.mutation({
            query: ({products, userData}: {products: ProductsCartTypes, userData: any}) => ({
                url: '/stripe/create-checkout-session',
                method: 'POST',
                body: {
                    products: products,
                    userData: userData
                }
            })
        })
    })
})

export const { useCreateCheckoutSessionMutation } = paymentApiSlice
