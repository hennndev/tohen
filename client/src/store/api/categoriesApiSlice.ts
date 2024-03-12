import { apiSlice } from "./apiSlice"

const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (queries: string) => `/categories${queries}`,
            providesTags: ['Categories']
        }),
        getCategory: builder.query({
            query: (categoryId: string) => `/categories/${categoryId}`,
            providesTags: ['Category']
        }),
        addCategory: builder.mutation({
            query: (category: string) => ({
                url: '/categories',
                method: 'POST',
                body: {
                    category
                }
            }),
            invalidatesTags: ['Categories']
        }),
        deleteCategory: builder.mutation({
            query: (categoryId: string) => ({
                url: `/categories/${categoryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories', 'Category']
        }),
        editCategory: builder.mutation({
            query: ({categoryId, oldCategory, newCategory}: {categoryId: string, oldCategory: string, newCategory: string}) => ({
                url: `/categories/${categoryId}`,
                method: 'PUT',
                body: {
                    oldCategory,
                    newCategory
                }
            }),
            invalidatesTags: ['Categories', 'Category', 'Products', 'Product']
        })
    })
})

export const { useGetCategoriesQuery, useGetCategoryQuery, useAddCategoryMutation, useDeleteCategoryMutation, useEditCategoryMutation } = categoriesApiSlice