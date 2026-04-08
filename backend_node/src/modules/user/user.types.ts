import { UserRole } from "../../generated/prisma/enums.js";

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}
