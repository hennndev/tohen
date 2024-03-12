import { useState, useEffect, Fragment } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getStripe } from '@/config/stripe'
import { rupiahFormat } from '@/utils/utils'
import useDecodeToken from '@/hooks/useDecodeToken'
import { useGetUserQuery } from '@/store/api/usersApiSlice'
import { getCurrentToken } from '@/store/features/authSlice'
import { useCreateCheckoutSessionMutation } from '@/store/api/paymentApiSlice'
import { useCheckProductsInStockMutation } from '@/store/api/productsApiSlice'
// components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ModalRecipientDetails from '@/components/modals/ModalRecipientDetails'

type PropsTypes = {
    cart: Array<ProductCartTypes>
    totalPrice: number
    totalItems: number
    isAdmin: boolean
}

const CheckoutSummary = ({cart, totalPrice, totalItems, isAdmin}: PropsTypes) => {
    const dataDecoded = useDecodeToken()
    const token = useSelector(getCurrentToken)
    const [skip, setSkip] = useState<boolean>(true)
    const [userData, setUserData] = useState<null | any>(null)
    const [isCheckout, setIsCheckout] = useState<boolean>(false)
    const [showModalRecipientDetails, setShowModalRecipientDetails] = useState<boolean>(false)
    const userId = dataDecoded?.UserInfo?.userId as string
    const { data: currentUser } = useGetUserQuery(userId, {skip})
    const [checkProducts, {isLoading}] = useCheckProductsInStockMutation()

    const handleCheckout = async () => {
        const response = await checkProducts(cart).unwrap()
        if(response.productsOutStock.length > 0) {
            toast(() => (
                <div className='flex flex-col space-y-1'>
                    <h1 className='font-medium text-lg'>❌ Transaction Failed!</h1>
                    {response.productsOutStock.map((item: any) => (
                        <span>
                            {item.name} <span className='text-red-500'>is out of stock</span>
                        </span>
                    ))}
                </div>
            ), {
                duration: 3000
            })
        } else {
            setIsCheckout(true)
        }
    }

    useEffect(() => {
        if(dataDecoded) {
            setSkip(false)
        }
    }, [dataDecoded])

    useEffect(() => {
        if(!skip && currentUser) {
            setUserData(currentUser.data)
        }
    }, [skip, currentUser])
    
    useEffect(() => {
        if(isCheckout && !showModalRecipientDetails) {
            setShowModalRecipientDetails(true)
        }
    }, [isCheckout])

    return (
        <Fragment>
            <ModalRecipientDetails 
                open={showModalRecipientDetails} 
                setOpen={setShowModalRecipientDetails}
                handleClose={() => {
                    setShowModalRecipientDetails(false)
                    setIsCheckout(false)
                }}/>
            <div className='flex flex-col flex-1 md:flex-[0.35] xl:flex-[0.25] h-max border border-gray-200 dark:border-gray-800 rounded-md shadow-sm p-7 mt-10 lg:mt-0'>
                <h1 className='text-center text-lg font-semibold mb-10'>Checkout Summary</h1>
                <div className="flex flex-col space-y-3 mb-5">
                    <div className='flex flex-col space-y-3'>
                        <h3>Enter promo code</h3>
                        <div className="flexx space-x-2">
                            <Input placeholder='Enter promo code'/>
                            <Button disabled={!token || isAdmin}>Submit</Button>
                        </div>
                    </div>
                    <div>
                        <h2 className='text-lg font-semibold mb-2'>Shopping Info</h2>
                        <hr />
                        <div className='mt-2 flex flex-col space-y-2'>
                            <div className="flex-between">
                                <h3>Total Items Type:</h3>
                                <p>{cart.length} item</p>
                            </div>
                            <div className="flex-between">
                                <h3>Total Items:</h3>
                                <p>{totalItems} item</p>
                            </div>
                            <div className="flex-between">
                                <h3>Subtotal:</h3>
                                <p>${totalPrice}</p>
                            </div>
                            <div className="flex-between">
                                <h3>Discount:</h3>
                                <p>-</p>
                            </div>
                            <div className="flex-between">
                                <h3>Tax:</h3>
                                <p>-</p>
                            </div>
                            <div className="flex-between font-bold">
                                <h3>Total Estimation:</h3>
                                <p>Rp {totalPrice}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Button disabled={!token || isLoading || isAdmin} onClick={handleCheckout}>Checkout</Button>
            </div>
        </Fragment>
    )
}

export default CheckoutSummary