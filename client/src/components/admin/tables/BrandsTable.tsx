import { useState, Fragment } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDeleteBrandMutation } from '@/store/api/brandsApiSlice'
// components
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ModalConfirm from '@/components/modals/ModalConfirm'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type PropsTypes = {
    setIsEdit: (value: string) => void
    brands: BrandsTypes
}

const BrandsTable = ({setIsEdit, brands}: PropsTypes) => {
    const navigate = useNavigate()
    const [showModalDelete, setShowModalDelete] = useState<null | string>(null)
    const [handleDeleteBrand, {isLoading}] = useDeleteBrandMutation()

    const confirmDelete = async (brandId: string) => {
        try {
            const response = await handleDeleteBrand(brandId).unwrap()
            if(response.ok) {
                toast.success('Berhasil menghapus data brand')
                setShowModalDelete(null)
            }
        } catch (error: any) {
            toast.error(error.message)
        } 
    }

    return (
        <Fragment>
            <Table>
                <TableCaption>A list about brands data.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>View Products</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {brands.length > 0 ? brands.map((brand: BrandTypes, index) => (
                        <TableRow key={brand._id} className='text-[15px]'>
                            <TableCell className="font-medium">{index  + 1}</TableCell>
                            <TableCell className='font-semibold'>{brand.brand}</TableCell>
                            <TableCell>{brand.products.length} products</TableCell>
                            <TableCell>
                                <Button variant='outline' size='sm' onClick={() => navigate(`/admin/products?brand=${brand.brand}`)}>Details</Button>
                            </TableCell>
                            <TableCell>
                                <div className="flexx">
                                    <Pencil className='mr-3 w-4 h-4 text-blue-500 cursor-pointer' onClick={() => setIsEdit(brand._id)}/>
                                    <ModalConfirm 
                                        isLoading={isLoading}
                                        open={showModalDelete === brand._id}
                                        handleClose={() => setShowModalDelete(null)}
                                        handleOpen={() => setShowModalDelete(brand._id)}
                                        handleConfirm={() => confirmDelete(brand._id)}
                                        triggerComponent={<Trash2 className='w-4 h-4 text-red-500 cursor-pointer'/>}
                                        title='Are you sure want to delete this brand?'>
                                        ⚠️ This action will permanently delete this brand.
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
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Fragment>
    )
}

export default BrandsTable