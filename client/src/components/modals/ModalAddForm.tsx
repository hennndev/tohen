import React, { useState, useEffect } from 'react'
//components
import BrandForm from '@/components/admin/forms/BrandForm'
import CategoryForm from '@/components/admin/forms/CategoryForm'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type PropsTypes = { 
    children: React.ReactNode
    handleEditNull: () => void
    formName: 'category' | 'brand'
    modalTitle: string
    isEdit: null | string
}

const ModalAddForm = ({children, handleEditNull, formName, modalTitle, isEdit}: PropsTypes) => {
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        if(isEdit) {
            setOpen(true)
        }
    }, [isEdit])
    
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className='max-h-[600px] overflow-y-auto scrollbar-hide'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='mb-2 text-2xl font-bold'>{modalTitle}</AlertDialogTitle>
                </AlertDialogHeader>
                {formName === 'category' && <CategoryForm setOpen={setOpen} isEdit={isEdit} handleEditNull={handleEditNull}/>}
                {formName === 'brand' && <BrandForm setOpen={setOpen} isEdit={isEdit} handleEditNull={handleEditNull}/>}
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default ModalAddForm