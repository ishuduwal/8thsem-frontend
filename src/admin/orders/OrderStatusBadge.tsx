import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' };
      case 'CONFIRMED':
        return { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' };
      case 'DELIVERED':
        return { color: 'bg-green-100 text-green-800', label: 'Delivered' };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};