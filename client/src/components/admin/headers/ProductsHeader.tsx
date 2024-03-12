import { useNavigate } from 'react-router-dom'
// components
import { Filter, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ModalFilteredProducts from '@/components/modals/ModalFilteredProducts'

const ProductsHeader = () => {
    const navigate = useNavigate()
    return (
        <div className='flex-between mb-5'>
            <div className="flexx space-x-4">
                <ModalFilteredProducts>
                    <Button variant='outline'>
                        <Filter className="mr-2 h-4 w-4" /> Filter products
                    </Button>
                </ModalFilteredProducts>
                <Button variant='outline'>
                    Discount Event
                </Button>
            </div>
            <Button onClick={() => navigate('/admin/products/add-product')}>
                <Plus className="mr-2 h-4 w-4" /> Add new product
            </Button>
        </div>
    )
}
export default ProductsHeader