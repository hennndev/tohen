import { useState, ChangeEvent } from 'react'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import {DebounceInput} from 'react-debounce-input'
import { useQueryParams } from '@/hooks/useQueryParams'
// components
import { Search, X } from 'lucide-react'


const SearchInput = () => {
    const location = useLocation()
    const queryStr = queryString.parse(location.search)
    const [searchTerm, setSearchTerm] = useState(queryStr.q as string || '')
    const { setSearchParams, newQueryParameters, handleSetQueries } = useQueryParams()
   
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        handleSetQueries(queryStr)
        if(value) {
            newQueryParameters.set('q', value)
        } else {
            newQueryParameters.delete('q')
        }
        setSearchParams(newQueryParameters)		
    }

    const handleClear = () => {
        setSearchTerm('')
        handleSetQueries(queryStr)
        newQueryParameters.delete('q')
        setSearchParams(newQueryParameters)
    }

    return (
        <div className='flexx border border-[#ccc] dark:border-gray-800 px-4 rounded-lg w-[350px]'>
            <Search size={20} className='text-[#222] dark:text-gray-300 mr-3'/>
            <DebounceInput debounceTimeout={300} type='text' value={searchTerm} onChange={handleChange} className='border-none outline-none py-2 bg-transparent flex-1' placeholder="Search anything" />
            {searchTerm && <X className='ml-1 text-red-500 w-4 h-4 cursor-pointer' onClick={handleClear}/>}
        </div>
    )
}

export default SearchInput