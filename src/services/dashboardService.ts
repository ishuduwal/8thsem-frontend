import API_BASE_URL from "../config/api";

export interface DashboardStats {
  totals: {
    products: number;
    categories: number;
    users: number;
    orders: number;
  };
  charts: {
    monthlyOrders: number[];
    paymentMethods: { name: string; value: number }[];
  };
  highestSellingProducts: {
    productId: string;
    productName: string;
    totalSold: number;
    price: number;
    mainImage: string;
  }[];
}

export interface TimeRangeStats {
  range: string;
  startDate: string;
  endDate: string;
  revenue: number;
  orders: number;
  newUsers: number;
  newProducts: number;
}

class DashboardService {
  private baseURL = `${API_BASE_URL}/dashboard`;

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

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(this.baseURL, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard stats');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getStatsByTimeRange(range: 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december' | 'yearly'): Promise<TimeRangeStats> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/range/${range}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch time range stats');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching time range stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new DashboardService();