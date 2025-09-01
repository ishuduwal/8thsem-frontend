import React, { useEffect, useState, useCallback } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useOrders } from '../../store/hooks/useOrders';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { OrderActions } from './OrderActions';
import { toast } from 'react-toastify';

export const AdminOrdersPage: React.FC = () => {
  const { 
    orders, 
    isLoading, 
    error, 
    getAllOrders, 
    total, 
    clearError,
  } = useOrders();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    delivered: 0,
    cancelled: 0
  });

  // Memoized function to load orders
  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const result = await getAllOrders(currentPage, 10, statusFilter || undefined);

      if (statusFilter === '' && result?.orders) {
        const pending = result.orders.filter((o: any) => o.orderStatus === 'PENDING').length;
        const confirmed = result.orders.filter((o: any) => o.orderStatus === 'CONFIRMED').length;
        const delivered = result.orders.filter((o: any) => o.orderStatus === 'DELIVERED').length;
        const cancelled = result.orders.filter((o: any) => o.orderStatus === 'CANCELLED').length;
        
        setStats({ pending, confirmed, delivered, cancelled });
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setRefreshing(false);
    }
  };

  fetchOrders();
}, [currentPage, statusFilter]); 
// ✅ only run when page or filter changes

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getAllOrders(currentPage, 10, statusFilter || undefined);
      toast.success('Orders refreshed successfully');
    } catch (err) {
      console.error('Failed to refresh orders:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearError = () => {
    clearError();
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Debounced search to prevent throttling
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    (order.userInfo.email && order.userInfo.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
    (order.userInfo.username && order.userInfo.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
    (order.deliveryAddress.fullName && order.deliveryAddress.fullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  );

  // Calculate pagination
  const totalPages = Math.ceil(total / 10);
  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, total);

  // Generate pagination items with ellipsis
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        end = 4;
      }
      
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      if (start > 2) {
        items.push('ellipsis-left');
      }
      
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      
      if (end < totalPages - 1) {
        items.push('ellipsis-right');
      }
      
      items.push(totalPages);
    }
    
    return items;
  };

  return (
    <div className="container mx-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and track customer orders</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
              <BarChart3 className="h-4 w-4" />
              <span>Total: {total} orders</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {statusFilter === '' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">Pending</h3>
                <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.pending}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">Confirmed</h3>
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.confirmed}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">Delivered</h3>
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.delivered}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">Cancelled</h3>
                <div className="h-2 w-2 bg-red-400 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.cancelled}</p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, email, username, or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-md border border-gray-300">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="bg-transparent focus:outline-none focus:ring-0 border-none text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-600">{error}</p>
              </div>
              <button
                onClick={handleClearError}
                className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-100 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {(isLoading || refreshing) && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !refreshing && orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {statusFilter 
                ? `No orders with status "${statusFilter}" found. Try changing your filters.`
                : 'There are no orders in the system yet. Orders will appear here once customers start placing them.'
              }
            </p>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Refresh Orders
            </button>
          </div>
        )}

        {/* Orders Table */}
        {!isLoading && !refreshing && orders.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/80 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-mono">
                            #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.userInfo.username}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-[120px]">
                              {order.userInfo.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.deliveryAddress.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.deliveryAddress.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <OrderStatusBadge status={order.orderStatus} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PaymentStatusBadge status={order.paymentStatus} />
                          <div className="text-xs text-gray-500 mt-1 capitalize">
                            {order.paymentMethod.toLowerCase().replace(/_/g, ' ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Rs. {order.grandTotal.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <OrderActions order={order} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                <div className="text-sm text-gray-600">
                  Showing {startItem} to {endItem} of {total} orders
                </div>
                
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || refreshing}
                    className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-150"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {/* Page numbers */}
                  {getPaginationItems().map((item, index) => {
                    if (item === 'ellipsis-left' || item === 'ellipsis-right') {
                      return (
                        <span key={index} className="px-2 py-1 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(Number(item))}
                        className={`px-3 py-1.5 rounded-md min-w-[2.5rem] text-sm ${
                          currentPage === item
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        } transition-colors duration-150`}
                      >
                        {item}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || refreshing}
                    className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-150"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            )}

            {/* Search results info */}
            {debouncedSearchTerm && filteredOrders.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800">
                  No orders found matching "<strong>{debouncedSearchTerm}</strong>"
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-yellow-800 underline mt-2 text-sm"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};