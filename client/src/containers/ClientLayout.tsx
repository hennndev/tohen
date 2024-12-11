import { Outlet } from "react-router-dom"
// components
import Navbar from "@/components/client/layout/Navbar"
import Footer from "@/components/client/layout/Footer"

const ClientLayout = () => {
    return (
        <main className='flex md:min-h-screen flex-col'>
            <Navbar/>
            <section className='mt-10 mb-36'>
                <Outlet/>
            </section>
            <Footer/>
        </main>
    )
}
export default ClientLayout