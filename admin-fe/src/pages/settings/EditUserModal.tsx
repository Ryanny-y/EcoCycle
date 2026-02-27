import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Save, Shield, ShieldCheck } from "lucide-react";
import type { Role } from "@/contexts/types/AuthContextTypes";
import useMutation from "@/hooks/useMutation";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/dto";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
};

type EditUserModalProps = {
  userToEdit: User | null;
  setUserToEdit: (user: User | null) => void;
  isEditUserOpen: boolean;
  setIsEditUserOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

const EditUserModal = ({
  userToEdit,
  setUserToEdit,
  isEditUserOpen,
  setIsEditUserOpen,
  refetchData,
}: EditUserModalProps) => {
  if (!userToEdit) return;

  const [isUpdating, setIsUpdating] = useState(false);
  const { execute } = useMutation();

  const [formData, setFormData] = useState<FormData>({
    username: userToEdit.username,
    email: userToEdit.email,
    password: "",
    confirmPassword: "",
    role: userToEdit.role,
  });

  const onClose = () => {
    setIsEditUserOpen(false);
    setUserToEdit(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Make it reusable
  const validateForm = () => {
    if (!formData.username.trim()) return "Username name is required";
    if (!formData.email.trim()) return "Email name is required";
    if (!formData.role) return "At lease one role is required";
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        return "Password and Confirm Password do not match.";
      }
    }

    return null;
  };

  const handleRoleChange = (role: Role) => {
    setFormData((prev) => {
      return {
        ...prev,
        role: role
      };
    });
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
        `users/${userToEdit.id}`,
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
    <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="text-emerald-600 bg-emerald-100 p-2 rounded-lg">
            <Edit />
          </div>

          <div>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a User
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Last Name */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Admin"
              />
            </div>

            {/* First Name */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@gmail.com"
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>
                System Role <span className="text-red-500">*</span>{" "}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("ADMIN")}
                  className={`border-2 p-2 rounded-lg flex items-center justify-center gap-2 
                    ${
                      formData.role === "ADMIN"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-black/10 hover:border-black/30"
                    }
                  `}
                >
                  <Shield size={16} /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("SUPER_ADMIN")}
                  className={`border-2 p-2 rounded-lg flex items-center justify-center gap-2 
                    ${
                      formData.role === "SUPER_ADMIN"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-black/10 hover:border-black/30"
                    }
                  `}
                >
                  <ShieldCheck size={16} /> Super Admin
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              size={"lg"}
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditUserOpen(false)}
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
              {isUpdating ? "Updating..." : "Update User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
