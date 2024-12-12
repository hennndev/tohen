import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { store } from '@/store/store'
// import { productsApiSlice } from '@/store/api/productsApiSlice'
import { usersApiSlice } from '@/store/api/usersApiSlice'
import useDecodeToken from '@/hooks/useDecodeToken'

const PrefetchData = () => {
    const dataDecoded = useDecodeToken()
    const userId = dataDecoded?.UserInfo.userId as string
    useEffect(() => {
        // const products = store.dispatch(productsApiSlice.endpoints.getProducts.initiate(""))
        const wishlist = store.dispatch(usersApiSlice.endpoints.getWishlist.initiate(userId))
        // console.log(products)
        return () => {
            // products.unsubscribe()
            wishlist.unsubscribe()
        } 
    }, [])

    return <Outlet/>
}

export default PrefetchData