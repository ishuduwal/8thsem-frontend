import API_BASE_URL from "../config/api";
import type { Product, ProductResponse } from "../types/Product";

class ProductService {
    private baseURL = `${API_BASE_URL}/products`;
  
    async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<ProductResponse> {
      try {
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create product');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error creating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async getAllProducts(page: number = 1): Promise<ProductResponse> {
      try {
        const response = await fetch(`${this.baseURL}?page=${page}`);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch products');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error fetching products: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async getProductById(id: string): Promise<ProductResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}`);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch product');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error fetching product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async updateProduct(id: string, productData: Partial<Product>): Promise<ProductResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update product');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error updating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async deleteProduct(id: string): Promise<ProductResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete product');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async getRecommendedProducts(id: string): Promise<ProductResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}/recommendations`);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch recommended products');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`Error fetching recommended products: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  export default new ProductService();