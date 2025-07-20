import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Fournisseur } from "@/hooks/useFournisseurs";
import { Button } from "@/components/ui/button";

interface FournisseurDetailsModalProps {
  open: boolean;
  onClose: () => void;
  fournisseur: Fournisseur | null;
}

export const FournisseurDetailsModal: React.FC<FournisseurDetailsModalProps> = ({
  open,
  onClose,
  fournisseur,
}) => {
  if (!fournisseur) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du fournisseur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Nom:</h3>
            <p>{fournisseur.nom}</p>
          </div>
          <div>
            <h3 className="font-medium">Adresse:</h3>
            <p>{fournisseur.adresse}</p>
          </div>
          <div>
            <h3 className="font-medium">Contact:</h3>
            <p>{fournisseur.contact}</p>
          </div>
          <div>
            <h3 className="font-medium">Téléphone:</h3>
            <p>{fournisseur.telephone}</p>
          </div>
          <div>
            <h3 className="font-medium">Email:</h3>
            <p>{fournisseur.email}</p>
          </div>
          <div>
            <h3 className="font-medium">Date de création:</h3>
            <p>{new Date(fournisseur.createdAt || "").toLocaleDateString()}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};