import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

type StateThemeTypes = {
    checkedTheme: boolean
}

const initialState: StateThemeTypes = {
    checkedTheme: localStorage.getItem('theme') === 'light' ? true : false || false
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setCheckedTheme: (state, action: PayloadAction<boolean>) => {
            state.checkedTheme = action.payload
        }
    }

})

export const { setCheckedTheme } = themeSlice.actions
export default themeSlice.reducer
export const getCheckedTheme = (state: RootState) => state.theme.checkedTheme