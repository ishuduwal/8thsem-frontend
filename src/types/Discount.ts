export interface Discount {
    _id?: string;
    name: string;
    description?: string;
    percentage: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    applyTo: 'ALL' | 'CATEGORY' | 'PRODUCT';
    targetIds: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface DiscountResponse {
    success: boolean;
    message: string;
    data: Discount | Discount[];
    error?: string;
  }