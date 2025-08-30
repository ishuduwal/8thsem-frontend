import React, { useState, useEffect } from 'react';
import DashboardService, { type DashboardStats, type TimeRangeStats } from '../services/dashboardService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Home, 
  Grid, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  List, 
  UserPlus, 
  PlusSquare,
  TrendingUp,
  CreditCard,
  Award
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeRangeStats, setTimeRangeStats] = useState<TimeRangeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Set current month as default
  const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
  const [selectedRange, setSelectedRange] = useState<'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december' | 'yearly'>(currentMonth as any);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchTimeRangeStats(selectedRange);
  }, [selectedRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await DashboardService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeRangeStats = async (range: 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december' | 'yearly') => {
    try {
      const stats = await DashboardService.getStatsByTimeRange(range);
      setTimeRangeStats(stats);
    } catch (err) {
      console.error('Error fetching time range stats:', err);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRange(e.target.value as any);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-xl font-semibold text-gray-700">Loading dashboard...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-red-600 mb-2">Oops!</div>
        <div className="text-gray-600">Error: {error}</div>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
  
  if (!stats) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="text-xl font-semibold text-gray-600">No data available</div>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );

  // Prepare data for monthly orders line chart
  const monthlyOrdersData = stats.charts.monthlyOrders.map((count, index) => ({
    name: new Date(2023, index).toLocaleString('default', { month: 'short' }),
    orders: count
  }));

  // Enhanced colors for pie chart
  const COLORS = ['#6366f1', '#8b5cf6', '#06d6a0', '#f72585', '#4cc9f0', '#7209b7'];

  const timeRangeOptions = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december', 'yearly'
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm shadow-sm p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Products</h3>
                <p className="text-3xl font-bold mt-2">{stats.totals.products.toLocaleString()}</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
                <Home className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-sm shadow-sm p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-100 text-sm font-medium uppercase tracking-wide">Categories</h3>
                <p className="text-3xl font-bold mt-2">{stats.totals.categories}</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
                <Grid className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-sm shadow-sm p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-100 text-sm font-medium uppercase tracking-wide">Total Users</h3>
                <p className="text-3xl font-bold mt-2">{stats.totals.users.toLocaleString()}</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm shadow-sm p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-orange-100 text-sm font-medium uppercase tracking-wide">Total Orders</h3>
                <p className="text-3xl font-bold mt-2">{stats.totals.orders.toLocaleString()}</p>
              </div>
              <div className="bg-orange-400 bg-opacity-30 rounded-full p-3">
                <ShoppingCart className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="bg-white rounded-sm shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Time Period</h3>
            <div className="flex items-center">
              <select 
                value={selectedRange}
                onChange={handleRangeChange}
                className="px-4 py-2 rounded-sm  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeRangeOptions.map((range) => (
                  <option key={range} value={range}>
                    {range === 'yearly' ? 'This Year' : range.charAt(0).toUpperCase() + range.slice(1)}
                  </option>
                ))}
              </select>
              <span className="ml-3 text-sm text-gray-500">
                Currently viewing: {selectedRange === 'yearly' ? 'This Year' : selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Time Range Stats */}
        {timeRangeStats && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Stats for {selectedRange === 'yearly' ? 'This Year' : selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-sm shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Revenue</h3>
                    <p className="text-2xl font-bold text-gray-800">${timeRangeStats.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-sm shadow-sm p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-3 mr-4">
                    <List className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Orders</h3>
                    <p className="text-2xl font-bold text-gray-800">{timeRangeStats.orders}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-sm shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <UserPlus className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">New Users</h3>
                    <p className="text-2xl font-bold text-gray-800">{timeRangeStats.newUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-sm shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-3 mr-4">
                    <PlusSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">New Products</h3>
                    <p className="text-2xl font-bold text-gray-800">{timeRangeStats.newProducts}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Monthly Orders Line Chart */}
          <div className="bg-white rounded-sm shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="bg-blue-100 rounded-md p-2 mr-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              Monthly Orders Trend
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#4f46e5' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Methods Pie Chart */}
          <div className="bg-white rounded-sm shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="bg-purple-100 rounded-md p-2 mr-3">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              Payment Methods Distribution
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={stats.charts.paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.charts.paymentMethods.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Highest Selling Products */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="bg-green-100 rounded-md p-2 mr-3">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            Top Selling Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {stats.highestSellingProducts.map((product, index) => (
              <div key={product.productId} className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-sm shadow-sm p-4 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-sm shadow-sm">
                    #{index + 1}
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Sold</div>
                    <div className="text-lg font-bold text-gray-800">{product.totalSold}</div>
                  </div>
                </div>
                <img 
                  src={product.mainImage} 
                  alt={product.productName} 
                  className="w-full h-32 object-cover rounded-sm shadow-sm mb-3" 
                />
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm">{product.productName}</h4>
                  <p className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};