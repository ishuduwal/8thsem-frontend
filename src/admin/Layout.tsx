import { Dashboard } from "./Dashboard"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

export const Layout = () =>{
    return(
        <>
        <div className="flex">
            <Sidebar />
            <div className="w-full ml-16 md:ml-56">
                <Header />
                <Dashboard />
            </div>

        </div>
        </>
    )
}