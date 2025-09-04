import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import productService from '../services/productService';

interface SearchSuggestionsProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

export const SearchSuggestions = ({ query, isOpen, onClose, onSearch }: SearchSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching suggestions for:', query);
        const response = await productService.getSearchSuggestions(query);
        console.log('Search suggestions response:', response);

        const suggestionsData = response.data || [];
        console.log('Processed suggestions:', suggestionsData);

        setSuggestions(suggestionsData);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, isOpen]);

  useEffect(() => {
    console.log('SearchSuggestions mounted/updated', {
      isOpen,
      query,
      suggestionsCount: suggestions.length,
      suggestions: suggestions.map(s => ({ id: s._id, name: s.name }))
    });
  }, [isOpen, query, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Click outside detected, closing dropdown');
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose, isOpen]);

  const handleProductClick = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('PRODUCT CLICKED:', product);
    
    let productId: string | undefined;
    if (typeof product._id === 'string') {
      productId = product._id;
    } else if (product._id) {
      productId = (product._id as any)?.toString?.();
    }
    
    console.log('Extracted product ID:', productId);
    
    if (productId) {
      console.log('Navigating to product:', `/products/${productId}`);
      
      onClose();
      
      if (onSearch) {
        onSearch('');
      }
      
      navigate(`/products/${productId}`);
    } else {
      console.error('No valid product ID found');
    }
  };

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('View all clicked with query:', query);
    
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      // Close suggestions
      onClose();
      
      // Clear search query if callback provided
      if (onSearch) {
        onSearch('');
      }
      
      // Navigate to search results
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  // Don't render if not open or query is too short
  if (!isOpen || query.length < 2) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400 mr-2"></div>
            Searching...
          </div>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          {`No products found for "${query}"`}
        </div>
      ) : (
        <ul className="py-2">
          {suggestions.map((product, index) => {
            // Extract ID for debugging
            const productId = typeof product._id === 'string' 
              ? product._id 
              : (product._id as any)?.toString?.();
            
            return (
              <li 
                key={productId || index} 
                className="border-b border-gray-100 last:border-b-0"
              >
                <div
                  onClick={(e) => {
                    console.log('CLICK EVENT FIRED for product:', product.name);
                    handleProductClick(product, e);
                  }}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  data-product-id={productId}
                  data-testid={`suggestion-${index}`}
                >
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md mr-3 border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Rs. {product.price}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          Rs. {product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.stock !== undefined && (
                      <div className="text-xs text-gray-500 mt-1">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    )}
                    {/* Debug info */}
                    {/* <div className="text-xs text-red-500 mt-1">
                      ID: {productId || 'N/A'}
                    </div> */}
                  </div>
                </div>
              </li>
            );
          })}

          <li className="border-t border-gray-200 mt-2">
            <div
              onClick={handleViewAllClick}
              className="block px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 text-center font-medium cursor-pointer transition-colors"
            >
              View all results for "{query}"
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};