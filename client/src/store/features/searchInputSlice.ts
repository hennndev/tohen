import { RootState } from "../store"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type SearchInputTypes = {
    showSearchInput: boolean
}

const initialState: SearchInputTypes = {
    showSearchInput: false,
}

const searchInputSlice = createSlice({
    name: 'searchInput',
    initialState,
    reducers: {
        handleShowSearchInput: (state, action: PayloadAction<boolean>) => {
            state.showSearchInput = action.payload
        },
    }
})

export const { handleShowSearchInput } = searchInputSlice.actions
export default searchInputSlice.reducer

export const getShowSearchInput = (state: RootState) => state.searchInput.showSearchInput