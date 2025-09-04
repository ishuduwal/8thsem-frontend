import type { Rating } from "./Review";

export interface Product {
  _id?: string;
  name: string;
  description: string;
  originalPrice: number;
  price: number;
  category: string | { _id: string; name: string };
  mainImage: string;
  subImages: string[];
  createdAt?: Date;
  updatedAt?: Date;
  averageRating?: number;
  ratings?: Rating[];
  stock: number;
}
export interface ProductFilters {
  page?: number;
  search?: string;
  category?: string;
  price?: string;
  sort?: string;
  limit?: number; // Add this line
}
export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
  filters?: {
    category?: string[];
    price?: string;
    sort?: string;
    search?: string;
  };
}