import { useNavigate } from 'react-router-dom'
import { defaultProfilePhoto } from '@/utils/utils'
import { useSendLogoutMutation } from '@/store/api/authApiSlice'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type PropsTypes = {
    userData: {
        photoUrl: string | null,
        username: string
    }
}
const UserProfileIcon = ({userData}: PropsTypes) => {
    const navigate = useNavigate()
    const [logoutHandler, {isLoading}] = useSendLogoutMutation()
    const handleLogout = async () => {
        await logoutHandler(1)
        navigate('/products')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className='w-7 h-7 cursor-pointer'>
                    <AvatarImage src={userData?.photoUrl || defaultProfilePhoto(userData?.username)} alt='user-profile-image' className='object-contain w-full h-full'/>
                    <AvatarFallback>TH</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem className='text-[15px]' onClick={() => navigate('/profile')}>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className='text-[15px]' onClick={() => navigate('/profile/update-profile')}>
                        Update Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className='text-[15px]' onClick={() => navigate('/profile/change-password')}>
                        Change Password
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className={`cursor-pointer text-red-600 ${isLoading && 'opacity-50 cursor-default'}`} disabled={isLoading} onClick={handleLogout}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserProfileIcon