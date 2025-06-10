import API_BASE_URL from "../config/api";
import type { Discount, DiscountResponse } from "../types/Discount";

class DiscountService {
    private baseURL = `${API_BASE_URL}/discounts`;
  
    async createDiscount(discountData: Omit<Discount, '_id' | 'createdAt' | 'updatedAt'>): Promise<DiscountResponse> {
      try {
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(discountData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create discount');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error creating discount: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async getAllDiscounts(): Promise<DiscountResponse> {
      try {
        const response = await fetch(this.baseURL);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch discounts');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error fetching discounts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async getDiscountById(id: string): Promise<DiscountResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}`);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch discount');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error fetching discount: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async updateDiscount(id: string, discountData: Partial<Discount>): Promise<DiscountResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(discountData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update discount');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error updating discount: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async deleteDiscount(id: string): Promise<DiscountResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete discount');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error deleting discount: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async getActiveDiscounts(): Promise<DiscountResponse> {
      try {
        const response = await fetch(`${this.baseURL}?active=true`);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch active discounts');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error fetching active discounts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  export default new DiscountService();