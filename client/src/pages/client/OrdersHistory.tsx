import { Fragment, useState } from 'react'
import useDecodeToken from '@/hooks/useDecodeToken'
import { useGetOrdersHistoryQuery } from '@/store/api/usersApiSlice'
// components
import CustomPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'
// import OrdersHistory from '@/components/client/ordersHistory/OrdersHistory'

const OrdersHistoryPage = () => {

    const dataDecoded = useDecodeToken()
    const [openFilter] = useState<boolean>(false)

    const userId = dataDecoded?.UserInfo?.userId as string
    const { isLoading } = useGetOrdersHistoryQuery(userId)

    return (
        <Fragment>
            <CustomPage title='TOHEN | Orders History' content='Orders history page'/>
            <section className='flex px-5 md:container'>
                <div className={`w-[320px] h-full lg:h-auto overflow-y-auto px-5 py-8 bg-background fixed lg:static lg:w-auto  top-0 ${openFilter ? 'left-0' : '-left-[100%]'} duration-300 ease-linear !z-[50] lg:z-auto lg:flex-[0.25] xl:flex-[0.2] shadow-lg lg:shadow-none`}>
                    
                </div>  

                <div className='flex-1 lg:flex-[0.7] xl:flex-[0.75]'>
                    <h1 className='text-2xl font-semibold'>Semua Orders History</h1>
                    {isLoading && <PageLoader/>}
                    
                </div>
            </section>
        </Fragment>
    )
}

export default OrdersHistoryPage