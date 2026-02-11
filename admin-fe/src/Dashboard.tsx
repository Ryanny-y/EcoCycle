import Layout from "./components/layout/Layout"
import { Outlet } from "react-router"

const Dashboard = () => {
  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  )
}

export default Dashboard