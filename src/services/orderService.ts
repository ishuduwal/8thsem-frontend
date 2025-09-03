import API_BASE_URL from "../config/api";
import type { IOrder, CreateOrderData, OrdersResponse, CreateOrderResponse } from "../types/Order";
import { getCurrentUserId, getCurrentUser } from "../utils/jwtUtlis";

class OrderService {
  private baseURL = `${API_BASE_URL}/order`;
  
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
      const userId = getCurrentUserId();
      const username = getCurrentUser();
      
      if (!userId) {
        throw new Error('User information not found. Please login again.');
      }
      const userUsername = username || `user_${userId.substring(0, 8)}`;
      const headers = await this.getAuthHeaders();
      
      const requestBody = {
        userId,
        username: userUsername,
        ...orderData,
      };

      console.log('Creating order with data:', requestBody);

      const response = await fetch(`${this.baseURL}/from-cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

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

  async getOrdersByUser(userId: string, page: number = 1, limit: number = 10): Promise<OrdersResponse> {
    try {
      console.log('OrderService: Fetching orders for user:', userId, 'page:', page, 'limit:', limit);
      
      const headers = await this.getAuthHeaders();
      const url = `${this.baseURL}/user/${userId}?page=${page}&limit=${limit}`;
      console.log('OrderService: Making request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      console.log('OrderService: Response status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          const textResponse = await response.text();
          throw new Error(textResponse || `Server error: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      const data = await response.json();
      console.log('OrderService: Received data:', data);
      return data;
    } catch (error) {
      console.error('OrderService: Error fetching orders:', error);
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

  // Process eSewa payment result (for frontend handling)
  async processEsewaPayment(data: string): Promise<any> {
    try {
      // This would be called after eSewa redirects back to your frontend
      // The frontend should then send this data to the success endpoint
      const response = await fetch(`${this.baseURL}/esewa/success?data=${encodeURIComponent(data)}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
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

  // Handle eSewa success - METHOD PROPERLY IMPLEMENTED
  async handleEsewaSuccess(data: string): Promise<any> {
    return this.processEsewaPayment(data);
  }

  // Handle eSewa payment failure (for frontend handling) - FIXED METHOD NAME
  async processEsewaFailure(transaction_uuid: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/esewa/failure?transaction_uuid=${transaction_uuid}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
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

  // Handle eSewa failure - METHOD PROPERLY IMPLEMENTED
  async handleEsewaFailure(transaction_uuid: string): Promise<any> {
    return this.processEsewaFailure(transaction_uuid);
  }

  openEsewaPayment(paymentData: any): Window | null {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.gateway_url;
    form.target = '_blank'; 
    Object.entries(paymentData.formData || paymentData).forEach(([key, value]) => {
      if (key !== 'gateway_url') {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    const paymentWindow = window.open('', '_blank');
    form.submit();
    document.body.removeChild(form);

    return paymentWindow;
  }
}

export default new OrderService();