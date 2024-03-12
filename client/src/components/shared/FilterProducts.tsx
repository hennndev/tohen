import { useState, useEffect, ChangeEvent, Fragment, useRef } from 'react'
import toast from 'react-hot-toast'
import queryString from 'query-string'
import { condition, sorting } from '@/utils/utils'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useForm, useFieldArray } from 'react-hook-form'
import { useGetBrandsQuery } from '@/store/api/brandsApiSlice'
import { useGetCategoriesQuery } from '@/store/api/categoriesApiSlice'
// components
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormItem, FormLabel, FormControl, FormField, FormDescription } from '@/components/ui/form'

type PropsTypes = { 
    isModal?: boolean
    setOpen?: (value: boolean) => void
    setOpenFilter?: (value: boolean) => void
}

type FormTypes = {
    category: Array<string>
    brand: Array<string>
    condition: Array<string>
    discount: Array<string>
    lowest_price: number | string
    highest_price: number | string
    tags: Array<{name: string}>
}

const defaultValues = {
    category: [],
    brand: [],
    condition: [],
    lowest_price: '',
    highest_price: '',
    tags: []
}

const FilterProducts = ({isModal, setOpen, setOpenFilter}: PropsTypes) => {
    const tagRef = useRef<HTMLInputElement>(null)
    const [tagTerm, setTagTerm] = useState<string>('')
    const [sort, setSort] = useState<null | string>(null)
    const form = useForm<FormTypes>({ defaultValues: defaultValues})
    
    const queryStr = queryString.parse(location.search)
    const queryLength = Object.keys(queryStr).length
    const {data: dataBrands} = useGetBrandsQuery('')
    const {data: dataCategories} = useGetCategoriesQuery('')
    const { setSearchParams, newQueryParameters, handleSetQueries } = useQueryParams()
    const { fields, append, remove } = useFieldArray({name: 'tags', control: form.control})

    const iterationQueryValue = (key: 'category' | 'condition' | 'brand', values: FormTypes) => {
        values[key].forEach((value: string) => newQueryParameters.append(key, value))
    } 
    const onSubmit = (values: FormTypes) => {
        handleSetQueries(queryStr)
        // category
        if(values.category.length > 0) {
            newQueryParameters.delete('category')
            iterationQueryValue('category', values)
        } else {
            newQueryParameters.delete('category')
        }
        // brands
        if(values.brand.length > 0) {
            newQueryParameters.delete('brand')
            iterationQueryValue('brand', values)
        } else {
            newQueryParameters.delete('brand')
        }
        // condition
        if(values.condition.length > 0) {
            newQueryParameters.delete('condition')
            iterationQueryValue('condition', values)
        } else {
            newQueryParameters.delete('condition')
        }
        // price group
        if(values.lowest_price && values.lowest_price as number > 0) {
            newQueryParameters.set('lowest_price', String(values.lowest_price as number))
        } else {
            newQueryParameters.delete('lowest_price')
        }
        if(values.highest_price && values.highest_price as number > 0) {
            if(values.highest_price >= values.lowest_price) {
                newQueryParameters.set('highest_price', String(values.highest_price))
            }
        } else {
            newQueryParameters.delete('highest_price')
        }
        // tags
        if(values.tags.length > 0) {
            newQueryParameters.delete('tag')
            values.tags.forEach((tag) => newQueryParameters.append('tag', tag.name))
        } else {
            newQueryParameters.delete('tag')
        }
        // SORT
        if(sort) {
            newQueryParameters.set('sort', sort)
        } else {
            newQueryParameters.delete('sort')
        }
        setSearchParams(newQueryParameters)
        if(isModal && setOpen) {
            setOpen(false)
        }
        if(setOpenFilter) {
            setOpenFilter(false)
        }
    }
    const handleAddTag = () => {
        if(form.watch('tags').find(tag => tag.name === tagTerm)) {
            toast.error('This tag has been added!')
            return
        } 
        append({
            name: tagTerm.toLowerCase().trim()
        })
        tagRef.current?.focus()
        setTagTerm('')
    }
    const handleAddSort = (value: string) => setSort(sort === value ? null : value)

    const handleResetForm = () => {
        setSearchParams(newQueryParameters)
        form.reset()
        setSort(null)
        if(isModal && setOpen) {
            setOpen(false)
        }
        if(setOpenFilter) {
            setOpenFilter(false)
        }
    }
    const utilsSetValue = (key: 'category' | 'brand' | 'condition' | 'lowest_price' | 'highest_price' | 'tags', value?: string[] | FormTypes['tags']) => {
        let newQueriesValue: string | (string | null)[] | null | string[] | FormTypes['tags'] = queryStr[key]
        const isNumber = ['lowest_price', 'highest_price'].includes(key)
        if(value) newQueriesValue = value
        form.setValue(key, isNumber ? parseInt(newQueriesValue as string) : newQueriesValue as FormTypes[typeof key])
    }

    useEffect(() => {
        if(queryStr.tag) {
            if(queryStr.tag && typeof queryStr.tag === 'string') {
                utilsSetValue('tags', [{name: queryStr.tag as string}]) 
            } else if(queryStr.tag && typeof queryStr.tag !== 'string') {
                const newQueriesValue = queryStr.tag.map(tag => ({name: tag}))
                utilsSetValue('tags', newQueriesValue as Array<{name: string}>)
            }
        }
        // category
        if(queryStr.category && dataCategories) {
            if(queryStr.category && typeof queryStr.category === 'string') {
                utilsSetValue('category', [queryStr.category as string]) 
            } else if(queryStr.category) {
                utilsSetValue('category')
            }
        }
        // brands
        if(queryStr.brand && dataCategories) {
            if(queryStr.brand && typeof queryStr.brand === 'string') {
                utilsSetValue('brand', [queryStr.brand as string]) 
            } else if(queryStr.brand) {
                utilsSetValue('brand')
            }
        }
        // condition
        if(queryStr.condition) {
            if(queryStr.condition && typeof queryStr.condition === 'string') {
                utilsSetValue('condition', [queryStr.condition as string]) 
            } else if(queryStr.condition) {
                utilsSetValue('condition')
            }
        }
        // price group
        if(queryStr.lowest_price) {
            utilsSetValue('lowest_price')
        }
        if(queryStr.highest_price) {
            utilsSetValue('highest_price')
        }
        // SORT
        if(queryStr.sort) {
            setSort(queryStr.sort as string)
        }
    }, [location.search, dataBrands, dataCategories])

    return (
        <Fragment>
            {!isModal && (  
                <div className="flex-between mb-5 text-[#333] dark:text-gray-200">
                    <h1 className='text-xl xl:text-2xl font-semibold'>Filter Products</h1>
                    {queryLength > 0 && <Button variant="ghost" onClick={handleResetForm}>Reset</Button>}
                </div>
            )}
            <div className='text-[#333] dark:text-gray-400 mb-4'>
                <h2 className='text-base xl:text-lg font-semibold mb-2'>Sort Products</h2>
                <div className='flex flex-wrap'>
                    {sorting.map(sortVal => (
                        <p key={sortVal.value} className={`text-base category-item ${sort === sortVal.value ? 'category-active' : ''}`} onClick={() => handleAddSort(sortVal.value)}>{sortVal.name}</p>
                    ))}
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 text-[#333] dark:text-gray-400 !text-base'>
                    {/* CATEGORY */}
                    <div className='flex flex-col space-y-2'>
                        <FormItem>
                            <FormLabel className='text-base xl:text-lg font-semibold'>Products Category</FormLabel>
                            {dataCategories?.data.map((obj: CategoryTypes) => (
                                <FormField key={obj._id} control={form.control} name="category" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 mb-1.5" key={obj.category}>
                                                <Checkbox checked={field.value.includes(obj.category)} onCheckedChange={(checked) => {
                                                    return checked ?
                                                        field.onChange([...field.value, obj.category]) :
                                                        field.onChange(field.value.filter((value) => value !== obj.category))                    
                                                }} id={obj.category}/>
                                                <label htmlFor={obj.category} className={`text-md capitalize ${field.value.find(value => value === obj.category) ? 'text-gray-200' : ''}`}>
                                                    {obj.category.includes('-') ? obj.category.replaceAll('-', ' ') : obj.category}
                                                </label>                 
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            ))}
                        </FormItem>
                    </div>
                    {/* BRANDS */}
                    <div className='flex flex-col space-y-2'>
                        <FormItem>
                            <FormLabel className='text-base xl:text-lg font-semibold'>Brands Products</FormLabel>
                            {dataBrands?.data.map((obj: BrandTypes) => (
                                <FormField key={obj._id} control={form.control} name="brand" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 mb-1.5" key={obj.brand}>
                                                <Checkbox checked={field.value.includes(obj.brand)} onCheckedChange={(checked) => {
                                                    return checked ?
                                                        field.onChange([...field.value, obj.brand]) :
                                                        field.onChange(field.value.filter((value) => value !== obj.brand))                    
                                                }} id={obj.brand}/>
                                                <label htmlFor={obj.brand} className={`text-md capitalize ${field.value.find(value => value === obj.brand) ? 'text-gray-200' : ''}`}>
                                                    {obj.brand.includes('-') ? obj.brand.replaceAll('-', ' ') : obj.brand}
                                                </label>                 
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            ))}
                        </FormItem>
                    </div>
                    {/* CONDITION */}
                    <div className='flex flex-col space-y-2'>
                        <FormItem>
                            <FormLabel className='text-base xl:text-lg font-semibold'>Products Condition</FormLabel>
                            {condition.map(obj => (
                                <FormField key={obj.value} control={form.control} name="condition" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 mb-1.5" key={obj.value}>
                                                <Checkbox checked={field.value.includes(obj.value)} onCheckedChange={(checked) => {
                                                    return checked ?
                                                        field.onChange([...field.value, obj.value]) :
                                                        field.onChange(field.value?.filter((value) => value !== obj.value))                    
                                                }} id={obj.value}/>
                                                <label htmlFor={obj.value} className={`text-md ${field.value.find(value => value === obj.value) ? 'text-gray-200' : ''}`}>
                                                    {obj.name}
                                                </label>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            ))}
                        </FormItem>
                    </div>
                    {/* PRICE GROUP */}
                    <div className={`flex ${!isModal ? 'flex-col space-y-3' : 'space-x-3'}`}>
                        {/* LOWEST PRICE */}
                        <FormField control={form.control} name="lowest_price" render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel htmlFor='lowest_price' className='text-base xl:text-lg font-semibold'>Lowest Price</FormLabel>
                                <FormControl id='lowest_price'>
                                    <Input type='number' {...field} onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(+e.target.value)} placeholder='Type price amount minimum...' className='dark:text-gray-200'/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        {/* HIGHEST PRICE */}
                        <FormField control={form.control} name="highest_price" render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel htmlFor='highest_price' className='text-base xl:text-lg font-semibold'>Highest Price</FormLabel>
                                <FormControl id='highest_price'>
                                    <Input type='number' {...field} onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(+e.target.value)} placeholder='Type price amount maximum...' className='dark:text-gray-200'/>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                    {/* TAGS */}
                    <div className="flex flex-col space-y-3">
                        <div className="flex flex-col space-y-2">
                            <FormLabel htmlFor='tag' className='text-base xl:text-lg font-semibold'>Product tags</FormLabel>
                            <div className="flexx space-x-2">
                                <Input id='tag' ref={tagRef} value={tagTerm} onChange={(e: ChangeEvent<HTMLInputElement>) => setTagTerm(e.target.value)} placeholder="Input tag here..." className='dark:text-gray-200'/>
                                <Button type='button' variant='outline' disabled={!tagTerm} onClick={handleAddTag}>Add</Button>
                            </div>
                            <FormDescription>Filter using product tags to filter related and specific products what you search</FormDescription>
                        </div>
                        {fields.length > 0 && (
                            <div className="flexx flex-wrap">
                                {fields.map((field, index) => (
                                    <div className='relative shadow dark:border dark:border-[#222] py-2 px-4 rounded-lg cursor-pointer mr-4 mb-2' key={field.id}>
                                        <X className='absolute top-0 right-0 w-3.5 h-3.5' onClick={() => remove(index)}/>
                                        {field.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className='flexx space-x-3 justify-end !mt-10'>
                        {isModal && (
                            <Fragment>
                                <Button type='button' variant='outline' onClick={() => setOpen && setOpen(false)}>Cancel</Button>
                                <Button type='button' variant='destructive' onClick={handleResetForm}>Reset</Button>
                            </Fragment>
                        )}
                        <Button type='submit' className={`${!isModal ? 'w-full' : ''}`}>{!isModal ? 'Filter Products' : 'Confirm'}</Button>
                    </div>
                </form>
            </Form>         
        </Fragment>
    )
}
export default FilterProducts