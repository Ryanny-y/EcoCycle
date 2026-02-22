import { Outlet } from "react-router";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/layout/AppSideBar";
import Header from "./components/layout/Header";

const Dashboard = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-background w-full">
          <Header />
          <div className="px-7 py-5">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default Dashboard;
