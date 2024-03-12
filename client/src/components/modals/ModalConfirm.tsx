import React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type PropsTypes = { 
    title: string
    isLoading: boolean
    open: boolean
    handleOpen: () => void
    handleClose: () => void
    triggerComponent: React.ReactNode
    // setShowModalDelete: (value: boolean) => void
    handleConfirm: () => void
    children: string
}
const ModalConfirm = ({title, open, triggerComponent, handleOpen, handleClose, isLoading, handleConfirm, children}: PropsTypes) => {

    return (
        <AlertDialog defaultOpen={false} open={open} onOpenChange={handleOpen}>
            <AlertDialogTrigger asChild>
                {triggerComponent}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {children}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button disabled={isLoading} variant='outline' onClick={handleClose}>Cancel</Button>
                    <Button disabled={isLoading} onClick={handleConfirm}>
                        {isLoading && <Loader2 className='animate-spin mr-2 w-4 h-4'/>}
                        {isLoading ? 'Waiting...' : 'Confirm'} 
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default ModalConfirm