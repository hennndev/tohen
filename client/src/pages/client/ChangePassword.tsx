import { Fragment, useEffect, useState } from 'react'
import useDecodeToken from '@/hooks/useDecodeToken'
import CustomPage from '@/components/shared/HelmetPage'
import { useGetUserQuery } from '@/store/api/usersApiSlice'
import ChangePasswordForm from '@/components/client/forms/ChangePasswordForm'

const ChangePassword = () => {
    const dataDecode = useDecodeToken()
    const userId = dataDecode?.UserInfo.userId as string
    const [skip, setSkip] = useState<boolean>(true)
    const [userData, setUserData] = useState<null | any>(null)
    const {data: data, isLoading} = useGetUserQuery(userId, {skip})

    useEffect(() => {
        if(userId) {
            setSkip(false)
        }
    }, [userId])

    useEffect(() => {
        if(data) {
            setUserData(data.data)
        }
    }, [data])

    return (
        <Fragment>
            <CustomPage title='TOHEN | Change Password' content='Change password page'/>
            <div className='flex-1 flex flex-col p-10 border border-gray-300 dark:border-gray-800 rounded-md'>
                <ChangePasswordForm userData={userData}/>
            </div>
        </Fragment>
    )
}
export default ChangePassword