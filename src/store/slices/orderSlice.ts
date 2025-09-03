import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';
import type { IOrder, CreateOrderData, OrdersResponse, CreateOrderResponse } from '../../types/Order';

interface OrderState {
  orders: IOrder[];
  currentOrder: IOrder | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  pages: number;
  page: number;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  total: 0,
  pages: 1,
  page: 1,
};

// Async thunks
export const createOrderFromCart = createAsyncThunk(
  'order/createOrderFromCart',
  async (orderData: CreateOrderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrderFromCart(orderData);
      return response;
    } catch (error: any) {
      console.error('Create order error:', error);
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      return response;
    } catch (error: any) {
      console.error('Create order error:', error);
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const getOrdersByUser = createAsyncThunk(
  'order/getOrdersByUser',
  async ({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      console.log('Fetching orders for user:', userId, 'page:', page, 'limit:', limit);
      const response = await orderService.getOrdersByUser(userId, page, limit);
      console.log('Orders response received:', response);
      return response;
    } catch (error: any) {
      console.error('Get orders by user error:', error);
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(orderId);
      return response;
    } catch (error: any) {
      console.error('Get order by ID error:', error);
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  'order/checkPaymentStatus',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.checkPaymentStatus(orderId);
      return response;
    } catch (error: any) {
      console.error('Check payment status error:', error);
      return rejectWithValue(error.message || 'Failed to check payment status');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, status);
      return response;
    } catch (error: any) {
      console.error('Update order status error:', error);
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async ({ page = 1, limit = 10, status }: { page?: number; limit?: number; status?: string }, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllOrders(page, limit, status);
      return response;
    } catch (error: any) {
      console.error('Get all orders error:', error);
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const processEsewaSuccess = createAsyncThunk(
  'order/processEsewaSuccess',
  async (data: string, { rejectWithValue }) => {
    try {
      const response = await orderService.processEsewaPayment(data);
      return response;
    } catch (error: any) {
      console.error('Process eSewa success error:', error);
      return rejectWithValue(error.message || 'Failed to process eSewa payment');
    }
  }
);

export const processEsewaFailure = createAsyncThunk(
  'order/processEsewaFailure',
  async (transaction_uuid: string, { rejectWithValue }) => {
    try {
      const response = await orderService.processEsewaFailure(transaction_uuid);
      return response;
    } catch (error: any) {
      console.error('Process eSewa failure error:', error);
      return rejectWithValue(error.message || 'Failed to process eSewa failure');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<IOrder | null>) => {
      state.currentOrder = action.payload;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.error = null;
      state.total = 0;
      state.pages = 1;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order From Cart
      .addCase(createOrderFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.error = null;
      })
      .addCase(createOrderFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get Orders by User - FIXED
      .addCase(getOrdersByUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersByUser.fulfilled, (state, action) => {
        console.log('getOrdersByUser fulfilled with payload:', action.payload);
        state.isLoading = false;
        // Make sure we're accessing the correct properties from the response
        const response = action.payload as OrdersResponse;
        state.orders = response.orders || [];
        state.total = response.total || 0;
        state.pages = response.pages || 1;
        state.page = response.page || 1;
        state.error = null;
      })
      .addCase(getOrdersByUser.rejected, (state, action) => {
        console.log('getOrdersByUser rejected with error:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
        // Reset orders on error
        state.orders = [];
        state.total = 0;
        state.pages = 1;
        state.page = 1;
      })

      // Get Order by ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.error = null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Check Payment Status
      .addCase(checkPaymentStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkPaymentStatus.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        // Update the order in the orders list if it exists
        const index = state.orders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        const response = action.payload as OrdersResponse;
        state.orders = response.orders || [];
        state.total = response.total || 0;
        state.pages = response.pages || 1;
        state.page = response.page || 1;
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.orders = [];
        state.total = 0;
        state.pages = 1;
        state.page = 1;
      })

      // Process eSewa Success
      .addCase(processEsewaSuccess.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processEsewaSuccess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.error = null;
      })
      .addCase(processEsewaSuccess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Process eSewa Failure
      .addCase(processEsewaFailure.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processEsewaFailure.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(processEsewaFailure.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderError, setCurrentOrder, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;