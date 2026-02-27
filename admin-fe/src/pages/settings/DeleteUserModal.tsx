import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAuth from "@/contexts/AuthContext";
import useMutation from "@/hooks/useMutation";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/dto";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DeleteUserModalProps = {
  userToDelete: User | null;
  setUserToDelete: (user: User | null) => void;
  isDeleteUserOpen: boolean;
  setIsDeleteUserOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

const DeleteUserModal = ({
  userToDelete,
  setUserToDelete,
  isDeleteUserOpen,
  setIsDeleteUserOpen,
  refetchData,
}: DeleteUserModalProps) => {
  if (!userToDelete) return;
  const { authResponse } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);
  const { execute } = useMutation();

  const onClose = () => {
    setIsDeleteUserOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    if(authResponse?.data.username === userToDelete.username) {
      toast.error("You cannot delete your own account.")
      return;
    }

    setIsDeleting(true);
    try {
      const response: ApiResponse<any> = await execute(
        `users/${userToDelete.id}`,
        {
          method: "DELETE",
        },
      );

      toast.success(response.message);
      await refetchData();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
      <DialogContent className="w-sm" showCloseButton={false}>
        <DialogHeader className="flex mb-5 items-center text-center">
          <div className="text-destructive p-3 rounded-full bg-red-100">
            <TriangleAlert size={28} />
          </div>
          <DialogTitle className="font-bold text-[24px]">
            Delete User?
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-black">{userToDelete.username}</span>? This
            action cannot be undone and all point history will be lost.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-center!">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDelete} variant={"destructive"} type="submit">
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;
