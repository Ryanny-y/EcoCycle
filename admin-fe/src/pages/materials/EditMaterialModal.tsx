import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import useFormHandlers from "@/hooks/useFormHandlers";
import useMutation from "@/hooks/useMutation";
import type { Material } from "@/types/dto";

import { Edit, Save } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

type FormData = {
  id: string;
  name: string;
  description: string | undefined;
  pointsPerKg: number;
  imageFile: File | null;
  imageUrl: string;
};

type EditMaterialModalProps = {
  materialToEdit: Material | null;
  setMaterialToEdit: (record: Material | null) => void;
  isEditMaterialOpen: boolean;
  setIsEditMaterialOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

const EditMaterialModal = ({
  materialToEdit,
  setMaterialToEdit,
  isEditMaterialOpen,
  setIsEditMaterialOpen,
  refetchData,
}: EditMaterialModalProps) => {
  if (!materialToEdit) return;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

  const [formData, setFormData] = useState<FormData>({
    id: materialToEdit.id,
    name: materialToEdit.name,
    description: materialToEdit?.description,
    pointsPerKg: materialToEdit.pointsPerKg,
    imageFile: null,
    imageUrl: materialToEdit.imageUrl,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const { execute } = useMutation();

  const {
    handleChange,
    handleFileChange,
    handleDrop,
    handleDragOver,
  } = useFormHandlers<FormData>(setFormData, "imageFile");

  // TODO: Make it Reusable
  const validateForm = (): string | null => {
    if (!formData.name) return "Name is Required";
    if (!formData.pointsPerKg) return "Item Type is Required";

    return null;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(isUpdating) return;
    const formDataToSend = new FormData();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    formDataToSend.append("name", formData.name);
    formDataToSend.append("pointsPerKg", String(formData.pointsPerKg));

    if(formData.description) {
      formDataToSend.append("description", formData.description);
    }
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }


    setIsUpdating(true);
    try {
      const response: any = await execute(`materials/${formData.id}`, {
        method: "PATCH",
        body: formDataToSend
      });

      refetchData();
      toast.success(response.message);
      setIsEditMaterialOpen(false);
      setMaterialToEdit(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Dialog open={isEditMaterialOpen} onOpenChange={setIsEditMaterialOpen}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="text-emerald-600 bg-emerald-100 p-2 rounded-lg">
            <Edit />
          </div>

          <div>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription>
              Fill in the details to create a add new Material
            </DialogDescription>
          </div>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Eco Rug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointsPerKg">
                Points per Kilogram <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pointsPerKg"
                name="pointsPerKg"
                type="number"
                min={0}
                value={formData.pointsPerKg}
                required
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a brief detail about the item"
              />
            </div>

            {/* FILE UPLOAD */}
            <div className="space-y-2 col-span-2">
              <Label>
                Upload Image <span className="text-red-500">*</span>
              </Label>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary duration-300"
              >
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileUpload"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] || null)
                  }
                />

                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer block p-5"
                >
                  {formData.imageFile ? (
                    <div className="space-y-2">
                      <img
                        src={URL.createObjectURL(formData.imageFile)}
                        alt="Preview"
                        className="mx-auto max-h-20 rounded-lg object-contain"
                      />
                      <p className="text-primary font-medium">
                        {formData.imageFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Click or drag to replace image
                      </p>
                    </div>
                  ) : formData.imageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={`${STORAGE_URL}/${formData.imageUrl}`}
                        alt="Current"
                        className="mx-auto max-h-20 rounded-lg object-contain"
                      />
                      <p className="text-sm text-gray-500">
                        Current image — click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Drag & drop an image here, or click to select a file
                    </p>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              className="flex-1 py-6 text-base rounded-xl font-semibold text-muted-foreground hover:text-foreground duration-300"
              type="button"
              onClick={() => setIsEditMaterialOpen(false)}
            >
              Cancel
            </button>
            <button
              disabled={isUpdating}
              className="flex-1 py-4 rounded-xl text-base bg-primary/90 grid place-items-center text-white font-semibold duration-300 hover:bg-primary"
              type="submit"
            >
              {isUpdating ? (
                <Spinner />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save /> Save Material
                </span>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMaterialModal;
