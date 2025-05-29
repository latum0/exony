import { useState } from "react"
import useProfile from "@/hooks/useProfile"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"

export function AccountModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { isLoading, error, profile } = useProfile()
  const [tab, setTab] = useState("view")

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  })

  // Met à jour le formulaire quand le profil change
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdate = () => {
    // Appel API ici pour mettre à jour le profil
    console.log("Nouvelles données :", formData)
    // Tu peux afficher une notif ou refermer la modale ici
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Mon compte</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Chargement...</p>
        ) : error ? (
          <p className="text-destructive text-sm">Erreur de chargement</p>
        ) : (
          <Tabs value={tab} onValueChange={setTab} className="w-full space-y-4">
                {profile?.name && (
  <div className="flex justify-center mb-4">
    <div className="w-16 h-16 rounded-full bg-[#F8A67E] text-white flex items-center justify-center text-2xl font-bold shadow-md">
      {profile.name.charAt(0).toUpperCase()}
    </div>
  </div>
)}
            <TabsList className="grid w-full grid-cols-2" >
              <TabsTrigger value="view"  style={{background:"#F1c69E"}}>Mon compte</TabsTrigger>
              <TabsTrigger value="edit"  style={{background:"#F6C69F"}}>Modifier</TabsTrigger>
            </TabsList>

            {/* Tab: Affichage du profil */}
            <TabsContent value="view" className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p>{profile?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{profile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p>{profile?.phone || "Non fourni"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rôle</p>
                <p>{profile?.role}</p>
              </div>
               {/* <div>
                <p className="text-sm text-muted-foreground">Permissions</p>
                <p>{profile?.permissions?.join(", ") || "Aucune"}</p>
              </div> */}
            </TabsContent>

            {/* Tab: Modifier le profil */}
            <TabsContent value="edit" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <Button onClick={handleUpdate} className="w-full mt-4" style={{background:"#F8A67E"}} >
                Mettre à jour
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
