import { configureStore, combineReducers } from '@reduxjs/toolkit'
import cartSliceReducer from './features/cartSlice'
import authSliceReducer from './features/authSlice'
import themeSliceReducer from './features/themeSlice'
import layoutSliceReducer from './features/layoutSlice'
import searchInputReducer from './features/searchInputSlice'
import { apiSlice } from './api/apiSlice'

const rootReducers = combineReducers({
    cart: cartSliceReducer,
    auth: authSliceReducer,
    theme: themeSliceReducer,
    layout: layoutSliceReducer,
    searchInput: searchInputReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
})

export const store = configureStore({
    reducer: rootReducers,
    devTools: true,
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware().concat(apiSlice.middleware)
    
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

