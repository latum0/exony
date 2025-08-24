"use client";

import * as React from "react";
import {
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
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

import useProfile from "@/hooks/useProfile";

import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
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

  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],

  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfile();

  const user = {
    name: profile?.name || "Utilisateur",
    email: profile?.role || "Email inconnu",
    //   avatar: "/avatars/shadcn.jpg",
  };

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
                <span className="text-2xl text-[#F8A67E]  mt-2 font-semibold font-poppins">
                  Exony
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <NavMain items={data.navMain} />

        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
