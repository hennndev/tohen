import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getCurrentToken } from '@/store/features/authSlice'
import { useRefreshMutation } from '@/store/api/authApiSlice'
import { useDispatch } from 'react-redux'

const PersistLogin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const effectRan = useRef(false)
    const accessToken = useSelector(getCurrentToken)
    const [successRefresh, setSuccessRefresh] = useState<boolean>(false)
    const [refresh, {isUninitialized, isLoading, isError, isSuccess}] = useRefreshMutation()
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') as string) || false

    useEffect(() => {
        if(effectRan.current === true) {
            const verifyTokenRefresh = async () => {
                try {
                    await refresh(1).unwrap()
                    setSuccessRefresh(true)
                } catch (error) {
                    console.log(error)       
                }
            }
            if(!accessToken) verifyTokenRefresh()
        }
        return () => {
            effectRan.current = true
        }
    }, [])
    
    let content
    if(isLoading) {
        content = <p>Loading</p>
    }
    if(isLoggedIn && accessToken && !isUninitialized) { //before loggedin
        content = <Outlet/>
    } else if(isLoggedIn && accessToken && isUninitialized) { //after loggedin
        content = <Outlet/>
    } else if(isSuccess && successRefresh) {  //after refresh token and everything success/resolved
        content = <Outlet/>
    } else if(!accessToken && successRefresh && isError) {
        content = <Outlet/>
    } else if(!accessToken) {
        content = <Outlet/>
    } 

    return content 
}

export default PersistLogin