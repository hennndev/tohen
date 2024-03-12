import { useNavigate } from 'react-router-dom'
// components
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PropsTypes = {
    data: ProductTypes 
    isWishlist: boolean
    handleDeleteWishlist: (e: any) => void
    handleAddCart: (e: any) => void
    productInCart: boolean
}

const Product = ({data, isWishlist, handleDeleteWishlist, handleAddCart, productInCart}: PropsTypes) => {
    const navigate = useNavigate()
    return (
        <div onClick={() => navigate(`/products/${data.name.replaceAll(' ', '-')}?id=${data._id}`)} className={`min-h-[70px] border border-gray-200 dark:border-gray-800 p-3 rounded-md shadow-sm relative overflow-hidden`}>
            {data.stock < 1 && <div className='absolute top-0 right-0 left-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.2)]'/>}
            {isWishlist && (
                <X className='absolute top-2 right-2 w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500' onClick={(e) => handleDeleteWishlist(e)}/>
            )}
            {data.discount?.is_discount && (
                <div className='absolute top-2 -left-10 py-2 px-10 bg-orange-500 text-[12px] md:text-sm text-white font-semibold transform -rotate-[45deg]'>Disc {data.discount.discount_percentage}%</div>
            )}
            <div className='w-full h-[80px] md:h-[100px] lg:h-[120px]'>
                <img src={data.image.image_url} alt={data.name} className='w-full h-full object-contain'/>
            </div>
            <div className='flex-center flex-col space-y-1 mt-3'>
                <h1 className='text-center text-sm md:text-base'>{data.name}</h1>
                <h1 className={`text-center ${data.discount?.discount_percentage === 0 ? 'text-sm md:text-base font-bold' : 'font-medium text-gray-500 text-[12px] md:text-[14px] line-through'}`}>
                    ${data.price}
                </h1>
                {data.discount?.is_discount && (
                    <h1 className='text-center font-bold text-sm md:text-base'>
                        ${data.price - (data.discount.discount_percentage / 100) * data.price}
                    </h1>
                )}
                {data.stock > 0 ? (
                    <Button size="sm" className='w-max !mt-3' disabled={Boolean(data.stock < 1) || productInCart} variant="outline" onClick={(e) => handleAddCart(e)}>
                        {data.stock < 1 ? 'Out stock' : productInCart ? 'In Cart' : 'Add to cart'}
                    </Button>
                ): (
                    <p className='!mt-3 text-[15px] text-gray-500 font-medium'>Out of stock</p>
                )}
            </div>
        </div>
    )
}
export default Product