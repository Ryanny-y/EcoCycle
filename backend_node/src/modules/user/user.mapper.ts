import { User } from "../../generated/prisma/client";
import { UserDto } from "./user.types";

export const mapToDto = (data: User): UserDto => {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    role: data.role
  }
} 