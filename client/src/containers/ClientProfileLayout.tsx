import { Outlet } from "react-router-dom"
// components
import Sidebar from "@/components/client/profile/Sidebar"
import ButtonOpenSidebar from "@/components/client/profile/ButtonOpenSidebar"

const ClientProfileLayout = () => {
    return (
        <div className='flex -mt-10 pt-10 md:container px-5 md:space-x-1'>
            <Sidebar/>
            <section className="flex flex-1 flex-col space-y-3 lg:space-y-0">
                <ButtonOpenSidebar/>
                <Outlet/>
            </section>
        </div>
    )
}
export default ClientProfileLayout