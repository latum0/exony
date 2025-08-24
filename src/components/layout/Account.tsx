import { useState, useEffect } from "react";
import useProfile from "@/hooks/useProfile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Shield, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { loading, error, profile } = useProfile();
  const [tab, setTab] = useState("view");

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    console.log("Nouvelles données :", formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Mon compte
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-muted-foreground text-sm">Chargement...</p>
        ) : error ? (
          <p className="text-destructive text-sm">Erreur de chargement</p>
        ) : (
          <Tabs value={tab} onValueChange={setTab} className="w-full space-y-4">
            {/* Avatar */}
            {profile?.name && (
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr to-[#f7b154] from-[#F8A67E] text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Tabs */}
            <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted/70 p-1  h-12">
              <TabsTrigger
                value="view"
                className="flex items-center text-base gap-2 h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <User size={17} /> Mon compte
              </TabsTrigger>
              <TabsTrigger
                value="edit"
                className="flex items-center text-base gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Settings size={17} /> Modifier
              </TabsTrigger>
            </TabsList>

            {/* Affichage du profil */}
            <TabsContent value="view" className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Nom</p>
                  <p>{profile?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p>{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p>{profile?.phone || "Non fourni"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Rôle</p>
                  <Badge variant="secondary">{profile?.role}</Badge>
                </div>
              </div>
            </TabsContent>

            {/* Modifier le profil */}
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
              <Button
                onClick={handleUpdate}
                className="w-full mt-4 bg-gradient-to-r to-[#f7b154] from-[#F8A67E] text-white shadow-md hover:opacity-90"
              >
                Mettre à jour
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
