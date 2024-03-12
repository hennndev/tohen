import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import 'react-international-phone/style.css'
import { useForm, Controller } from 'react-hook-form'
import { PhoneInput } from 'react-international-phone'
import { useUpdateUserMutation } from '@/store/api/usersApiSlice'
// components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CountryDropdown } from 'react-country-region-selector'

type FormTypes = {
    fullname: string
    username: string
    phoneNumber: string
    fullAddress: string
    city: string
    province: string
    region: string
    postalCode: number | string
}

type PropsTypes = {
    userData: UserDataTypes
    userId: string
}

const ProfileForm = ({userData, userId}: PropsTypes) => {
    const [isFocus, setIsFocus] = useState(false)
    const { register, formState: {errors}, handleSubmit, setValue, control } = useForm<FormTypes>()
    const [updateUser, {isLoading}] = useUpdateUserMutation()

    const onSubmit = async (values: FormTypes) => {
        console.log(values)
        const updatedData = {
            fullname: values.fullname,
            username: values.username,
            personal_information: {
                full_address: values.fullAddress,
                city: values.city,
                province: values.province,
                postal_code: values.postalCode,
                phone_number: values.phoneNumber,
                region: values.region
            }
        }
        try {
            const response = await updateUser({userId, userData: updatedData}).unwrap()
            if(response.error) {
                throw response.error
            } else {
                toast.success(response.message)
            }
        } catch (error: any) {
            toast.error(error?.data.message)
        }
    }

    useEffect(() => {
        if(userData) {
            setValue('fullname', userData.fullname)
            setValue('username', userData.username)
            setValue('phoneNumber', userData.personal_information.phone_number || '')
            setValue('fullAddress', userData.personal_information.full_address || '')
            setValue('city', userData.personal_information.city || '')
            setValue('province', userData.personal_information.province || '')
            setValue('region', userData.personal_information.region || '')
            setValue('postalCode', userData.personal_information.postal_code || '')
        }
    }, [userData])
    

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
            <div className='flex flex-col space-y-2'>
                <label htmlFor='phoneNumber' className='text-md font-medium w-max'>Phone number</label>
                {/* <Input type='number' id='phoneNumber' disabled={isLoading} placeholder="Input phone number here..." {...register('phoneNumber')} /> */}
                <Controller name="phoneNumber" control={control} disabled={isLoading}
                    render={({ field }) => (
                        <PhoneInput
                            defaultCountry='id'
                            {...field}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            className={`
                                [&>.react-international-phone-input-container]:flex
                                [&>.react-international-phone-country-selector>button]:!border-none 
                                [&>.react-international-phone-input]:text-base
                                [&>.react-international-phone-input]:text-[#333]
                                [&>.react-international-phone-input]:dark:text-gray-200
                                [&>.react-international-phone-input]:font-normal
                                [&>.react-international-phone-input]:ring-0 
                                [&>.react-international-phone-input]:!bg-transparent 
                                [&>.react-international-phone-input]:rounded-md
                                [&>.react-international-phone-input]:px-3
                                [&>.react-international-phone-input]:!py-5
                                [&>.react-international-phone-input]:flex-1
                                [&>.react-international-phone-input]:dark:!border-[#333] outline-none w-full !bg-transparent 
                                [&>.react-international-phone-country-selector]:mr-3
                                ${isFocus 
                                ? '[&>.react-international-phone-country-selector]:rounded-md [&>.react-international-phone-country-selector]:ring-0 [&>.react-international-phone-input]:!ring-[1.7px] [&>.react-international-phone-input]:!ring-black [&>.react-international-phone-input]:dark:!ring-white' : ''} 
                            `}
                        />
                    )}
                />  
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='fullAddress' className='text-md font-medium w-max'>Full Address</label>
                <Textarea rows={5} id='fullAddress' disabled={isLoading} placeholder="Input full address here..." {...register('fullAddress')} />
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='city' className='text-md font-medium w-max'>City</label>
                <Input id='city' disabled={isLoading} placeholder="Input city here..." {...register('city')} />
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='province' className='text-md font-medium w-max'>Province</label>
                <Input id='province' disabled={isLoading} placeholder="Input province here..." {...register('province')} />
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor='region' className='text-md font-medium w-max'>Region</label>
                <Controller name="region" control={control} disabled={isLoading}
                    render={({ field }) => (
                        <CountryDropdown {...field} classes='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'/>
                    )}
                />  
            </div>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='postalCode' className='text-md font-medium w-max'>Postal Code</label>
                <Input id='postalCode' disabled={isLoading} placeholder="Input Postal Code here..." {...register('postalCode')} />
            </div>
            <Button type='submit'>Update Profile</Button>
        </form>
    )
}

export default ProfileForm