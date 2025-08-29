import API_BASE_URL from "../config/api";
import type { IOrder, CreateOrderData, OrdersResponse, CreateOrderResponse } from "../types/Order";
import { getCurrentUserEmail } from "../utils/jwtUtlis";

class OrderService {
  private baseURL = `${API_BASE_URL}/order`;
  
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

  async createOrderFromCart(orderData: CreateOrderData): Promise<CreateOrderResponse> {
    try {
      const userEmail = getCurrentUserEmail();
      if (!userEmail) {
        throw new Error('User email not found. Please login again.');
      }

      const headers = await this.getAuthHeaders();
      
      // Include userEmail in the request body
      const requestBody = {
        ...orderData,
        userEmail // Add the userEmail field
      };

      console.log('Creating order with data:', requestBody);

      const response = await fetch(`${this.baseURL}/from-cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      // Check if response is HTML (server error)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const htmlResponse = await response.text();
        console.error('Server returned HTML instead of JSON:', htmlResponse.substring(0, 500));
        throw new Error('Server error occurred. Please try again later.');
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // If JSON parsing fails, use the response text
          const textResponse = await response.text();
          throw new Error(textResponse || `Server error: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.message || `Failed to create order: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Order creation error details:', error);
      throw new Error(`Error creating order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createOrder(orderData: any): Promise<CreateOrderResponse> {
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

  // Handle eSewa payment success
  async handleEsewaSuccess(data: string): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/esewa/success?data=${encodeURIComponent(data)}`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process eSewa payment');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error processing eSewa payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Handle eSewa payment failure
  async handleEsewaFailure(transaction_uuid: string): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/esewa/failure?transaction_uuid=${transaction_uuid}`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process eSewa payment failure');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error processing eSewa payment failure: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new OrderService();