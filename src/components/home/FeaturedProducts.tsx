import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import type { Product } from '../../types/Product';
import { StarRating } from '../StarRating';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // We'll need to add this method to ProductService
        const response = await fetch(`${API_BASE_URL}/products/featured/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        const products = await response.json();
        setFeaturedProducts(products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="w-full h-40 bg-gray-200"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="text-center text-red-500 py-8">
          Error loading featured products: {error}
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="text-center text-gray-500 py-8">
          No featured products available
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <Link 
          to="/products" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All Products →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <Link to={`/products/${product._id}`}>
              <div className="w-full h-40 bg-gray-100">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">{product.name}</h3>
                <div className="mt-1">
                  {product.averageRating && product.averageRating > 0 ? (
                    <div className="flex items-center">
                      <StarRating rating={product.averageRating} size="sm" />
                      <span className="text-xs text-gray-500 ml-1">({product.averageRating})</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No reviews yet</div>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">Rs. {product.price}</span>
                  {product.stock > 0 ? (
                    <span className="text-xs text-green-600">In Stock</span>
                  ) : (
                    <span className="text-xs text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;