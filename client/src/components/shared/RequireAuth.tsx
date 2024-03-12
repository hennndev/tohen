import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentToken } from '@/store/features/authSlice'

const RequireAuth = () => {
    const accessToken = useSelector(getCurrentToken)
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') as string)
    
    if(!accessToken && !isLoggedIn) {
        return <Navigate to='/page-not-found' replace={true}/>
    } else {
        return <Outlet/>
    }
}

export default RequireAuth