// src/pages/commandes/CommandesPage.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusCircleIcon,
  ShoppingCartIcon,
  PencilIcon,
  TrashIcon,
  Eye,
  Undo2, // Ajout de l'icône de retour
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import {
  useCommandes,
  type CommandeResponseDto,
  type CreateCommandeDto,
  type UpdateCommandeDto,
} from "@/hooks/useCommandes";
import { useRetour, type RetourInput } from "@/hooks/useRetour";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CommandeFormDialog } from "./components/CommandeFormDialog";
import { RetourFormDialog } from "../retours/components/RetourFormDialog";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { CommandeDetailsModal } from "./components/CommandeDetailsModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CommandesPage = () => {
  const {
    commandes = [],
    commande,

    loading,
    error,
    getCommandes,
    getCommande,
    createCommande,
    updateCommande,
    deleteCommande,
    resetCommande,
  } = useCommandes();

  // Hook pour gérer les retours
  const { createRetour } = useRetour();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedCommande, setSelectedCommande] =
    useState<CommandeResponseDto | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commandeToDelete, setCommandeToDelete] =
    useState<CommandeResponseDto | null>(null);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // États pour gérer le retour
  const [isRetourDialogOpen, setRetourDialogOpen] = useState(false);
  const [commandeForRetour, setCommandeForRetour] =
    useState<CommandeResponseDto | null>(null);

  const [filters, setFilters] = useState({
    statut: "",

    minTotal: "",
    maxTotal: "",
  });

  const filteredCommandes = Array.isArray(commandes)
    ? commandes.filter((c) => {
        const matchesGlobal =
          c.idCommande?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          c.adresseLivraison
            ?.toLowerCase()
            .includes(globalFilter.toLowerCase()) ||
          c.montantTotal?.includes(globalFilter) ||
          c.clientId?.toString().includes(globalFilter);

        const matchesStatut = filters.statut
          ? c.statut === filters.statut
          : true;

        const matchesMinTotal = filters.minTotal
          ? parseFloat(c.montantTotal) >= parseFloat(filters.minTotal)
          : true;
        const matchesMaxTotal = filters.maxTotal
          ? parseFloat(c.montantTotal) <= parseFloat(filters.maxTotal)
          : true;

        return (
          matchesGlobal && matchesStatut && matchesMinTotal && matchesMaxTotal
        );
      })
    : [];

  const pageCount = Math.ceil(filteredCommandes.length / pagination.pageSize);
  const paginatedCommandes = filteredCommandes.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  const handleGetCommandes = async () => {
    try {
      await getCommandes({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        statut: filters.statut || undefined,

        minTotal: filters.minTotal ? parseFloat(filters.minTotal) : undefined,
        maxTotal: filters.maxTotal ? parseFloat(filters.maxTotal) : undefined,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    }
  };

  useEffect(() => {
    handleGetCommandes();
  }, [pagination.pageIndex, pagination.pageSize, filters]);

  const handleCreateCommande = async (data: CreateCommandeDto) => {
    await createCommande(data);
    setDialogOpen(false);
    handleGetCommandes();
  };

  const handleUpdateCommande = async (data: UpdateCommandeDto) => {
    if (selectedCommande) {
      await updateCommande(selectedCommande.idCommande, data);
      setDialogOpen(false);
      setSelectedCommande(null);
      handleGetCommandes();
    }
  };

  // Fonction pour créer un retour à partir d'une commande
  const handleCreateRetour = async (data: RetourInput) => {
    if (commandeForRetour) {
      try {
        await createRetour({
          ...data,
          commandeId: commandeForRetour.idCommande,
        });
        setRetourDialogOpen(false);
        setCommandeForRetour(null);
        // Vous pourriez ajouter une notification de succès ici
      } catch (error) {
        console.error("Erreur lors de la création du retour:", error);
        // Vous pourriez ajouter une notification d'erreur ici
      }
    }
  };

  const handleViewDetails = async (idCommande: string) => {
    try {
      await getCommande(idCommande);
      setViewDialogOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    }
  };

  const handleDeleteClick = (commande: CommandeResponseDto) => {
    setCommandeToDelete(commande);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (commandeToDelete) {
      await deleteCommande(commandeToDelete.idCommande);
      setDeleteDialogOpen(false);
      setCommandeToDelete(null);
      handleGetCommandes();
    }
  };

  const handleEdit = (commande: CommandeResponseDto) => {
    setSelectedCommande(commande);
    setDialogOpen(true);
  };

  // Fonction pour ouvrir le formulaire de retour
  const handleAddRetour = (commande: CommandeResponseDto) => {
    setCommandeForRetour(commande);
    setRetourDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statutOptions = [
    { value: "EN_ATTENTE", label: "En attente" },
    { value: "EN_COURS", label: "En cours" },
    { value: "LIVREE", label: "Livrée" },
    { value: "ANNULEE", label: "Annulée" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[27px] font-bold gap-x-2 flex items-center text-[#F8A67E]">
          <ShoppingCartIcon size={28} /> Gestion des commandes
        </h2>
        <Button
          onClick={() => {
            setSelectedCommande(null);
            setDialogOpen(true);
          }}
          style={{ background: "#F8A67E", borderRadius: "8px" }}
          className="h-9"
        >
          <PlusCircleIcon className="w-4 h-4 mr-[3px]" />
          Nouvelle commande
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="w-full">
        <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
          <h3 className="font-semibold mb-3 text-gray-700">Filtres avancés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Recherche globale */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Recherche
              </label>
              <Search className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ID, adresse, montant, client..."
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="pl-10 border-gray-300 bg-white/50"
              />
            </div>

            {/* Statut */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Statut
              </label>
              <Select
                value={filters.statut}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, statut: value }));
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
              >
                <SelectTrigger className="w-full border-gray-300 bg-white/50">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statutOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Montant min */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Montant min
              </label>
              <Input
                placeholder="Min"
                value={filters.minTotal}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, minTotal: e.target.value }));
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="border-gray-300 bg-white/50"
              />
            </div>

            {/* Montant max */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Montant max
              </label>
              <Input
                placeholder="Max"
                value={filters.maxTotal}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, maxTotal: e.target.value }));
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="border-gray-300 bg-white/50"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border  overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Réference
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Date
                  </TableHead>

                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Num Client
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Montant Total
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Statut
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-lg text-gray-400 italic"
                    >
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : paginatedCommandes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-gray-500"
                    >
                      {globalFilter || filters.statut
                        ? "Aucun résultat trouvé"
                        : "Aucune commande enregistrée"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCommandes.map((c, index) => (
                    <TableRow
                      key={c.idCommande}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }
                    >
                      <TableCell className="py-3 px-4 whitespace-nowrap text-sm">
                        {c.idCommande.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {formatDate(c.dateCommande)}
                      </TableCell>

                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {c.client}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap font-medium">
                        {parseFloat(c.montantTotal).toFixed(2)} DA
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold tracking-wide ${
                            c.statut === "EN_ATTENTE"
                              ? "bg-orange-100 text-orange-600 border-orange-400"
                              : c.statut === "EN_COURS"
                              ? "bg-blue-100 text-blue-600 border-blue-400"
                              : c.statut === "LIVREE"
                              ? "bg-green-100 text-green-600 border-green-400"
                              : "bg-red-100 text-red-600 border-red-400"
                          }`}
                        >
                          {statutOptions.find((s) => s.value === c.statut)
                            ?.label || c.statut}
                        </span>
                      </TableCell>

                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-600/90"
                            onClick={() => handleEdit(c)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#2c97f5] hover:text-[#2c97f5]"
                            onClick={() => handleViewDetails(c.idCommande)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!c.retour && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-500 border "
                              onClick={() => handleAddRetour(c)}
                            >
                              <Undo2 className="h-4 w-4 text-purple-500 " />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-500"
                            onClick={() => handleDeleteClick(c)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {filteredCommandes.length} commande(s) trouvée(s)
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-1">
              <p className="text-sm font-medium">Lignes par page</p>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={(value) => {
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(value),
                    pageIndex: 0,
                  }));
                }}
              >
                <SelectTrigger className="h-8 w-fit">
                  <SelectValue className="text-sm mr-1" />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 25, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} sur {pageCount}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="size-8 bg-transparent hover:bg-gray-100"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.max(prev.pageIndex - 1, 0),
                  }))
                }
                disabled={pagination.pageIndex === 0}
              >
                <span className="sr-only">Aller à la page précédente</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 bg-transparent hover:bg-gray-100"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.min(prev.pageIndex + 1, pageCount - 1),
                  }))
                }
                disabled={pagination.pageIndex >= pageCount - 1}
              >
                <span className="sr-only">Aller à la page suivante</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CommandeFormDialog
        open={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedCommande(null);
        }}
        initialData={selectedCommande}
        onSubmit={
          selectedCommande ? handleUpdateCommande : handleCreateCommande
        }
      />

      {/* Dialogue pour créer un retour */}
      <RetourFormDialog
        open={isRetourDialogOpen}
        onClose={() => {
          setRetourDialogOpen(false);
          setCommandeForRetour(null);
        }}
        initialData={
          commandeForRetour
            ? ({
                commandeId: commandeForRetour.idCommande,
                dateRetour: new Date().toISOString().slice(0, 16),
                statutRetour: "PENDING",
                raisonRetour: "",
              } as any)
            : null
        }
        onSubmit={handleCreateRetour}
      />

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        itemName={
          commandeToDelete?.idCommande
            ? `la commande ${commandeToDelete.idCommande.slice(0, 8)}...`
            : "cette commande"
        }
      />

      <CommandeDetailsModal
        open={isViewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          resetCommande();
        }}
        commande={commande}
      />
    </div>
  );
};

export default CommandesPage;
