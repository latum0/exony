import { PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { deleteUser } from "@/hooks/usersHooks";
import UserFormDialog from "./UserFormDialog";
import UserDetailsModal from "./UserDetailsModal";
import { Eye } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { getUserById } from "@/hooks/usersHooks";
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  permissions: string[];
}

interface UserTableProps {
  users: User[];
  loading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ users, loading }) => {
  const dispatch = useAppDispatch();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // 👈 ajouter ça
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [detailedUser, setDetailedUser] = useState<User | null>(null);

  const handleViewDetails = async (id: number) => {
    try {
      const actionResult = await dispatch(getUserById(id));
      if (getUserById.fulfilled.match(actionResult)) {
        setDetailedUser(actionResult.payload);
        setViewDialogOpen(true);
      } else {
        console.error("Erreur lors de la récupération utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de l'affichage du détail :", error);
    }
  };
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  const handleEdit = (user: User) => {
    setSelectedUser(user); // 👈 définir l'utilisateur à modifier
    setDialogOpen(true); // 👈 ouvrir le dialogue
  };

  return (
    <div className="   overflow-x-auto rounded-lg shadow-lg bg-white border border-gray-200">
      <Table
        className="  max-w-full divide-y divide-gray-200  "
        style={{ maxWidth: 100 }}
      >
        {/* <TableCaption className="text-gray-500 text-sm mt-2">
          Liste des utilisateurs
        </TableCaption> */}

        <TableHeader>
          <TableRow className="bg-gradient-to-r from-orange-50 via-orange-50 to-orange-50 text-white select-none">
            <TableHead className="px-6 py-3 font-semibold tracking-wide text-left">
              Nom
            </TableHead>
            <TableHead className="px-6 py-3 font-semibold tracking-wide text-left">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 font-semibold tracking-wide text-left">
              Téléphone
            </TableHead>
            <TableHead className="px-6 py-3 font-semibold tracking-wide text-left">
              Permissions
            </TableHead>
            <TableHead className="px-6 py-3 font-semibold tracking-wide text-left">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100">
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-10 text-lg text-gray-400 italic"
              >
                Chargement...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-10 text-lg text-gray-400 italic"
              >
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
              >
                <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {user.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {user.email}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {user.phone}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm italic">
                  {user.permissions.join(", ")}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap flex gap-3 justify-start">
                  {/* <UserFormDialog mode="edit" user={user}>
                   */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-orange-600 hover:bg-indigo-100 transition"
                    onClick={() => handleEdit(user)} 
                  >
                    <PencilIcon className="w-4 h-4" />
                    
                  </Button>
                  <UserFormDialog
                    open={isDialogOpen}
                    onClose={() => {
                      setDialogOpen(false);
                      setSelectedUser(null); 
                    }}
                    initialData={selectedUser}
                  />
                   <Button
  type="button" // ✅ empêche la soumission du formulaire
  variant="outline"
  size="sm"
  className="flex items-center gap-1 text-orange-600 hover:bg-indigo-100 transition"
  onClick={() => handleViewDetails(user.id)}
>
  <Eye className="w-4 h-4" />
</Button>
                  {/* </UserFormDialog> */}
                  <Button
                    style={{ background: "#F8A67E" }}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <TrashIcon className="w-4 h-4" />
                   
                  </Button>
                
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        userName={userToDelete?.name}
      />
    <UserDetailsModal
  user={detailedUser}
  isOpen={!!detailedUser}
  onClose={() => setDetailedUser(null)}
/>
    </div>
  );
};
