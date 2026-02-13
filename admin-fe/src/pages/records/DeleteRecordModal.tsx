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
import useMutation from "@/hooks/useMutation";
import type { ApiResponse } from "@/types/api";
import type { RecordInterface } from "@/types/dto";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DeleteRecordModalProps = {
  recordToDelete: RecordInterface | null;
  setRecordToDelete: (record: RecordInterface | null) => void;
  isDeleteRecordOpen: boolean;
  setIsDeleteRecordOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

const DeleteRecordModal = ({
  recordToDelete,
  setRecordToDelete,
  isDeleteRecordOpen,
  setIsDeleteRecordOpen,
  refetchData,
}: DeleteRecordModalProps) => {
  if (!recordToDelete) return;
  const [isDeleting, setIsDeleting] = useState(false);
  const { execute } = useMutation();

  const fullName = `${recordToDelete.lastName[0].concat(recordToDelete.lastName.slice(1).toLowerCase())}, ${recordToDelete.firstName[0].concat(recordToDelete.firstName.slice(1).toLowerCase())}`;

  const onClose = () => {
    setIsDeleteRecordOpen(false);
    setRecordToDelete(null);
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response: ApiResponse<any> = await execute(
        `records/${recordToDelete.id}`,
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
    <Dialog open={isDeleteRecordOpen} onOpenChange={setIsDeleteRecordOpen}>
      <DialogContent className="w-sm" showCloseButton={false}>
        <DialogHeader className="flex mb-5 items-center text-center">
          <div className="text-destructive p-3 rounded-full bg-red-100">
            <TriangleAlert size={28} />
          </div>
          <DialogTitle className="font-bold text-[24px]">
            Delete Record?
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-black">{fullName}</span>? This
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

export default DeleteRecordModal;
