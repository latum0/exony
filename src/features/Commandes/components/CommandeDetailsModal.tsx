"use client";

// src/pages/commandes/components/CommandeDetailsModal.tsx
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Calendar,
  MapPin,
  User,
  CreditCard,
  Package,
  Hash,
  FileText,
} from "lucide-react";
import type { CommandeResponseDto } from "@/hooks/useCommandes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { BASE_URL } from "@/constants/config";

interface CommandeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  commande: CommandeResponseDto | null;
}

export const CommandeDetailsModal: React.FC<CommandeDetailsModalProps> = ({
  open,
  onClose,
  commande,
}) => {
  if (!commande) return null;
  console.log(commande);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "EN_ATTENTE":
        return "En attente";
      case "EN_COURS":
        return "En cours";
      case "LIVREE":
        return "Livrée";
      case "ANNULEE":
        return "Annulée";
      default:
        return statut;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[81vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-slate-100/50">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-[#F8A67E]/10 rounded-lg">
              <FileText className="h-5 w-5 text-[#F8A67E]" />
            </div>
            Détails de la commande
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(81vh-120px)]">
          <div className="p-6 py-3 space-y-8">
            <div className="grid grid-cols-1  gap-6">
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center  gap-2 text-sm text-muted-foreground mb-2">
                  <Hash className="h-4 w-4" />
                  <span>Référence de la Commande</span>
                </div>
                <p className="text-base font-mono font-semibold text-gray-800">
                  {commande.idCommande}
                </p>
              </div>

              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date de commande</span>
                </div>
                <p className="text-base font-medium">
                  {formatDate(commande.dateCommande)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Package className="h-4 w-4" />
                  <span>Statut</span>
                </div>
                <span
                  className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold tracking-wide ${
                    commande.statut === "EN_ATTENTE"
                      ? "bg-orange-100 text-orange-600 border-orange-400"
                      : commande.statut === "EN_COURS"
                      ? "bg-blue-100 text-blue-600 border-blue-400"
                      : commande.statut === "LIVREE"
                      ? "bg-green-100 text-green-600 border-green-400"
                      : "bg-red-100 text-red-600 border-red-400"
                  }`}
                >
                  {getStatutLabel(commande.statut)}
                </span>
              </div>

              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  <span>Client </span>
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {commande.client}
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span>Adresse de livraison</span>
              </div>
              <div className="bg-slate-50 border rounded-md p-4">
                <p className="text-base leading-relaxed">
                  {commande.adresseLivraison}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                <CreditCard className="h-4 w-4" />
                <span>Montant total</span>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {Number.parseFloat(commande.montantTotal).toFixed(2)}
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Lignes de commande
              </h4>
              <div className="space-y-3">
                {commande?.ligne?.map((ligne, index) => (
                  <div
                    key={ligne.idLigne}
                    className="bg-slate-50 border rounded-lg p-4 hover:bg-slate-100 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Produit
                        </span>
                        <p className="font-semibold ">
                          <Link
                            to={`${BASE_URL}/produits/${ligne.produitId}`}
                            className=" hover:underline font-semibold text-black"
                          >
                            {ligne.produit}
                          </Link>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Quantité
                        </span>
                        <p className="font-semibold">{ligne.quantite}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Prix unitaire
                        </span>
                        <p className="font-semibold text-green-600">
                          {Number.parseFloat(ligne.prixUnitaire).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 p-6 border-t bg-slate-50">
          <Button onClick={onClose} className="px-6">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
