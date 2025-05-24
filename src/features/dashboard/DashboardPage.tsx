import { AppSidebar } from "@/components/layout/app-sidebar"
import { ChartAreaInteractive } from "@/components/layout/chart-area-interactive"
import { DataTable } from "@/components/layout/data-table"
import { SectionCards } from "@/components/layout/section-cards"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold  ml-15 mb-4">  Dashboard </h1>
      {/* Ton contenu ici (graphiques, stats, etc.) */}
    </div>
  )
}

