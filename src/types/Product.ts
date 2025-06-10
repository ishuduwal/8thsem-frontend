export interface Product {
    _id?: string;
    title: string;
    description: string;
    originalPrice: number;
    price: number;
    category: string | { _id: string; name: string };
    mainImage: string;
    additionalImages: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ProductResponse {
    success: boolean;
    message: string;
    data: Product | Product[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
    };
  }