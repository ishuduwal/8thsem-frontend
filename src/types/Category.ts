export interface ICategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormValues {
  name: string;
  description?: string;
  image?: File | null;
}