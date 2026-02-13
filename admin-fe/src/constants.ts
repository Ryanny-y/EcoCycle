import type { Material, RecordInterface } from "./types/dto";

type FRecordType = {
  content: RecordInterface[]
}

export const FAKERECORDS: FRecordType = {
  content: [
    {
      id: "1a2b3c4d-0002",
      firstName: "Maria",
      middleName: "Isabel",
      lastName: "Santos",
      birthDate: "1985-11-22",
      gender: "FEMALE",
      isResident: true,
      address: "456 Elm Street, Riverside",
      points: 250,
      contactNumber: "+1-555-987-6543",
      createdAt: "2025-01-12T10:15:00Z",
    },
    {
      id: "1a2b3c4d-0001",
      firstName: "John",
      middleName: "Michael",
      lastName: "Doe",
      suffix: "Jr.",
      birthDate: "1990-05-14",
      gender: "MALE",
      isResident: true,
      address: "123 Main Street, Springfield",
      points: 120,
      contactNumber: "+1-555-123-4567",
      createdAt: "2025-01-10T08:30:00Z",
    },
    {
      id: "1a2b3c4d-0003",
      firstName: "Alex",
      middleName: "Jordan",
      lastName: "Taylor",
      birthDate: "1995-03-08",
      gender: "LGBTQIA_PLUS",
      isResident: true,
      points: 75,
      contactNumber: "+1-555-222-3344",
      createdAt: "2025-01-15T14:45:00Z",
    },
    {
      id: "1a2b3c4d-0004",
      firstName: "Priya",
      middleName: "K.",
      lastName: "Patel",
      birthDate: "1992-07-19",
      gender: "FEMALE",
      isResident: true,
      address: "789 Oak Avenue, Greenfield",
      points: 310,
      contactNumber: "+1-555-444-7788",
      createdAt: "2025-01-18T09:20:00Z",
    },
    {
      id: "1a2b3c4d-0005",
      firstName: "Sam",
      middleName: "Lee",
      lastName: "Chen",
      birthDate: "1988-12-02",
      gender: "PREFER_NOT_TO_SAY",
      isResident: true,
      points: 180,
      contactNumber: "+1-555-666-9900",
      createdAt: "2025-01-20T16:05:00Z",
    },
  ],
};

export const MATERIALS: Material[] = [
  { id: 'm1', name: 'Used Clothes', pointsPerKg: 1, unit: 'kg' },
  { id: 'm2', name: 'Plastic Wrappers', pointsPerKg: 2, unit: 'kg' },
  { id: 'm3', name: 'PET Bottles', pointsPerKg: 3, unit: 'kg' },
  { id: 'm4', name: 'Aluminium Cans', pointsPerKg: 5, unit: 'kg' },
];