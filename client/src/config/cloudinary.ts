export const cloudinaryFetch = async (image: File) => {
    const formDataImage = new FormData()
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    formDataImage.append('file', image)
    formDataImage.append('upload_preset', preset)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, {
        method: 'POST',
        body: formDataImage
    })
    return response.json()
}