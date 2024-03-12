import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import HelmetPage from '@/components/shared/HelmetPage'
import BoxInfo from '@/components/admin/dashboard/BoxInfo'
import { Button } from '@/components/ui/button'
import OrdersAnalytics from '@/components/admin/charts/OrdersAnalytics'
import { handleShowSearchInput } from '@/store/features/searchInputSlice'
import { useGetProductsQuery } from '@/store/api/productsApiSlice'
import { useGetUsersQuery } from '@/store/api/usersApiSlice'

const Dashboard = () => {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(handleShowSearchInput(false))
    }, [location.search])
    

    return (
        <Fragment>
            <HelmetPage title='TOHEN | Admin | Dashboard' content='Admin dashboard page'/>
            <section className='flex flex-col flex-1 h-screen p-5 overflow-hidden'>
                <div className="flex-between mb-7">
                    <div className='flex flex-col space-y-1'>
                        <h1 className='font-semibold text-xl'>Welcome back, Admin</h1>
                        <p className=''>Here's what happening with your ecommerce today. Let's check it out!</p>
                    </div>
                    <Button variant='outline' className='self-end'>View analytics details</Button>
                </div>
                <BoxInfo/>
                <div className='flex mt-10 h-[300px]'>
                    <div className='flex-[0.7]'>
                        <h1 className='mb-3 text-xl font-medium'>Ecommerce Revenue</h1>
                        <OrdersAnalytics/>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default Dashboard