import { Fragment } from 'react'
import {Toaster} from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'
import RequireAuth from '@/components/shared/RequireAuth'
import PersistLogin from '@/components/shared/PersistLogin'
import RequireAuthAdmin from '@/components/shared/RequireAuthAdmin'
// Pages
import Users from '@/pages/admin/Users' //ADMIN
import Brands from '@/pages/admin/Brands'
import Orders from './pages/admin/Orders'
import Products from '@/pages/admin/Products'
import Dashboard from './pages/admin/Dashboard'
import AddProduct from '@/pages/admin/AddProduct'
import Categories from '@/pages/admin/Categories'
import EditProduct from '@/pages/admin/EditProduct'
import ExpensesManager from './pages/admin/ExpensesManager'
import AdminProductDetail from '@/pages/admin/ProductDetail'
import Cart from '@/pages/client/Cart' //CLIENT
import Profile from '@/pages/client/Profile'
import Wishlist from '@/pages/client/Wishlist'
import Homepage from '@/pages/client/Homepage'
import PageNotFound from '@/pages/PageNotFound'
import ProductsClient from '@/pages/client/Products'
import UpdateProfile from '@/pages/client/UpdateProfile'
import ProductDetail from '@/pages/client/ProductDetail'
import OrdersHistory from '@/pages/client/OrdersHistory'
import ChangePassword from '@/pages/client/ChangePassword'
// containers
import AdminLayout from '@/containers/AdminLayout'
import ClientLayout from '@/containers/ClientLayout'
import ClientProfileLayout from '@/containers/ClientProfileLayout'

const App = () => {
    return (
        <Fragment>
            <Toaster reverseOrder={false} toastOptions={{
                className: 'dark:bg-[#222] dark:!text-[#fff]',
                duration: 2000
            }}/>
            <Routes>
                <Route element={<PersistLogin/>}>
                    {/* ADMIN */}
                    <Route element={<RequireAuthAdmin/>}>
                        <Route element={<AdminLayout/>}>
                            <Route path='/admin/dashboard' element={<Dashboard/>}/>
                            <Route path='/admin/orders' element={<Orders/>}/>
                            <Route path='/admin/customers' element={<Users/>}/>
                            <Route path='/admin/expenses-manager' element={<ExpensesManager/>}/>
                            <Route path='/admin/products' element={<Products/>}/>
                            <Route path='/admin/products/brands' element={<Brands/>}/>
                            <Route path='/admin/products/categories' element={<Categories/>}/>
                            <Route path='/admin/products/add-product' element={<AddProduct/>}/>
                            <Route path='/admin/products/edit-product' element={<EditProduct/>}/>
                            <Route path='/admin/products/product' element={<AdminProductDetail/>}/>
                        </Route>
                    </Route>
                    {/* CLIENT */}
                    <Route element={<ClientLayout/>}>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/" element={<Homepage/>}/>
                        <Route path="/products" element={<ProductsClient/>}/>
                        <Route path="/products/:productId" element={<ProductDetail/>}/>
                        <Route element={<RequireAuth/>}>
                            <Route path="/wishlist" element={<Wishlist/>}/>
                            <Route path='/orders-history' element={<OrdersHistory/>}/>
                        </Route>
                        <Route element={<RequireAuth/>}>
                            <Route element={<ClientProfileLayout/>}>
                                <Route path='/profile' element={<Profile/>}/>
                                <Route path='/profile/update-profile' element={<UpdateProfile/>}/>
                                <Route path='/profile/change-password' element={<ChangePassword/>}/>
                            </Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </Fragment>
    )
}
export default App