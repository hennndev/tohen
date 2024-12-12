// import RecipientForm from '@/components/client/forms/RecipientForm'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type PropsTypes = {
    open: boolean
    setOpen: (value: boolean) => void
    handleClose: () => void
}

const ModalRecipientDetails = ({open, setOpen}: PropsTypes) => {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className='w-full max-w-lg md:max-w-2xl max-h-[700px] lg:max-h-[630px] overflow-y-auto'>
            <AlertDialogHeader>
                <AlertDialogTitle className='mb-2 text-xl font-semibold'>Complete recipient details below</AlertDialogTitle>
            </AlertDialogHeader>
            {/* <RecipientForm handleClose={handleClose}/> */}
        </AlertDialogContent>
    </AlertDialog>
  )
}
export default ModalRecipientDetails