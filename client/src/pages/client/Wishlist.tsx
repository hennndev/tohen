import { useState, useEffect, Fragment } from 'react'
import toast from 'react-hot-toast'
import useDecodeToken from '@/hooks/useDecodeToken'
import { useGetWishlistQuery, useHandleWishlistMutation } from '@/store/api/usersApiSlice'
// components
import { Button } from '@/components/ui/button'
import PageLoader from '@/components/shared/PageLoader'
import CustomPage from '@/components/shared/HelmetPage'
import Products from '@/components/client/products/Products'

const Wishlist = () => {
    const dataDecoded = useDecodeToken()
    const [skip, setSkip] = useState<boolean>(true)
    const userId = dataDecoded?.UserInfo?.userId as string
    const [wishlist, setWishlist] = useState<ProductsTypes | []>([])
    const { data: wishlistData, isLoading } = useGetWishlistQuery(userId, {skip})
    const [clearWishlist] = useHandleWishlistMutation()
    
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
        if(!skip && wishlistData) {
            setWishlist(wishlistData.data)
        }
    }, [skip, wishlistData])


    return (
        <Fragment>
            <CustomPage title='TOHEN | Wishlist' content='Wishlist page'/>
            <section className='flex md:container px-5'>
                <div className='flex-1'>
                    <h1 className='text-2xl font-semibold'>Wishlist</h1>
                    {isLoading && !wishlistData && <PageLoader/>}
                    {!isLoading && wishlistData && (
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