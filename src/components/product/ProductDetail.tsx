import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../../types/Product';
import productService from '../../services/productService';
import { ProductReview } from './ProductReview';
import { RecommendedProduct } from './RecommendedProduct';
import { StarRating } from '../StarRating';
import { useCart } from '../../store/hooks/useCart';
import { useAppSelector } from '../../store/hooks';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'reviews'>('recommendations');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }
      
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
    if (product && newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!product || !id) return;
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(id, quantity); // Use id from useParams instead of product._id
      alert(`Added ${quantity} ${product.name} to cart`);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('login') || err.message.includes('authenticated')) {
          alert('Please login to add items to cart');
          navigate('/login');
        } else {
          alert(`Failed to add to cart: ${err.message}`);
        }
      } else {
        alert('Failed to add to cart. Please try again.');
      }
      console.error('Add to cart error:', err);
    } finally {
      setIsAddingToCart(false);
    }
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images Section */}
        <div className="lg:w-1/2">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Sub-images column */}
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
            
            {/* Main image */}
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
            <span className="text-2xl font-semibold text-gray-900">Rs. {product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-4 text-sm text-gray-500 line-through">
                Rs. {product.originalPrice}
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
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1 || isAddingToCart}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-12 text-center border-0 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={isAddingToCart}
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity >= (product.stock || 1) || isAddingToCart}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock < 1 || isAddingToCart}
              className="w-25 py-2 px-6 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAddingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Adding to Cart...
                </>
              ) : product.stock && product.stock > 0 ? (
                'Add to Cart'
              ) : (
                'Out of Stock'
              )}
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
            <ProductReview productId={id} />
          )}
        </div>
      </div>
    </div>
  );
};