import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getIsSidebarProfile } from '@/store/features/layoutSlice'
import { handleIsSidebarProfile } from '@/store/features/layoutSlice'
// components
import { X } from 'lucide-react'

const Sidebar = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const isSidebarProfile = useSelector(getIsSidebarProfile)
    const currentPage = location.pathname.split('/').reverse()[0]

    const handleClose = () => {
        dispatch(handleIsSidebarProfile(false))
    }
    
    return (
        <aside className={`fixed h-screen duration-200 ease-linear lg:transition-none z-50 lg:z-auto lg:h-0 lg:static top-0 bg-background lg:bg-auto ${isSidebarProfile ? 'left-0' : '-left-[200px]'} w-[200px] flex flex-col space-y-5 p-5 lg:p-0 lg:pl-5 shadow-lg lg:shadow-none text-[#333] dark:text-gray-200`}>
            <X className='absolute w-5 h-5 top-3 right-3 cursor-pointer' onClick={handleClose}/>
            <Link to='/profile' onClick={handleClose} className={`text-[17px] ${currentPage === 'profile' ? 'font-medium' : 'text-gray-500 dark:text-gray-500'} hover:underline`}>Profile</Link>
            <Link to='/profile/update-profile' onClick={handleClose} className={`text-[17px] ${currentPage === 'update-profile' ? 'font-medium' : 'text-gray-500 dark:text-gray-500'} hover:underline`}>Update Profile</Link>
            <Link to='/profile/change-password' onClick={handleClose} className={`text-[17px] ${currentPage === 'change-password' ? 'font-medium' : 'text-gray-500 dark:text-gray-500'} hover:underline`}>Change Password</Link>
        </aside>
    )
}
export default Sidebar