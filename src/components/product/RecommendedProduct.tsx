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
    if (!productId) return;
    
    navigate(`/products/${productId}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded-sm mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-sm w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded-sm w-1/2 mt-3"></div>
            </div>
          </div>
        ))}
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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {recommendedProducts.map((product) => (
        <div
          key={product._id}
          onClick={() => handleProductClick(product._id)}
          className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
        >
          <div className="h-40 overflow-hidden">
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
              {product.name}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">
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
  );
};