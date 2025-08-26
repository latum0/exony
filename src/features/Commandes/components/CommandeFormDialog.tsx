// src/pages/commandes/components/CommandeFormDialog.tsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CommandeFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: CommandeResponseDto | null;
  onSubmit: (data: any) => void;
}

export const CommandeFormDialog: React.FC<CommandeFormDialogProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    dateCommande: new Date().toISOString().slice(0, 16),
    statut: "EN_ATTENTE",
    adresseLivraison: "",
    clientId: "",
    lignes: [] as Array<{ produitId: string; quantite: number }>,
  });

  const [newLigne, setNewLigne] = useState({ produitId: "", quantite: 1 });

  useEffect(() => {
    if (initialData) {
      setFormData({
        dateCommande: initialData.dateCommande.slice(0, 16),
        statut: initialData.statut,
        adresseLivraison: initialData.adresseLivraison,
        clientId: initialData.clientId.toString(),
        lignes: initialData.ligne.map(l => ({
          produitId: l.produitId,
          quantite: l.quantite,
        })),
      });
    } else {
      setFormData({
        dateCommande: new Date().toISOString().slice(0, 16),
        statut: "EN_ATTENTE",
        adresseLivraison: "",
        clientId: "",
        lignes: [],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLigne = () => {
    if (newLigne.produitId && newLigne.quantite > 0) {
      setFormData(prev => ({
        ...prev,
        lignes: [...prev.lignes, newLigne],
      }));
      setNewLigne({ produitId: "", quantite: 1 });
    }
  };

  const removeLigne = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lignes: prev.lignes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      clientId: parseInt(formData.clientId),
      lignes: formData.lignes,
    };
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier la commande" : "Créer une nouvelle commande"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateCommande">Date de commande *</Label>
              <Input
                id="dateCommande"
                name="dateCommande"
                type="datetime-local"
                value={formData.dateCommande}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut">Statut *</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) => handleSelectChange("statut", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                  <SelectItem value="EN_COURS">En cours</SelectItem>
                  <SelectItem value="LIVREE">Livrée</SelectItem>
                  <SelectItem value="ANNULEE">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresseLivraison">Adresse de livraison *</Label>
            <Input
              id="adresseLivraison"
              name="adresseLivraison"
              value={formData.adresseLivraison}
              onChange={handleChange}
              required
              placeholder="Adresse complète de livraison"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">ID Client *</Label>
            <Input
              id="clientId"
              name="clientId"
              type="number"
              value={formData.clientId}
              onChange={handleChange}
              required
              placeholder="ID du client"
              min="1"
            />
          </div>

          <div className="space-y-4">
            <Label>Lignes de commande</Label>
            
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="ID Produit"
                value={newLigne.produitId}
                onChange={(e) => setNewLigne(prev => ({ ...prev, produitId: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Quantité"
                min="1"
                value={newLigne.quantite}
                onChange={(e) => setNewLigne(prev => ({ ...prev, quantite: parseInt(e.target.value) || 1 }))}
              />
              <Button type="button" onClick={addLigne} className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Ajouter
              </Button>
            </div>

            {formData.lignes.length > 0 && (
              <div className="border rounded-md p-4 space-y-2">
                {formData.lignes.map((ligne, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">
                      Produit: {ligne.produitId.slice(0, 8)}... - Quantité: {ligne.quantite}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLigne(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" style={{ background: "#F8A67E" }}>
              {initialData ? "Enregistrer les modifications" : "Créer la commande"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};