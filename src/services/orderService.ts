import API_BASE_URL from "../config/api";
import type { IOrder } from "../types/Order";


interface CreateOrderData {
  deliveryAddress: {
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  paymentMethod: 'CASH_ON_DELIVERY' | 'ESEWA';
  notes?: string;
}

interface OrdersResponse {
  orders: IOrder[];
  total: number;
  page: number;
  pages: number;
}

class OrderService {
  private baseURL = `${API_BASE_URL}/orders`;
  
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

  async createOrder(orderData: CreateOrderData): Promise<{order: IOrder, paymentData?: any}> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error creating order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrdersByUser(email: string, page: number = 1, limit: number = 10): Promise<OrdersResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/user/${email}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrderById(orderId: string): Promise<{order: IOrder}> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/${orderId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkPaymentStatus(orderId: string): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/${orderId}/payment-status`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check payment status');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error checking payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<{order: IOrder}> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/${orderId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ orderStatus: status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error updating order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllOrders(page: number = 1, limit: number = 10, status?: string): Promise<OrdersResponse> {
    try {
      const headers = await this.getAuthHeaders();
      let url = `${this.baseURL}?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new OrderService();