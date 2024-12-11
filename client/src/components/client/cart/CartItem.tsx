import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom' 
import type { AppDispatch } from '@/store/store'
import { addCart, deleteCart, decrement } from '@/store/features/cartSlice'
// components
import { Plus, Minus } from 'lucide-react' 
import { Button } from '@/components/ui/button'

type PropsTypes = {
    item: ProductCartTypes
    inWishlist: boolean
    isAdmin: boolean
    isLoggedIn: string | null
    handleAddWishlist: () => void
}

const CartItem = ({item, handleAddWishlist, inWishlist, isAdmin, isLoggedIn}: PropsTypes) => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const totalPrice = (item.discount?.is_discount ? (item.price - (item.discount.discount_percentage / 100) * item.price) : item.price) * item.count

    return (
        <div className='flexx group space-x-10'>
            <div className="flex flex-1 lg:flex-1 xl:flex-[0.45] space-x-5 md:space-x-3">
                <div className='flex-[0.3] h-[60px] md:h-[75px] lg:h-[70px]'>
                    <img src={item.image.image_url} alt={item.name} className='object-contain w-full h-full'/>
                </div>
   
                <div className='flex-[0.7] flex lg:flex-1 flex-col space-y-1 md:space-y-0'>
                    <h2 className='text-[15px] sm:text-base lg:text-xl font-semibold group-hover:underline cursor-pointer' onClick={() => navigate(`/products/${item.name.replaceAll(' ', '-')}?id=${item._id}`)}>{item.name}</h2>
                    <h3 className={`${item.discount?.is_discount ? 'line-through text-sm' : 'font-medium'}`}>
                        ${item.price}
                    </h3>
                    {item.discount?.is_discount && <h3 className='font-medium flexx !mb-1'>
                        ${item.price - (item.discount.discount_percentage / 100) * item.price}
                        <span className='ml-2 py-1 px-3 bg-orange-500 text-[12px] text-white font-medium rounded-md'>Disc {item.discount.discount_percentage}%</span>
                    </h3>}
                    <p className='text-sm line-clamp-1 md:line-clamp-2 mr-3 dark:text-gray-400'>{item.description}</p>
                    <p className='text-sm md:text-base dark:text-gray-300'>Jumlah: ({item.count}x)</p>
                    <div className='flex flex-col xl:hidden space-y-2 !mt-3'>
                        <div className='flexx space-x-3'>
                            <div className='border border-gray-300 rounded-md p-1 cursor-pointer' onClick={() => dispatch(decrement(item._id))}>
                                <Minus className='w-3 h-3'/>
                            </div>
                            <span>{item.count}</span>
                            <div className='border border-gray-300 rounded-md p-1 cursor-pointer' onClick={() => dispatch(addCart(item))}>
                                <Plus className='w-3 h-3'/>
                            </div>
                        </div>
                    </div>
                    {/* Mobile */}
                    <div className='flex lg:flex xl:hidden flex-col space-y-1 !mt-3'>
                        <h1 className='font-semibold text-lg'><span className='font-medium text-[17px]'>Total:</span> ${totalPrice}</h1>
                    </div>
                    {/* Mobile */}
                    <div className='flex lg:flex xl:hidden flex-col space-y-2 !mt-2'>
                        <div className='flexx space-x-3'>
                            {isLoggedIn && !isAdmin && (
                                <Button size='sm' variant='outline' disabled={inWishlist} className='px-2 text-sm' onClick={handleAddWishlist}>
                                    {!inWishlist && <Plus className='w-4 h-4 mr-2'/>}
                                    {inWishlist ? 'Already in wishlist' : 'Add wishlist'}
                                </Button>
                            )}
                            <Button size='sm' variant='destructive' className='px-2 text-sm' onClick={() => dispatch(deleteCart(item._id))}>Hapus</Button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='hidden xl:flex-between md:flex-[0.55]'>
                <div className='flex flex-col space-y-2'>
                    <p>Quantity</p>
                    <div className='flexx space-x-3'>
                        <div className='border border-gray-300 rounded-md p-1 cursor-pointer' onClick={() => dispatch(decrement(item._id))}>
                            <Minus className='w-4 h-4'/>
                        </div>
                        <span>{item.count}</span>
                        <div className='border border-gray-300 rounded-md p-1 cursor-pointer' onClick={() => dispatch(addCart(item))}>
                            <Plus className='w-4 h-4'/>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col space-y-2'>
                    <p>Action</p>
                    <div className='flexx space-x-3'>
                        {isLoggedIn && !isAdmin && (
                            <Button size='sm' variant='outline' disabled={inWishlist} className='px-2 text-sm' onClick={handleAddWishlist}>
                                {!inWishlist && <Plus className='w-4 h-4 mr-2'/>}
                                {inWishlist ? 'Already in wishlist' : 'Add wishlist'}
                            </Button>
                        )}
                        <Button size='sm' variant='destructive' className='px-2 text-sm' onClick={() => dispatch(deleteCart(item._id))}>Hapus</Button>
                    </div>
                </div>
                <div className='flex flex-col space-y-1'>
                    <p>Total</p>
                    <h1 className='font-semibold text-lg'>${totalPrice.toFixed(2)}</h1>
                </div>
            </div>
        </div>
    )
}
export default CartItem