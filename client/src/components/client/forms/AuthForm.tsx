import { useState } from 'react'
import * as z from "zod"
import {useForm} from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { zodResolver } from "@hookform/resolvers/zod"
import { setCredentials } from '@/store/features/authSlice'
import { authFormSchema } from '@/components/validation/authSchemaValidation'
import { useLoginMutation, useRegisterMutation } from '@/store/api/authApiSlice'
// components
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type PropsTypes = {
    isLogin: boolean
    handleClose: () => void
    changeAuth: () => void
}

const authForm = ({handleClose, isLogin, changeAuth}: PropsTypes) => {
    const dispatch = useDispatch()
    const [error, setError] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<null | string>(null)
    const {register, handleSubmit, reset, formState: {errors}} = useForm<z.infer<typeof authFormSchema>>({
        resolver: zodResolver(authFormSchema),
    })
    const [loginHandler] = useLoginMutation()
    const [registerHandler] = useRegisterMutation()
    const onSubmit = async (values: z.infer<typeof authFormSchema>) => {
        setIsLoading(true)
        setError(null)
        setSuccess(null)
        let response
        try {
            if(isLogin) {
                response = await loginHandler({email: values.email, password: values.password}).unwrap()
                localStorage.setItem('isLoggedIn', JSON.stringify(true))
                dispatch(setCredentials({accessToken: response.accessToken}))
                reset()
                handleClose()
            } else {
                response = await registerHandler({fullname: values.fullname as string, username: values.username as string, email: values.email, password: values.password}).unwrap()
                setSuccess('Success create new user, you can login now!')
                reset()
            }
        } catch (error: any) {
            setError(error.data.message)
        } finally {
            setIsLoading(false)
        }
    }
    const changeAndReset = () => {
        reset()
        setError(null)
        setSuccess(null)
        changeAuth()
    }
   
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-1.5 text-[#333] dark:text-gray-200'>
            {error && <p className='text-red-500 text-[15px] font-medium'>{error}</p>}
            {success && <p className='text-green-500 text-[15px] font-medium'>{success}</p>}
            <div className="flex md:items-center flex-col md:flex-row flex-1 space-x-2">
                {!isLogin && (
                    <div className='flex flex-1 flex-col space-y-1'>
                        <label htmlFor='fullname' className='text-md font-medium w-max'>Fullname</label>
                        <Input id='fullname' disabled={isLoading} placeholder="Input fullname here..." {...register('fullname')} />
                        <p className='text-red-500 font-medium text-sm'>{errors.fullname?.message}</p>
                    </div>
                )}
                {!isLogin && (
                    <div className='flex flex-1 flex-col space-y-1'>
                        <label htmlFor='username' className='text-md font-medium w-max'>Username</label>
                        <Input id='username' disabled={isLoading} placeholder="Input username here..." {...register('username')} />
                        <p className='text-red-500 font-medium text-sm'>{errors.username?.message}</p>
                    </div>
                )}
            </div>
            <div className='flex flex-col space-y-1'>
                <label htmlFor='email' className='text-md font-medium w-max'>Email</label>
                <Input type='email' id='email' disabled={isLoading} placeholder="Input email here..." {...register('email')} />
                <p className='text-red-500 font-medium text-sm'>{errors.email?.message}</p>
            </div>
            <div className="flex md:items-center flex-col md:flex-row flex-1 space-x-3">
                <div className='flex flex-1 flex-col space-y-1'>
                    <label htmlFor='password' className='text-md font-medium w-max'>Password</label>
                    <Input type='password' id='password' disabled={isLoading} {...register('password')} />
                    <p className='text-red-500 font-medium text-sm'>{errors.password?.message}</p>
                </div>
                {!isLogin && (
                    <div className='flex flex-1 flex-col space-y-1'>
                        <label htmlFor='passwordConfirmation' className='text-md font-medium w-max'>Password Konfirmasi</label>
                        <Input type='password' id='passwordConfirmation' disabled={isLoading} {...register('passwordConfirmation')} />
                        <p className='text-red-500 font-medium text-sm'>{errors.passwordConfirmation?.message}</p>
                    </div>
                )}
            </div>
            <p className='text-[15px] !mt-3'>
                {isLogin ? "Don't have an account?" : 'Already have an account?'} <span className='cursor-pointer underline hover:font-medium' onClick={changeAndReset}>{isLogin ? 'Register' : 'Login'}</span>
            </p>
            <div className="flexx space-x-3 !mt-3">
                <Button disabled={isLoading} type="submit">
                    {isLoading && <Loader2 className='animate-spin mr-2 w-4 h-4'/>} Submit
                </Button>
                <Button type="button" disabled={isLoading} variant='outline' onClick={handleClose}>Close</Button>
            </div>
        </form>
    )
}
export default authForm