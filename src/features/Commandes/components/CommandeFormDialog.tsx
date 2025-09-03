"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Trash2, CalendarIcon, Search } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import api from "@/api/axios";

const ligneCommandeSchema = z.object({
  produitId: z.string().min(1, "Le produit est requis"),
  quantite: z.number().min(1, "La quantité doit être au moins 1"),
});

const commandeSchema = z.object({
  dateCommande: z.string().min(1, "La date de commande est requise"),
  statut: z.enum(["EN_ATTENTE", "EN_COURS", "LIVREE", "ANNULEE"]),
  adresseLivraison: z.string().min(1, "L'adresse de livraison est requise"),
  clientId: z
    .number({
      invalid_type_error: "Le client est requis",
      required_error: "Le client est requis",
    })
    .min(1, "Le client est requis"),
  lignes: z
    .array(ligneCommandeSchema)
    .min(1, "Au moins une ligne de commande est requise"),
});

interface Client {
  idClient: number;
  nom: string;
  prenom: string;
  email: string;
  numeroTelephone: string;
}

interface Produit {
  idProduit: string;
  nom: string;
  prix: number;
  stock: number;
}

interface CommandeFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: any | null;
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ligneErrors, setLigneErrors] = useState<
    Record<number, Record<string, string>>
  >({});
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(false);

  const [clientSearch, setClientSearch] = useState("");
  const [produitSearch, setProduitSearch] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [clientPagination, setClientPagination] = useState({
    currentPage: 1,
    hasMore: true,
    loading: false,
  });
  const [produitPagination, setProduitPagination] = useState({
    currentPage: 1,
    hasMore: true,
    loading: false,
  });

  useEffect(() => {
    if (open) {
      fetchClientsAndProduits();
    }
  }, [open]);

  useEffect(() => {
    if (clientSearch.length > 0) {
      setClients([]);
      setClientPagination({ currentPage: 1, hasMore: true, loading: false });
      fetchClients(1, true);
    }
  }, [clientSearch]);

  useEffect(() => {
    if (produitSearch.length > 0) {
      setProduits([]);
      setProduitPagination({ currentPage: 1, hasMore: true, loading: false });
      fetchProduits(1, true);
    }
  }, [produitSearch]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        dateCommande: initialData.dateCommande.slice(0, 16),
        statut: initialData.statut,
        adresseLivraison: initialData.adresseLivraison,
        clientId: initialData.clientId.toString(),
        lignes: initialData.ligne
          ? initialData.ligne.map(
              (l: { produitId: string; quantite: number }) => ({
                produitId: l.produitId,
                quantite: l.quantite,
              })
            )
          : [],
      });
      setSelectedDate(new Date(initialData.dateCommande));
    }
  }, [initialData, open]);

  const fetchClients = async (page = 1, reset = false) => {
    if (clientPagination.loading) return;

    setClientPagination((prev) => ({ ...prev, loading: true }));

    try {
      const response = await api.get(
        `/clients?search=${clientSearch}&page=${page}&perPage=10`
      );

      const clientsData = response.data.data || response.data;
      const newClients = Array.isArray(clientsData) ? clientsData : [];

      setClients((prev) => (reset ? newClients : [...prev, ...newClients]));
      setClientPagination((prev) => ({
        ...prev,
        currentPage: page,
        hasMore: newClients.length === 10,
        loading: false,
      }));
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      setClients([]);
      setClientPagination((prev) => ({
        ...prev,
        loading: false,
        hasMore: false,
      }));
    }
  };

  const fetchProduits = async (page = 1, reset = false) => {
    if (produitPagination.loading) return;

    setProduitPagination((prev) => ({ ...prev, loading: true }));

    try {
      const response = await api.get(
        `/produits?nom=${produitSearch}&page=${page}&limit=10`
      );

      const produitsData = response.data.data || response.data;
      const newProduits = Array.isArray(produitsData) ? produitsData : [];

      setProduits((prev) => (reset ? newProduits : [...prev, ...newProduits]));
      setProduitPagination((prev) => ({
        ...prev,
        currentPage: page,
        hasMore: newProduits.length === 10,
        loading: false,
      }));
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setProduits([]);
      setProduitPagination((prev) => ({
        ...prev,
        loading: false,
        hasMore: false,
      }));
    }
  };

  const fetchClientsAndProduits = async () => {
    setLoading(true);
    try {
      setClientPagination({ currentPage: 1, hasMore: true, loading: false });
      setProduitPagination({ currentPage: 1, hasMore: true, loading: false });

      await Promise.all([fetchClients(1, true), fetchProduits(1, true)]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error("Erreur de chargement", {
        description: "Impossible de charger les clients et produits",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData((prev) => ({
        ...prev,
        dateCommande: date.toISOString().slice(0, 16),
      }));
      setCalendarOpen(false);
      if (errors.dateCommande) {
        setErrors((prev) => ({ ...prev, dateCommande: "" }));
      }
    }
  };

  const addLigne = () => {
    const produitSelectionne = produits.find(
      (p) => p.idProduit === newLigne.produitId
    );

    if (produitSelectionne && newLigne.quantite > produitSelectionne.stock) {
      toast.error("Stock insuffisant", {
        description: `Quantité demandée (${newLigne.quantite}) supérieure au stock disponible (${produitSelectionne.stock})`,
      });
      return;
    }

    const ligneValidation = ligneCommandeSchema.safeParse({
      produitId: newLigne.produitId,
      quantite: newLigne.quantite,
    });

    if (!ligneValidation.success) {
      const newErrors: Record<string, string> = {};
      ligneValidation.error.errors.forEach((error) => {
        newErrors[error.path[0]] = error.message;
      });

      toast.error("Erreur de validation", {
        description:
          "Veuillez corriger les erreurs dans la ligne avant de l'ajouter",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      lignes: [...prev.lignes, newLigne],
    }));
    setNewLigne({ produitId: "", quantite: 1 });
  };

  const removeLigne = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lignes: prev.lignes.filter((_, i) => i !== index),
    }));

    setLigneErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      dateCommande: new Date(formData.dateCommande).toISOString(),
      statut: formData.statut,
      adresseLivraison: formData.adresseLivraison,
      clientId: formData.clientId ? Number.parseInt(formData.clientId) : 0,
      lignes: formData.lignes,
    };

    const validationResult = commandeSchema.safeParse(submitData);

    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      const newLigneErrors: Record<number, Record<string, string>> = {};

      validationResult.error.errors.forEach((error) => {
        const path = error.path.join(".");

        if (path.startsWith("lignes.")) {
          const pathParts = path.split(".");
          const ligneIndex = Number.parseInt(pathParts[1]);
          const fieldName = pathParts[2];

          if (!isNaN(ligneIndex)) {
            if (!newLigneErrors[ligneIndex]) {
              newLigneErrors[ligneIndex] = {};
            }
            newLigneErrors[ligneIndex][fieldName] = error.message;
          }
        } else {
          newErrors[path] = error.message;
        }
      });

      setErrors(newErrors);
      setLigneErrors(newLigneErrors);

      toast.error("Erreur de validation", {
        description: "Veuillez corriger les erreurs dans le formulaire",
      });
      return;
    }

    setErrors({});
    setLigneErrors({});

    try {
      onSubmit(submitData);
      toast.success(initialData ? "Commande modifiée" : "Commande créée");
      if (!initialData) {
        resetForm();
      }
    } catch (error) {
      toast.error("Erreur lors de la soumission");
    }
  };

  const resetForm = () => {
    setFormData({
      dateCommande: new Date().toISOString().slice(0, 16),
      statut: "EN_ATTENTE",
      adresseLivraison: "",
      clientId: "",
      lignes: [],
    });
    setNewLigne({ produitId: "", quantite: 1 });
    setErrors({});
    setLigneErrors({});
    setSelectedDate(new Date());
    setClientSearch("");
    setProduitSearch("");
  };

  const getClientFullName = (client: Client) => {
    return `${client.nom} ${client.prenom} (${client.numeroTelephone})`;
  };

  const getProduitDisplay = (produit: Produit) => {
    return `${produit.nom} - ${produit.stock}`;
  };

  const getStockDisponible = (produitId: string) => {
    const produit = produits.find((p) => p.idProduit === produitId);
    return produit ? produit.stock : 0;
  };

  const handleQuantiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nouvelleQuantite = Number.parseInt(e.target.value) || 1;
    const stockMax = newLigne.produitId
      ? getStockDisponible(newLigne.produitId)
      : 0;

    const quantiteFinale = newLigne.produitId
      ? Math.min(Math.max(1, nouvelleQuantite), stockMax)
      : Math.max(1, nouvelleQuantite);

    setNewLigne((prev) => ({
      ...prev,
      quantite: quantiteFinale,
    }));
  };

  const handleLigneQuantiteChange = (
    index: number,
    nouvelleQuantite: number
  ) => {
    const ligne = formData.lignes[index];
    const stockMax = getStockDisponible(ligne.produitId);

    const quantiteFinale = Math.min(Math.max(1, nouvelleQuantite), stockMax);

    setFormData((prev) => ({
      ...prev,
      lignes: prev.lignes.map((l, i) =>
        i === index ? { ...l, quantite: quantiteFinale } : l
      ),
    }));
  };

  const loadMoreClients = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (clientPagination.hasMore && !clientPagination.loading) {
      await fetchClients(clientPagination.currentPage + 1, false);
    }
  };

  const loadMoreProduits = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (produitPagination.hasMore && !produitPagination.loading) {
      await fetchProduits(produitPagination.currentPage + 1, false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Modifier la commande"
              : "Créer une nouvelle commande"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p>Chargement des données...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4 w-full">
              <div className="w-[60%] space-y-2">
                <Label>Date de commande *</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                        errors.dateCommande && "border-red-500"
                      )}
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateCommande && (
                  <p className="text-sm text-red-500">{errors.dateCommande}</p>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="statut">Statut *</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => handleSelectChange("statut", value)}
                >
                  <SelectTrigger
                    className={errors.statut ? "border-red-500" : ""}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                    <SelectItem value="EN_COURS">En cours</SelectItem>
                    <SelectItem value="LIVREE">Livrée</SelectItem>
                    <SelectItem value="ANNULEE">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                {errors.statut && (
                  <p className="text-sm text-red-500">{errors.statut}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresseLivraison">Adresse de livraison *</Label>
              <Input
                id="adresseLivraison"
                name="adresseLivraison"
                value={formData.adresseLivraison}
                onChange={handleChange}
                placeholder="Adresse complète de livraison"
                className={errors.adresseLivraison ? "border-red-500" : ""}
              />
              {errors.adresseLivraison && (
                <p className="text-sm text-red-500">
                  {errors.adresseLivraison}
                </p>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label>Client *</Label>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un client (nom, prénom)..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    handleSelectChange("clientId", value)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors.clientId && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients
                      .filter(
                        (client) =>
                          clientSearch === "" ||
                          client.nom
                            .toLowerCase()
                            .includes(clientSearch.toLowerCase()) ||
                          client.prenom
                            .toLowerCase()
                            .includes(clientSearch.toLowerCase())
                      )
                      .map((client) => (
                        <SelectItem
                          key={client.idClient}
                          value={client.idClient.toString()}
                        >
                          {getClientFullName(client)}
                        </SelectItem>
                      ))}
                    {clientPagination.hasMore && (
                      <div className="p-2 border-t">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={loadMoreClients}
                          disabled={clientPagination.loading}
                          className="w-full"
                        >
                          {clientPagination.loading
                            ? "Chargement..."
                            : "Charger plus"}
                        </Button>
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {errors.clientId && (
                <p className="text-sm text-red-500">{errors.clientId}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Lignes de commande *</Label>

              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <div className="space-y-">
                    <div className="relative mb-2 w-full">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un produit par nom..."
                        value={produitSearch}
                        onChange={(e) => setProduitSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select
                      value={newLigne.produitId}
                      onValueChange={(value) => {
                        const selectedProduit = produits.find(
                          (p) => p.idProduit === value
                        );
                        if (selectedProduit && selectedProduit.stock > 0) {
                          setNewLigne((prev) => ({
                            ...prev,
                            produitId: value,
                            quantite: 1,
                          }));
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {produits
                          .filter(
                            (produit) =>
                              produitSearch === "" ||
                              produit.nom
                                .toLowerCase()
                                .includes(produitSearch.toLowerCase())
                          )
                          .map((produit) => (
                            <SelectItem
                              key={produit.idProduit}
                              value={produit.idProduit}
                              disabled={produit.stock === 0}
                              className={cn(
                                produit.stock === 0 && "text-red-500 opacity-50"
                              )}
                            >
                              {getProduitDisplay(produit)}
                            </SelectItem>
                          ))}
                        {produitPagination.hasMore && (
                          <div className="p-2 border-t">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={loadMoreProduits}
                              disabled={produitPagination.loading}
                              className="w-full"
                            >
                              {produitPagination.loading
                                ? "Chargement..."
                                : "Charger plus"}
                            </Button>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="w-20">
                  <Input
                    type="number"
                    placeholder="Qté"
                    min="1"
                    max={
                      newLigne.produitId
                        ? getStockDisponible(newLigne.produitId)
                        : undefined
                    }
                    value={newLigne.quantite}
                    onChange={handleQuantiteChange}
                    disabled={!newLigne.produitId}
                    className="text-center number-input-black"
                  />
                </div>

                <Button
                  type="button"
                  onClick={addLigne}
                  size="icon"
                  disabled={!newLigne.produitId}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {newLigne.produitId && (
                <p className="text-xs text-gray-500">
                  Stock disponible: {getStockDisponible(newLigne.produitId)}
                </p>
              )}

              {errors.lignes && (
                <p className="text-sm text-red-500">{errors.lignes}</p>
              )}

              {formData.lignes && formData.lignes.length > 0 && (
                <div className="border rounded-md p-4 space-y-2">
                  {formData.lignes.map((ligne, index) => {
                    const produit = produits.find(
                      (p) => p.idProduit === ligne.produitId
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded gap-4"
                      >
                        <div className="flex-1">
                          <span className="text-sm block">
                            Produit:{" "}
                            {produit ? produit.nom : `ID: ${ligne.produitId}`}
                          </span>
                          <span className="text-xs text-gray-600">
                            Prix unitaire:{" "}
                            {produit ? `${produit.prix}DA` : "N/A"} - Total:{" "}
                            {produit
                              ? `${(produit.prix * ligne.quantite).toFixed(
                                  2
                                )}DA`
                              : "N/A"}
                          </span>
                          {ligneErrors[index]?.produitId && (
                            <p className="text-xs text-red-500">
                              {ligneErrors[index]?.produitId}
                            </p>
                          )}
                          {ligneErrors[index]?.quantite && (
                            <p className="text-xs text-red-500">
                              {ligneErrors[index]?.quantite}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-center">
                            <Label className="text-xs text-gray-500 mb-1">
                              Quantité
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max={produit ? produit.stock : undefined}
                              value={ligne.quantite}
                              onChange={(e) => {
                                const nouvelleQuantite =
                                  Number.parseInt(e.target.value) || 1;
                                handleLigneQuantiteChange(
                                  index,
                                  nouvelleQuantite
                                );
                              }}
                              className="w-16 text-center text-sm number-input-black"
                            />
                            {produit && (
                              <span className="text-xs text-gray-500 mt-1">
                                Max: {produit.stock}
                              </span>
                            )}
                          </div>

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
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" style={{ background: "#F8A67E" }}>
                {initialData
                  ? "Enregistrer les modifications"
                  : "Créer la commande"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
