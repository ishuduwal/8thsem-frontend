export interface ICategory {
    _id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CategoryFormData {
    name: string;
    description?: string;
  }