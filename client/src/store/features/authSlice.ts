import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

type StateAuthTypes = {
    accessToken: string | null
}

const initialState: StateAuthTypes = {
    accessToken: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<StateAuthTypes>) => {
            state.accessToken = action.payload.accessToken
        },
        logout: (state) => {
            localStorage.removeItem('isLoggedIn')
            state.accessToken = null
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
export const getCurrentToken = (state: RootState) => state.auth.accessToken