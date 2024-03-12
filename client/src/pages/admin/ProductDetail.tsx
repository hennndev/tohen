import { Fragment, useState, useEffect } from 'react'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'
import { rupiahFormat } from '@/utils/utils'
import { useLocation, Navigate } from 'react-router-dom'
import { useGetProductQuery } from '@/store/api/productsApiSlice'
import { handleShowSearchInput } from '@/store/features/searchInputSlice'
// components
import CustomPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'

const ProductDetail = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const queryStr = queryString.parse(location.search)
    const [product, setProduct] = useState<ProductTypes | null>(null)
    const { data, isLoading, isSuccess, isError } = useGetProductQuery(queryStr.productId as string)

    useEffect(() => {
        dispatch(handleShowSearchInput(false))
    }, [location.pathname])

    useEffect(() => {
        if(data && queryStr.productId) setProduct(data.data)
    }, [data, queryStr.productId])

    if(isError) return <Navigate to='/page-not-found' replace={true}/>

    return (
        <Fragment>
            <CustomPage title={`TOHEN | Admin | Product ${product?.name}`} content='Product detail page'/> 
            {isLoading && <PageLoader/>}
            {!isLoading && isSuccess && (
                <section className='flex space-x-5 flex-1 h-screen p-5 pt-10'>
                    <div className='flex-[0.25]'>
                        <div className='w-full h-[200px]'>
                            <img src={product?.image.image_url} alt={product?.name} className='w-full h-full object-contain'/>
                        </div>
                    </div>
                    <div className='flex-[0.75] flex flex-col space-y-2'>
                        <h1 className='text-3xl font-bold'>{product?.name}</h1>
                        <h2 className={`${product?.discount?.is_discount ? 'line-through text-xl text-gray-500 font-medium' : 'text-2xl font-bold'}`}>
                            Rp.{rupiahFormat(product?.price as number)}
                        </h2>
                        {product?.discount?.is_discount && (
                            <h2 className='text-2xl font-bold flexx'>
                                Rp{rupiahFormat(product?.price - (product?.discount.discount_percentage / 100) * product?.price)} 
                                <span className='ml-2 py-1.5 px-5 bg-orange-500 text-[12px] md:text-sm text-white font-semibold rounded-md'>Disc {product?.discount.discount_percentage}%</span>
                            </h2>
                        )}
                        <p className='font-medium'>Rating: <span className='font-normal'>⭐ 4.1 (Reviews: 1200)</span></p>
                        <p className='font-medium'>Stock: <span className='font-normal'>{product?.stock}</span></p>
                        <p className='font-medium'>About this product: <br /> <span className='font-normal'>{product?.description}</span></p>
                        <p className="font-medium">Brand: <span className='font-bold'>{product?.brand}</span></p>
                        <p className='font-medium'>Category: <span className='font-normal capitalize'>{product?.category}</span></p>
                        <p className='font-medium'>Condition: <span className='font-normal capitalize'>{product?.condition}</span></p>
                        {product && product?.specifications.length > 0 && (
                            <div className='flex flex-col space-y-2'>
                                <p className='font-medium'>Specifications:</p>
                                <div className='flex flex-col space-y-1.5'>
                                    {product?.specifications.map(({specification, value}, index) => (
                                        <p key={index}>{specification}: <span>{value}</span></p>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className='flex flex-col space-y-2'>
                            <p className='font-medium'>Tags:</p>
                            <div className="flex flex-wrap">
                                {product?.tags.map(tag => (
                                    <p key={tag.name} className='border border-400 p-2 rounded-md w-max mr-2 mb-2'>{tag.name}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Fragment>
    )
}

export default ProductDetail