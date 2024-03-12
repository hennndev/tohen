import { useState, useEffect, Fragment } from 'react'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'
import { handleQueries } from '@/utils/utils'
import { useLocation } from 'react-router-dom'
import { useGetUsersQuery } from '@/store/api/usersApiSlice'
import { handleShowSearchInput } from '@/store/features/searchInputSlice'
// components
import HelmetPage from '@/components/shared/HelmetPage'
import PageLoader from '@/components/shared/PageLoader'
import UsersTable from '@/components/admin/tables/UsersTable'
import ProductsHeader from '@/components/admin/headers/ProductsHeader'

const Users = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const queryStr = queryString.parse(location.search)
    const [users, setUsers] = useState([])
    // const { setSearchParams, newQueryParameters, handleSetQueries } = useQueryParams()
    const queries = handleQueries(queryStr)
    const { data, isLoading } = useGetUsersQuery(1)

    useEffect(() => {
        dispatch(handleShowSearchInput(true))
    }, [location.pathname])

    useEffect(() => {
        if(data) {
            setUsers(data.data) 
        }
    }, [data, location.search])

    return (
        <Fragment>
            <HelmetPage title='TOHEN | Admin | Customers' content='Customers page'/>
            <section className='flex flex-col flex-1 h-screen p-5'>
                <ProductsHeader/>
                {isLoading ? <PageLoader/> : <UsersTable users={users}/>}
            </section>
        </Fragment>
    )
}

export default Users