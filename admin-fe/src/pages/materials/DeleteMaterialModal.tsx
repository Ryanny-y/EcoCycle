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
import { Spinner } from "@/components/ui/spinner";
import useMutation from "@/hooks/useMutation";
import type { ApiResponse } from "@/types/api";
import type { Material } from "@/types/dto";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DeleteMaterialProps = {
  materialToDelete: Material | null;
  setMaterialToDelete: (material: Material | null) => void;
  isDeleteMaterialOpen: boolean;
  setIsDeleteMaterialOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

const DeleteMaterialModal = ({
  materialToDelete,
  setMaterialToDelete,
  isDeleteMaterialOpen,
  setIsDeleteMaterialOpen,
  refetchData,
}: DeleteMaterialProps) => {
  if (!materialToDelete) return null;

  const [isDeleting, setIsDeleting] = useState(false);
  const { execute } = useMutation();

  const onClose = () => {
    setIsDeleteMaterialOpen(false);
    setMaterialToDelete(null);
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response: ApiResponse<any> = await execute(
        `materials/${materialToDelete.id}`,
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
    <Dialog open={isDeleteMaterialOpen} onOpenChange={setIsDeleteMaterialOpen}>
      <DialogContent className="w-sm" showCloseButton={false}>
        <DialogHeader className="flex mb-5 items-center text-center">
          <div className="text-destructive p-3 rounded-full bg-red-100">
            <TriangleAlert size={28} />
          </div>
          <DialogTitle className="font-bold text-[24px]">
            Delete Material?
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-black">
              {materialToDelete.name}
            </span>
            ? This action cannot be undone and all point history will be lost.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-center!">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDelete} variant={"destructive"} type="submit">
            {isDeleting ? (
              <>
                <Spinner /> Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMaterialModal;
