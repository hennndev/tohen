import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useUpdateUserMutation } from '@/store/api/usersApiSlice'
// components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormTypes = {
    fullname: string
    username: string
}

type PropsTypes = {
    userId: string
    userData: UserDataTypes
}

const ProfileForm = ({userData, userId}: PropsTypes) => {
    const [updateUser, {isLoading}] = useUpdateUserMutation()
    const { register, formState: {errors}, handleSubmit, setValue, watch } = useForm<FormTypes>()

    const onSubmit = async (values: FormTypes) => {
        const updatedData = {
            ...values
        }
        try {
            const response = await updateUser({userId, userData: updatedData}).unwrap()
            toast.success(response.message)
        } catch (error: any) {
            toast.error(error?.data.message)
        }
    }

    useEffect(() => {
        if(userData) {
            setValue('fullname', userData.fullname)
            setValue('username', userData.username)
        }
    }, [userData])

    const formValues: any = watch()
    const arrFormValues = Object.keys(formValues)
    const objUserData = userData && [userData].map((data: any) => {
        delete data._id
        delete data.email
        delete data.role
        delete data.photo
        return data
    }).map(({personal_information, ...data}) => {
        return {...data, ...personal_information}
    })[0]
    const arrayDataKey = userData && Object.keys(objUserData).filter((key) => arrFormValues.includes(key))
    const isDisabledBtn = userData && arrayDataKey.every((key: any) => objUserData[key] === watch(key))

    return (
        <form className='flex flex-col space-y-3 text-[#333] dark:text-gray-200' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='fullname' className='text-md font-medium w-max'>Fullname</label>
                <Input id='fullname' disabled={isLoading} placeholder="Input fullname here..." {...register('fullname', {
                    required: 'Fullname field is required!',
                    minLength: {
                        value: 3,
                        message: 'Minimum fullname length is 3 characters'
                    },
                    pattern: {
                        value: (/^[A-Za-z\s]+$/),
                        message: 'Fullname just only receive text, not numbers or unique characters!'
                    }
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.fullname?.message}</p>
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='username' className='text-md font-medium w-max'>Username</label>
                <Input id='username' disabled={isLoading} placeholder="Input username here..." {...register('username', {
                    required: 'Username field is required',
                    minLength: {
                        value: 3,
                        message: 'Minimum username length is 3 characters'
                    },
                    pattern: {
                        value: (/^[A-Za-z\s]+$/),
                        message: 'Username just only receive text, not numbers or unique characters!'
                    }
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.username?.message}</p>
            </div>
            <Button disabled={isLoading || isDisabledBtn} type='submit'>Update Profile</Button>
        </form>
    )
}
export default ProfileForm