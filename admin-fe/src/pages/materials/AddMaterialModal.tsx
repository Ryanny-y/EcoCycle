import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import useFormHandlers from "@/hooks/useFormHandlers";
import useMutation from "@/hooks/useMutation";
import { Box, Save } from "lucide-react";
import {
  useState,
  type Dispatch,
  type SetStateAction,
  type SubmitEvent,
} from "react";
import { toast } from "sonner";

type FormData = {
  name: string;
  description?: string;
  pointsPerKg: number;
  image: File | null;
};

type AddMaterialItemModal = {
  isAddMaterialModalOpen: boolean;
  setIsAddMaterialModalOpen: Dispatch<SetStateAction<boolean>>;
  refetchData: () => Promise<void>;
};

const AddMaterialModal = ({
  isAddMaterialModalOpen,
  setIsAddMaterialModalOpen,
  refetchData,
}: AddMaterialItemModal) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    pointsPerKg: 1,
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { execute } = useMutation();

  const {
    handleChange,
    handleFileChange,
    handleDrop,
    handleDragOver,
  } = useFormHandlers<FormData>(setFormData, "image");

  const validateForm = (): string | null => {
    if (!formData.name) return "Name is Required";
    if (formData.pointsPerKg <= 0)
      return "Points per kilogram must be greater than 0";
    if (!formData.image) return "Reward image is required";

    return null;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    const formDataToSend = new FormData();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    formDataToSend.append("name", formData.name);
    formDataToSend.append("pointsPerKg", String(formData.pointsPerKg));

    if (formData.description) {
      formDataToSend.append("description", formData.description);
    }
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    setIsSubmitting(true);
    try {
      const response: any = await execute("materials", {
        method: "POST",
        body: formDataToSend,
      });

      refetchData();
      toast.success(response.message);
      setIsAddMaterialModalOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isAddMaterialModalOpen}
      onOpenChange={setIsAddMaterialModalOpen}
    >
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="text-emerald-600 bg-emerald-100 p-2 rounded-lg">
            <Box />
          </div>

          <div>
            <DialogTitle>Add New Reward</DialogTitle>
            <DialogDescription>
              Fill in the details to create a add new reward
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
                Points per kilogram <span className="text-red-500">*</span>
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
                className="border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer h-28 grid items-center hover:border-primary duration-300"
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
                  {formData.image ? (
                    <p className="text-primary font-medium">
                      {formData.image.name}
                    </p>
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
              onClick={() => setIsAddMaterialModalOpen(false)}
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-xl text-base bg-primary/90 grid place-items-center text-white font-semibold duration-300 hover:bg-primary"
              type="submit"
            >
              {isSubmitting ? (
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

export default AddMaterialModal;
