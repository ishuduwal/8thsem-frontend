import API_BASE_URL from "../config/api";
import type { Product, ProductResponse } from "../types/Product";
import type { ProductReviews, Reply, Comment } from "../types/Review";
import { getCurrentUser } from "../utils/jwtUtlis";

class ProductService {
  private baseURL = `${API_BASE_URL}/products`;
  
  // Helper method to get headers with authentication
  private async getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
  private getCurrentUsername(): string {
    const username = getCurrentUser();
    if (!username) {
      throw new Error('User not authenticated');
    }
    return username;
  }

  async createProduct(productData: FormData): Promise<ProductResponse> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        body: productData,
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

  async getAllProducts(page: number = 1, search: string = ''): Promise<ProductResponse> {
    try {
      const url = new URL(this.baseURL);
      url.searchParams.append('page', page.toString());
      if (search) {
        url.searchParams.append('search', search);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductById(id: string): Promise<{ data: Product }> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch product');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      throw new Error(`Error fetching product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateProduct(id: string, productData: FormData): Promise<ProductResponse> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        body: productData,
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

  async getRecommendedProducts(id: string): Promise<{ data: Product[] }> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/recommendations`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recommended products');
      }

      const data = await response.json();
      return { data: data.recommendations || [] };
    } catch (error) {
      throw new Error(`Error fetching recommended products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Review methods - updated to not require user parameter
  async addRating(productId: string, ratingData: { value: number }): Promise<{ message: string; averageRating: number }> {
    try {
      const username = this.getCurrentUsername();
      const headers = await this.getAuthHeaders();
      
      const payload = {
        ...ratingData,
        user: username
      };

      const response = await fetch(`${this.baseURL}/${productId}/ratings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add rating');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error adding rating: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addComment(productId: string, commentData: { text: string }): Promise<{ message: string; comment: Comment }> {
    try {
      const username = this.getCurrentUsername();
      const headers = await this.getAuthHeaders();
      
      const payload = {
        ...commentData,
        user: username
      };

      const response = await fetch(`${this.baseURL}/${productId}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error adding comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addReply(productId: string, commentId: string, replyData: { text: string }): Promise<{ message: string; reply: Reply }> {
    try {
      const username = this.getCurrentUsername();
      const headers = await this.getAuthHeaders();
      
      const payload = {
        ...replyData,
        user: username
      };

      const response = await fetch(`${this.baseURL}/${productId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add reply');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error adding reply: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async likeComment(productId: string, commentId: string): Promise<{ message: string; likes: string[] }> {
    try {
      const username = this.getCurrentUsername();
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseURL}/${productId}/comments/${commentId}/like`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like comment');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error liking comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async likeReply(productId: string, commentId: string, replyId: string): Promise<{ message: string; likes: string[] }> {
    try {
      const username = this.getCurrentUsername();
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseURL}/${productId}/comments/${commentId}/replies/${replyId}/like`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like reply');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error liking reply: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteComment(productId: string, commentId: string): Promise<{ message: string }> {
    try {
      const username = this.getCurrentUsername();
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseURL}/${productId}/comments/${commentId}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error deleting comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteReply(productId: string, commentId: string, replyId: string): Promise<{ message: string }> {
    try {
      const username = this.getCurrentUsername();
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseURL}/${productId}/comments/${commentId}/replies/${replyId}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete reply');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error deleting reply: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductReviews(productId: string): Promise<ProductReviews> {
    try {
      const response = await fetch(`${this.baseURL}/${productId}/reviews`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch product reviews');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching product reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new ProductService();