import { useAppDispatch, useAppSelector } from '../hooks';
import { 
  createOrder, 
  getOrdersByUser, 
  getOrderById, 
  checkPaymentStatus, 
  updateOrderStatus,
  getAllOrders 
} from '../slices/orderSlice';

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, currentOrder, isLoading, error, total, pages, page } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);

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

  return {
    orders,
    currentOrder,
    isLoading,
    error,
    total,
    pages,
    page,
    createOrder: createNewOrder,
    getOrdersByUser: fetchUserOrders,
    getOrderById: fetchOrderById,
    checkPaymentStatus: checkOrderPaymentStatus,
    updateOrderStatus: updateOrder,
    getAllOrders: fetchAllOrders,
  };
};