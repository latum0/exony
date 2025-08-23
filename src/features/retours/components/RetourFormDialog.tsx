
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Retour, RetourInput } from "@/hooks/useRetour";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RetourFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: Retour | null;
  onSubmit: (data: RetourInput) => void;
}

export const RetourFormDialog: React.FC<RetourFormDialogProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState<RetourInput>({
    dateRetour: new Date().toISOString(),
    statutRetour: "PENDING",
    raisonRetour: "",
    commandeId: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        dateRetour: initialData.dateRetour || new Date().toISOString(),
        statutRetour: initialData.statutRetour || "PENDING",
        raisonRetour: initialData.raisonRetour || "",
        commandeId: initialData.commandeId || "",
      });
    } else {
      setFormData({
        dateRetour: new Date().toISOString(),
        statutRetour: "PENDING",
        raisonRetour: "",
        commandeId: "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier le retour" : "Créer un retour"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateRetour">Date de retour *</Label>
              <Input
                id="dateRetour"
                name="dateRetour"
                type="datetime-local"
                value={formData.dateRetour ? new Date(formData.dateRetour).toISOString().slice(0, 16) : ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statutRetour">Statut *</Label>
              <Select
                value={formData.statutRetour}
                onValueChange={(value) => handleSelectChange("statutRetour", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="COMPLETED">Complété</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="commandeId">ID de commande *</Label>
            <Input
              id="commandeId"
              name="commandeId"
              value={formData.commandeId}
              onChange={handleChange}
              required
              placeholder="ID de la commande"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="raisonRetour">Raison du retour *</Label>
            <textarea
              id="raisonRetour"
              name="raisonRetour"
              value={formData.raisonRetour}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F8A67E]"
              placeholder="Décrivez la raison du retour..."
            />
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
              {initialData ? "Enregistrer les modifications" : "Créer le retour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};