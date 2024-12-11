import * as z from 'zod'

const MAX_SIZE_IMAGE = 5000000
const IMAGE_TYPE = ['image/jpeg', 'image/jpg', 'image/png']

export const productFormSchema = z.object({
    name: z.string({
          required_error: 'Product name field is required'
        }).min(5, {
            message: "Product name at least have 5 character",
        }),
    category: z.string().min(1, {
            message: 'Product category field is required'
        }),
    brand: z.string().min(1, {
            message: 'Product brand field is required'
        }),
    price: z.number().gte(1, {
            message: 'Product price at least 1 dollar'
        }),
    discount: z.optional(z.number()),
    condition: z.string().min(1, {
            message: 'Product condition field is required'
        }),
    stock: z.number().gte(1, {
            message: 'Product stock at least have 1 stock'
        }),
    description: z.string().min(1, {
            message: 'Product description field is required'
        }).min(10, {
            message: 'Product description at least have 10 character'
        }),
    specifications:  z.object({specification: z.string().min(1, {
            message: 'Product key specification field is required'
        }), value: z.string().min(1, {
            message: 'Product value specification field is required'
        })}).array(),
    tags: z.object({name: z.string().min(1)}).array().min(1, {
            message: 'Product tags at least have 1 tag'
        }),
    image: z.any()
        .refine((file) => file?.size <= MAX_SIZE_IMAGE, 'Maximum size product image is 5MB')
        .refine((file) => IMAGE_TYPE.includes(file?.type), 'Format require for product image is JPEG, JPG and PNG')
        .nullable()
  })