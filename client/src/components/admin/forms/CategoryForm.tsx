import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAddCategoryMutation, useEditCategoryMutation, useGetCategoryQuery } from '@/store/api/categoriesApiSlice'
// components
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormTypes = {
    category: string
}

type PropsTypes = {
    setOpen: (value: boolean) => void
    isEdit: null | string
    handleEditNull: () => void
}

const CategoryForm = ({setOpen, isEdit, handleEditNull}: PropsTypes) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [skip, setSkip] = useState<boolean>(true)
    const { register, formState: {errors}, setValue, handleSubmit, reset } = useForm<FormTypes>({defaultValues: {
        category: ''
    }})
    const [handleAddCategory] = useAddCategoryMutation()
    const [handleEditCategory] = useEditCategoryMutation()
    const {data: dataCategory, isLoading: loadingGet} = useGetCategoryQuery(isEdit as string, {skip})

    const handleClose = () => {
        handleEditNull()
        setSkip(true)
        setOpen(false)
    }

    const handleEdit = async (isEdit: string, category: string) => {
        const response = await handleEditCategory({categoryId: isEdit, oldCategory: dataCategory.data.category, newCategory: category}).unwrap()
        return response.ok
    }

    const handleAdd = async (category: string) => {
        const response = await handleAddCategory(category).unwrap()
        return response.ok
    }

    const onSubmit = async (values: FormTypes) => {
        setIsLoading(true)
        const category = values.category.includes(' ') ? values.category.replaceAll(' ', '-').toLowerCase() : values.category.toLowerCase()
        let promise
        try {
            if(isEdit) {
                promise = await handleEdit(isEdit as string, category)
            } else {
                promise = await handleAdd(category)
            }
            if(promise) {
                toast.success(isEdit ? 'Success update category' : 'Success add new category')
                reset()
                handleClose()
            }
        } catch (error: any) {
            toast.error(error.message)
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
        if(!skip && dataCategory) {
            setValue('category', dataCategory.data.category)
        }
    }, [skip, dataCategory])
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col space-y-2'>
                <label htmlFor='category' className='text-md font-semibold w-max'>Category</label>
                <Input type='text' id='category' disabled={isLoading} placeholder="Input category here..." {...register('category', {
                    required: 'Field kategori wajib diisi!',
                    validate: {
                        onlyChar: value => {
                            return !/[0-9]/.test(value) || 'Nilai kategori tidak boleh terdapat angka didalamnya'
                        }
                    }
                })} />
                <p className='text-red-500 font-medium text-sm'>{errors.category?.message}</p>
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
export default CategoryForm