import z from "zod";
import { Gender, Role } from "../../generated/prisma/enums.js";

export const recordIdSchema = z.object({
  id: z.uuid("Invalid Resident Id."),
});

export const getRecordsQuery = {
  query: z.object({
    isResident: z.boolean().optional(),
    search: z.string().optional(),
    size: z.string().optional(),
    page: z.string().optional(),
  }),
};

export const createRecord = {
  body: z.object({
    firstName: z
      .string("First name is required")
      .max(100, "First name is too long"),
    middleName: z.string().max(100, "Middle name is too long").optional(),
    lastName: z
      .string("Last name is required")
      .max(100, "Last name is too long"),
    suffix: z.string().optional(),
    birthDate: z.coerce
      .date()
      .max(new Date(), "Birthdate must be in the past")
      .optional(),
    gender: z.enum([
      Gender.MALE,
      Gender.FEMALE,
      Gender.LGBTQIA_PLUS,
      Gender.PREFER_NOT_TO_SAY,
      Gender.OTHER,
    ]),
    isResident: z.boolean().optional().default(true),
    role: z
      .enum([Role.RESIDENT, Role.NON_RESIDENT, Role.STAFF])
      .optional()
      .default(Role.RESIDENT),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    subdivisionId: z.uuid("Subdivision is required."),
  }),
};

export const updateRecord = {
  params: recordIdSchema,
  body: z.object({
    firstName: z
      .string("First name is required")
      .max(100, "First name is too long"),
    middleName: z.string().max(100, "Middle name is too long").optional(),
    lastName: z
      .string("Last name is required")
      .max(100, "Last name is too long"),
    suffix: z.string().optional(),
    birthDate: z.coerce
      .date()
      .max(new Date(), "Birthdate must be in the past")
      .optional(),
    gender: z.enum(
      [
        Gender.MALE,
        Gender.FEMALE,
        Gender.LGBTQIA_PLUS,
        Gender.PREFER_NOT_TO_SAY,
        Gender.OTHER,
      ],
      "Gender is required.",
    ),
    isResident: z.boolean("Resident Status is required."),
    role: z.enum(
      [Role.RESIDENT, Role.NON_RESIDENT, Role.STAFF],
      "Resident Role is required.",
    ),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    subdivisionId: z.uuid("Subdivision is required."),
  }),
};
