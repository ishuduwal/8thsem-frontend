import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../types/Product';
import productService from '../../services/productService';
import { ProductReview } from './ProductReview';
import { RecommendedProduct } from './RecommendedProduct';
import { StarRating } from '../StarRating';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'reviews'>('recommendations');

  const currentUser = localStorage.getItem('username') || 'guest';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        setProduct(response.data);
        setSelectedImage(response.data.mainImage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product?.name} to cart`);
  };

  const getCategoryName = () => {
    if (!product?.category) return '';
    
    if (typeof product.category === 'string') {
      return product.category;
    } else {
      return product.category.name;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images Section - Redesigned */}
        <div className="lg:w-1/2">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Sub-images column (right on desktop, top on mobile) */}
            {product.subImages && product.subImages.length > 0 && (
              <div className="flex md:flex-col gap-2 order-2 md:order-1">
                <button
                  onClick={() => handleImageSelect(product.mainImage)}
                  className={`w-16 h-16 border-2 rounded-sm overflow-hidden flex-shrink-0 transition-all duration-200 ${
                    selectedImage === product.mainImage
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={product.mainImage}
                    alt="Main"
                    className="w-full h-full object-cover"
                  />
                </button>
                
                {product.subImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(image)}
                    className={`w-16 h-16 border-2 rounded-sm overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      selectedImage === image
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main image (left on desktop, below on mobile) */}
            <div className="bg-white rounded-sm overflow-hidden border border-gray-200 shadow-sm flex-1 order-1 md:order-2">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-96 md:h-[500px] object-contain p-4"
              />
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          {/* Star Rating Display */}
          <div className="flex items-center mb-4">
            <StarRating rating={product.averageRating || 0} size="lg" />
            <span className="ml-2 text-sm text-gray-600">
              ({product.ratings?.length || 0} reviews)
            </span>
          </div>

          <div className="flex items-center mb-4">
            <span className="text-2xl font-semibold text-gray-900">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-4 text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {product.category && (
            <div className="mb-4">
              <span className="text-sm text-gray-600">Category: </span>
              <span className="text-sm font-medium text-gray-800">
                {getCategoryName()}
              </span>
            </div>
          )}
          
          <div className='mb-4'>
            <span className="text-sm font-semibold text-gray-900">Stock Left: </span>
            <span className="text-gray-700">
              {product.stock || 'No stock available.'}
            </span>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description || 'No description available.'}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mr-4">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-12 text-center border-0 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-100 py-2 px-6 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for Recommendations and Reviews */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recommended Products
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer Reviews
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'recommendations' && id && (
            <RecommendedProduct productId={id} />
          )}

          {activeTab === 'reviews' && id && (
            <ProductReview productId={id} currentUser={currentUser} />
          )}
        </div>
      </div>
    </div>
  );
};