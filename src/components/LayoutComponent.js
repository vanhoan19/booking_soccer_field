import { Outlet } from "react-router-dom"
import { HeaderComponent } from "./HeaderComponent"
import { Layout } from "antd"

export const LayoutComponent = () => {
    return (
        <Layout>
            <HeaderComponent />
            <Outlet />
        </Layout>
    )
}