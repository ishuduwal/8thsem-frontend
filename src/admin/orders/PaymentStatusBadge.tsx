import React from 'react';
import { CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Paid'
        };
      case 'PENDING':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Pending'
        };
      case 'FAILED':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Failed'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: CreditCard,
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} font-medium rounded-full border ${config.color}`}>
      <IconComponent className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};