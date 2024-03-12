import { useState, useEffect, ChangeEvent, Fragment, useRef} from 'react'
import * as z from "zod"
import toast from 'react-hot-toast'
import { cloudinaryFetch } from '@/config/cloudinary'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { usePreviewImage } from '@/hooks/usePreviewImage'
import { useGetBrandsQuery } from '@/store/api/brandsApiSlice'
import { useGetCategoriesQuery } from '@/store/api/categoriesApiSlice'
import { productFormSchema } from '@/components/validation/productSchemaValidation'
import { useAddProductMutation, useEditProductMutation } from '@/store/api/productsApiSlice'
// components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'
import { Download, X, Plus, Trash, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"


const defaultValues = {
    name: '',
    category: '',
    brand: '',
    price: 1000,
    discount: 0,
    condition: '',
    stock: 1,
    description: '',
    specifications: [],
    tags: [],
    image: ''
}

type PropsTypes = {
    isEdit?: boolean
    product?: ProductTypes
}
 
const ProductForm = ({isEdit, product}: PropsTypes) => {
    const [tagTerm, setTagTerm] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const inputFileRef = useRef<HTMLInputElement>(null) 
    const inputTagRef = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: defaultValues
    })
    const [addProduct] = useAddProductMutation()
    const [editProduct] = useEditProductMutation()
    const {data: dataBrands} = useGetBrandsQuery('')
    const {data: dataCategories} = useGetCategoriesQuery('')
    const {fields: tagFields, append: tagAppend, remove: tagRemove} = useFieldArray({name: 'tags', control: form.control})
    const {fields, append, remove} = useFieldArray({name: 'specifications', control: form.control})
    const {prevImage, setPrevImage, handleChangePrevImage} = usePreviewImage()

    const handleAdd = async (values: z.infer<typeof productFormSchema>) => {
        const { image, discount, ...formData } = values
        const imageResponse = await cloudinaryFetch(image)
        if(imageResponse) {
            const response = await addProduct({
                ...formData,
                image: {
                    image_id: imageResponse.public_id,
                    image_url: imageResponse.url
                }
            }).unwrap()
            return response.ok
        }
    }
    
    const handleEdit = async (values: z.infer<typeof productFormSchema>) => {
        const { image, ...formData } = values
        const productData = product as ProductTypes
        if(image) {
            const imageResponse = await cloudinaryFetch(image)
            if(imageResponse) {
                const response = await editProduct({
                    productId: productData._id,
                    newProductData: {
                        ...formData,
                        image: {
                            image_id: imageResponse.public_id,
                            image_url: imageResponse.url
                        },
                        oldImageId: productData.image.image_id
                    }
                }).unwrap()
                return response.ok
            }
        } else {
            const response = await editProduct({
                productId: productData._id,
                newProductData: {
                    ...formData,
                    oldImageId: null
                }
            }).unwrap()
            return response.ok
        }
    }
    
    const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
        setIsLoading(true)
        let promise
        try {
            if(!isEdit) {
                promise = await handleAdd(values)
            } else {
                promise = await handleEdit(values)
            }
            if(promise) {
                toast.success(isEdit ? 'Success update this product' : 'Success add new product')
                clearForm()
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }
    // clear form
    const clearForm = () => {
        form.reset(defaultValues)
        form.clearErrors()
        deleteImage()
    }

    // tags
    const handleAddTag = () => {
        tagAppend({name: tagTerm.toLowerCase().trim()})
        setTagTerm('')
        inputTagRef.current?.focus()
    }
    // specifications
    const handleAddSpecification = () => {
        append({
            specification: '',
            value: ''
        })
    }
    // handling delete image
    const deleteImage = () => {
        form.resetField('image', {keepDirty: true})
        setPrevImage(null)
        if(inputFileRef.current !== null) {
            inputFileRef.current.value = ''
        }
    }

    useEffect(() => {
        if(isEdit && product) {
            const productData = product as ProductTypes
            form.setValue('name', productData?.name)  
            form.setValue('price', productData?.price)
            form.setValue('discount', productData?.discount?.discount_percentage)
            form.setValue('stock', productData?.stock)
            form.setValue('condition', productData?.condition)
            form.setValue('description', productData?.description)
            form.setValue('specifications', productData?.specifications)
            form.setValue('tags', productData?.tags)
            form.setValue('image', null)
            setPrevImage(productData.image.image_url)
        }
    }, [isEdit, product])
    
    useEffect(() => {
        if(isEdit && product && dataBrands && dataCategories) {
            const productData = product as ProductTypes
            form.setValue('brand', productData?.brand)
            form.setValue('category', productData?.category)
        }
    }, [isEdit, product, dataBrands, dataCategories])
    
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex space-x-3">
                    {/* GENERAL INFORMATION */}
                    <div className="flex-[0.55] flex flex-col space-y-6">
                        <h1 className='text-xl font-semibold'>General Information</h1>
                        {/* NAME */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='name' className='text-md'>Product name</FormLabel>
                                    <FormControl>
                                        <Input id='name' disabled={isLoading} placeholder="Input product name here..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* CATEGORY */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='category' className='text-md'>Product category</FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                                        <FormControl id='category'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose product category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {dataCategories?.data.map((data: CategoryTypes) => (
                                                <SelectItem value={data.category} key={data._id} className='capitalize'>
                                                    {data.category.replaceAll('-', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* BRAND */}
                        <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='brand' className='text-md'>Product brand</FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                                        <FormControl id='brand'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose product brand" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {dataBrands?.data.map((data: BrandTypes) => (
                                                <SelectItem value={data.brand} key={data._id} className='capitalize'>
                                                    {data.brand.replaceAll('-', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* PRICE */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='price' className='text-md'>Product price</FormLabel>
                                    <FormControl>
                                        <Input id='price' disabled={isLoading} min={1} type='number' placeholder="Input product price here..." {...field} onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(+e.target.value)}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* DISCOUNT */}
                        {isEdit && (
                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor='discount' className='text-md'>Product discount percentage</FormLabel>
                                        <FormControl>
                                            <Input id='discount' disabled={isLoading} min={0} type='number' placeholder="Input product discount here..." {...field} onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(+e.target.value)}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {/* CONDITION */}
                        <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='condition' className='text-md'>Product condition</FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                                        <FormControl id='condition'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose product condition" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="baru">Baru</SelectItem>
                                            <SelectItem value="bekas">Bekas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* STOCK */}
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='stock' className='text-md'>Product stock</FormLabel>
                                    <FormControl>
                                        <Input id='stock' disabled={isLoading} min={1} type='number' placeholder="Input product stock here..." {...field} onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(+e.target.value)}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* DESCRIPTION */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field: {ref, ...formField} }) => (
                                <FormItem>
                                    <FormLabel htmlFor='description' className='text-md'>Product description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id='description'
                                            disabled={isLoading}
                                            rows={7}
                                            placeholder="Input product description here..."
                                            {...formField}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* SPECIFICATIONS */}
                        <div className='flex flex-col space-y-2'>
                            <FormLabel className='text-md'>
                                Product specifications <span className='text-gray-500 text-sm font-medium'>Optional</span>
                            </FormLabel>
                            {fields.map((field,index) => (
                                <Fragment key={field.id}>
                                    <div className="w-full flexx space-x-2">
                                        <FormField
                                            control={form.control}
                                            name={`specifications.${index}.specification`}
                                            render={({ field }) => (
                                                <FormItem className='flex-1'>
                                                    <FormControl>
                                                        <Input disabled={isLoading} placeholder="Specification" {...field}/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`specifications.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem className='flex-1'>
                                                    <FormControl>
                                                        <Input disabled={isLoading} placeholder="Value" {...field}/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Trash className={`${isLoading ? 'text-gray-500' : 'text-red-500'} w-5 h-5 cursor-pointer`} onClick={() => !isLoading && remove(index)}/>
                                    </div>
                                    {fields.length - 1 === index && (
                                        <Button disabled={isLoading} type='button' variant='outline' onClick={() => handleAddSpecification()}>
                                            <Plus className='mr-2 w-4 h-4'/> Add another specification
                                        </Button>
                                    )}
                                </Fragment>
                            ))}
                            {fields.length < 1 && (
                                <Button disabled={isLoading} type='button' variant='outline' onClick={() => handleAddSpecification()}>
                                    <Plus className='mr-2 w-4 h-4'/> Add specification
                                </Button>
                            )}
                        </div>
                    </div>


                    {/* TAGS AND IMAGES */}
                    <div className='flex-[0.45] space-y-6'>
                        <h1 className='text-xl font-semibold'>Tags and Images</h1>
                        {/* TAGS */}
                        <div className="flex flex-col space-y-3">
                                <div className="flex flex-col space-y-2">
                                    <FormLabel htmlFor='tag' className='text-md'>Product tags</FormLabel>
                                    <div className="flexx space-x-2">
                                        <Input ref={inputTagRef} id='tag' disabled={isLoading} value={tagTerm} onChange={(e: ChangeEvent<HTMLInputElement>) => setTagTerm(e.target.value)} placeholder="Input tag here..."/>
                                        <Button type='button' variant='outline' disabled={!tagTerm} onClick={handleAddTag}>Add</Button>
                                    </div>
                                    <FormDescription>Tambahkan tag produk untuk sebagai helper user mencari produk yang sesuai</FormDescription>
                                    {form.formState.errors.tags?.message && (
                                        <FormMessage>{form.formState.errors.tags?.message}</FormMessage>
                                    )}
                                </div>
                            {tagFields.length > 0 && (
                                <div className="flexx flex-wrap">
                                    {tagFields.map((field, index) => (
                                        <div className='relative shadow dark:border dark:border-[#222] py-2 px-4 rounded-lg cursor-pointer mr-4 mb-2' key={field.id}>
                                            <X className='absolute top-0 right-0 w-3.5 h-3.5' onClick={() => tagRemove(index)}/>
                                            {field.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* IMAGE */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: {value, ...formField} }) => (
                                <FormItem>
                                    <FormLabel htmlFor='image' className='text-md'>Product Image</FormLabel>
                                    <FormControl>
                                        <Input id='image' disabled={isLoading} accept='image/*' {...formField} ref={inputFileRef} type='file' onChange={(e: any) => {
                                            formField.onChange(e.target.files ? e.target.files[0] : null)
                                            handleChangePrevImage(e.target.files[0])
                                        }}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {prevImage && (
                            <div className='h-[300px] w-full relative'>
                                <X className='absolute top-0 right-0 w-3.5 h-3.5' onClick={deleteImage}/>
                                <img src={prevImage} className='w-full h-full object-contain'/>
                            </div>
                        )}
                        <Button variant='outline'> 
                            <Download className='mr-3 w-4 h-4'/>Add another images
                        </Button>
                    </div>
                </div>
                <div className="flexx space-x-3">
                    <Button disabled={isLoading} type="submit">
                        {isLoading && <Loader2 className='animate-spin mr-2 w-4 h-4'/>} Save Product
                    </Button>
                    <Button type="reset" disabled={isLoading} variant='destructive' onClick={clearForm}>Clear Form</Button>
                </div>
            </form>
        </Form>
    )
}
export default ProductForm