import { useState, useEffect } from 'react'
import { jwtDecode, JwtPayload } from "jwt-decode"
import { useSelector } from 'react-redux'
import { getCurrentToken } from '@/store/features/authSlice'

const useDecodeToken = () => {
    const token = useSelector(getCurrentToken)
    const [dataDecoded, setDataDecoded] = useState<DataDecodedTypes | null>(null)
    useEffect(() => {
        if(token) {
            const decoded: DataDecodedTypes = jwtDecode(token)
            setDataDecoded(decoded)
        }
    }, [token])
    return dataDecoded
}

export default useDecodeToken