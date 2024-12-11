import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import useDecodeToken from '@/hooks/useDecodeToken'
import { useChangePasswordMutation } from '@/store/api/usersApiSlice'
// components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormTypes = {
    email: string
    password: string
    newPassword: string
    newPasswordConfirmation: string
}

type PropsTypes = {
    userData: UserDataTypes
}

const ChangePasswordForm = ({userData}: PropsTypes) => {
    const dataDecoded = useDecodeToken()
    const userId = dataDecoded?.UserInfo.userId as string
    const [changePassword, {isLoading}] = useChangePasswordMutation()
    const { register, formState: {errors}, handleSubmit, setValue, watch, resetField } = useForm<FormTypes>()

    const onSubmit = async (values: FormTypes) => {
        try {
            const response = await changePassword({userId, password: values.password, newPassword: values.newPassword}).unwrap()
            toast.success(response.message)
            resetField('password')
            resetField('newPassword')
            resetField('newPasswordConfirmation')
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
                    required: 'Password field is required',
                    min: {
                        value: 7,
                        message: 'Minimum password length is 7 characters'
                    }
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.password?.message}</p>
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='newPassword' className='text-md font-medium w-max'>New Password</label>
                <Input id='newPassword' type='password' disabled={isLoading} placeholder="Input new password here..." {...register('newPassword', {
                    required: 'New password field is required',
                    minLength: {
                        value: 7,
                        message: 'Minimum new password length is 7 characters'
                    }
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.newPassword?.message}</p>
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='newPasswordConfirmation' className='text-md font-medium w-max'>New Password Confirmation</label>
                <Input id='newPasswordConfirmation' type='password' disabled={isLoading} placeholder="Input new password confirmation here..." {...register('newPasswordConfirmation', {
                    required: 'New password confirmation field is required',
                    minLength: {
                        value: 7,
                        message: 'Minimum new password confirmation length is 7 characters'
                    },
                    validate: (value: string) => {
                        return watch('newPassword') === value || 'New password confirmation is not match with new password'
                    },
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.newPasswordConfirmation?.message}</p>
            </div>
            <Button type='submit'>Submit</Button>
        </form>
    )
}
export default ChangePasswordForm