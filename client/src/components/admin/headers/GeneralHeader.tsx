import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ModalAddForm from '@/components/modals/ModalAddForm'

type PropsTypes = {
    isEdit: null | string
    handleEditNull: () => void
    formName: 'category' | 'brand'
    modalTitle: string
    buttonTitle: string
}

const GeneralHeader = ({isEdit, handleEditNull, formName, modalTitle, buttonTitle}: PropsTypes) => {
    return (
        <div className='flex-end mb-5'>
            <ModalAddForm handleEditNull={handleEditNull} formName={formName} modalTitle={modalTitle} isEdit={isEdit}>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> {buttonTitle}
                </Button>
            </ModalAddForm>
        </div>
    )
}
export default GeneralHeader