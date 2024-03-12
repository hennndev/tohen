import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
// components
import { Button } from '@/components/ui/button'
import HelmetPage from '@/components/shared/HelmetPage'

const PageNotFound = () => {
    const navigate = useNavigate()
    return (
        <Fragment>
            <HelmetPage title='Page not found' content='404. Page not found'/>
            <main className='flex-center flex-col h-screen bottom-20 relative text-[#333] dark:text-gray-300'>
                <h1 className='font-bold text-2xl mb-2'>Page Not Found!</h1>
                <p className='mb-4 dark:text-gray-400'>Oops, this page is not available</p>
                <Button variant='secondary' onClick={() => navigate('/products')}>Back to homepage</Button>
            </main>
        </Fragment>
    )
}
export default PageNotFound