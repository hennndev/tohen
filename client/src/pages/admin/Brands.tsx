import { useState, useEffect, Fragment } from 'react'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { handleQueries } from '@/utils/utils'
import { useGetBrandsQuery } from '@/store/api/brandsApiSlice'
import { handleShowSearchInput } from '@/store/features/searchInputSlice'
// components
import HelmetPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'
import BrandsTable from '@/components/admin/tables/BrandsTable'
import GeneralHeader from '@/components/admin/headers/GeneralHeader'

const Brands = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const queriesStr = queryString.parse(location.search)
    const queries = handleQueries(queriesStr)
    const [brands, setBrands] = useState<BrandsTypes | []>([])
    const {data, isLoading} = useGetBrandsQuery(queries)
    const [isEdit, setIsEdit] = useState<string | null>(null)

    useEffect(() => {
        dispatch(handleShowSearchInput(true))
    }, [location.search])

    useEffect(() => {
        if(data) {
            setBrands(data.data)
        }
    }, [data, location.search])
    
    return (
        <Fragment>
            <HelmetPage title='TOHEN | Admin | Brands' content='Brands page'/>
            <section className='flex flex-col flex-1 h-screen p-5'>
                <GeneralHeader 
                    isEdit={isEdit}
                    handleEditNull={() => setIsEdit(null)} 
                    formName='brand' 
                    modalTitle={isEdit ? 'Edit brand' : 'Tambah brand'} 
                    buttonTitle='Tambah brand baru'/>
                {isLoading ? <PageLoader/> : <BrandsTable brands={brands} setIsEdit={setIsEdit}/>}
            </section>
        </Fragment>
    )
}
export default Brands