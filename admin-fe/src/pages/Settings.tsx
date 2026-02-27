import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import useFetchData from "@/hooks/useFetchData";
import type { User } from "@/types/dto";
import { Plus, Shield } from "lucide-react";
import UserTable from "./settings/UserTable";
import { useState } from "react";
import type { ApiResponse } from "@/types/api";
import CreateUserModal from "./settings/CreateUserModal";
import EditUserModal from "./settings/EditUserModal";
import DeleteUserModal from "./settings/DeleteUserModal";

const Settings = () => {
  const { data, loading, error, refetchData } =
    useFetchData<ApiResponse<User[]>>("users");

  // Modals
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const openEditUser = (user: User) => {
    setIsEditUserOpen(true);
    setUserToEdit(user);
  };

  const openDeleteUser = (user: User) => {
    setIsDeleteUserOpen(true);
    setUserToDelete(user);
  };

  return (
    <div id="settings" className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage system configurations and administrator access."
      />

      {/* Administrator Management */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
              <Shield />
            </span>
            Administrator Management
          </CardTitle>

          <Button onClick={() => setIsCreateUserOpen(true)}>
            <Plus />
            Add Administrator
          </Button>
        </CardHeader>

        <div>
          <UserTable
            users={data?.data ?? []}
            loading={loading}
            error={error}
            openEditUser={openEditUser}
            openDeleteUser={openDeleteUser}
            refetchData={refetchData}
          />
        </div>
      </Card>

      {/* Modals */}
      {isCreateUserOpen && (
        <CreateUserModal
          isCreateUserOpen={isCreateUserOpen}
          setIsCreateUserOpen={setIsCreateUserOpen}
          refetchData={refetchData}
        />
      )}

      {isEditUserOpen && (
        <EditUserModal
          userToEdit={userToEdit}
          setUserToEdit={setUserToEdit}
          isEditUserOpen={isEditUserOpen}
          setIsEditUserOpen={setIsEditUserOpen}
          refetchData={refetchData}
        />
      )}

      {isDeleteUserOpen && (
        <DeleteUserModal
          userToDelete={userToDelete}
          setUserToDelete={setUserToDelete}
          isDeleteUserOpen={isDeleteUserOpen}
          setIsDeleteUserOpen={setIsDeleteUserOpen}
          refetchData={refetchData}
        />
      )}
    </div>
  );
};

export default Settings;
