import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import useDecodeToken from '@/hooks/useDecodeToken'
import { useGetUserQuery } from '@/store/api/usersApiSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCurrentToken } from '@/store/features/authSlice'
import { getShowSearchInput } from '@/store/features/searchInputSlice'
// components
import SearchInput from '../ui/SearchInput'
import { Button } from '@/components/ui/button'
import DarkMode from '@/components/ui/darkMode'
import { Bell, Info, ArrowLeft } from 'lucide-react'
import UserProfileIcon from '@/components/shared/UserProfileIcon'

type UserDataTypes = {
    photoUrl: string | null
    username: string
    wishlistLength: number
} | null

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dataDecoded = useDecodeToken()
    const [skip, setSkip] = useState<boolean>(true)
    const currentToken = useSelector(getCurrentToken)
    const showSearchInput = useSelector(getShowSearchInput)
    const [userData, setUserData] = useState<UserDataTypes | null>(null)

    const userId = dataDecoded?.UserInfo?.userId as string
    const { data: currentUser } = useGetUserQuery(userId, {skip})
    const pathname = location.pathname.split('/').reverse()
    let path = /[0-9]/.test(pathname[0]) ? pathname[1].replace('-', ' ') : pathname[0].replace('-', ' ')
    const navbarTitle = path.charAt(0).toUpperCase() + path.slice(1)

    const handleNavigate = () => {
        const backURL = pathname.slice(0, (pathname.length - 1)).join('/')
        navigate(backURL)
    }

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
        <header className='sticky top-0 bg-background pt-5 pb-3 px-5 z-50 flex-between w-full'>
            <div className="flexx space-x-5">
                <div className="flexx space-x-2">
                    {pathname.length > 3 && (
                        <Button variant='outline' onClick={handleNavigate}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div className="flex flex-col">
                        {pathname.length > 3 && (
                            <p className='text-xs text-gray-500 dark:text-gray-500 font-medium'>Back to {pathname.reverse()[2]}</p>
                        )}
                        <h1 className='text-[#222] dark:text-gray-300 text-xl font-semibold capitalize'>{navbarTitle}</h1>
                    </div>
                </div>
                {showSearchInput && <SearchInput/>}
            </div>
            <div className="flexx space-x-4">
                {currentToken && userData && <UserProfileIcon userData={userData}/>}
                <Info size={23} className='text-[#222] dark:text-gray-300'/>
                <Bell size={23} className='text-[#222] dark:text-gray-300'/>
                <DarkMode/>
            </div>
        </header>
    )
}

export default Navbar