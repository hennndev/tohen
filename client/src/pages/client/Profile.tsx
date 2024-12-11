import { useState, useEffect, Fragment, ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import useDecodeToken from '@/hooks/useDecodeToken'
import { cloudinaryFetch } from '@/config/cloudinary'
import { useGetUserQuery } from '@/store/api/usersApiSlice'
import { useChangePhotoProfileMutation } from '@/store/api/usersApiSlice'
// components
import CustomPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'
import ProfileDetail from '@/components/client/profile/ProfileDetail'

type UserDataProfileTypes = UserDataTypes & {
    orders_history: any
}

const Profile = () => {
    const dataDecoded = useDecodeToken()
    const [skip, setSkip] = useState<boolean>(true)
    const [userData, setUserData] = useState<null | UserDataProfileTypes>(null)
    const [isLoadingChangePhoto, setIsLoadingChangePhoto] = useState<boolean>(false)

    const userId = dataDecoded?.UserInfo.userId as string
    const [changePhotoProfile] = useChangePhotoProfileMutation()
    const {data: data, isLoading, isSuccess} = useGetUserQuery(userId, {skip})
    
    const handleChangePhotoProfile = async (e: ChangeEvent<HTMLInputElement>) => {
        const photoFile = e.target.files as FileList
        if(!photoFile) {
            return 
        } 
        setIsLoadingChangePhoto(true)
        try {
            const photoResponse = await cloudinaryFetch(photoFile[0] as File)
            if(photoResponse) {
                const response = await changePhotoProfile({userId, oldPhotoId: userData?.photo.photo_id as string, photoProfile: {
                    photoUrl: photoResponse.url,
                    photoId: photoResponse.public_id
                }}).unwrap()
                toast.success(response.message)
            }
        } catch (error: any) {
            toast.error(error.data.message)
        } finally {
            setIsLoadingChangePhoto(false)
        }
    }

    useEffect(() => {
        if(dataDecoded) {
            setSkip(false)
        }
    }, [dataDecoded])

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
                    <ProfileDetail userData={userData} isLoadingChangePhoto={isLoadingChangePhoto} handleChangePhotoProfile={handleChangePhotoProfile}/>
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