import { UserRole } from "../../generated/prisma/enums";

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}
