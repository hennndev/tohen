import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useDecodeToken from '@/hooks/useDecodeToken'
import { useChangePasswordMutation } from '@/store/api/usersApiSlice'
// components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

type FormTypes = {
    email: string
    password: string
    newPassword: string
    newPasswordConfirmation: string
}

type PropsTypes = {
    userData: any
}

const ChangePasswordForm = ({userData}: PropsTypes) => {
    const dataDecoded = useDecodeToken()
    const userId = dataDecoded?.UserInfo.userId as string
    const { register, formState: {errors}, handleSubmit, setValue, watch, reset } = useForm<FormTypes>()
    const [changePassword, {isLoading}] = useChangePasswordMutation()


    const onSubmit = async (values: FormTypes) => {
        try {
            const response = await changePassword({userId, password: values.password, newPassword: values.newPassword}).unwrap()
            if(response.error) {
                throw response.error
            } else {
                toast.success(response.message)
                reset()
            }
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }

    useEffect(() => {
        if(userData) {
            setValue('email', userData.email)
        }
    }, [userData])
    

    return (
        <form className='flex flex-col space-y-3' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='email' className='text-md font-medium w-max'>Email</label>
                <Input id='email' type='email' disabled {...register('email')} />
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='password' className='text-md font-medium w-max'>Password</label>
                <Input id='password' type='password' disabled={isLoading} placeholder="Input password here..." {...register('password', {
                    required: 'Field password tidak boleh dikosongkan',
                    min: {
                        value: 7,
                        message: 'Minimal panjang password adalah 7 karakter'
                    }
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.password?.message}</p>
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='newPassword' className='text-md font-medium w-max'>New Password</label>
                <Input id='newPassword' type='password' disabled={isLoading} placeholder="Input new password here..." {...register('newPassword', {
                    required: 'Field new password tidak boleh dikosongkan',
                    minLength: {
                        value: 7,
                        message: 'Minimal panjang new password adalah 7 karakter'
                    }
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.newPassword?.message}</p>
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='newPasswordConfirmation' className='text-md font-medium w-max'>New Password Confirmation</label>
                <Input id='newPasswordConfirmation' type='password' disabled={isLoading} placeholder="Input new password confirmation here..." {...register('newPasswordConfirmation', {
                    required: 'Field new password confirmation tidak boleh dikosongkan',
                    minLength: {
                        value: 7,
                        message: 'Minimal panjang new password confirmation adalah 7 karakter'
                    },
                    validate: (value: string) => {
                        return watch('newPassword') === value || 'New password tidak cocok dengan new password confirmation'
                    },
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.newPasswordConfirmation?.message}</p>
            </div>
            <Button type='submit'>Submit</Button>
        </form>
    )
}

export default ChangePasswordForm