"use client";

import * as React from "react";
import {
  LayoutDashboardIcon,
  UsersIcon,
  FactoryIcon,
  ShoppingCartIcon,
  UserXIcon,
  PackageIcon,
  UserIcon,
  Undo2,
  History,
} from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const data = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Fournisseurs", url: "/fournisseurs", icon: FactoryIcon },
    { title: "Utilisateurs", url: "/utilisateurs", icon: UsersIcon },
    { title: "Commandes", url: "/commandes", icon: ShoppingCartIcon },
    { title: "Clients", url: "/client", icon: UserIcon },
    { title: "Liste noire", url: "/liste-noire", icon: UserXIcon },
    { title: "Produits", url: "/produits", icon: PackageIcon },
    { title: "Retours", url: "/retours", icon: Undo2 },
    { title: "historiques", url: "/historique", icon: History },
  ],
};
const permissionAccess: Record<string, string[]> = {
  AGENT_DE_STOCK: ["/produits", "/fournisseurs", "/retours"],
  CONFIRMATEUR: ["/commandes", "/client"],
  SAV: ["/retours", "/client", "/liste-noire"],
};
function getAccessibleNav(role: string, permissions: string[] | null) {
  if (role === "ADMIN") {
    return data.navMain;
  }

  if (role === "MANAGER" && permissions) {
 
    const allowedUrls = new Set(
      permissions.flatMap((p) => permissionAccess[p] || [])
    );

    return data.navMain.filter((item) => allowedUrls.has(item.url));
  }

  return []; 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const profile = useSelector((state: RootState) => state.profile.data);

  const navItems = profile
    ? getAccessibleNav(profile.role, profile.permissions)
    : [];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 bg-none hover:bg-none"
            >
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="logoexony.png"
                  alt="Logo Exony"
                  className="h-13 w-13 mt-2"
                />
                <span className="text-2xl text-[#F8A67E] mt-2 font-semibold font-poppins">
                  Exony
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-4">
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
