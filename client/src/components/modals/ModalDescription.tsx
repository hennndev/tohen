import React from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type PropsTypes = { 
    title: string
    triggerComponent: React.ReactNode
    children: React.ReactNode
}

const ModalDescription = ({title, triggerComponent, children}: PropsTypes) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {triggerComponent}
            </AlertDialogTrigger>
            <AlertDialogContent className='max-h-[600px] overflow-y-auto scrollbar-hide'>
                <AlertDialogHeader>
                <AlertDialogTitle className='mb-2'>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {children}
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModalDescription