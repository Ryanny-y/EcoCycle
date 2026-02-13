import { useState, type SubmitEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/api";
import useMutation from "@/hooks/useMutation";
import type { Gender } from "@/types/dto";
import useFormHandlers from "@/hooks/useFormHandlers";

type AddRecordModalProps = {
  isResident: boolean;
  isAddRecordOpen: boolean;
  setIsAddRecordOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

type FormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthDate: string;
  gender: Gender;
  contactNumber: string;
  isResident: boolean;
  // role: UserRole;
  address: string;
};

const AddRecordModal = ({
  isResident,
  isAddRecordOpen,
  refetchData,
  setIsAddRecordOpen,
}: AddRecordModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    gender: "MALE",
    birthDate: "",
    contactNumber: "",
    isResident,
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { execute } = useMutation();

  const { handleChange, handleSelectChange } = useFormHandlers<FormData>(setFormData);

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.birthDate) return "Birthdate is required";
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

    setIsSubmitting(true);

    try {
      const response: ApiResponse<any> = await execute("records", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success(
        `${response.data.lastName}, ${response.data.firstName} Registered.`,
      );
      await refetchData();
      setIsAddRecordOpen(false);
    } catch (error) {
      console.error("Error creating resident:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
      <DialogContent>
        <DialogHeader className="flex items-start">
          <DialogTitle>Add {!isResident && "Non-"}Resident</DialogTitle>
          <DialogDescription>
            Fill in the details to create a record
          </DialogDescription>
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
              <Label htmlFor="birthDate">
                Birthdate <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            {/* Contact */}
            <div className="space-y-2 md:col-span-2">
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

            {/* Account Type */}
            {/* <div className="space-y-2">
              <Label>Account Type</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  handleSelectChange("role", value as UserRole)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.NORMAL}>
                    Normal Resident
                  </SelectItem>
                  <SelectItem value={UserRole.STAFF}>
                    Staff
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Complete Address</Label>
              <Textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="St., Brgy, City, Province"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              size={"lg"}
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsAddRecordOpen(false)}
            >
              Cancel
            </Button>

            <Button
              size={"lg"}
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              <Save color="#fff" className="mr-2 h-4 w-4" />
              {isSubmitting ? "Register..." : "Register Resident"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecordModal;
