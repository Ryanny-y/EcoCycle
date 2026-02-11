import { useState } from "react";
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

type AddRecordModalProps = {
  isAddRecordOpen: boolean;
  setIsAddRecordOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

type FormData = {
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  gender: string;
  birthdate: string;
  contact: string;
  // role: UserRole;
  address: string;
};

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  middleName: "",
  suffix: "",
  gender: "Male",
  birthdate: "",
  contact: "",
  // role: UserRole.NORMAL,
  address: "",
};

const AddRecordModal = ({
  isAddRecordOpen,
  refetchData,
  setIsAddRecordOpen,
}: AddRecordModalProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onClose = () => {
    setIsAddRecordOpen(false);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contact.length !== 11) {
      toast.error("Invalid Contact Number");
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting:", formData);

      await refetchData();
      onClose();
    } catch (error) {
      console.error("Error creating resident:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
      <DialogContent className="sm:min-w-xl">
        <DialogHeader className="flex items-start mb-5">
          <DialogTitle>Add New Resident</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new record
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
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Birthdate */}
            <div className="space-y-2">
              <Label htmlFor="birthdate">
                Birthdate <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                required
                value={formData.birthdate}
                onChange={handleChange}
              />
            </div>

            {/* Contact */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                type="tel"
                value={formData.contact}
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
              onClick={onClose}
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
              {isSubmitting ? "Registering..." : "Register Resident"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecordModal;
