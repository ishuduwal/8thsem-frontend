import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  clearCartError,
  resetCart 
} from '../slices/cartSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { cart, isLoading, error, cartCount } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  console.log('useCart - isAuthenticated:', isAuthenticated, 'user:', user, 'cart:', cart);

  // Reset cart when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, resetting cart');
      dispatch(resetCart());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !cart && !isLoading) {
      console.log('User authenticated, fetching cart');
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated, cart, isLoading]);

  const addItemToCart = useCallback(async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }
    
    try {
      const result = await dispatch(addToCart({ productId, quantity })).unwrap();
      return result;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }, [dispatch, isAuthenticated]);

  const updateItemQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error('Please login to update cart');
    }
    
    try {
      const result = await dispatch(updateCartItem({ productId, quantity })).unwrap();
      return result;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }, [dispatch, isAuthenticated]);

  const removeItemFromCart = useCallback(async (productId: string) => {
    if (!isAuthenticated) {
      throw new Error('Please login to remove items from cart');
    }
    
    try {
      const result = await dispatch(removeFromCart(productId)).unwrap();
      return result;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }, [dispatch, isAuthenticated]);

  const clearUserCart = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Please login to clear cart');
    }
    
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }, [dispatch, isAuthenticated]);

  const refreshCart = useCallback(() => {
    if (isAuthenticated) {
      console.log('Refreshing cart');
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  const clearError = useCallback(() => {
    dispatch(clearCartError());
  }, [dispatch]);

  return {
    cart,
    isLoading,
    error,
    cartCount,
    addToCart: addItemToCart,
    updateCartItem: updateItemQuantity,
    removeFromCart: removeItemFromCart,
    clearCart: clearUserCart,
    refreshCart,
    clearError,
  };
};