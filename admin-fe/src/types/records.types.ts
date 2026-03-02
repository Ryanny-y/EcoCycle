export type IGender = 'MALE' | 'FEMALE' | 'LGBTQIA_PLUS' | 'PREFER_NOT_TO_SAY'; 

export type IRecordRole = "RESIDENT" | "NON_RESIDENT" | "STAFF";


export interface IRecord {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  birthDate: string;
  gender: IGender;
  isResident: boolean;
  role: IRecordRole; 
  points: number;
  contactNumber: string;
  area: number;
  subdivision: string;
  createdAt: string;
}