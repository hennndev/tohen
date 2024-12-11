import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useDecodeToken from '@/hooks/useDecodeToken'
import { getCart } from '@/store/features/cartSlice'
import { useGetUserQuery } from '@/store/api/usersApiSlice'
import { getCurrentToken } from '@/store/features/authSlice'
// components
import { Badge } from '@/components/ui/badge'
import DarkMode from '@/components/ui/darkMode'
import { SiCoinmarketcap } from "react-icons/si"
import ModalAuth from '@/components/modals/ModalAuth'
import UserProfileIcon from '@/components/shared/UserProfileIcon'
import { LuShoppingCart, LuHeart, LuMenu, LuX } from 'react-icons/lu'


type UserDataTypes = {
    photoUrl: string | null
    username: string
    wishlistLength: number
} | null

const Navbar = () => {
    const cart = useSelector(getCart)
    const [skip, setSkip] = useState<boolean>(true)
    const currentToken = useSelector(getCurrentToken)
    const [open, setOpen] = useState<boolean>(false)
    const [userData, setUserData] = useState<UserDataTypes>(null)
    
    const dataDecoded = useDecodeToken()
    const userId = dataDecoded?.UserInfo?.userId as string
    const userRole = dataDecoded?.UserInfo?.role as string
    const {data: currentUser} = useGetUserQuery(userId, {skip})

    const handleCloseOpen = () => setOpen(false)
    
    useEffect(() => {
        if(dataDecoded) {
            setSkip(false)
        }
    }, [dataDecoded])

    useEffect(() => {
        if(currentUser && !skip) {
            setUserData({
                username: currentUser.data.username,
                photoUrl: currentUser.data.photo.photo_url,
                wishlistLength: currentUser.data.wishlist.length
            })
        }
    }, [currentUser, skip])

    return (
        <header className='sticky top-0 bg-background pt-5 pb-3 z-40 lg:z-[55] w-full'>
            <section className='flex-between md:container px-5 text-[#333] dark:text-gray-200'>
                <h1 className='flexx text-2xl font-bold'>
                    <SiCoinmarketcap className='mr-2'/>
                    TOHEN.
                </h1>
                <section className='hidden md:flexx space-x-5'>
                    <Link to="/products" className='hover:underline'>Products</Link>
                    {currentToken && userRole === 'customer' && <Link to="/orders-history" className='hover:underline'>Orders</Link>}
                    {!currentToken && <ModalAuth>
                        <p className='cursor-pointer hover:underline'>Login</p>
                    </ModalAuth>}
                    {currentToken && userRole === 'admin' && <Link to="/admin/products" className='hover:underline'>Dashboard</Link>}
                </section>
                <section className='flexx space-x-5'>
                    {currentToken && userData && <UserProfileIcon userData={userData}/>}
                    {currentToken && userRole === 'customer' && (            
                        <Link to='/wishlist' className='relative'>
                            <LuHeart className='w-5 h-5'/>
                            {userData?.wishlistLength && userData?.wishlistLength > 0 ? (
                                <Badge variant='destructive' className='absolute -top-5 -right-3 px-2'>
                                    {userData?.wishlistLength}
                                </Badge>
                            ) : null}
                        </Link>
                    )}
                    <Link to='/cart' className='relative'>
                        <LuShoppingCart className='w-5 h-5'/>
                        {cart.length > 0 && (
                            <Badge variant='destructive' className='absolute -top-5 -right-3 px-2'>
                                {cart.length}
                            </Badge>
                        )}
                    </Link> 
                    <DarkMode/>
                    <LuMenu className='w-6 h-6 cursor-pointer block md:hidden' onClick={() => setOpen(true)}/>
                </section>
            </section>

            {/* MOBILE */}
            <section className={`fixed bg-background flex flex-col w-full h-screen top-0 ${!open ? '!-right-[100%] md:hidden' : 'right-0 md:hidden'} duration-300 ease-linear !z-[100] px-10 py-5`}>
                <section className='flex-between'>
                    <h1 className='flexx text-2xl font-bold text-[#222] dark:text-gray-100'>
                        <SiCoinmarketcap className='mr-2'/>
                        TOHEN.
                    </h1>
                    <section className="flexx space-x-5">
                        <LuX className='w-6 h-6 cursor-pointer text-[#222] dark:text-gray-100' onClick={handleCloseOpen}/>
                    </section>
                </section>
                <section className='flex-center flex-1 flex-col space-y-5 mb-20'>
                    <Link to="/" className='hover:underline text-[#222] dark:text-gray-100 text-xl' onClick={handleCloseOpen}>Home</Link>
                    <Link to="/products" className='hover:underline text-[#222] dark:text-gray-100 text-xl' onClick={handleCloseOpen}>Products</Link>
                    {currentToken && userRole === 'customer' && <Link to="/orders-history" className='hover:underline text-[#222] dark:text-gray-100 text-xl'>Orders</Link>}
                    {!currentToken && <ModalAuth>
                        <p className='cursor-pointer text-[#222] dark:text-gray-100 text-xl hover:underline' onClick={handleCloseOpen}>Login</p>
                    </ModalAuth>}
                    {currentToken && userRole === 'admin' && <Link to="/admin/products" className='hover:underline text-[#222] dark:text-gray-100 text-xl' onClick={handleCloseOpen}>Dashboard</Link>}
                </section>
            </section>
        </header>
    )
}


export default Navbar