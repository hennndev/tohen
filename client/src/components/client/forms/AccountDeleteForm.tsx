import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch } from '@/store/store'
import { logout } from '@/store/features/authSlice'
import useDecodeToken from '@/hooks/useDecodeToken'
import { useDeleteUserMutation } from '@/store/api/usersApiSlice'
// component
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


type PropsTypes = {
    username: string
    setOpen: (value: boolean) => void
}

const AccountDeleteForm = ({username, setOpen}: PropsTypes) => {
    const navigate = useNavigate()
    const dataDecoded = useDecodeToken()
    const dispatch = useDispatch<AppDispatch>()

    const userId = dataDecoded?.UserInfo.userId as string
    const [deleteAccount, {isLoading}] = useDeleteUserMutation()
    const { register, formState: {errors}, handleSubmit, setValue } = useForm<{username: string}>({
        defaultValues: {
            username: ''
        }
    })

    const onSubmit = async (values: {username: string}) => {
        try {
            const response = await deleteAccount({userId, isUsername: values.username}).unwrap()
            navigate('/products')
            toast.success(response.message)
            dispatch(logout())
        } catch (error: any) {
            toast.error(error.data.message)            
        }
    }

    const handleCancel = () => {
        setValue('username', '')
        setOpen(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col space-y-2'>
                <Input id='username' disabled={isLoading} placeholder="Input your username here..." 
                    {...register('username', {
                        required: 'Username field is required',
                        validate: (value: string) => {
                            return value === username || 'Username not match with your username'
                        }
                    })} />
                <p className='text-red-500 font-medium text-sm '>{errors.username?.message}</p>
            </div>
            <p className='mb-3 text-center mt-3'>
                Type your username to confirm delete your account {' '} <span className='text-red-600 italic'>
                    {username}
                </span>
            </p>
            <div className="flex-center space-x-3">
                <Button disabled={isLoading} type='button' variant='outline' onClick={handleCancel}>Cancel</Button>
                <Button disabled={isLoading} type='submit' variant='destructive'>Submit</Button>
            </div>
        </form>
    )
}
export default AccountDeleteForm