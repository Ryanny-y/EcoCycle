import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import useRewardItems from "@/contexts/RewardItemsContext";
import useFormHandlers from "@/hooks/useFormHandlers";
import useMutation from "@/hooks/useMutation";
import type {
  RewardItem,
  RewardItemMainCategory,
  RewardItemType,
  RewardItemUnit,
} from "@/types/dto";
import { Edit, Save } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

type FormData = {
  id: string;
  name: string;
  description: string | undefined;
  itemType: RewardItemType | "";
  mainCategory: RewardItemMainCategory | "";
  subCategory: string;
  stocks: number;
  requiredPoints: number;
  unit: RewardItemUnit;
  farmOrigin?: string;
  imageFile: File | null;
  imageUrl: string;
};

type EditRewardItemModalProps = {
  rewardToEdit: RewardItem | null;
  setRewardToEdit: (record: RewardItem | null) => void;
  isEditRewardOpen: boolean;
  setIsEditRewardOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

const EditRewardItemModal = ({
  rewardToEdit,
  setRewardToEdit,
  isEditRewardOpen,
  setIsEditRewardOpen,
  refetchData,
}: EditRewardItemModalProps) => {
  if (!rewardToEdit) return;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

  const [formData, setFormData] = useState<FormData>({
    id: rewardToEdit.id,
    name: rewardToEdit.name,
    description: rewardToEdit?.description,
    itemType: rewardToEdit.itemType,
    mainCategory: rewardToEdit.mainCategory,
    subCategory: rewardToEdit?.subCategory,
    stocks: rewardToEdit.stocks,
    requiredPoints: rewardToEdit.requiredPoints,
    unit: rewardToEdit.unit,
    farmOrigin: rewardToEdit.farmOrigin,
    imageFile: null,
    imageUrl: rewardToEdit.imageUrl,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const { execute } = useMutation();

  const {
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleDrop,
    handleDragOver,
  } = useFormHandlers<FormData>(setFormData, "imageFile");


  // TODO: Make it Reusable
  const validateForm = (): string | null => {
    if (!formData.name) return "Name is Required";
    if (!formData.itemType) return "Item Type is Required";
    if (!formData.mainCategory) return "Main Category is Required";
    if (!formData.stocks) return "Stocks is Required";
    if (!formData.requiredPoints) return "Required Points is Required";
    if (!formData.unit) return "Unit is Required";

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
    formDataToSend.append("itemType", formData.itemType);
    formDataToSend.append("mainCategory", formData.mainCategory);
    formDataToSend.append("subCategory", formData.subCategory);
    formDataToSend.append("stocks", String(formData.stocks));
    formDataToSend.append("requiredPoints", String(formData.requiredPoints));
    formDataToSend.append("unit", formData.unit);

    if(formData.description) {
      formDataToSend.append("description", formData.description);
    }
    if (formData.farmOrigin) {
      formDataToSend.append("farmOrigin", formData.farmOrigin);
    }
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }


    setIsUpdating(true);
    try {
      const response: any = await execute(`exchange-items/${formData.id}`, {
        method: "PATCH",
        body: formDataToSend
      });

      refetchData();
      toast.success(response.message);
      setIsEditRewardOpen(false);
      setRewardToEdit(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Dialog open={isEditRewardOpen} onOpenChange={setIsEditRewardOpen}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="text-emerald-600 bg-emerald-100 p-2 rounded-lg">
            <Edit />
          </div>

          <div>
            <DialogTitle>Edit Reward</DialogTitle>
            <DialogDescription>
              Fill in the details to create a add new reward
            </DialogDescription>
          </div>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
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

            <div className="space-y-2">
              <Label>
                Item Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.itemType}
                onValueChange={(value: RewardItemType) =>
                  handleSelectChange("itemType", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Item Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"PRODUCT"}>Product</SelectItem>
                  <SelectItem value={"FARM"}>Farm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Main Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.mainCategory}
                onValueChange={(value: RewardItemMainCategory) =>
                  handleSelectChange("mainCategory", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Main Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"AGRICULTURAL"}>Agricultural</SelectItem>
                  <SelectItem value={"NON_AGRICULTURAL"}>
                    Non-Agricultural
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="subCategory">Sub Category</Label>
              <Textarea
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="resize-none"
                placeholder="Provide a sub category for the item"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stocks">
                Initial Stock <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stocks"
                name="stocks"
                type="number"
                min={0}
                value={formData.stocks}
                required
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredPoints">
                Required Points <span className="text-red-500">*</span>
              </Label>
              <Input
                id="requiredPoints"
                name="requiredPoints"
                type="number"
                min={0}
                value={formData.requiredPoints}
                required
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Unit <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.unit}
                onValueChange={(value: RewardItemUnit) =>
                  handleSelectChange("unit", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"KG"}>Kilogram</SelectItem>
                  <SelectItem value={"PIECE"}>Piece</SelectItem>
                  <SelectItem value={"BUNDLE"}>Bundle</SelectItem>
                  <SelectItem value={"SACK"}>Sack</SelectItem>
                  <SelectItem value={"POT"}>Pot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmOrigin">Farm Origin</Label>
              <Input
                id="farmOrigin"
                name="farmOrigin"
                value={formData.farmOrigin ?? ""}
                onChange={handleChange}
                placeholder="Farm Origin"
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
                        className="mx-auto max-h-48 rounded-lg object-contain"
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
              onClick={() => setIsEditRewardOpen(false)}
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
                  <Save /> Save Reward
                </span>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRewardItemModal;
