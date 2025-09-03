import { useAppDispatch, useAppSelector } from '../hooks';
import {
  createOrderFromCart,
  createOrder,
  getOrdersByUser,
  getOrderById,
  checkPaymentStatus,
  updateOrderStatus,
  getAllOrders,
  processEsewaSuccess,
  processEsewaFailure,
  clearOrderError,
} from '../slices/orderSlice';
import { getCurrentUserId } from '../../utils/jwtUtlis';
import type { CreateOrderData } from '../../types/Order';

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, currentOrder, isLoading, error, total, pages, page } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);

  const createNewOrderFromCart = async (orderData: CreateOrderData) => {
    try {
      const result = await dispatch(createOrderFromCart(orderData)).unwrap();
      return result;
    } catch (error) {
      console.error('Create order from cart error:', error);
      throw error;
    }
  };

  const createNewOrder = async (orderData: any) => {
    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      return result;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  };

  const fetchUserOrders = async (userId: string, pageNum: number = 1, limit: number = 10) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      console.log('useOrders: Fetching orders for user:', userId, 'page:', pageNum, 'limit:', limit);
      const result = await dispatch(getOrdersByUser({ userId, page: pageNum, limit })).unwrap();
      console.log('useOrders: Successfully fetched orders:', result);
      return result;
    } catch (error) {
      console.error('useOrders: Fetch user orders error:', error);
      throw error;
    }
  };

  const fetchOrderById = async (orderId: string) => {
    try {
      const result = await dispatch(getOrderById(orderId)).unwrap();
      return result;
    } catch (error) {
      console.error('Fetch order by ID error:', error);
      throw error;
    }
  };

  const checkOrderPaymentStatus = async (orderId: string) => {
    try {
      const result = await dispatch(checkPaymentStatus(orderId)).unwrap();
      return result;
    } catch (error) {
      console.error('Check payment status error:', error);
      throw error;
    }
  };

  const updateOrder = async (orderId: string, status: string) => {
    try {
      const result = await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      return result;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  };

  const fetchAllOrders = async (pageNum: number = 1, limit: number = 10, status?: string) => {
    try {
      const result = await dispatch(getAllOrders({ page: pageNum, limit, status })).unwrap();
      return result;
    } catch (error) {
      console.error('Fetch all orders error:', error);
      throw error;
    }
  };

  const handleEsewaSuccess = async (data: string) => {
    try {
      const result = await dispatch(processEsewaSuccess(data)).unwrap();
      return result;
    } catch (error) {
      console.error('Handle eSewa success error:', error);
      throw error;
    }
  };

  const handleEsewaFailure = async (transaction_uuid: string) => {
    try {
      const result = await dispatch(processEsewaFailure(transaction_uuid)).unwrap();
      return result;
    } catch (error) {
      console.error('Handle eSewa failure error:', error);
      throw error;
    }
  };

  const clearError = () => {
    dispatch(clearOrderError());
  };

  return {
    // State
    orders,
    currentOrder,
    isLoading,
    error,
    total,
    pages,
    page,
    
    // Actions
    createOrderFromCart: createNewOrderFromCart,
    createOrder: createNewOrder,
    getOrdersByUser: fetchUserOrders,
    getOrderById: fetchOrderById,
    checkPaymentStatus: checkOrderPaymentStatus,
    updateOrderStatus: updateOrder,
    getAllOrders: fetchAllOrders,
    processEsewaSuccess: handleEsewaSuccess,
    processEsewaFailure: handleEsewaFailure,
    clearError,
  };
};