import { useEffect, Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { handleShowSearchInput } from '@/store/features/searchInputSlice'
// components
import HelmetPage from '@/components/shared/HelmetPage'
import ProductForm from '@/components/admin/forms/ProductForm'

const AddProduct = () => {
    const dispatch= useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(handleShowSearchInput(false))
    }, [location.pathname])

    return (
        <Fragment>
            <HelmetPage title='TOHEN | Admin | Add product' content='Add product page'/>
            <section className='flex flex-col flex-1 h-screen p-5'>
                <ProductForm/>
            </section>
        </Fragment>
    )
}
export default AddProduct