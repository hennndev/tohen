import toast from "react-hot-toast"
import { RootState } from "../store"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type StateCartTypes = {
    cart: Array<ProductCartTypes>
}

const initialState: StateCartTypes = {
    cart: JSON.parse(localStorage.getItem('cart') as string) || []
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCart: (state, action: PayloadAction<ProductTypes>) => {
            const cart = [...state.cart]
            const product = cart.find((item: ProductCartTypes) => item._id === action.payload._id)
            if(product) {
                product.count++
            } else {
                cart.push({...action.payload, count: 1})
                toast.success('New item has added to cart!')
            }
            state.cart = cart
            localStorage.setItem('cart', JSON.stringify(cart))
        },
        deleteCart: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter(item => item._id !== action.payload)
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        decrement: (state, action: PayloadAction<string>) => {
            let cart = [...state.cart]
            const product = cart.find((item: ProductCartTypes) => item._id === action.payload) 
            if(product && product.count === 1) {
                cart = cart.filter((item: ProductCartTypes) => item._id !== action.payload)
            } 
            if(product && product.count > 1) {
                product.count--
            }
            state.cart = cart
            localStorage.setItem('cart', JSON.stringify(cart))
        },
        clear: (state) => {
            state.cart = []
            localStorage.removeItem('cart')
        }
    }
})

export const { addCart, deleteCart, decrement, clear } = cartSlice.actions
export default cartSlice.reducer
export const getCart = (state: RootState) => state.cart.cart
