import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useGetBrandQuery, useAddBrandMutation, useEditBrandMutation } from '@/store/api/brandsApiSlice'
// components
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


type FormTypes = {
    brand: string
}

type PropsTypes = {
    isEdit: string | null
    handleEditNull: () => void
    setOpen: (value: boolean) => void
}

const BrandForm = ({isEdit, handleEditNull, setOpen}: PropsTypes) => {
    const [skip, setSkip] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { register, formState: {errors}, setValue, handleSubmit, reset } = useForm<FormTypes>({defaultValues: {
        brand: ''
    }})
    const [handleAddBrand] = useAddBrandMutation()
    const [handleEditBrand] = useEditBrandMutation()
    const { data: dataBrand, isLoading: loadingGet } = useGetBrandQuery(isEdit as string, {skip})

    const handleClose = () => {
        handleEditNull()
        setSkip(true)
        setOpen(false)
    }

    const handleEdit = async (isEdit: string, brand: string) => {
        const response = await handleEditBrand({brandId: isEdit, oldBrand: dataBrand.data.brand, newBrand: brand}).unwrap()
        return response.ok
    }
    
    const handleAdd = async (brand: string) => {
        const response = await handleAddBrand(brand).unwrap()
        return response.ok
    }

    const onSubmit = async (values: FormTypes) => {
        setIsLoading(true)
        let promise
        try {
            if(isEdit) {
                promise = await handleEdit(isEdit, values.brand) 
            } else {
                promise = await handleAdd(values.brand)
            }        
            if(promise) {
                toast.success(isEdit ? 'Berhasil update brand' : 'Berhasil menambah brand baru')
                reset()
                handleClose()
            }
        } catch (error: any) {
            toast.error(error.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(isEdit) {
            setSkip(false)
        }
    }, [isEdit])

    useEffect(() => {
        if(!skip && dataBrand) {
            console.log(dataBrand)
            setValue('brand', dataBrand.data.brand)
        }
    }, [skip, dataBrand])
    

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='brand' className='text-md font-semibold w-max'>Brand</label>
                <Input type='text' id='brand' disabled={isLoading} placeholder="Input brand here..." {...register('brand', {
                    required: 'Field brand wajib diisi!',
                    validate: {
                        onlyChar: value => {
                            return !/[0-9]/.test(value) || 'Value brand tidak boleh terdapat angka didalamnya'
                        }
                    }
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.brand?.message}</p>
            </div>
            <div className="flexx space-x-3 mt-5">
                <Button disabled={isLoading} variant='outline' type='button' onClick={handleClose}>Cancel</Button>
                <Button type='submit' disabled={isLoading || loadingGet}>
                    {isLoading && <Loader2 className='animate-spin mr-2 w-4 h-4'/>} Submit
                </Button>
            </div>
        </form>
    )
}

export default BrandForm