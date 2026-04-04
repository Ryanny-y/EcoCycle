import { Record } from "../../generated/prisma/client";
import { RecordDto } from "./record.types";

export const toDto = (record: Record): RecordDto => {
  return {
    id: record.id,
    firstName: record.firstName,
    middleName: record.middleName || "",
    lastName: record.lastName,
    suffix: record.suffix || "",
    birthDate: record.birthDate?.toISOString() ?? "",
    gender: record.gender,
    isResident: record.isResident,
    role: record.role,
    address: record.address || "",
    contactNumber: record.contactNumber || "",
    subdivisionId: record.subdivisionId,
    points: Number(record.points),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
};
