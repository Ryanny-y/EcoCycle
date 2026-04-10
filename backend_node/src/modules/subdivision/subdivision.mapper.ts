import { Subdivision } from "../../generated/prisma/client.js";
import { SubdivisionDto } from "./subdivision.types.js";

export const toDto = (data: Subdivision): SubdivisionDto => {
  return {
    id: data.id,
    name: data.name,
    area: data.area,
  };
};
