import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../store/hooks/useCart';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { toast } from 'react-toastify';
import type { ICartItem } from '../../types/Cart';

interface CartItemProps {
  item: ICartItem;
  onUpdate: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdate }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    if (updating) return;

    setUpdating(true);
    try {
      await updateCartItem(item.product, newQuantity);
      setQuantity(newQuantity);
      onUpdate();
      toast.success('Quantity updated successfully');
    } catch (error) {
      console.error('Error updating cart item:', error);
      setQuantity(item.quantity);
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await removeFromCart(item.product);
      onUpdate();
      toast.success('Item removed from cart');
      setIsRemoveModalOpen(false);
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      handleQuantityChange(value);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
        {/* Product Image */}
        <Link to={`/products/${item.product}`} className="flex-shrink-0 self-center sm:self-auto">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-gray-200 rounded"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.png';
            }}
          />
        </Link>
        
        {/* Product Info */}
        <div className="flex-1 min-w-0 self-stretch flex flex-col justify-between">
          <div className="mb-2">
            <Link to={`/products/${item.product}`} className="hover:text-indigo-600 transition-colors">
              <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
            </Link>
            <p className="text-gray-600 text-sm mt-1">Unit Price: ${item.price.toFixed(2)}</p>
          </div>
          
          {/* Mobile: Quantity controls and price */}
          <div className="flex sm:hidden justify-between items-center mt-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={updating || quantity <= 1}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={handleQuantityInputChange}
                disabled={updating}
                className="w-10 text-center border border-gray-300 px-1 py-1 text-sm rounded disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={updating || quantity >= 99}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
            
            <div className="text-right">
              <span className="font-medium text-base">
                ${(item.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Desktop: Quantity Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={updating || quantity <= 1}
            className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={handleQuantityInputChange}
            disabled={updating}
            className="w-12 text-center border border-gray-300 px-1 py-1 text-sm rounded disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={updating || quantity >= 99}
            className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {/* Desktop: Total Price */}
        <div className="hidden sm:block w-24 text-right">
          <span className="font-medium text-lg">
            ${(item.price * quantity).toFixed(2)}
          </span>
        </div>
        
        {/* Remove Button */}
        <button
          onClick={() => setIsRemoveModalOpen(true)}
          disabled={updating}
          className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors hover:bg-red-50 rounded self-center sm:self-auto"
          title="Remove item"
          aria-label={`Remove ${item.name} from cart`}
        >
          {updating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600"></div>
          ) : (
            <X className="h-5 w-5" />
          )}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemove}
        title="Remove Item"
        message={
          <div>
            <p>Are you sure you want to remove this item from your cart?</p>
            <p className="font-medium mt-2">{item.name}</p>
          </div>
        }
        confirmText="Remove"
        cancelText="Keep Item"
        isConfirming={updating}
        type="danger"
      />
    </>
  );
};