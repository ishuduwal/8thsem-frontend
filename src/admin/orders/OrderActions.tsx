import React, { useState } from 'react';
import { Eye, Edit, MoreVertical } from 'lucide-react';
import { useOrders } from '../../store/hooks/useOrders';
import type { IOrder } from '../../types/Order';

interface OrderActionsProps {
  order: IOrder;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateOrderStatus } = useOrders();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateOrderStatus(order._id, newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-md"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <a
              href={`/orders/${order._id}`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </a>
            
            {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
              <div className="border-t border-gray-100">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Update Status
                </div>
                {['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((status) => (
                  status !== order.orderStatus && (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 mr-2 inline" />
                      Mark as {status.toLowerCase()}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};