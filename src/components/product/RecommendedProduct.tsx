// components/RecommendedProduct.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/Product';
import productService from '../../services/productService';

interface RecommendedProductProps {
  productId: string;
}

export const RecommendedProduct = ({ productId }: RecommendedProductProps) => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getRecommendedProducts(productId);
        setRecommendedProducts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRecommendedProducts();
    }
  }, [productId]);

  const handleProductClick = (productId: string | undefined) => {
    if (!productId) return; // Add null check
    
    navigate(`/products/${productId}`);
    // Scroll to top when navigating to new product
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (recommendedProducts.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No recommendations available at the moment.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">You might also like</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
          >
            <div className="h-60 overflow-hidden p-2">
              <img
                src={product.mainImage}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600">
                {product.name}
              </h4>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">
                  Rs. {product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    Rs. {product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};