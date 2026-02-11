export interface RecordInterface {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'LGBTQIA_PLUS' | 'PREFER_NOT_TO_SAY'; 
  isResident: boolean;
  address?: string; 
  points: number;
  contactNumber: string;
  createdAt: string;
}