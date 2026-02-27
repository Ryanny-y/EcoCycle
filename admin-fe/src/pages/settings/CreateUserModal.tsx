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
import { Button } from "@/components/ui/button";
import { Save, Shield, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/api";
import useMutation from "@/hooks/useMutation";
import useFormHandlers from "@/hooks/useFormHandlers";
import type { Role } from "@/contexts/types/AuthContextTypes";

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
};

type CreateUserModalProps = {
  isCreateUserOpen: boolean;
  setIsCreateUserOpen: (open: boolean) => void;
  refetchData: () => Promise<void>;
};

const CreateUserModal = ({
  isCreateUserOpen,
  setIsCreateUserOpen,
  refetchData,
}: CreateUserModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { execute } = useMutation();

  const { handleChange } = useFormHandlers<FormData>(setFormData);

  const validateForm = (): string | null => {
    if (!formData.username.trim()) return "Username is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.password) return "Password is required";
    if (!formData.confirmPassword) return "Password is required";
    if (formData.password.length < 8)
      return "Password should be at least 8 characters";
    if (formData.role.length === 0) return "At least one role is required";

    if(formData.password !== formData.confirmPassword) return "Password and Confirm Password do not match.";

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

    setIsSubmitting(true);

    try {
      const response: ApiResponse<any> = await execute("auth/sign-up", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success(response.message);
      await refetchData();
      setIsCreateUserOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="text-emerald-600 bg-emerald-100 p-2 rounded-lg">
            <User />
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
                    ${formData.role === "ADMIN"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-black/10 hover:border-black/30"}
                  `}
                >
                  <Shield size={16} /> Admin
                  
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("SUPER_ADMIN")}
                  className={`border-2 p-2 rounded-lg flex items-center justify-center gap-2 
                    ${formData.role === "SUPER_ADMIN"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-black/10 hover:border-black/30"}
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
              onClick={() => setIsCreateUserOpen(false)}
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
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
