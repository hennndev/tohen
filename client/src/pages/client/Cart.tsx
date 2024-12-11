import { Fragment, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useDecodeToken from '@/hooks/useDecodeToken'
import { getCart } from '@/store/features/cartSlice'
import { useGetUserQuery } from '@/store/api/usersApiSlice'
import { useHandleWishlistMutation } from '@/store/api/usersApiSlice'
// components
import { Button } from '@/components/ui/button'
import HelmetPage from '@/components/shared/HelmetPage'
import CartItem from '@/components/client/cart/CartItem'
import CartSummary from '@/components/client/cart/CartSummary'
import CheckoutSummary from '@/components/client/cart/CheckoutSummary'

const Cart = () => {
    const navigate = useNavigate()
    const cart = useSelector(getCart)
    const dataDecoded = useDecodeToken()
    const [skip, setSkip] = useState(true)

    const [addWishlist] = useHandleWishlistMutation()
    const role = dataDecoded?.UserInfo.role as string
    const userId = dataDecoded?.UserInfo.userId as string
    const { data: userData, isSuccess } = useGetUserQuery(userId, {skip})

    const totalPrice = cart.reduce((currVal, item) => {
        return currVal += ((item.discount?.is_discount ? (item.price - (item.discount.discount_percentage / 100) * item.price) : item.price) * item.count)
    }, 0)
    const totalItems = cart.reduce((currVal, value) => {
        return currVal += value.count
    }, 0)
    const inWishlist = (productId: string) => {
        return isSuccess && userData.data.wishlist.find((product: ProductTypes) => product._id === productId) 
    }

    const handleAddWishlist = async (productId: string) => {
        try {
            const response = await addWishlist({userId, productId, method: 'add'}).unwrap()
            toast.success(response.message)
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }

    useEffect(() => {
        if(dataDecoded) {
            setSkip(false)
        }
    }, [dataDecoded])
    
    useEffect(() => {
        scrollTo(0, 0)
    }, [])

    return (
        <Fragment>
            <HelmetPage title='TOHEN | Cart' content='Cart page'/>
            <section className='md:container px-5 text-[#333] dark:text-gray-200'>
                <h1 className='text-2xl font-semibold mb-2'>Cart</h1>
                {cart.length > 0 && <p>Total items: {cart.length} item</p>}
                {cart.length > 0 ? (
                    <div className='flex flex-col lg:flex-row lg:space-x-8 mt-5'>
                        <div className="flex flex-col flex-1 md:flex-[0.65] lg:flex-[0.75] space-y-3">
                            <div className='h-max flex flex-col space-y-10 border border-gray-200 dark:border-gray-800 rounded-md shadow-sm p-7'>
                                {cart.map(item => (
                                    <CartItem key={item._id} item={item} isLoggedIn={userId} isAdmin={role === 'admin'}
                                        handleAddWishlist={() => handleAddWishlist(item._id)}
                                        inWishlist={inWishlist(item._id)}    
                                    />
                                ))}
                            </div>
                            <CartSummary totalPrice={totalPrice} totalItems={totalItems}/>
                        </div>
                        <CheckoutSummary cart={cart} totalPrice={totalPrice} totalItems={totalItems} isAdmin={role === 'admin'}/>
                    </div>
                ) : (
                    <Fragment>
                        <p>No items currently added in this cart now</p>
                        <Button className='mt-2' onClick={() => navigate('/products')}>Go Shopping</Button>
                    </Fragment>
                )}
            </section>
        </Fragment>
    )
}
export default Cart