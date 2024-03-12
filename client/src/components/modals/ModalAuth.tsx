import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import AuthForm from '@/components/client/forms/AuthForm'

type PropsTypes = {
    children: React.ReactNode
}

const ModalAuth = ({children}: PropsTypes) => {
    const [open, setOpen] = useState<boolean>(false)
    const [isLogin, setIsLogin] = useState<boolean>(true)

    const handleClose = () => {
        setIsLogin(true)
        setOpen(false)
    }

    useEffect(() => {
        if(open === false) {
            setIsLogin(true)
        }
    }, [open])
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className={isLogin ? 'max-w-[500px]' : 'max-w-[700px]'}>
                <DialogHeader>
                    <DialogTitle className='mb-2 text-2xl font-semibold text-[#333] dark:text-gray-200'>{isLogin ? 'Login' : 'Register'}</DialogTitle>
                </DialogHeader>
                <AuthForm isLogin={isLogin} changeAuth={() => setIsLogin(!isLogin)} handleClose={handleClose}/>
            </DialogContent>
        </Dialog>
    )
}
export default ModalAuth