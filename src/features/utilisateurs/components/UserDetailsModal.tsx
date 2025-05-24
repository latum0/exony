// UserDetailsModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  permissions: string[];
}

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
}: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de l'utilisateur</DialogTitle>
          <DialogDescription>Voici les informations complètes de l'utilisateur.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p><strong>Nom :</strong> {user.name}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Téléphone :</strong> {user.phone}</p>
          <p><strong>Permissions :</strong> {user.permissions.join(", ")}</p>
        </div>

        <DialogFooter>
          <Button onClick={onClose} style={{ background: "#F8A67E" }}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
