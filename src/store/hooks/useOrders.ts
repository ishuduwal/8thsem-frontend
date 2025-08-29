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

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, currentOrder, isLoading, error, total, pages, page } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);

  const createNewOrderFromCart = async (orderData: any) => {
    return dispatch(createOrderFromCart(orderData)).unwrap();
  };

  const createNewOrder = async (orderData: any) => {
    return dispatch(createOrder(orderData)).unwrap();
  };

  const fetchUserOrders = async (pageNum: number = 1, limit: number = 10) => {
    if (!user?.email) {
      throw new Error('User email is required');
    }
    return dispatch(getOrdersByUser({ email: user.email, page: pageNum, limit })).unwrap();
  };

  const fetchOrderById = async (orderId: string) => {
    return dispatch(getOrderById(orderId)).unwrap();
  };

  const checkOrderPaymentStatus = async (orderId: string) => {
    return dispatch(checkPaymentStatus(orderId)).unwrap();
  };

  const updateOrder = async (orderId: string, status: string) => {
    return dispatch(updateOrderStatus({ orderId, status })).unwrap();
  };

  const fetchAllOrders = async (pageNum: number = 1, limit: number = 10, status?: string) => {
    return dispatch(getAllOrders({ page: pageNum, limit, status })).unwrap();
  };

  const handleEsewaSuccess = async (data: string) => {
    return dispatch(processEsewaSuccess(data)).unwrap();
  };

  const handleEsewaFailure = async (transaction_uuid: string) => {
    return dispatch(processEsewaFailure(transaction_uuid)).unwrap();
  };

  // 👇 new clearError wrapper
  const clearError = () => {
    dispatch(clearOrderError());
  };

  return {
    orders,
    currentOrder,
    isLoading,
    error,
    total,
    pages,
    page,
    createOrderFromCart: createNewOrderFromCart,
    createOrder: createNewOrder,
    getOrdersByUser: fetchUserOrders,
    getOrderById: fetchOrderById,
    checkPaymentStatus: checkOrderPaymentStatus,
    updateOrderStatus: updateOrder,
    getAllOrders: fetchAllOrders,
    processEsewaSuccess: handleEsewaSuccess,
    processEsewaFailure: handleEsewaFailure,
    clearError, // 👈 now exposed for components
  };
};
