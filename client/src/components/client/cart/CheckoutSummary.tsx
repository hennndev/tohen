import { Fragment } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getStripe } from '@/config/stripe'
import { getCurrentToken } from '@/store/features/authSlice'
import { useCheckProductsInStockMutation } from '@/store/api/productsApiSlice'
import { useCreateCheckoutSessionMutation } from '@/store/api/paymentApiSlice'
// components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type PropsTypes = {
    cart: Array<ProductCartTypes>
    isAdmin: boolean
    totalPrice: number
    totalItems: number
}

const CheckoutSummary = ({cart, totalPrice, totalItems, isAdmin}: PropsTypes) => {
    const token = useSelector(getCurrentToken)

    const [createCheckoutSession] = useCreateCheckoutSessionMutation()
    const [checkProducts, {isLoading}] = useCheckProductsInStockMutation()
    const productDiscount = cart.filter(item => item.discount?.is_discount)
    
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
            checkoutPayment()
        }
    }

    const cartFormat = cart.map(item => {
        return {
            _id: item._id,
            name: item.name,
            qty: item.count,
            image: item.image.image_url,
            unit_amount: item.discount?.is_discount ? (item.price - ((item.discount.discount_percentage / 100) * item.price)) * 100 : item.price * 100
        }
    })

    const checkoutPayment = async () => {
        try {
            const stripe = await getStripe()
            const checkoutResponse = await createCheckoutSession({products: cartFormat}).unwrap()
            console.log(checkoutResponse)
            const { sessionId } = await checkoutResponse
            const stripeError = await stripe!.redirectToCheckout({sessionId})
    
            if (stripeError) {
                toast.error('Stripe configuration is error. Call the developer if this is happen')
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong with stripe payment')
        }
    }


    return (
        <Fragment>
            <div className='flex flex-col flex-1 md:flex-[0.35] xl:flex-[0.25] h-max border border-gray-200 dark:border-gray-800 rounded-md shadow-sm p-7 mt-10 lg:mt-0'>
                <h1 className='text-center text-lg font-semibold mb-10'>Checkout Summary</h1>
                <div className="flex flex-col space-y-3 mb-5">
                    <div className='flex flex-col space-y-3'>
                        <h3 className='font-semibold'>Enter promo code</h3>
                        <div className="flexx space-x-2">
                            <Input placeholder='Enter promo code'/>
                            <Button type='button' disabled={!token || isAdmin} onClick={() => toast.error('This feature will released soon 😍')}>Submit</Button>
                        </div>
                    </div>
                    <div>
                        <h2 className='font-semibold mb-2'>Shopping Info</h2>
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
                                <p>${totalPrice.toFixed(2)}</p>
                            </div>
                            <div className={productDiscount.length > 0 ? 'flex flex-col' : 'flex-between'}>
                                <h3>Discount:</h3>
                                {productDiscount.length > 0 ? productDiscount.map((product: ProductCartTypes) => (
                                    <p key={product._id} className='justify-self-end self-end'>{product.name} <span className='ml-1 py-1 px-3 bg-orange-500 text-[12px] text-white font-medium rounded-md'>{product?.discount?.discount_percentage}%</span></p>
                                )): (
                                    <p>-</p>
                                )}
                            </div>
                            <div className="flex-between">
                                <h3>Tax:</h3>
                                <p>-</p>
                            </div>
                            <div className="flex-between font-bold">
                                <h3 className='font-semibold'>Total Estimation:</h3>
                                <p>${totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Button type='button' disabled={!token || isLoading || isAdmin} onClick={handleCheckout}>Checkout</Button>
            </div>
        </Fragment>
    )
}
export default CheckoutSummary