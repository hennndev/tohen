import React, { useState } from 'react'
import AccountDeleteForm from '../client/forms/AccountDeleteForm'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type PropsTypes = { 
    username: string
    children: React.ReactNode
}

const ModalDeleteAccount = ({username, children}: PropsTypes) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className='max-h-[600px] overflow-y-auto scrollbar-hide'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='mb-2 text-2xl font-bold'>Delete Account Confirmation</AlertDialogTitle>
                </AlertDialogHeader>
                <AccountDeleteForm username={username} setOpen={setOpen}/>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModalDeleteAccount