import { useState } from 'react'
export const usePreviewImage = () => {
    const [prevImage, setPrevImage] = useState<string | null>(null)
    const handleChangePrevImage = (data: File) => {
        const readerImg: FileReader = new FileReader()
        readerImg.readAsDataURL(data)
        readerImg.onloadend = () => {
          const result: string = readerImg.result as string
          setPrevImage(result)
        }
    }
    return {
        prevImage, setPrevImage, handleChangePrevImage
    }
}
