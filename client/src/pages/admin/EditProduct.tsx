import { useState, useEffect, Fragment } from 'react'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'
import { useLocation, Navigate } from 'react-router-dom'
import { useGetProductQuery } from '@/store/api/productsApiSlice'
import { handleShowSearchInput } from '@/store/features/searchInputSlice'
// components
import HelmetPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'
import ProductForm from '@/components/admin/forms/ProductForm'

const EditProduct = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const queryStr = queryString.parse(location.search)
    const [product, setProduct] = useState<ProductTypes | null>(null)
    const { data, isLoading, isError } = useGetProductQuery(queryStr.productId as string)
    
    useEffect(() => {
      dispatch(handleShowSearchInput(false))
    }, [location.pathname])
      
    useEffect(() => {
        if(data) setProduct(data.data)
    }, [data, queryStr.productId])

    if(isError) return <Navigate to='/page-not-found' replace={true}/>
    
    return (
        <Fragment>
            <HelmetPage title='TOHEN | Admin | Edit product' content='Edit product page'/>
            <section className='flex flex-col flex-1 h-screen p-5'>
                {isLoading && <PageLoader/>}
                {!isLoading && product && <ProductForm isEdit product={product as ProductTypes}/>}
            </section>
        </Fragment>
    )
}

export default EditProduct