import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../store/hooks/useCart';
import { useAppSelector } from '../../store/hooks';
import { CartItem } from './CartItem';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { toast } from 'react-toastify';

export const CartPage: React.FC = () => {
  const { cart, isLoading, error, clearCart, refreshCart } = useCart();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // Calculate subtotal and total from cart items
  const calculateTotals = () => {
    if (!cart || !cart.items) return { subtotal: 0, total: 0 };
    
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;
    
    return { subtotal, total };
  };

  const { subtotal, total } = calculateTotals();
  const cartTotal = cart?.total || total; 

  useEffect(() => {
    console.log('CartPage useEffect - isAuthenticated:', isAuthenticated, 'hasAttemptedLoad:', hasAttemptedLoad, 'cart:', cart);
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { state: { from: '/cart' } });
    } else if (isAuthenticated && !hasAttemptedLoad && !isLoading) {
      console.log('User authenticated, loading cart');
      refreshCart();
      setHasAttemptedLoad(true);
    }
  }, [isAuthenticated, navigate, refreshCart, hasAttemptedLoad, cart, isLoading]);

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart();
      toast.success('Cart cleared successfully');
      setIsClearModalOpen(false);
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
    } finally {
      setIsClearing(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  console.log('CartPage render - isLoading:', isLoading, 'error:', error, 'cart:', cart);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
          <div className="text-red-600 mb-4">
            <ShoppingBag className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to load cart</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshCart}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-100 w-24 h-24 flex items-center justify-center mx-auto mb-6 rounded-full">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6 sm:mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-indigo-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={() => setIsClearModalOpen(true)}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Clear Cart
          </button>
        </div>

        {/* Cart Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Cart Items ({cart.items.length})
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.product}
                    item={item}
                    onUpdate={refreshCart}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 sticky top-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {subtotal > 0 ? '$0.00' : '$0.00'}
                  </span>
                </div>
                
                {/* Tax */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    {subtotal > 0 ? '$0.00' : '$0.00'}
                  </span>
                </div>
                
                {/* Total */}
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.items.length === 0}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>

              <Link
                to="/products"
                className="w-full mt-4 text-center text-indigo-600 hover:text-indigo-800 transition-colors block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearCart}
        title="Clear Cart"
        message="Are you sure you want to clear your entire cart? This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Keep Items"
        isConfirming={isClearing}
        type="danger"
      />
    </div>
  );
};