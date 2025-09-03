import API_BASE_URL from "../config/api";
import type { ICart } from "../types/Cart";
import { getCurrentUserId } from "../utils/jwtUtlis";

class CartService {
  private baseURL = `${API_BASE_URL}/cart`;
     
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

  private getUserIdFromToken(): string | null {
    return getCurrentUserId();
  }
 
  async getCart(): Promise<ICart> {
  try {
    const userId = this.getUserIdFromToken();
    
    if (!userId) {
      throw new Error('User not authenticated - no user ID found in token');
    }

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 500) {
        // Handle server errors gracefully
        return { userId, items: [], total: 0 };
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      throw new Error(errorData.message || 'Failed to fetch cart');
    }

    const data = await response.json();
    return data.cart || data;
  } catch (error) {
    console.error('Error fetching cart, returning empty cart:', error);
    // Return empty cart instead of throwing error
    const userId = this.getUserIdFromToken();
    return { userId: userId || '', items: [], total: 0 };
  }
}

  async addToCart(productId: string, quantity: number): Promise<ICart> {
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        throw new Error('Please login to add items to cart');
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          userId, 
          productId, 
          quantity 
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login to add items to cart');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }

      const data = await response.json();
      return data.cart || data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error adding to cart: Unknown error');
    }
  }

  async updateCartItem(productId: string, quantity: number): Promise<ICart> {
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        throw new Error('Please login to update cart');
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/update`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ 
          userId, 
          productId, 
          quantity 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart item');
      }

      const data = await response.json();
      return data.cart || data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error updating cart item: Unknown error');
    }
  }

  async removeFromCart(productId: string): Promise<ICart> {
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        throw new Error('Please login to remove items from cart');
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/remove`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ 
          userId, 
          productId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove from cart');
      }

      const data = await response.json();
      return data.cart || data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error removing from cart: Unknown error');
    }
  }

  async clearCart(): Promise<void> {
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        throw new Error('Please login to clear cart');
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/clear/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear cart');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error clearing cart: Unknown error');
    }
  }

  async getCartCount(): Promise<number> {
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        return 0;
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/count/${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          return 0;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get cart count');
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  }
}

export default new CartService();