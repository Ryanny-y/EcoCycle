export interface IMaterial {
  id: string;
  name: string;
  description?: string;
  pointsPerKg: number;
  imageUrl: string;
  createdAt: Date;
}