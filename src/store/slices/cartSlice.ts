import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';
import type { ICart } from '../../types/Cart';

interface CartState {
  cart: ICart | null;
  isLoading: boolean;
  error: string | null;
  cartCount: number;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  cartCount: 0,
};

// Helper function to calculate cart count
const calculateCartCount = (cart: ICart | null): number => {
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((total, item) => total + item.quantity, 0);
};


// Async thunks
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log('Fetching cart from API...');
      const state = getState() as { auth: { isAuthenticated: boolean } };

      if (!state.auth.isAuthenticated) {
        console.log('User not authenticated, skipping cart fetch');
        return rejectWithValue('User not authenticated');
      }

      const cart = await cartService.getCart();
      console.log('Cart fetched successfully:', cart);
      return cart;
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue, getState }) => {
    try {
      console.log('Adding to cart:', productId, quantity);
      const state = getState() as { auth: { isAuthenticated: boolean } };

      if (!state.auth.isAuthenticated) {
        return rejectWithValue('Please login to add items to cart');
      }

      const cart = await cartService.addToCart(productId, quantity);
      console.log('Item added to cart successfully');
      return cart;
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue, getState }) => {
    try {
      console.log('Updating cart item:', productId, quantity);
      const state = getState() as { auth: { isAuthenticated: boolean } };

      if (!state.auth.isAuthenticated) {
        return rejectWithValue('Please login to update cart');
      }

      const cart = await cartService.updateCartItem(productId, quantity);
      console.log('Cart item updated successfully');
      return cart;
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      return rejectWithValue(error.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, { rejectWithValue, getState }) => {
    try {
      console.log('Removing from cart:', productId);
      const state = getState() as { auth: { isAuthenticated: boolean } };

      if (!state.auth.isAuthenticated) {
        return rejectWithValue('Please login to remove items from cart');
      }

      const cart = await cartService.removeFromCart(productId);
      console.log('Item removed from cart successfully');
      return cart;
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      return rejectWithValue(error.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log('Clearing cart');
      const state = getState() as { auth: { isAuthenticated: boolean } };

      if (!state.auth.isAuthenticated) {
        return rejectWithValue('Please login to clear cart');
      }

      await cartService.clearCart();
      console.log('Cart cleared successfully');
      return null;
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.cart = null;
      state.cartCount = 0;
      state.error = null;
      state.isLoading = false;
    },
    updateCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
    setCart: (state, action: PayloadAction<ICart | null>) => {
      state.cart = action.payload;
      state.cartCount = calculateCartCount(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.cartCount = calculateCartCount(action.payload);
        state.error = null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Don't reset cart on error unless it's auth-related
        if ((action.payload as string)?.includes('authenticated') ||
          (action.payload as string)?.includes('401')) {
          state.cart = null;
          state.cartCount = 0;
        }
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.cartCount = calculateCartCount(action.payload);
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.cartCount = calculateCartCount(action.payload);
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.cartCount = calculateCartCount(action.payload);
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = null;
        state.cartCount = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCartError, resetCart, updateCartCount, setCart } = cartSlice.actions;
export default cartSlice.reducer;