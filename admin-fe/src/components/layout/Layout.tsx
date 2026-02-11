import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSideBar"
import Header from "./Header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-background w-full">
        <Header />
        <div className="p-5">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}