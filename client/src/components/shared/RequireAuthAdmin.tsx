import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import useDecodeToken from '@/hooks/useDecodeToken'
import { getCurrentToken } from '@/store/features/authSlice'

const RequireAuthAdmin = () => {
    const accessToken = useSelector(getCurrentToken)
    const dataDecoded = useDecodeToken()
    const role = dataDecoded?.UserInfo.role as string
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') as string)
    
    if(!accessToken && !isLoggedIn) {
        return <Navigate to='/page-not-found' replace={true}/>
    } 

    if(accessToken && isLoggedIn && dataDecoded && role === 'customer') {
        return <Navigate to='/page-not-found' replace={true}/>
    }
    if(accessToken && isLoggedIn && dataDecoded && role === 'admin') {
        return <Outlet/>
    }

    
}

export default RequireAuthAdmin