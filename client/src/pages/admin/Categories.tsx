import { useState, useEffect, Fragment } from 'react'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'
import { handleQueries } from '@/utils/utils'
import { useLocation } from 'react-router-dom'
import { useGetCategoriesQuery } from '@/store/api/categoriesApiSlice'
import { handleShowSearchInput } from '@/store/features/searchInputSlice'
// components
import HelmetPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'
import GeneralHeader from '@/components/admin/headers/GeneralHeader'
import CategoriesTable from '@/components/admin/tables/CategoriesTable'

const Categories = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const [isEdit, setIsEdit] = useState<null | string>(null)
    const [categories, setCategories] = useState<CategoriesTypes>([])
    const queryStr = queryString.parse(location.search)
    const queries = handleQueries(queryStr)
    const {data, isLoading } = useGetCategoriesQuery(queries)

    useEffect(() => {
        dispatch(handleShowSearchInput(true))
    }, [location.search])

    useEffect(() => {
        if(data) {
            setCategories(data.data)
        }
    }, [data])

    return (
        <Fragment>
            <HelmetPage title='TOHEN | Admin | Categories' content='Categories page'/>
            <section className='flex flex-col flex-1 h-screen p-5'>
                <GeneralHeader 
                    isEdit={isEdit} 
                    handleEditNull={() => setIsEdit(null)}
                    formName='category' 
                    modalTitle={isEdit ? 'Edit category' : 'Add category'} 
                    buttonTitle='Add new category'/>
                {isLoading ? <PageLoader/> : <CategoriesTable setIsEdit={setIsEdit} categories={categories}/>}
            </section>
        </Fragment>
    )
}
export default Categories