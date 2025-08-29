import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Clock, XCircle } from 'lucide-react';
import { useOrders } from '../../store/hooks/useOrders';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams();
  const { getOrderById, currentOrder, isLoading } = useOrders();
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId);
    }
  }, [orderId, getOrderById]);

  useEffect(() => {
    if (currentOrder && currentOrder.paymentStatus === 'PENDING' && !polling) {
      setPolling(true);
      const interval = setInterval(() => {
        getOrderById(orderId!);
      }, 5000);

      return () => {
        clearInterval(interval);
        setPolling(false);
      };
    }
  }, [currentOrder, orderId, getOrderById, polling]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p>The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {currentOrder.paymentStatus === 'PAID' ? (
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        ) : currentOrder.paymentStatus === 'PENDING' ? (
          <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        ) : (
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        )}

        <h1 className="text-3xl font-bold mb-4">
          {currentOrder.paymentStatus === 'PAID' 
            ? 'Order Confirmed!' 
            : currentOrder.paymentStatus === 'PENDING'
            ? 'Payment Processing'
            : 'Payment Failed'
          }
        </h1>

        <p className="text-gray-600 mb-6">
          {currentOrder.paymentStatus === 'PAID' 
            ? 'Thank you for your order! Your payment was successful.'
            : currentOrder.paymentStatus === 'PENDING'
            ? 'Your payment is being processed. This may take a few moments.'
            : 'There was an issue with your payment. Please try again.'
          }
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">#{currentOrder._id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium">${currentOrder.grandTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">{currentOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded-full text-sm ${
              currentOrder.paymentStatus === 'PAID' 
                ? 'bg-green-100 text-green-800'
                : currentOrder.paymentStatus === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {currentOrder.paymentStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};