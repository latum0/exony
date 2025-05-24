// components/DeleteConfirmationModal.tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userName?: string;
}

const DeleteConfirmationModal: React.FC<Props> = ({ open, onConfirm, onCancel, userName }) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation de suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l’utilisateur <strong>{userName}</strong> ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} >Annuler</Button>
          <Button variant="destructive" onClick={onConfirm} style={{ background: "#F8A67E" }}>Supprimer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
