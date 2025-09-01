import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/hooks/useCart';
import { useOrders } from '../../store/hooks/useOrders';
import { toast } from 'react-toastify';
import { decodeJWT, getCurrentUserEmail } from '../../utils/jwtUtlis';
import { useAppSelector } from '../../store/hooks';

export const CheckoutPage: React.FC = () => {
  const { cart } = useCart();
  const { createOrderFromCart } = useOrders();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth); // Get user from Redux state

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'ESEWA'>('CASH_ON_DELIVERY');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    console.log('Current user email from getCurrentUserEmail():', getCurrentUserEmail());
  
  // Debug token
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decoded = decodeJWT(token);
    console.log('Decoded token:', decoded);
    console.log('Available fields:', {
      userId: decoded?.userId,
      username: decoded?.username,
      email: decoded?.email,
      isAdmin: decoded?.isAdmin
    });
  }
    // Try multiple sources to get the user email
    const getEmail = () => {
      // 1. First try from Redux auth state
      if (user?.email) {
        console.log('Got email from Redux state:', user.email);
        return user.email;
      }
      
      // 2. Try from JWT token
      const emailFromToken = getCurrentUserEmail();
      if (emailFromToken) {
        console.log('Got email from JWT token:', emailFromToken);
        return emailFromToken;
      }
      
      // 3. Try from localStorage (auth state)
      try {
        const authState = localStorage.getItem('persist:root');
        if (authState) {
          const parsedAuthState = JSON.parse(authState);
          const authData = JSON.parse(parsedAuthState.auth);
          
          if (authData.user && authData.user.email) {
            console.log('Got email from localStorage auth state:', authData.user.email);
            return authData.user.email;
          }
        }
      } catch (error) {
        console.error('Error parsing auth state from localStorage:', error);
      }
      
      return null;
    };

    const email = getEmail();
    
    if (email) {
      setUserEmail(email);
      
      // Pre-fill form with user data if available
      if (user) {
        setFormData(prev => ({
          ...prev,
          fullName: user.fullName || prev.fullName,
          phoneNumber: user.phoneNumber || prev.phoneNumber,
        }));
      }
    } else {
      toast.error('User email not found. Please login again.');
      navigate('/login');
    }
  }, [navigate, user]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail) {
      toast.error('User email not found. Please login again.');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        deliveryAddress: formData,
        paymentMethod,
        notes: notes || undefined,
        userEmail: userEmail, // Explicitly send userEmail
      };

      console.log('Submitting order with complete data:', orderData);

      const result = await createOrderFromCart(orderData);
      console.log('Order creation successful:', result);

      if (paymentMethod === 'ESEWA' && result.paymentData) {
        // Handle eSewa payment
        console.log('Processing eSewa payment...');
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = result.paymentData.gateway_url;

        Object.entries(result.paymentData).forEach(([key, value]) => {
          if (key !== 'gateway_url' && value !== null && value !== undefined) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value as string;
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        // For cash on delivery, redirect to order confirmation
        toast.success('Order created successfully!');
        navigate(`/orders/${result.order._id}`);
      }
    } catch (error: any) {
      console.error('Order creation error details:', error);
      
      // Handle specific error cases
      if (error.message.includes('Server error occurred')) {
        toast.error('Server error occurred. Please try again later or contact support.');
      } else if (error.message.includes('User email not found')) {
        toast.error('Please login again to continue.');
        navigate('/login');
      } else {
        toast.error(error.message || 'Failed to create order. Please check your information and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debug information
  console.log('Checkout page state:', {
    userEmail,
    cartItems: cart?.items?.length,
    formData,
    paymentMethod
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p>Please add items to your cart before proceeding to checkout.</p>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0;
  const deliveryCharge = 0;
  const total = subtotal + tax + deliveryCharge;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* User Info Display */}
        {userEmail && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Ordering as:</h3>
            <p className="text-blue-700">{userEmail}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cart.items.map((item) => (
              <div key={item.product} className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">Rs. {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Rs. {deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter your delivery address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code (Optional)</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter postal code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'CASH_ON_DELIVERY' | 'ESEWA')}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                    <option value="ESEWA">eSewa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !userEmail}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : `Place Order - Rs. ${total.toFixed(2)}`}
                </button>

                {!userEmail && (
                  <p className="text-red-600 text-sm">
                    User information not available. Please try logging in again.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};