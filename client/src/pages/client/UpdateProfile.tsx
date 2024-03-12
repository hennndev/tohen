import { useState, useEffect, Fragment } from 'react'
import useDecodeToken from '@/hooks/useDecodeToken'
import { useGetUserQuery } from '@/store/api/usersApiSlice'
// components
import CustomPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'
import ProfileForm from '@/components/client/forms/ProfileForm'

const UpdateProfile = () => {
    const dataDecode = useDecodeToken()
    const [skip, setSkip] = useState<boolean>(true)
    const [userData, setUserData] = useState<null | UserDataTypes>(null)
    const userId = dataDecode?.UserInfo.userId as string
    const {data: data, isLoading} = useGetUserQuery(userId, {skip})

    useEffect(() => {
        if(userId) {
            setSkip(false)
        }
    }, [userId])

    useEffect(() => {
        if(data) {
            setUserData({
                _id: data.data._id,
                fullname: data.data.fullname,
                username: data.data.username,
                email: data.data.email,
                role: data.data.role,
                photo: data.data.photo,
                personal_information: data.data.personal_information,
            })
        }
    }, [data])

    return (
        <Fragment>
            <CustomPage title='TOHEN | Update Profile' content='Update profile page'/>
            {isLoading ? <PageLoader/> : (
                <div className='flex-1 flex flex-col p-10 border border-gray-300 dark:border-gray-800 rounded-md'>
                    <ProfileForm userId={userId} userData={userData as UserDataTypes}/>
                </div>
            )}
        </Fragment>
    )
}
export default UpdateProfile