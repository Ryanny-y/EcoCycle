export type Gender = 'MALE' | 'FEMALE' | 'LGBTQIA_PLUS' | 'PREFER_NOT_TO_SAY'; 

export interface RecordInterface {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  birthDate: string;
  gender: Gender;
  isResident: boolean;
  address?: string; 
  points: number;
  contactNumber: string;
  createdAt: string;
}

export interface Material {
  id: string;
  name: string;
  pointsPerKg: number;
  unit: string;
}