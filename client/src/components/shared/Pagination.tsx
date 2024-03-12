import { useState } from 'react'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import { useQueryParams } from '@/hooks/useQueryParams'
import { Pagination as PaginationContainer, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

type PropsTypes = {
    dataCount: number
    currentDataLength: number
}

const DATA_LIMIT = import.meta.env.VITE_DATA_ROW_TABLE

const Pagination = ({dataCount, currentDataLength}: PropsTypes) => {
    const location = useLocation()
    const queryStr = queryString.parse(location.search)
    const [page, setPage] = useState<number>(parseInt(queryStr.page as string) || 1)
    const { setSearchParams, newQueryParameters, handleSetQueries } = useQueryParams()

    const handleNext = (value: number) => {
        handleSetQueries(queryStr)
        setPage(value)
        newQueryParameters.set('page', String(value))
        setSearchParams(newQueryParameters)
    }
    const handlePrev = (value: number) => {
        handleSetQueries(queryStr)
        if(page === 2) {
            newQueryParameters.delete('page')
            setPage(1)
        } else {
            setPage(value)
            newQueryParameters.set('page', String(value))
        }
        setSearchParams(newQueryParameters)
    }
    
    const handleClickPageNumber = (value: number) => {
        handleSetQueries(queryStr)
        setPage(value)
        newQueryParameters.set('page', String(value))
        setSearchParams(newQueryParameters)
    }

    const isNext = (((page - 1) * DATA_LIMIT) + currentDataLength) < dataCount

    const isCondition = page < 4 ? false : (((page - 1) * DATA_LIMIT) + currentDataLength) > (((page - 2) * DATA_LIMIT))
    
    let firstNumber = 1 + (isCondition ? Math.floor((((((page - 1)) + currentDataLength) / 3) - 0.1)) * 3 : 0)
    const secondNumber = firstNumber + 1
    const thirdNumber = firstNumber + 2
    
    return (
        <PaginationContainer>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className={`${page === 1 ? 'cursor-default text-gray-300 hover:text-gray-300 dark:text-gray-700 hover:bg-transparent' : 'cursor-pointer'}`} onClick={() => page > 1 && handlePrev(page - 1)}/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive={page === firstNumber} className={`cursor-pointer`} onClick={() => handleClickPageNumber(firstNumber)}>
                        {firstNumber}
                    </PaginationLink>
                </PaginationItem>
                {((secondNumber - 1) * DATA_LIMIT) < dataCount && (
                    <PaginationItem>
                        <PaginationLink isActive={page === secondNumber} className={`cursor-pointer`}  onClick={() => handleClickPageNumber(secondNumber)}>
                            {secondNumber}
                        </PaginationLink>
                    </PaginationItem>
                )}
                {((thirdNumber - 1) * DATA_LIMIT) < dataCount && (
                    <PaginationItem>
                        <PaginationLink isActive={page === thirdNumber} className={`cursor-pointer`} onClick={() => handleClickPageNumber(thirdNumber)}>
                            {thirdNumber}
                        </PaginationLink>
                    </PaginationItem>
                )}
                <PaginationItem>
                    <PaginationNext className={`${!isNext ? 'cursor-default text-gray-300 hover:text-gray-300 dark:text-gray-700 hover:bg-transparent' : 'cursor-pointer'}`} onClick={() => isNext && handleNext(page + 1)}/>
                </PaginationItem>
            </PaginationContent>
        </PaginationContainer>
    )
}

export default Pagination