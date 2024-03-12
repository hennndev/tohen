import React, { useState } from 'react'
import FilterProducts from '@/components/shared/FilterProducts'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type PropsTypes = { 
    children: React.ReactNode
}

const ModalFilteredProducts = ({children}: PropsTypes) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className='w-full max-w-lg md:max-w-xl max-h-[600px] overflow-y-auto scrollbar-hide'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='mb-2 text-2xl font-bold'>Filter Products</AlertDialogTitle>
                </AlertDialogHeader>
                <FilterProducts isModal setOpen={setOpen}/>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default ModalFilteredProducts