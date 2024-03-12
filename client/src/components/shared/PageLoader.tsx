import React from 'react'
import { Loader2 } from 'lucide-react'

const PageLoader = () => {
    return (
        <div className='flex-center'>
            <Loader2 className='mr-2 w-4 h-4 animate-spin'/>
            <p>Waiting...</p>
        </div>
    )
}

export default PageLoader