import API_BASE_URL from "../config/api";
import type { ICart } from "../types/Cart";

// JWT decode utility
interface DecodedToken {
  username: string;
  email?: string;
  exp: number;
  iat: number;
  isAdmin?: boolean;
  userId : string;
}

const decodeJWT = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }
        
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
        
    const decoded = JSON.parse(jsonPayload) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

class CartService {
  private baseURL = `${API_BASE_URL}/cart`;
     
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

  // Helper method to get user email from token
  private getUserEmailFromToken(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  
  // Try multiple fields that could contain the email/username
  return decoded?.email || decoded?.username || decoded?.userId || null;
}
 
  async getCart(): Promise<ICart> {
    try {
    const userEmail = this.getUserEmailFromToken();
    console.log('CartService - getUserEmailFromToken result:', userEmail);
    
    if (!userEmail) {
      throw new Error('User not authenticated');
    }

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/${encodeURIComponent(userEmail)}`, {
      method: 'GET',
      headers,
    });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login to access your cart');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cart');
      }

      const data = await response.json();
      return data.cart || data; // Handle different response structures
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error fetching cart: Unknown error');
    }
  }

  async addToCart(productId: string, quantity: number): Promise<ICart> {
    try {
      const userEmail = this.getUserEmailFromToken();
      if (!userEmail) {
        throw new Error('Please login to add items to cart');
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          userEmail, 
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
      const userEmail = this.getUserEmailFromToken();
      if (!userEmail) {
        throw new Error('Please login to update cart');
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/update`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ 
          userEmail, 
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
      const userEmail = this.getUserEmailFromToken();
      if (!userEmail) {
        throw new Error('Please login to remove items from cart');
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/remove`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ 
          userEmail, 
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
      const userEmail = this.getUserEmailFromToken();
      if (!userEmail) {
        throw new Error('Please login to clear cart');
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/clear/${encodeURIComponent(userEmail)}`, {
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
      const userEmail = this.getUserEmailFromToken();
      if (!userEmail) {
        return 0;
      }

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/count/${encodeURIComponent(userEmail)}`, {
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