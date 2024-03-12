import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

type StateLayoutTypes = {
    isSidebarProfile: boolean
}

const initialState: StateLayoutTypes = {
    isSidebarProfile: false
}

export const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        handleIsSidebarProfile: (state, action: PayloadAction<boolean>) => {
            state.isSidebarProfile = action.payload
        }
    }
})


export const { handleIsSidebarProfile } = layoutSlice.actions
export default layoutSlice.reducer

export const getIsSidebarProfile = (state: RootState) => state.layout.isSidebarProfile