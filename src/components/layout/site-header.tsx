import { SidebarTrigger } from "@/components/ui/sidebar";

import useProfile from "@/hooks/useProfile";
import { NavUserHeader } from "./nav-user";

export function SiteHeader() {
  const { profile } = useProfile();

  const user = {
    name: profile?.name || "",
    role: profile?.role || "",
    email: profile?.email || "",
    //   avatar: "/avatars/shadcn.jpg",
  };
  return (
    <header className="sticky top-0 bg-[#fafafa] z-50 h-16 flex items-center shadow-sm border-b pr-4 lg:pr-6 pl-4">
      <div className="flex w-full  items-center">
        <SidebarTrigger className="-ml-1" />

        <div className=" flex items-center justify-end w-full ">
          <NavUserHeader user={user} />
        </div>
      </div>
    </header>
  );
}
