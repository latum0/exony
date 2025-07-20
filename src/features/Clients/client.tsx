import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";

import { Button } from "@/components/ui/button";
import { CogIcon, Loader2, PlusCircleIcon } from "lucide-react";

import UserFormDialog from "@/components/clients/add-form";
import { fetchClients } from "@/hooks/clients-hook";
import { DataTable } from "@/components/clients/data-table";
import { getClientColumns, type Client } from "@/components/clients/columns";
export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { clients, loading } = useAppSelector((state) => state.clients);

  const handleEditClient = (client: Client) => {};

  const handleDeleteClient = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      dispatch(fetchClients());
    }
  };
  const [isDialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);
  const columns = getClientColumns({
    onEdit: handleEditClient,
    onDelete: handleDeleteClient,
  });

  return (
    <div className="py-6 px-2">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-2xl font-bold gap-x-2  flex items-center text-[#F8A67E]">
          <CogIcon size={28} /> Gestion des Clients
        </h2>
        <Button
          onClick={() => setDialogOpen(true)}
          style={{ background: "#F8A67E", borderRadius: "8px" }}
        >
          <PlusCircleIcon className="w-4 h-4 mr-[3px]" />
          Ajouter
        </Button>

        <UserFormDialog
          open={isDialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="size-12 animate-spin text-[#F8A67E]" />
        </div>
      ) : (
        <DataTable columns={columns} data={clients} />
      )}
    </div>
  );
};

export default UsersPage;
