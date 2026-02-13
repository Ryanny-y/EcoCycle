import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFormHandlers from "@/hooks/useFormHandlers";
import type {
  RewardItemMainCategory,
  RewardItemType,
  RewardItemUnit,
} from "@/types/dto";
import { Box, Save } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

type FormData = {
  name: string;
  description: string;
  itemType: RewardItemType | "";
  mainCategory: RewardItemMainCategory | "";
  subCategory: string;
  stocks: number;
  requiredPoints: number;
  unit: RewardItemUnit;
  farmOrigin?: string;
  image: File | null;
};

type AddRewardItemModal = {
  isAddRewardModalOpen: boolean;
  setIsAddRewardModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AddRewardItemModal = ({
  isAddRewardModalOpen,
  setIsAddRewardModalOpen,
}: AddRewardItemModal) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    itemType: "",
    mainCategory: "",
    subCategory: "",
    stocks: 0,
    requiredPoints: 1,
    unit: "KG",
    farmOrigin: "",
    image: null,
  });

  const {
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleDrop,
    handleDragOver,
  } = useFormHandlers<FormData>(setFormData, "image");

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("itemType", formData.itemType);
    formDataToSend.append("mainCategory", formData.mainCategory);
    formDataToSend.append("subCategory", formData.subCategory);
    formDataToSend.append("stocks", String(formData.stocks));
    formDataToSend.append("requiredPoints", String(formData.requiredPoints));
    formDataToSend.append("unit", formData.unit);

    if (formData.farmOrigin) {
      formDataToSend.append("farmOrigin", formData.farmOrigin);
    }

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

  }

  return (
    <Dialog open={isAddRewardModalOpen} onOpenChange={setIsAddRewardModalOpen}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="text-emerald-600 bg-emerald-100 p-2 rounded-lg">
            <Box />
          </div>

          <div>
            <DialogTitle> Add New Reward</DialogTitle>
            <DialogDescription>
              Fill in the details to create a add new reward
            </DialogDescription>
          </div>
        </DialogHeader>

        <form className="space-y-5">
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
              <Label htmlFor="subCategory">
                Sub Category <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                required
                onChange={handleChange}
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
                  <SelectItem value={"PIECES"}>Pieces</SelectItem>
                  <SelectItem value={"BUNDLES"}>Bundles</SelectItem>
                  <SelectItem value={"SACKS"}>Sacks</SelectItem>
                  <SelectItem value={"POTS"}>Pots</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmOrigin">Farm Origin</Label>
              <Input
                id="farmOrigin"
                name="farmOrigin"
                value={formData.farmOrigin}
                required
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
              onClick={() => setIsAddRewardModalOpen(false)}
            >
              Cancel
            </button>
            <button className="flex-1 py-4 rounded-xl text-base bg-primary/90 items-center flex justify-center text-white gap-2 font-semibold duration-300 hover:bg-primary">
              <Save /> Save Reward
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRewardItemModal;
