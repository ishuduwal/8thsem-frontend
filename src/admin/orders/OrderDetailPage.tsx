import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useOrders } from '../../store/hooks/useOrders';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { toast } from 'react-toastify';

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  mainImage: string;
  id: string;
}

export interface IOrderItem {
  product: IProduct;
  quantity: number;
  price: number;
  _id: string;
}

export interface IDeliveryAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode?: string;
  _id: string;
}

export interface IUserInfo {
  email: string;
  username: string;
  _id: string;
}

export interface IOrder {
  _id: string;
  userInfo: IUserInfo;
  items: IOrderItem[];
  deliveryAddress: IDeliveryAddress;
  paymentMethod: 'CASH_ON_DELIVERY' | 'ESEWA';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  taxAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, isLoading, error, clearError, currentOrder } = useOrders();

  useEffect(() => {
    if (orderId) {
      console.log('Fetching order with ID:', orderId);
      getOrderById(orderId).catch((err) => {
        console.error('Failed to fetch order:', err);
        toast.error('Failed to load order details');
      });
    }
  }, [orderId]); 

  useEffect(() => {
    if (error) {
      console.error('Order error:', error);
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || (!isLoading && !currentOrder && orderId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? 'Error Loading Order' : 'Order Not Found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'The order you\'re looking for doesn\'t exist.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Order</h2>
          <p className="text-gray-600 mb-4">No order ID provided.</p>
          <Link
            to="/admin-dashboard/orders"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const order = currentOrder as IOrder;

  return (
    <div className="container mx-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin-dashboard/orders"
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-600 mt-1">
                Order ID: #{order._id.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.orderStatus} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Order Items ({order.items.length})
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <img
                      src={item.product.mainImage}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {item.product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </div>
                        <div className="font-medium text-gray-900">
                          Rs. {item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">Rs. {order.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {order.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">Rs. {order.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {order.deliveryCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span className="text-gray-900">Rs. {order.deliveryCharge.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">
                      Rs. {order.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Notes</h2>
                <p className="text-gray-700 bg-yellow-50 p-4 rounded-md border border-yellow-100">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="w-0.5 h-16 bg-gray-200"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div className="w-0.5 h-16 bg-gray-200"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Updated</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.updatedAt).toLocaleDateString()} at{' '}
                      {new Date(order.updatedAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {order.orderStatus === 'DELIVERED' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    ) : order.orderStatus === 'CANCELLED' ? (
                      <XCircle className="h-5 w-5 text-red-500 mt-1" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500 mt-1" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {order.orderStatus.toLowerCase()}
                    </p>
                    <p className="text-sm text-gray-600">Current status</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Customer Information
              </h2>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{order.userInfo.username}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{order.userInfo.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-medium text-gray-900 text-sm font-mono">
                    #{order.userInfo._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Delivery Address
              </h2>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">{order.deliveryAddress.fullName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-900">{order.deliveryAddress.phoneNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{order.deliveryAddress.address}</p>
                </div>
                
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium text-gray-900">{order.deliveryAddress.city}</p>
                  </div>
                  
                  {order.deliveryAddress.postalCode && (
                    <div>
                      <p className="text-sm text-gray-600">Postal Code</p>
                      <p className="font-medium text-gray-900">{order.deliveryAddress.postalCode}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Payment Information
              </h2>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Method</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.paymentMethod.toLowerCase().replace(/_/g, ' ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-gray-900">Rs. {order.grandTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};