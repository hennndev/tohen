import { Outlet } from "react-router-dom"
// components
import Navbar from "@/components/admin/layout/Navbar"
import Sidebar from "@/components/admin/layout/Sidebar"

const AdminLayout = () => {
    return (
        <main className='flex'>
            <Sidebar/>
            <section className='flex-1 flex flex-col'>
                <Navbar/>
                <Outlet/>
            </section>
        </main>
    )
}
export default AdminLayout