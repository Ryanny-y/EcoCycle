import { useEffect, useState, type SubmitEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/api";
import useMutation from "@/hooks/useMutation";
import type { Gender, RecordInterface, RecordRole } from "@/types/dto";
import { areaSubdivisions } from "./CONSTANT";
import useFormHandlers from "@/hooks/useFormHandlers";

type FormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  birthDate?: string;
  role: RecordRole;
  gender: Gender;
  contactNumber: string;
  isResident: boolean;
  area: number;
  subdivision: string;
};

type EditRecordModalProps = {
  recordToEdit: RecordInterface | null;
  setRecordToEdit: (record: RecordInterface | null) => void;
  isEditRecordOpen: boolean;
  setIsEditRecordOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

const EditRecordModal = ({
  recordToEdit,
  setRecordToEdit,
  isEditRecordOpen,
  setIsEditRecordOpen,
  refetchData,
}: EditRecordModalProps) => {
  if (!recordToEdit) return;


  
  const [isUpdating, setIsUpdating] = useState(false);
  const { execute } = useMutation();

  const [formData, setFormData] = useState<FormData>({
    firstName: recordToEdit.firstName,
    lastName: recordToEdit.lastName,
    middleName: recordToEdit.middleName,
    suffix: recordToEdit.suffix,
    gender: recordToEdit.gender,
    birthDate: recordToEdit.birthDate ?? "",
    role: recordToEdit.role,
    contactNumber: recordToEdit.contactNumber,
    isResident: recordToEdit.isResident,
    area: recordToEdit.area,
    subdivision: recordToEdit.subdivision,
  });

  useEffect(() => {
      const subdivisions = areaSubdivisions[formData.area] || [];
  
      if (subdivisions.length > 0) {
        setFormData((prev) => ({
          ...prev,
          subdivision: subdivisions[0],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          subdivision: "",
        }));
      }
    }, [formData.area]);

  const onClose = () => {
    setIsEditRecordOpen(false);
    setRecordToEdit(null);
  };

  const { handleChange, handleSelectChange } =
    useFormHandlers<FormData>(setFormData);

  // Make it reusable
  const validateForm = () => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (formData.contactNumber && formData.contactNumber.length !== 11)
      return "Invalid contact number";

    return null;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setIsUpdating(true);

    try {
      const response: ApiResponse<any> = await execute(
        `records/${recordToEdit.id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        },
      );

      toast.success(response.message);
      await refetchData();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isEditRecordOpen} onOpenChange={setIsEditRecordOpen}>
      <DialogContent className="sm:min-w-xl">
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="text-emerald-600 bg-emerald-100 p-2 rounded-lg">
            <Pencil />
          </div>

          <div>
            <DialogTitle>
              {" "}
              Edit {!recordToEdit.isResident && "Non-"}Resident
            </DialogTitle>
            <DialogDescription>
              Fill in the details to edit record
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Dela Cruz"
              />
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Juan"
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

            {/* Suffix */}
            <div className="space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
                placeholder="Jr., Sr., III"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: Gender) => handleSelectChange("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Birthdate */}
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birthdate</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                required={false}
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: RecordRole) =>
                  handleSelectChange("role", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESIDENT">Resident</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="NON_RESIDENT">Non-Resident</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="09123456789"
              />
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label>
                Area <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.area.toString()}
                onValueChange={(value) => {
                  handleSelectChange("area", Number(value));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {Object.keys(areaSubdivisions).map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subdivision */}
            <div className="space-y-2">
              <Label>
                Subdivision <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.subdivision}
                onValueChange={(value) =>
                  handleSelectChange("subdivision", value)
                }
                disabled={!areaSubdivisions[formData.area]?.length}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subdivision" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  avoidCollisions={false}
                >
                  {areaSubdivisions[formData.area]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              size={"lg"}
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              size={"lg"}
              type="submit"
              className="flex-1"
              disabled={isUpdating}
            >
              <Save color="#fff" className="mr-2 h-4 w-4" />
              {isUpdating ? "Editing..." : "Edit Resident"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecordModal;
