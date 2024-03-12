import { ParsedQuery } from 'query-string'
import { useSearchParams } from "react-router-dom"

export const useQueryParams = () => {
    const [_, setSearchParams] = useSearchParams()
    const newQueryParameters : URLSearchParams = new URLSearchParams()

    const handleSetQueries = (queryStr: ParsedQuery) => {
        const queries = Object.keys(queryStr).map(key => {
            return {
                key: key,
                value: queryStr[key]
            }
        })
        queries.forEach(query => {
            if(Array.isArray(query.value)) {
                query.value.forEach((value) => {
                    newQueryParameters.append(query.key, value as string)
                })
            } else {
                newQueryParameters.set(query.key, query.value as string);
            }
        })
    }

    return {
        setSearchParams, 
        newQueryParameters,
        handleSetQueries
    }
}