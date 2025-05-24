import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"


export function SiteHeader() {
                
const { setTheme, theme } = useTheme()
  return (
    <header className="fixed top-0 bg-white w-full z-50 not-only-of-type:group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 flex h-14 shrink-0 items-center border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center px-4 lg:px-6">
        {/* Partie gauche */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
        </div>

        {/* Partie droite : Barre de recherche avec icône */}
        <div className="ml-auto mr-40 w-full max-w-sm relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="h-9 pl-10 bg-gray-100 placeholder:text-muted-foreground focus-visible:ring-[#F8A67E]"
          />
        </div>
        <Button
  variant="ghost"
  size="icon"
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="ml-2"
>
  {theme === "dark" ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
</Button>
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar className="h-8 w-8 cursor-pointer ml-4">
      <AvatarImage src="/avatars/shadcn.jpg" alt="@shadcn" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Profil</DropdownMenuItem>
    <DropdownMenuItem>Paramètres</DropdownMenuItem>
    <DropdownMenuItem>Déconnexion</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
      </div>
    </header>
  )
}
