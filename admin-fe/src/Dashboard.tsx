import { Toaster } from "sonner"
import Layout from "./components/layout/Layout"
import { Outlet } from "react-router"

const Dashboard = () => {
  return (
    <>
      <Toaster 
        position="bottom-right"
        richColors
        closeButton
      />
      <Layout>
        <Outlet />
      </Layout>
    </>
  )
}

export default Dashboard