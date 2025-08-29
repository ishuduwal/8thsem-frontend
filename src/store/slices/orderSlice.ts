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
      return await orderService.createOrderFromCart(orderData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrdersByUser = createAsyncThunk(
  'order/getOrdersByUser',
  async ({ email, page = 1, limit = 10 }: { email: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await orderService.getOrdersByUser(email, page, limit);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(orderId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  'order/checkPaymentStatus',
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await orderService.checkPaymentStatus(orderId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: string }, { rejectWithValue }) => {
    try {
      return await orderService.updateOrderStatus(orderId, status);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async ({ page = 1, limit = 10, status }: { page?: number; limit?: number; status?: string }, { rejectWithValue }) => {
    try {
      return await orderService.getAllOrders(page, limit, status);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const processEsewaSuccess = createAsyncThunk(
  'order/processEsewaSuccess',
  async (data: string, { rejectWithValue }) => {
    try {
      return await orderService.handleEsewaSuccess(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const processEsewaFailure = createAsyncThunk(
  'order/processEsewaFailure',
  async (transaction_uuid: string, { rejectWithValue }) => {
    try {
      return await orderService.handleEsewaFailure(transaction_uuid);
    } catch (error: any) {
      return rejectWithValue(error.message);
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

      // Get Orders by User
      .addCase(getOrdersByUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
        state.error = null;
      })
      .addCase(getOrdersByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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