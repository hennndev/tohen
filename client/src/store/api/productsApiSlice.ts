import { apiSlice } from './apiSlice'

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (queries: string) => `/products${queries}`,
            providesTags: ['Products']
        }),
        getProduct: builder.query({
            query: (productId: string) => `/products/${productId}`,
            providesTags: ['Product']
        }),
        addProduct: builder.mutation({
            query: (product: ProductBaseTypes) => ({
                url: '/products',
                method: 'POST',
                body: product
            }),
            invalidatesTags: ['Products', 'Categories', 'Brands']
        }),
        editProduct: builder.mutation({
            query: ({productId, newProductData}: {productId: string, newProductData: any}) => ({
                url: `/products/${productId}`,
                method: 'PUT',
                body: newProductData
            }),
            invalidatesTags: ['Products', 'Product', 'Categories', 'Brands']
        }),
        deleteProduct: builder.mutation({
            query: ({productId, productCategory, productBrand, imageId}: {productId: string, productCategory: string, productBrand:string, imageId: string}) => ({
                url: `/products/${productId}`,
                method: 'DELETE',
                body: {
                    category: productCategory,
                    brand: productBrand,
                    imageId: imageId
                }
            }),
            invalidatesTags: ['Products', 'Product', 'Categories', 'Brands']
        }),
        checkProductsInStock: builder.mutation({
            query: (products: ProductsCartTypes) => ({
                url: '/products/check-products-in-stock',
                method: 'POST',
                body: {
                    products
                }
            })
        })
    })
})

export const { useGetProductsQuery, useGetProductQuery, useAddProductMutation, useEditProductMutation, useDeleteProductMutation, useCheckProductsInStockMutation } = productsApiSlice