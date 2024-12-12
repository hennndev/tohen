import { useState, Fragment } from 'react'
import toast from 'react-hot-toast'
import queryString from 'query-string'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDeleteProductMutation } from '@/store/api/productsApiSlice'
// components
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ModalConfirm from '@/components/modals/ModalConfirm'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type PropsTypes = {
    products: ProductsTypes
}
const DATA_LIMIT = import.meta.env.VITE_DATA_ROW_TABLE

const ProductsTable = ({products}: PropsTypes) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showModalDelete, setShowModalDelete] = useState<null | string>(null)
    
    const queryStr = queryString.parse(location.search)
    const [deleteProduct] = useDeleteProductMutation()

    const confirmDelete = async (productId: string, productCategory: string, productBrand: string, imageId: string) => {
        setIsLoading(true)
        try {
            const response = await deleteProduct({productId, productCategory, productBrand, imageId})
            if(response) {
                toast.success('Success delete this product')
                setShowModalDelete(null)
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }
    
    let page = 1 
    if(queryStr.page) {
        page = +queryStr.page
    }

    return (
        <Fragment>
            <Table>
                <TableCaption>A list about products data.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length > 0 ? products.map((product: ProductTypes, index) => (
                        <TableRow key={product._id} className={`text-[15px] ${product.stock < 1 ? 'bg-red-50 dark:bg-red-900 hover:bg-red-50 dark:hover:bg-red-900' : ''}`}>
                            <TableCell className="font-medium">{(index  + 1) + ((page - 1) * DATA_LIMIT)}</TableCell>
                            <TableCell>
                                <img src={product.image.image_url} alt={product.name} className='h-[40px] object-contain'/>
                            </TableCell>
                            <TableCell className={`font-medium ${product.discount?.is_discount ? 'flex flex-col' : ''}`}>
                                <span>{product.name}</span>
                                {product.discount?.is_discount && (
                                    <span className='w-max mt-2 py-1 px-3 bg-orange-500 text-[13px] text-white font-semibold rounded-md'>Disc {product.discount?.discount_percentage}%</span>
                                )}
                            </TableCell>
                            <TableCell className='capitalize'>
                                {product.category.includes('-') ? product.category.replaceAll('-', ' ') : product.category}
                            </TableCell>
                            <TableCell className={product.discount?.is_discount ? 'flex flex-col' : ''}>
                                <span className={`${product.discount?.is_discount ? 'line-through text-sm' : 'font-semibold'}`}>${product.price} {product.discount?.is_discount}</span>
                                {product.discount?.is_discount && (
                                    <span className='mt-1.5 font-semibold'>${product?.price - (product?.discount.discount_percentage / 100) * product?.price}</span>
                                )}
                            </TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>{product.condition}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                                <Button variant='outline' size='sm' onClick={() => navigate(`/admin/products/product?productId=${product._id}`)}>Details</Button>
                            </TableCell>
                            <TableCell>
                                <div className="flexx">
                                    <Pencil className='mr-3 w-4 h-4 text-blue-500 cursor-pointer' onClick={() => navigate(`/admin/products/edit-product?productId=${product._id}`)}/>
                                    <ModalConfirm 
                                        isLoading={isLoading}
                                        open={showModalDelete === product._id}
                                        handleClose={() => setShowModalDelete(null)}
                                        handleOpen={() => setShowModalDelete(product._id)}
                                        handleConfirm={() => confirmDelete(product._id, product.category, product.brand, product.image.image_id)}
                                        triggerComponent={<Trash2 className='w-4 h-4 text-red-500 cursor-pointer'/>}
                                        title='Are you sure want to delete this product?'>
                                        ⚠️ This action will permanently delete this product.
                                    </ModalConfirm>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                            <TableCell>no data</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Fragment>
    )
}
export default ProductsTable