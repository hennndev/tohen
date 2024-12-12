import { TrendingUp, TrendingDown, UsersRound, ShoppingBag, ChevronsUp } from 'lucide-react'
import { rupiahFormat } from '@/utils/utils'

const BoxInfo = () => {
    return (
        <div className='grid grid-cols-box-desktop gap-7'>
            <div className='py-5 px-6 rounded-xl shadow-md bg-green-50'>
                <div className='flex-between'>
                    <div className='bg-gray-600 flexx space-x-0.5 font-bold text-green-300 rounded-full px-3 py-1.5 text-[13px] w-max'>
                        <ChevronsUp className='w-5 h-5 animate-pulse'/>
                        <p className=''>14.5%</p>
                    </div>
                    <TrendingUp className='w-10 h-10 text-gray-700'/>
                </div>
                <div className="mt-2">
                    <h1 className='font-bold text-2xl text-gray-700'>Rp{rupiahFormat(10500000)}</h1>
                    <h1 className='font-normal text-md text-gray-700 mt-1.5'>Ecommerce Revenue</h1>
                </div>
            </div>
            <div className='py-5 px-6 rounded-xl shadow-md bg-red-50'>
                <div className='flex-between'>
                    <div className='bg-gray-600 flexx space-x-0.5 font-bold text-red-300 rounded-full px-3 py-1.5 text-[13px] w-max'>
                        <ChevronsUp className='w-5 h-5 animate-pulse'/>
                        <p className=''>2.5%</p>
                    </div>
                    <TrendingDown className='w-10 h-10 text-gray-700'/>
                </div>
                <div className="mt-2">
                    <h1 className='font-bold text-2xl text-gray-700'>Rp{rupiahFormat(500000)}</h1>
                    <h1 className='font-normal text-md text-gray-700 mt-1.5'>Ecommerce Expense</h1>
                </div>
            </div>
            <div className='py-5 px-6 rounded-xl shadow-md bg-blue-50'>
                <div className='flex-between'>
                    <div className='bg-gray-600 flexx space-x-0.5 font-bold text-green-300 rounded-full px-3 py-1.5 text-[13px] w-max'>
                        <ChevronsUp className='w-5 h-5 animate-pulse'/>
                        <p className=''>21 users</p>
                    </div>
                    <UsersRound className='w-10 h-10 text-gray-700'/>
                </div>
                <div className="mt-2">
                    <h1 className='font-bold text-2xl text-gray-700'>98 Users</h1>
                    <h1 className='font-normal text-md text-gray-700 mt-1.5'>Daily new Users</h1>
                </div>
            </div>
            <div className='py-5 px-6 rounded-xl shadow-md bg-orange-50'>
                <div className='flex-between'>
                    <div className='bg-gray-600 flexx space-x-0.5 font-bold text-green-300 rounded-full px-3 py-1.5 text-[13px] w-max'>
                        <ChevronsUp className='w-5 h-5 animate-pulse'/>
                        <p className=''>16 orders</p>
                    </div>
                    <ShoppingBag className='w-10 h-10 text-gray-700'/>
                </div>
                <div className="mt-2">
                    <h1 className='font-bold text-2xl text-gray-700'>200 Orders</h1>
                    <h1 className='font-normal text-md text-gray-700 mt-1.5'>Daily new Orders</h1>
                </div>
            </div>
        </div>
    )
}

export default BoxInfo