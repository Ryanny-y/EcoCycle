import { User } from "../../generated/prisma/client.js";
import { UserDto } from "./user.types.js";

export const mapToDto = (data: User): UserDto => {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    role: data.role
  }
} 