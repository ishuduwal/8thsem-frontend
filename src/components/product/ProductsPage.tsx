import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, Grid, List, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllCategories } from '../../services/categoryService';
import productService, { type ProductFilters } from '../../services/productService';
import type { ICategory } from '../../types/Category';
import type { Product } from '../../types/Product';

// StarRating component
interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating = ({ rating, size = 'md' }: StarRatingProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= Math.round(rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
      {rating > 0 && (
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

// Main ProductsPage component
export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Price ranges
  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Rs. 0 - Rs. 46', value: '0-46' },
    { label: 'Rs. 46 - Rs. 84', value: '46-84' },
    { label: 'Rs. 84 - Rs. 123', value: '84-123' },
    { label: 'Rs. 123 - Rs. $161', value: '123-161' },
    { label: 'Rs. 161 - Rs. 200', value: '161-200' },
    { label: 'Rs. 200+', value: '200-' },
  ];

  // Sort options
  const sortOptions = [
    { label: 'Newest Items', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Name: Z to A', value: 'name-desc' },
  ];

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const priceParam = searchParams.get('price');
    const sortParam = searchParams.get('sort');
    const searchParam = searchParams.get('search');
    const pageParam = searchParams.get('page');
    
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(',').filter(Boolean));
    }
    
    if (priceParam) {
      setPriceRange(priceParam);
    }
    
    if (sortParam) {
      setSortBy(sortParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    if (pageParam) {
      setCurrentPage(parseInt(pageParam) || 1);
    }
  }, [searchParams]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

useEffect(() => {
  const categoryParam = searchParams.get('category');
  const priceParam = searchParams.get('price');
  const sortParam = searchParams.get('sort');
  const searchParam = searchParams.get('search');
  const pageParam = searchParams.get('page');
  
  if (categoryParam) {
    setSelectedCategories(categoryParam.split(',').filter(Boolean));
  }
  
  if (priceParam) {
    setPriceRange(priceParam);
  }
  
  if (sortParam) {
    setSortBy(sortParam);
  }
  
  if (searchParam) {
    setSearchTerm(searchParam);
  }
  
  if (pageParam) {
    setCurrentPage(parseInt(pageParam) || 1);
  }
  
  // Fetch products after initializing filters
  fetchProducts();
}, [searchParams]);

// Update the fetchProducts function to use URL parameters:
const fetchProducts = async () => {
  try {
    setIsLoading(true);
    
    // Get current values from URL params
    const categoryParam = searchParams.get('category');
    const priceParam = searchParams.get('price');
    const sortParam = searchParams.get('sort');
    const searchParam = searchParams.get('search');
    const pageParam = searchParams.get('page');
    
    // Build query parameters object using URL params
    const filters: ProductFilters = {
      page: pageParam ? parseInt(pageParam) || 1 : 1,
    };
    
    if (categoryParam) {
      filters.category = categoryParam;
    }
    
    if (priceParam) {
      filters.price = priceParam;
    }
    
    if (sortParam && sortParam !== 'newest') {
      filters.sort = sortParam;
    }
    
    if (searchParam && searchParam.trim()) {
      filters.search = searchParam.trim();
    }
    
    console.log('Fetching products with filters:', filters);
    
    const response = await productService.getAllProducts(filters);
    
    setProducts(response.products || []);
    setTotalPages(response.pages || 1);
    setTotalProducts(response.total || 0);
    setCurrentPage(response.page || 1);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    setProducts([]);
    setTotalProducts(0);
    setTotalPages(1);
  } finally {
    setIsLoading(false);
  }
};

const updateURL = () => {
  const params = new URLSearchParams();
  
  if (selectedCategories.length > 0) {
    params.set('category', selectedCategories.join(','));
  }
  
  if (priceRange) {
    params.set('price', priceRange);
  }
  
  if (sortBy !== 'newest') {
    params.set('sort', sortBy);
  }
  
  if (searchTerm && searchTerm.trim()) {
    params.set('search', searchTerm.trim());
  }
  
  // Reset to page 1 when filters change (except when just changing page)
  params.set('page', '1');
  setCurrentPage(1);
  
  setSearchParams(params);
};
  const handleCategoryChange = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelectedCategories);
  };

  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const applyFilters = () => {
    updateURL();
    setShowMobileFilters(false); // Close mobile filters after applying
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange('');
    setSortBy('newest');
    setSearchTerm('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const removeFilter = (filterType: string, value?: string) => {
    if (filterType === 'category' && value) {
      setSelectedCategories(prev => prev.filter(id => id !== value));
    } else if (filterType === 'price') {
      setPriceRange('');
    } else if (filterType === 'search') {
      setSearchTerm('');
    }
    
    // Apply changes immediately
    setTimeout(updateURL, 0);
  };

  const getActiveCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  const getPriceRangeLabel = (range: string) => {
    const priceRange = priceRanges.find(p => p.value === range);
    return priceRange ? priceRange.label : range;
  };

  const renderActiveFilters = () => {
    const hasActiveFilters = selectedCategories.length > 0 || priceRange || searchTerm;
    
    if (!hasActiveFilters) return null;

    return (
      <div className="mb-4 p-4 bg-gray-50 rounded-sm border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(categoryId => (
            <span
              key={categoryId}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
            >
              {getActiveCategoryName(categoryId)}
              <button
                onClick={() => removeFilter('category', categoryId)}
                className="ml-1 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {priceRange && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
              {getPriceRangeLabel(priceRange)}
              <button
                onClick={() => removeFilter('price')}
                className="ml-1 hover:text-green-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Search: "{searchTerm}"
              <button
                onClick={() => removeFilter('search')}
                className="ml-1 hover:text-purple-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderProductsGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
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

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      );
    }

    return (
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'flex flex-col'} gap-6`}>
        {products.map((product) => (
          <div
            key={product._id}
            className={`bg-white rounded-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
              viewMode === 'list' ? 'flex' : ''
            }`}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <div className={`${viewMode === 'list' ? 'w-1/3' : 'w-full'} h-40 bg-gray-100`}>
              <img
                src={product.mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
              <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
              <div className="mt-1">
                {product.averageRating && product.averageRating > 0 ? (
                  <StarRating rating={product.averageRating} />
                ) : (
                  <div className="text-sm text-gray-500">No reviews yet</div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Rs. {product.price}</span>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600">In Stock ({product.stock})</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>
              {viewMode === 'list' && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFilters = () => (
    <div className="bg-white rounded-sm border border-gray-200 p-4 ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        {(selectedCategories.length > 0 || priceRange || searchTerm) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Products
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Category Filter - Always visible */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Shop By Category</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label key={category._id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category._id)}
                onChange={() => handleCategoryChange(category._id)}
                className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter - Always visible */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Shop By Price</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex items-center">
              <input
                type="radio"
                name="price-range"
                checked={priceRange === range.value}
                onChange={() => handlePriceRangeChange(range.value)}
                className="text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={applyFilters}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <Filter className="w-4 h-4 mr-2" />
        Apply Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between bg-blue-600 text-white py-2 px-4 rounded-sm hover:bg-blue-700 transition-colors"
        >
          <span className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </span>
          {showMobileFilters ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Hidden on mobile, visible on desktop */}
        <div className={`w-full lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          {renderFilters()}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header with results and controls */}
          <div className="bg-white rounded-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Showing {products.length} of {totalProducts} products
                  {selectedCategories.length > 0 || priceRange || searchTerm ? ' (filtered)' : ''}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {renderActiveFilters()}

          {/* Products Grid/List */}
          {renderProductsGrid()}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-end">
              <nav className="flex items-center space-x-2">
                {/* Previous Button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1 rounded-sm text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  if (page > totalPages) return null;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-sm text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Show dots if there are more pages */}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}

                {/* Last page if not already shown */}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 rounded-sm text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                )}

                {/* Next Button */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1 rounded-sm text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};