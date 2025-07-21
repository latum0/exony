import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Fournisseur, FournisseurInput } from "@/hooks/useFournisseurs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FournisseurFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: Fournisseur | null;
  onSubmit: (data: FournisseurInput) => void;
}

export const FournisseurFormDialog: React.FC<FournisseurFormDialogProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState<FournisseurInput>({
    nom: "",
    adresse: "",
    contact: "",
    telephone: "",
    email: "",
  });


  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || "",
        adresse: initialData.adresse || "",
        contact: initialData.contact || "",
        telephone: initialData.telephone || "",
        email: initialData.email || "",
      });
    } else {
     
      setFormData({
        nom: "",
        adresse: "",
        contact: "",
        telephone: "",
        email: "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier fournisseur" : "Ajouter un fournisseur"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Nom du fournisseur"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="Personne de contact"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse *</Label>
            <Input
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
              placeholder="Adresse complète"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                placeholder="Numéro de téléphone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email de contact"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              type="button"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              style={{ background: "#F8A67E" }}
            >
              {initialData ? "Enregistrer les modifications" : "Créer le fournisseur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};