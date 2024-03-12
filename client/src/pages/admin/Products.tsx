import { useState, useEffect, Fragment } from 'react'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'
import { handleQueries } from '@/utils/utils'
import { useLocation } from 'react-router-dom'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useGetProductsQuery } from '@/store/api/productsApiSlice'
import { handleShowSearchInput } from '@/store/features/searchInputSlice'
// components
import PageLoader from '@/components/shared/PageLoader'
import Pagination from '@/components/shared/Pagination'
import HelmetPage from '@/components/shared/HelmetPage'
import ProductsTable from '@/components/admin/tables/ProductsTable'
import ProductsHeader from '@/components/admin/headers/ProductsHeader'

const DATA_LIMIT = import.meta.env.VITE_DATA_ROW_TABLE

const Products = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const [products, setProducts] = useState([])
    const [productsCount, setProductsCount] = useState<null | number>(null)
    const queryStr = queryString.parse(location.search)
    const queries = handleQueries(queryStr)
    const { data, isLoading } = useGetProductsQuery(queries)
    const { setSearchParams, newQueryParameters, handleSetQueries } = useQueryParams()

    useEffect(() => {
        dispatch(handleShowSearchInput(true))
    }, [location.pathname])

    useEffect(() => {
        if(data) {
            setProducts(data.data) 
            setProductsCount(data.productsCount)
        }
        if(parseInt(queryStr.page as string) > 1 && products.length < 1) {
            handleSetQueries(queryStr)
            newQueryParameters.delete('page')
            setSearchParams(newQueryParameters)
        }
    }, [data, location.search])

    return (
        <Fragment>
            <HelmetPage title='TOHEN | Admin | Products' content='Admin products page'/>
            <section className='flex flex-col flex-1 h-screen p-5'>
                <ProductsHeader/>
                {isLoading ? <PageLoader/> : <ProductsTable products={products}/>}
                {productsCount as number > DATA_LIMIT && !isLoading && <div className='mt-10'>
                    <Pagination currentDataLength={products.length as number} dataCount={productsCount as number}/>
                </div>}
            </section>
        </Fragment>
    )
}
export default Products