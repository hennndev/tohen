import { useState, useEffect, Fragment } from 'react'
import queryString from 'query-string'
import { handleQueries } from '@/utils/utils'
import { useLocation } from 'react-router-dom'
import { useGetProductsQuery } from '@/store/api/productsApiSlice'
// components
import { Button } from '@/components/ui/button'
import { LuX, LuListFilter } from 'react-icons/lu'
import HelmetPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'
import Pagination from '@/components/shared/Pagination'
import Products from '@/components/client/products/Products'
import FilterProducts from '@/components/shared/FilterProducts'

const DATA_LIMIT = import.meta.env.VITE_DATA_ROW_TABLE

const ProductsPage = () => {
    const location = useLocation()
    const [openFilter, setOpenFilter] = useState<boolean>(false)
    const [products, setProducts] = useState<ProductsTypes | []>([])
    const [productsCount, setProductsCount] = useState<null | number>(null)
    
    const queryStr = queryString.parse(location.search)
    const queries = handleQueries(queryStr)
    const { data, isLoading } = useGetProductsQuery(queries)

    useEffect(() => {
        if(data) {
            setProducts(data.data) 
            setProductsCount(data.productsCount)
        }
    }, [data, location.search])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.search])

    return (
        <Fragment>
            <HelmetPage title='TOHEN | Products' content='Page contains about products list and other details information'/>
            <section className='flex px-5 md:container lg:space-x-5'>
                <section className={`fixed lg:static w-[320px] lg:w-auto h-full lg:h-auto overflow-y-auto px-5 py-8 lg:py-0 bg-background top-0 ${openFilter ? 'left-0' : '-left-[100%]'} duration-300 ease-linear lg:transition-none z-[45] lg:z-[70] lg:flex-[0.25] xl:flex-[0.2] shadow-lg lg:shadow-none`}>
                    <LuX className='absolute lg:hidden w-5 h-5 top-3 right-3 cursor-pointer' onClick={() => setOpenFilter(false)}/>
                    <FilterProducts setOpenFilter={setOpenFilter}/>
                </section>  
                <section className='flex-1 lg:flex-[0.7] xl:flex-[0.75] !text-[#333] dark:!text-gray-200'>
                    <h1 className='text-2xl font-semibold'>All Products</h1>
                    {!isLoading && (
                        <p className='mb-3 lg:mb-10 mt-3'>
                            Showing {queryStr.page ? ((+queryStr.page - 1) * DATA_LIMIT) + products.length : products.length} products from total {productsCount} products
                        </p>
                    )}
                    {/* Mobile */}
                    <Button variant='outline' className='mb-10 lg:hidden' onClick={() => setOpenFilter(!openFilter)}>
                        <LuListFilter className='w-5 h-5 mr-2'/>
                        Filter Products
                    </Button>
                    {!isLoading && <Products products={products}/>}
                    {isLoading && <PageLoader/>}
                    {productsCount as number > DATA_LIMIT && !isLoading && 
                        <section className='mt-10'>
                            <Pagination currentDataLength={products.length as number} dataCount={productsCount as number}/>
                        </section>
                    }
                </section>
            </section>
        </Fragment>
    )
}
export default ProductsPage