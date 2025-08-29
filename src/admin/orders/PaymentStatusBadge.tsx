import React from 'react';

interface PaymentStatusBadgeProps {
  status: string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID':
        return { color: 'bg-green-100 text-green-800', label: 'Paid' };
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' };
      case 'FAILED':
        return { color: 'bg-red-100 text-red-800', label: 'Failed' };
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