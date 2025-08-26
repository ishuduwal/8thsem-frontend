import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../types/Product';
import productService from '../../services/productService';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

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
    // Add to cart functionality would go here
    alert(`Added ${quantity} ${product?.name} to cart`);
  };

  // Helper function to get category name
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
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images Section */}
        <div className="md:w-1/2">
          <div className="sticky top-4">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>
            
            {product.subImages && product.subImages.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {/* Main image thumbnail */}
                  <button
                    onClick={() => handleImageSelect(product.mainImage)}
                    className={`w-16 h-16 border-2 rounded overflow-hidden ${
                      selectedImage === product.mainImage
                        ? 'border-blue-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={product.mainImage}
                      alt="Main"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  
                  {/* Sub images thumbnails */}
                  {product.subImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(image)}
                      className={`w-16 h-16 border-2 rounded overflow-hidden ${
                        selectedImage === image
                          ? 'border-blue-500'
                          : 'border-gray-200'
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
              </div>
            )}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
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

          <div className="mb-6">
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
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
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
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

