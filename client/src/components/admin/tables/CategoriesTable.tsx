import { useState, Fragment } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDeleteCategoryMutation } from '@/store/api/categoriesApiSlice'
// components
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ModalConfirm from '@/components/modals/ModalConfirm'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type PropsTypes = {
    setIsEdit: (value: string) => void
    categories: CategoriesTypes
}

const CategoriesTable = ({setIsEdit, categories}: PropsTypes) => {
    const navigate = useNavigate()
    const [showModalDelete, setShowModalDelete] = useState<null | string>(null)
    const [handleDeleteCategory, {isLoading}] = useDeleteCategoryMutation()

    const confirmDelete = async (categoryId: string) => {
        try {
            const response = await handleDeleteCategory(categoryId).unwrap()
            if(response.ok) {
                toast.success('Berhasil menghapus data kategori')
                setShowModalDelete(null)
            }
        } catch (error: any) {
            toast.error(error.message)
        } 
    }

    return (
        <Fragment>
            <Table>
                <TableCaption>A list about categories data.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>View Products</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length > 0 ? categories.map((category: CategoryTypes, index) => (
                        <TableRow key={category._id} className='text-[15px]'>
                            <TableCell className="font-medium">{index  + 1}</TableCell>
                            <TableCell className='font-medium'>{category.category}</TableCell>
                            <TableCell>{category.products.length} products</TableCell>
                            <TableCell>
                                <Button variant='outline' size='sm' onClick={() => navigate(`/admin/products?category=${category.category}`)}>Details</Button>
                            </TableCell>
                            <TableCell>
                                <div className="flexx">
                                    <Pencil className='mr-3 w-4 h-4 text-blue-500 cursor-pointer' onClick={() => setIsEdit(category._id)}/>
                                    <ModalConfirm 
                                        isLoading={isLoading}
                                        open={showModalDelete === category._id}
                                        handleClose={() => setShowModalDelete(null)}
                                        handleOpen={() => setShowModalDelete(category._id)}
                                        handleConfirm={() => confirmDelete(category._id)}
                                        triggerComponent={<Trash2 className='w-4 h-4 text-red-500 cursor-pointer'/>}
                                        title='Are you sure want to delete this category?'>
                                        ⚠️ This action will permanently delete this category.
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

export default CategoriesTable