import { rupiahFormat } from '@/utils/utils'
import type { AppDispatch } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { clear, getCart } from '@/store/features/cartSlice'
// components
import { Button } from '@/components/ui/button'

type PropsTypes = {
    totalPrice: number
    totalItems: number
}

const CartSummary = ({totalPrice, totalItems}: PropsTypes) => {
    const dispatch = useDispatch<AppDispatch>()
    const cart = useSelector(getCart)

    return (
        <div className='flex flex-col md:flex-row lg:flex-col xl:flex-row border border-gray-200 dark:border-gray-800 rounded-md shadow-sm px-7 py-5 !mt-5 space-y-5 md:space-y-0 lg:space-y-5 xl:space-y-0'>
            <div className='flex-[0.45]'>
                <div>
                    {cart.map((item, index) => (
                        <p key={item._id}>{index + 1}. {item.name} ({item.count}x)</p>
                    ))}
                </div>
            </div>
            {/* Mobile */}
            <div className="flex-between sm:hidden">
                <div className='flex md:hidden flex-col space-y-1'>
                    <p>Total items</p>
                    <p>{totalItems} item</p>
                </div>
                <div className='flex flex-col space-y-1'>
                    <p>Total</p>
                    <h1 className='font-semibold text-lg'>${totalPrice}</h1>
                </div>
            </div>

            <div className='flex sm:flex-between sm:items-start flex-[0.55]'>
                <div className='hidden sm:flex flex-col space-y-2'>
                    <p>Total items</p>
                    <p>{totalItems} item</p>
                </div>
                <div className='flex flex-col space-y-2'>
                    <p>Action</p>
                    <div className="flexx">
                        <Button size='sm' variant='destructive' className='px-2 text-sm' onClick={() => dispatch(clear())}>Clear cart</Button>
                    </div>
                </div>
                <div className='hidden sm:flex flex-col space-y-1'>
                    <p>Total</p>
                    <h1 className='font-semibold text-lg'>${totalPrice}</h1>
                </div>
            </div>
        </div>
    )
}

export default CartSummary