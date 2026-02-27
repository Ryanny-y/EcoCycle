import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/SkeletonLoadings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Role } from "@/contexts/types/AuthContextTypes";
import type { User } from "@/types/dto";
import dayjs from "dayjs";
import { Edit, MoreVertical, Search, Trash2 } from "lucide-react";

interface UserTable {
  users: User[] | undefined;
  loading: boolean;
  error: string | null;
  openEditUser: (user: User) => void;
  openDeleteUser: (user: User) => void;
  refetchData: () => Promise<void>;
}

const UserTable = ({
  users,
  loading,
  error,
  openEditUser,
  openDeleteUser,
  refetchData,
}: UserTable) => {
  if (loading) return <TableSkeleton />;

  if (error) return <ErrorState onRetry={refetchData} />;

  if (!users) return;

  const transformedRole = (role: Role) => {
    if (role === "SUPER_ADMIN") return <Badge className="uppercase">Super Admin</Badge>;

    return <Badge className="bg-emerald-100 text-emerald-700 uppercase">Admin</Badge>;
  };

  return (
    <>
      <div className="custom-scroll rounded-xl max-h-150">
        <Table id="users_table">
          <TableHeader className="bg-stone-100 rounded-xl">
            <TableRow className="">
              <TableHead className="flex items-center text-muted-foreground gap-2 py-6 px-10">
                Username
              </TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Created At</TableHead>
              <TableHead className="text-muted-foreground text-right px-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground py-12"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="p-5 rounded-full bg-stone-100">
                      <Search size={30} />
                    </span>
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs">
                      Try adjusting your filters or add a new user.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                return (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-emerald-50/50"
                  >
                    <TableCell className="font-semibold px-10">
                      {user.username}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{transformedRole(user.role)}</TableCell>
                    <TableCell>
                      {dayjs(user.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="rounded-full "
                            onClick={() => openEditUser(user)}
                          >
                            <Edit className="mr-0.5 h-4 w-4" />
                            Edit user
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive rounded-full group hover:text-destructive!"
                            onClick={() => openDeleteUser(user)}
                          >
                            <Trash2 className="mr-0.5 h-4 w-4 group-hover:text-destructive" />
                            Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default UserTable;
