import { apiSlice } from "./apiSlice"

const brandsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBrands: builder.query({
            query: (queries: string) => `/brands${queries}`,
            providesTags: ['Brands']
        }),
        getBrand: builder.query({
            query: (brandId: string) => `/brands/${brandId}`,
            providesTags: ['Brand']
        }),
        addBrand: builder.mutation({
            query: (brand: string) => ({
                url: '/brands',
                method: 'POST',
                body: {
                    brand
                }
            }),
            invalidatesTags: ['Brands']
        }),
        deleteBrand: builder.mutation({
            query: (brandId: string) => ({
                url: `/brands/${brandId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Brands']
        }),
        editBrand: builder.mutation({
            query: ({brandId, oldBrand, newBrand}: {brandId: string, oldBrand: string, newBrand: string}) => ({
                url: `/brands/${brandId}`,
                method: 'PUT',
                body: {
                    oldBrand,
                    newBrand
                }
            }),
            invalidatesTags: ['Brands', 'Brand', 'Products', 'Product']
        })
    })
})

export const { useGetBrandsQuery, useGetBrandQuery, useAddBrandMutation, useDeleteBrandMutation, useEditBrandMutation } = brandsApiSlice