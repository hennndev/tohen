import toast from 'react-hot-toast'
import useDecodeToken from '@/hooks/useDecodeToken'
import { getCart } from '@/store/features/cartSlice'
import { addCart } from '@/store/features/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useHandleWishlistMutation } from '@/store/api/usersApiSlice'
// component
import Product from '@/components/client/products/Product'

type PropsTypes = {
    products: ProductsTypes
    isWishlist?: boolean
}

const Products = ({products, isWishlist}: PropsTypes) => {
    const dispatch = useDispatch()
    const cart = useSelector(getCart)
    
    const dataDecoded = useDecodeToken() 
    const userId = dataDecoded?.UserInfo.userId as string
    const [deleteWishlist] = useHandleWishlistMutation()

    const handleDeleteWishlist = async (e: any, productId: string) => {
        e.stopPropagation()
        try {
            const response = await deleteWishlist({userId, productId, method: 'delete'}).unwrap()
            toast.success(response.message)
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }

    const handleAddCart = (e: any, item: ProductTypes) => {
        e.stopPropagation()
        dispatch(addCart(item))
    }

    return (
        <div className='grid grid-cols-cards-mobile sm:grid-cols-cards-tablet lg:grid-cols-cards-desktop gap-3 sm:gap-5 lg:gap-10'>
            {products.map((product: ProductTypes) => (
                <Product key={product._id} data={product} isWishlist={!isWishlist ? false : isWishlist}
                    handleDeleteWishlist={(e: any) => handleDeleteWishlist(e, product._id)}
                    handleAddCart={(e: any) => handleAddCart(e, product)}
                    productInCart={Boolean(cart.find((item: ProductTypes) => item._id === product?._id))}/>
            ))}
        </div>
    )
}
export default Products