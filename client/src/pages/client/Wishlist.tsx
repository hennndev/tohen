import { useState, useEffect, Fragment } from 'react'
import toast from 'react-hot-toast'
import useDecodeToken from '@/hooks/useDecodeToken'
import { useGetWishlistQuery, useHandleWishlistMutation } from '@/store/api/usersApiSlice'
// components
import { Button } from '@/components/ui/button'
import PageLoader from '@/components/shared/PageLoader'
import HelmetPage from '@/components/shared/HelmetPage'
import Products from '@/components/client/products/Products'

const Wishlist = () => {
    const dataDecoded = useDecodeToken()
    const [skip, setSkip] = useState<boolean>(true)
    const [wishlist, setWishlist] = useState<ProductsTypes | []>([])
    
    const [clearWishlist] = useHandleWishlistMutation()
    const userId = dataDecoded?.UserInfo?.userId as string
    const { data, isLoading } = useGetWishlistQuery(userId, {skip})
    
    const handleClearWishlist = async () => {
        try {
            const response = await clearWishlist({userId, productId: null, method: 'clear'}).unwrap()
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
        if(!skip && data) {
            setWishlist(data.data)
        }
    }, [skip, data])

    return (
        <Fragment>
            <HelmetPage title='TOHEN | Wishlist' content='Wishlist page'/>
            <section className='flex md:container px-5'>
                <div className='flex-1'>
                    <h1 className='text-2xl font-semibold'>Wishlist</h1>
                    {isLoading && !data && <PageLoader/>}
                    {!isLoading && data && (
                        <Fragment>
                            <p className='mb-3 mt-3'>Showing {wishlist.length} products from total {wishlist.length} products wishlist</p>
                            {wishlist.length > 0 && <Button variant='outline' className='mb-10' onClick={handleClearWishlist}>Clear wishlist</Button>}
                            <Products products={wishlist} isWishlist/>
                        </Fragment>
                    )}
                </div>
            </section>
        </Fragment>
    )
}
export default Wishlist