"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { Button } from "@/components/ui/button";
import { CogIcon, Loader2, PlusCircleIcon, SearchIcon } from "lucide-react";
import UserFormDialog from "@/components/clients/add-form";
import {
  addToBlacklist,
  deleteClient,
  fetchClients,
} from "@/hooks/clients-hook";
import { DataTable } from "@/components/clients/data-table";
import { getClientColumns, type Client } from "@/components/clients/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { clients, loading } = useAppSelector((state) => state.clients);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);

  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);
  const [blacklistingClientId, setBlacklistingClientId] = useState<
    number | null
  >(null);

  useEffect(() => {
    dispatch(fetchClients({ page, perPage, search }));
  }, [dispatch, page, perPage, search]);

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClient = (id: number) => {
    setDeletingClientId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleBlacklistClient = (id: number) => {
    setBlacklistingClientId(id);
    setIsBlacklistDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (deletingClientId === null) return;

    try {
      await dispatch(deleteClient(deletingClientId)).unwrap();
      toast.success("Client supprimé avec succès !");
      dispatch(fetchClients({ page, perPage, search }));
    } catch (error) {
      toast.error("Erreur lors de la suppression du client");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingClientId(null);
    }
  };

  const confirmBlacklistClient = async () => {
    if (blacklistingClientId === null) return;

    try {
      await dispatch(addToBlacklist(blacklistingClientId)).unwrap();
      toast.success("Client ajouté à la blacklist !");
      dispatch(fetchClients({ page, perPage, search }));
    } catch (error) {
      toast.error("Erreur lors de l'ajout à la blacklist");
    } finally {
      setIsBlacklistDialogOpen(false);
      setBlacklistingClientId(null);
    }
  };

  const handleFormSuccess = () => {
    dispatch(fetchClients({ page, perPage, search }));
  };

  const columns = getClientColumns({
    onEdit: handleEditClient,
    onDelete: handleDeleteClient,
    onBlacklist: handleBlacklistClient,
  });

  return (
    <div className="py-6 px-2">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-[27px] font-bold gap-x-2 flex items-center text-[#F8A67E]">
          <CogIcon size={28} /> Gestion des Clients
        </h2>
        <Button
          onClick={() => setAddDialogOpen(true)}
          style={{ background: "#F8A67E", borderRadius: "8px" }}
        >
          <PlusCircleIcon className="w-4 h-4 mr-0.5" />
          Ajouter un client
        </Button>
      </div>

      <div className="relative w-full max-w-sm mb-7">
        <Input
          type="text"
          placeholder="Rechercher un client..."
          className="pl-10 bg-neutral-50 h-10"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <SearchIcon className="text-gray-500" />
      </div> */}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="size-12 animate-spin text-[#F8A67E]" />
        </div>
      ) : (
        <DataTable columns={columns} data={clients} />
      )}

      {/* Dialogs */}
      <UserFormDialog
        open={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleFormSuccess}
      />

      <UserFormDialog
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingClient(null);
        }}
        initialData={editingClient}
        onSuccess={handleFormSuccess}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteClient}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isBlacklistDialogOpen}
        onOpenChange={setIsBlacklistDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'ajout à la blacklist</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir ajouter ce client à la blacklist ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBlacklistDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="default"
              onClick={confirmBlacklistClient}
              style={{ background: "#F8A67E" }}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
