import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSideBar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-background w-full">
        <SidebarTrigger />
        <div className="p-5">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}