// layout.tsx
import { Outlet } from "react-router-dom"
import { SiteHeader } from "@/components/layout/site-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar className="hidden md:block w-64 shrink-0" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <SiteHeader />
          <main className="flex-1 overflow-y-auto pt-14 px-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
