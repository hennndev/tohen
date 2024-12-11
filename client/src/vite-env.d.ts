/// <reference types="vite/client" />

type ProductBaseTypes = {
    name: string
    category: string
    brand: string
    price: number
    discount?: {
        is_discount: boolean
        discount_percentage: number
    }
    condition: string
    stock: number
    description: string
    specifications: Array<{specification: string, value: string}> 
    tags: Array<{name: string}>
    image: {
        image_id: string
        image_url: string
    }
}

type ProductTypes = ProductBaseTypes & {
    _id: string
    ratings: any
}

type ProductsTypes = Array<Product>

type ProductCartTypes = ProductTypes & {count: number}

type ProductsCartTypes = Array<ProductCartTypes>

type ProductsCartFormatTypes = Array<{
    _id: string
    name: string
    qty: number
    image: string
    unit_amount: number
}>



type DataDecodedTypes = {
    UserInfo: {
        userId: string
        role: string
    }
}


// Categories 
type CategoryTypes = {
    _id: string
    category: string,
    products: Array<string>
}
type CategoriesTypes = Array<CategoryTypes>

// Brands
type BrandTypes = {
    _id: string
    brand: string
    products: Array<string>
}
type BrandsTypes = Array<BrandTypes>


// User data
type UserDataTypes = {
    _id: string
    fullname: string
    username: string
    email: string
    role: string
    photo: {
        photo_id: string | null
        photo_url: string | null
    }
    personal_information: {
        phone_number: string
        full_address: string
        postal_code: string
        city: string
        state: string
        region: string
    },
}

type RecipientTypes = {
    email: string
    fullname: string
    full_address: string
    phone_number: string
    postal_code: number | string
    city: string
    state: string
    region: string
}


// Order History
type OrderTypes = {
    
}
