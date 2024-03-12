import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {useForm} from 'react-hook-form'
import { useSelector } from 'react-redux'
import { getStripe } from '@/config/stripe'
import { Input } from '@/components/ui/input'
import useDecodeToken from '@/hooks/useDecodeToken'
import { getCart } from '@/store/features/cartSlice'
import { useGetUserQuery } from '@/store/api/usersApiSlice'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCheckoutSessionMutation } from '@/store/api/paymentApiSlice'
// components
import { Button } from '@/components/ui/button'

type PropsTypes = {
    handleClose: () => void
}

type RecipientTypes = {
    email: string
    fullName: string
    fullAddress: string
    phoneNumber: string
    postalCode: number
    city: string
    country: string
}

const RecipientForm = ({handleClose}: PropsTypes) => {
    const dataDecoded = useDecodeToken()
    const cart = useSelector(getCart)
    const [userData, setUserData] = useState<null | any>(null)
    const [skip, setSkip] = useState<boolean>(false)
    const userId = dataDecoded?.UserInfo?.userId as string
    const { register, formState: {errors}, handleSubmit, setValue } = useForm<RecipientTypes>({defaultValues: {
        email: '',
        fullName: ''
        
    }})
    const [createCheckoutSession, {isLoading}] = useCreateCheckoutSessionMutation()
    const { data: currentUser } = useGetUserQuery(userId, {skip})

    const checkout = async () => {
        try {
            const stripe = await getStripe()
            const checkoutResponse = await createCheckoutSession({products: cart, userData}).unwrap()
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

    const onSubmit = async (values: RecipientTypes) => {

    }

    useEffect(() => {
        if(dataDecoded) {
            setSkip(false)
        }
    }, [dataDecoded])
    

    return (
        <form className='flex flex-col space-y-2' onSubmit={handleSubmit(onSubmit)}>
            <div className="flexx flex-1 space-x-3">
                <div className='flex flex-1 flex-col space-y-2'>
                    <label htmlFor='email' className='text-md font-medium w-max'>Email</label>
                    <Input type='email' id='email' disabled {...register('email')} />
                </div>
                <div className='flex flex-1 flex-col space-y-2'>
                    <label htmlFor='fullName' className='text-md font-medium w-max'>Full Name</label>
                    <Input type='text' id='fullName' disabled={isLoading} placeholder='Input your fullname here...' {...register('fullName')} />
                </div>
            </div>
            <div className='flex flex-1 flex-col space-y-2'>
                <label htmlFor='fullAddress' className='text-md font-medium w-max'>Full Address</label>
                <Textarea rows={5} id='fullAddress' disabled={isLoading} placeholder='Input your fullAddress here...' {...register('fullAddress')} />
            </div>
            <div className="flexx flex-1 space-x-3">
                <div className='flex flex-1 flex-col space-y-2'>
                    <label htmlFor='phoneNumber' className='text-md font-medium w-max'>Phone Number</label>
                    <Input type='number' id='phoneNumber' disabled={isLoading} placeholder='Input your phone number here...' {...register('phoneNumber')} />
                </div>
                <div className='flex flex-1 flex-col space-y-2'>
                    <label htmlFor='postalCode' className='text-md font-medium w-max'>Postal Code</label>
                    <Input type='number' id='postalCode' disabled={isLoading} placeholder='Input your postal code here...' {...register('postalCode')} />
                </div>
            </div>
            <div className="flexx flex-1 space-x-3">
                <div className='flex flex-1 flex-col space-y-2'>
                    <label htmlFor='city' className='text-md font-medium w-max'>City</label>
                    <Input type='text' id='city' disabled={isLoading} placeholder='Input your city here...' {...register('city')} />
                </div>
                <div className='flex flex-1 flex-col space-y-2'>
                    <label htmlFor='country' className='text-md font-medium w-max'>Country</label>
                    <Input type='text' id='country' disabled={isLoading} placeholder='Input your country here...' {...register('country')} />
                </div>
            </div>
            <Button variant='secondary'>Save recipient data in my profile</Button>
            <div className="flexx space-x-3 !mt-5">
                <Button>Checkout</Button>
                <Button variant='outline' onClick={handleClose}>Cancel</Button>
            </div>
        </form>
    )
}

export default RecipientForm