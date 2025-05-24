"use client"

import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const [activePath, setActivePath] = useState("")

  useEffect(() => {
    setActivePath(window.location.pathname)
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3 px-1 py-2">
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = activePath === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`group flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-[#fbe7e1] text-[#F8A67E] shadow-inner"
                      : "text-muted-foreground hover:bg-[#ffe0d6] hover:text-[#F8A67E]"
                  }`}
                >
                  <a href={item.url} onClick={() => setActivePath(item.url)}>
                    {item.icon && (
                      <item.icon
                        className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-[#F8A67E]" : "text-muted-foreground"
                        }`}
                      />
                    )}
                    <span className="truncate">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
