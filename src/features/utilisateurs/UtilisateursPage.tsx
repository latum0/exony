import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { UserTable } from "./components/UserTable";
import UserFormDialog from "./components/UserFormDialog";

import { deleteUser, fetchUsers } from "@/hooks/usersHooks";
export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const [isDialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-6 ">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestion des utilisateurs
        </h2>
        <Button
          onClick={() => setDialogOpen(true)}
          style={{ background: "#F8A67E" }}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Ajouter un utilisateur
        </Button>

        <UserFormDialog
          open={isDialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </div>
      <UserTable users={users} loading={loading} />
    </div>
  );
};

export default UsersPage;
