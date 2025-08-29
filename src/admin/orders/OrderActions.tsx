import React, { useState } from 'react';
import { Eye, Edit, MoreVertical, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useOrders } from '../../store/hooks/useOrders';
import type { IOrder } from '../../types/Order';
import { toast } from 'react-toastify';

interface OrderActionsProps {
  order: IOrder;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { updateOrderStatus } = useOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'CONFIRMED':
        return <Truck className="h-4 w-4 text-blue-600" />;
      default:
        return <Edit className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      toast.success(`Order status updated to ${newStatus.toLowerCase()}`);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusOptions = () => {
    switch (order.orderStatus) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['DELIVERED', 'CANCELLED'];
      case 'DELIVERED':
        return []; // No further actions for delivered orders
      case 'CANCELLED':
        return []; // No further actions for cancelled orders
      default:
        return ['CONFIRMED', 'DELIVERED', 'CANCELLED'];
    }
  };

  const statusOptions = getStatusOptions();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-50 transition-colors"
        aria-label="Order actions"
      >
        {updating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
        ) : (
          <MoreVertical className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="py-1">
              {/* View Details */}
              <a
                href={`/admin-dashboard/orders/${order._id}`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </a>
              
              {/* Status Update Options */}
              {statusOptions.length > 0 && (
                <div className="border-t border-gray-100">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Update Status
                  </div>
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={updating}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      {getStatusIcon(status)}
                      <span className="ml-2">
                        Mark as {status.toLowerCase()}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Current Status Info */}
              <div className="border-t border-gray-100 px-4 py-2">
                <div className="text-xs text-gray-500">Current Status</div>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {order.orderStatus.toLowerCase()}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};