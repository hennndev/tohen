import React, { useRef, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
// components
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { defaultProfilePhoto } from '@/utils/utils'
import ModalDeleteAccount from '@/components/modals/ModalDeleteAccount'

type PropsTypes = {
    userData: any
    isLoadingChangePhoto: boolean
    handleChangePhotoProfile: (e: ChangeEvent<HTMLInputElement>) => void
}

const ProfileDetail = ({userData, isLoadingChangePhoto, handleChangePhotoProfile }: PropsTypes) => {
    const navigate = useNavigate()
    const inputFileRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)
    const openInputFile = () => inputFileRef.current?.click()

    return (
        <div className='flex-1 flex flex-col md:flex-row pb-8 border-b border-gray-300 dark:border-gray-800'>
            <div className='md:flex-[0.2] flex flex-col space-y-5 md:mr-10 mb-10 md:mb-0'>
                <div className='w-full h-[120px] xl:h-[200px]'>
                    <img src={userData?.photo.photo_url || defaultProfilePhoto(userData?.username as string)} alt='user-profile-image' className='w-full h-full object-contain rounded-md'/>
                </div>
                <Button type='button' disabled={isLoadingChangePhoto} variant='outline' className='w-full' onClick={openInputFile}>
                    {isLoadingChangePhoto && <Loader2 className='w-3 h-3 mr-2 animate-spin'/>}
                    {isLoadingChangePhoto ? 'Loading' : 'Upload Photo'}
                </Button>
                <input type="file" ref={inputFileRef} id='photo-profile' onChange={handleChangePhotoProfile} accept='image/*' hidden/>
            </div>
            <div className='flex flex-1 md:flex-[0.8] space-x-2 md:space-x-0'>
                <div className='flex flex-col space-y-5 flex-[0.4] lg:flex-[0.3]'>
                    <p className='text-base'>Fullname:</p>
                    <p className='text-base'>Username:</p>
                    <p className='text-base'>Email:</p>
                    <p className='text-base'>Role:</p>
                </div>
                <div className='flex flex-col space-y-5 flex-[0.6] lg:flex-[0.7]'>
                    <p className='text-base'>{userData?.fullname}</p>
                    <p className='text-base'>{userData?.username}</p>
                    <p className='text-base text-blue-500'>{userData?.email}</p>
                    <p className='text-base'>{userData?.role}</p>
                    <div className='hidden md:flex-end space-x-3'>
                        <Button type='button' disabled={isLoadingChangePhoto} variant='outline' onClick={() => navigate('/profile/update-profile')}>
                            Update my profile
                        </Button>
                        <ModalDeleteAccount username={userData?.username as string}>
                            <Button type='button' disabled={isLoadingChangePhoto} variant='destructive'>Delete my account</Button>
                        </ModalDeleteAccount>
                    </div>
                </div>
            </div>
            <div className='flexx md:hidden space-x-3 mt-10'>
                <Button disabled={isLoadingChangePhoto} variant='outline' onClick={() => navigate('/profile/update-profile')}>
                    Update my profile
                </Button>
                <ModalDeleteAccount username={userData?.username as string}>
                    <Button type='button' disabled={isLoadingChangePhoto} variant='destructive'>Delete my account</Button>
                </ModalDeleteAccount>
            </div>
        </div>
    )
}
export default ProfileDetail