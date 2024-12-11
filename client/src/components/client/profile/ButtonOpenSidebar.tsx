import { useDispatch } from 'react-redux'
import { handleIsSidebarProfile } from '@/store/features/layoutSlice'
// components
import { Button } from '@/components/ui/button'
import { ChevronLeftCircle } from 'lucide-react'

const ButtonOpenSidebar = () => {
    const dispatch = useDispatch()
    return (
        <Button variant='outline' className='flex lg:hidden w-max' onClick={() => dispatch(handleIsSidebarProfile(true))}>
            <ChevronLeftCircle className='w-5 h-5 mr-2'/> Menu
        </Button>
    )
}
export default ButtonOpenSidebar