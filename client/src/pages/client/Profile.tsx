import { useState, useEffect, Fragment, ChangeEvent, useRef } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useDecodeToken from '@/hooks/useDecodeToken'
import { defaultProfilePhoto } from '@/utils/utils'
import { cloudinaryFetch } from '@/config/cloudinary'
import { useGetUserQuery } from '@/store/api/usersApiSlice'
import { useChangePhotoProfileMutation } from '@/store/api/usersApiSlice'
// components
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CustomPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'
import ModalDeleteAccount from '@/components/modals/ModalDeleteAccount'

type UserDataProfileTypes = UserDataTypes & {
    orders_history: any
}

const Profile = () => {
    const navigate = useNavigate()
    const dataDecoded = useDecodeToken()
    const [skip, setSkip] = useState<boolean>(true)
    const [userData, setUserData] = useState<null | UserDataProfileTypes>(null)
    const [isLoadingChangePhoto, setIsLoadingChangePhoto] = useState<boolean>(false)
    const inputFileRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)

    const userId = dataDecoded?.UserInfo.userId as string
    const {data: data, isLoading, isSuccess} = useGetUserQuery(userId, {skip})
    const [changePhotoProfile] = useChangePhotoProfileMutation()
    
    const openInputFile = () => inputFileRef.current?.click()
    const handleChangePhotoProfle = async (e: ChangeEvent<HTMLInputElement>) => {
        const photoFile = e.target.files as FileList
        if(photoFile) {
            setIsLoadingChangePhoto(true)
            try {
                const photoResponse = await cloudinaryFetch(photoFile[0] as File)
                if(photoResponse) {
                    const response = await changePhotoProfile({userId, oldPhotoId: userData?.photo.photo_id as string, photoProfile: {
                        photoUrl: photoResponse.url,
                        photoId: photoResponse.public_id
                    }}).unwrap()
                    if(response.error) {
                        throw response.error
                    }
                    toast.success(response.message)
                }
            } catch (error: any) {
                toast.error(error.data.message)
            } finally {
                setIsLoadingChangePhoto(false)
            }
        } else {
            return
        }
    }

    useEffect(() => {
        if(userId) {
            setSkip(false)
        }
    }, [userId])

    useEffect(() => {
        if(data && !skip) {
            setUserData({
                _id: data.data._id,
                fullname: data.data.fullname,
                username: data.data.username,
                email: data.data.email,
                role: data.data.role,
                photo: data.data.photo,
                personal_information: data.data.personal_information,
                orders_history: data.data.orders_history
            })
        }
    }, [data, skip])

    return (
        <Fragment>
            <CustomPage title='TOHEN | Profile' content='Profile page'/>
            {isLoading && <PageLoader/>}
            {!isLoading && isSuccess && (
                <div className='p-5 md:p-10 border border-gray-300 dark:border-gray-800 rounded-md text-[#333] dark:text-gray-200'>
                    <div className='flex-1 flex flex-col md:flex-row pb-8 border-b border-gray-300 dark:border-gray-800'>
                        <div className='md:flex-[0.2] flex flex-col space-y-5 md:mr-10 mb-10 md:mb-0'>
                            <div className='w-full h-[120px] xl:h-[200px]'>
                                <img src={userData?.photo.photo_url || defaultProfilePhoto(userData?.username as string)} alt='user-profile-image' className='w-full h-full object-contain rounded-md'/>
                            </div>
                            <Button disabled={isLoadingChangePhoto} variant='outline' className='w-full' onClick={openInputFile}>
                                {isLoadingChangePhoto && <Loader2 className='w-3 h-3 mr-2 animate-spin'/>}
                                {isLoadingChangePhoto ? 'Loading' : 'Upload Photo'}
                            </Button>
                            <input type="file" ref={inputFileRef} id='photo-profile' onChange={handleChangePhotoProfle} accept='image/*' hidden/>
                        </div>
                        <div className='flex flex-1 md:flex-[0.8] space-x-2 md:space-x-0'>
                            <div className='flex flex-col space-y-5 flex-[0.4] lg:flex-[0.3]'>
                                <p className='text-[17px]'>Fullname:</p>
                                <p className='text-[17px]'>Username:</p>
                                <p className='text-[17px]'>Email:</p>
                                <p className='text-[17px]'>Role:</p>
                                <p className='text-[17px]'>Phone number:</p>
                                <p className='text-[17px]'>Full address:</p>
                                <p className='text-[17px]'>City:</p>
                                <p className='text-[17px]'>Province:</p>
                                <p className='text-[17px]'>Region:</p>
                                <p className='text-[17px]'>Postal code:</p>
                            </div>
                            <div className='flex flex-col space-y-5 flex-[0.6] lg:flex-[0.7]'>
                                <p className='text-[17px]'>{userData?.fullname}</p>
                                <p className='text-[17px]'>{userData?.username}</p>
                                <p className='text-[17px]'>{userData?.email}</p>
                                <p className='text-[17px]'>{userData?.role}</p>
                                <p className='text-[17px]'>{userData?.personal_information.phone_number || "None"}</p>
                                <p className='text-[17px]'>{userData?.personal_information.full_address || "None"}</p>
                                <p className='text-[17px]'>{userData?.personal_information.city || "None"}</p>
                                <p className='text-[17px]'>{userData?.personal_information.province || "None"}</p>
                                <p className='text-[17px]'>{userData?.personal_information.region || "None"}</p>
                                <p className='text-[17px]'>{userData?.personal_information.postal_code || "None"}</p>
                                <div className='hidden md:flexx space-x-3'>
                                    <Button disabled={isLoadingChangePhoto} variant='outline' onClick={() => navigate('/profile/update-profile')}>
                                        Update my profile
                                    </Button>
                                    <ModalDeleteAccount username={userData?.username as string}>
                                        <Button disabled={isLoadingChangePhoto} variant='destructive'>Delete my account</Button>
                                    </ModalDeleteAccount>
                                </div>
                            </div>
                        </div>
                        <div className='flexx md:hidden space-x-3 mt-10'>
                            <Button disabled={isLoadingChangePhoto} variant='outline' onClick={() => navigate('/profile/update-profile')}>
                                Update my profile
                            </Button>
                            <ModalDeleteAccount username={userData?.username as string}>
                                <Button disabled={isLoadingChangePhoto} variant='destructive'>Delete my account</Button>
                            </ModalDeleteAccount>
                        </div>

                    </div>
                    <div className='pt-10'>
                        <h1 className='text-xl font-medium'>My orders history</h1>
                        <p className='text-gray-600 dark:text-gray-400 mt-3'>Currenctly you don't have any orders</p>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

export default Profile