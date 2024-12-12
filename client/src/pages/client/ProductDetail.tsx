import { useState, useEffect, Fragment } from 'react'
import toast from 'react-hot-toast'
import queryString from 'query-string'
import useDecodeToken from '@/hooks/useDecodeToken'
import { addCart } from '@/store/features/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import type { AppDispatch, RootState } from '@/store/store'
import { useGetProductQuery } from '@/store/api/productsApiSlice'
import { useHandleWishlistMutation, useGetUserQuery } from '@/store/api/usersApiSlice'
// components
import { Button } from '@/components/ui/button'
import PageLoader from '@/components/shared/PageLoader'
import CustomPage from '@/components/shared/HelmetPage'
import { LuHeart, LuShoppingCart, LuLoader2 } from 'react-icons/lu'

const ProductDetail = () => {
    const location = useLocation()
    const dataDecoded = useDecodeToken()
    const dispatch = useDispatch<AppDispatch>()
    const [skip, setSkip] = useState<boolean>(true)
    const cart = useSelector((state: RootState) => state.cart.cart)
    const [product, setProduct] = useState<ProductTypes | null>(null)
    
    const queryStr = queryString.parse(location.search)
    const role = dataDecoded?.UserInfo?.role as string
    const userId = dataDecoded?.UserInfo?.userId as string

    const { data: userData, isSuccess } = useGetUserQuery(userId, {skip})
    const { data, isLoading, isError } = useGetProductQuery(queryStr.id as string)
    const [addWishlist, {isLoading: isAddLoading}] = useHandleWishlistMutation()

    const inCart = cart.find((item: ProductTypes) => item._id === product?._id)
    const inWishlist = (productId: string) => {
        return isSuccess && userData.data.wishlist.find((product: ProductTypes) => product._id === productId) 
    }

    const handleAddWishlist = async (productId: string) => {
        try {
            const response = await addWishlist({userId, productId, method: 'add'}).unwrap()
            toast.success(response?.message)
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }

    useEffect(() => {
        if(data && queryStr.id) {
            setProduct(data.data)
        } 
    }, [data, queryStr.id])
    
    useEffect(() => {
        if(dataDecoded) {
            setSkip(false)
        }
    }, [dataDecoded])
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [location.search])

    if(isLoading) {
        return (
            <section className='flex-center'>
                <PageLoader/>
            </section>
        )
    }
    if(isError) {
        return <Navigate to='/page-not-found' replace={true}/>
    }
    
    return (
        <Fragment>
            <CustomPage title={`TOHEN | ${product?.name}`} content='Product detail page'/> 
            <section className='flex flex-col md:flex-row px-5 md:space-x-5 md:container xl:product-detail-container'>
                {/* product image */}
                <section className='md:flex-[0.35] h-[170px] md:h-[200px] lg:h-[250px] mb-10 md:mb-0'>
                    <img src={product?.image.image_url} alt={product?.name} className='w-full h-full object-contain'/>
                </section>
                <section className='md:flex-[0.65] flex flex-col p-3 md:p-0 space-y-2 text-[#333] dark:text-gray-200'>
                    {/* product name */}
                    <h1 className='text-3xl font-bold'>{product?.name}</h1>
                    {/* product price */}
                    <h2 className={`${product?.discount?.is_discount ? 'line-through text-xl text-gray-500 font-medium' : 'text-2xl font-bold'}`}>
                        ${product?.price as number}
                    </h2>
                    {/* product price for discount */}
                    {product?.discount?.is_discount && (
                        <h2 className='text-2xl font-bold flexx'>
                            ${product?.price - (product?.discount.discount_percentage / 100) * product?.price} 
                            <span className='ml-2 py-1.5 px-5 bg-orange-500 text-sm text-white font-semibold rounded-md'>Disc {product?.discount.discount_percentage}%</span>
                        </h2>
                    )}
                    {/* product rating */}
                    <p className='font-medium'>Rating: <span className='font-normal dark:text-gray-300'>⭐ 4.1 (Reviews: 1200)</span></p>
                    {/* product stock */}
                    <p className='font-medium'>Stock: <span className='font-normal dark:text-gray-300'>{product?.stock}</span></p>
                    {/* product description */}
                    <p className='font-medium'>About this product: <br /> <span className='font-normal dark:text-gray-300'>
                        {product?.description}</span>
                    </p>
                    {/* product brand */}
                    <p className="font-medium">Brand: <span className="font-bold dark:text-gray-300">{product?.brand}</span></p>
                    {/* product category */}
                    <p className='font-medium'>Category: <span className='font-normal capitalize dark:text-gray-300'>{product?.category}</span></p>
                    {/* product condition */}
                    <p className='font-medium'>Condition: <span className='font-normal capitalize dark:text-gray-300'>{product?.condition}</span></p>
                    {/* product specification */}
                    {product && product?.specifications.length > 0 && (
                        <section className='flex flex-col space-y-2'>
                            <p className='font-medium'>Specifications:</p>
                            <section className='flex flex-col space-y-1.5 dark:text-gray-300'>
                                {product?.specifications.map(({specification, value}, index) => (
                                    <p key={index}>{specification}: <span>{value}</span></p>
                                ))}
                            </section>
                        </section>
                    )}
                    {/* product tags */}
                    <section className='flex flex-col space-y-2'>
                        <p className='font-medium'>Tags:</p>
                        <section className="flex flex-wrap">
                            {product?.tags.map(tag => (
                                <p key={tag.name} className='border border-400 p-2 rounded-md w-max mr-2 mb-2 dark:text-gray-300'>{tag.name}</p>
                            ))}
                        </section>
                    </section>
                    <section className='flexx space-x-4 !mt-5'>
                        {userId && role !== 'admin' && (
                            <Button className='w-max' variant='outline' disabled={isAddLoading || inWishlist(product?._id as string)} onClick={() => handleAddWishlist(product?._id as string)}>
                                {isAddLoading ? 
                                    <LuLoader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                                        !inWishlist(product?._id as string) && <LuHeart className='w-4 h-4 mr-2'/>
                                    )
                                }
                                {inWishlist(product?._id as string) ? 'Already in wishlist' : 'Add to wishlist'}
                            </Button>
                        )}
                        <Button className='w-max' disabled={Boolean(product?.stock as number < 1) || Boolean(inCart)} onClick={() => dispatch(addCart(product as ProductTypes))}>
                            {!inCart && product?.stock as number > 0 && <LuShoppingCart className='w-4 h-4 mr-2'/>}
                            {product?.stock as number < 1 ? 'Out stock' : inCart ? 'In Cart' : 'Add to cart'}
                        </Button>
                    </section>
                </section>
            </section>
        </Fragment>
    )
}
export default ProductDetail