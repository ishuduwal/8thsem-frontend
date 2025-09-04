import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { decodeJWT } from '../../utils/jwtUtlis';
import { SearchSuggestions } from '../SearchSuggestions';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = decodeJWT(token);
      if (decodedToken && decodedToken.username) {
        setUsername(decodedToken.username);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update search query from URL params when on products page
  useEffect(() => {
    if (location.pathname === '/products') {
      const searchParams = new URLSearchParams(location.search);
      const searchParam = searchParams.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    } else {
      // Clear search query when not on products page
      setSearchQuery('');
      setShowSuggestions(false);
    }
  }, [location.pathname, location.search]);

  const isHomePage = location.pathname === '/';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUsername(null);
    window.location.href = '/';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length >= 2) {
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      setShowSuggestions(false);
      setSearchQuery('');
      searchInputRef.current?.blur();
      mobileSearchInputRef.current?.blur();
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // Delay closing suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 2 && isSearchFocused) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const closeSuggestions = () => {
    setShowSuggestions(false);
  };

  const handleSearchCallback = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    if (location.pathname === '/products') {
      // If on products page, navigate to clear search
      navigate('/products');
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${!isHomePage || isScrolled ? 'bg-[#222222] shadow-lg' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-1 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          <div className="flex items-center">
            <button
              className="md:hidden text-white mr-4"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="text-2xl font-bold text-white">
              AliAli
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form className="relative w-full" onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-2 px-4 pr-20 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  autoComplete="off"
                />
                <div className="absolute right-0 top-0 h-full flex items-center">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="px-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-3 text-gray-500 hover:text-gray-700 transition-colors rounded-r-lg"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
              <SearchSuggestions
                query={searchQuery}
                isOpen={showSuggestions}
                onClose={closeSuggestions}
                onSearch={handleSearchCallback}
              />
            </form>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/cart"
              className="text-white hover:text-gray-300 relative transition-colors duration-200"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-purple-500 rounded-full w-4 h-4 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            </Link>

            {username ? (
              <div className="relative group">
                <div className="flex-shrink-0 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer">
                  {username.charAt(0).toUpperCase()}
                </div>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-800 font-medium">Hello, {username}</p>
                  </div>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <User size={24} />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden my-3">
          <form className="relative w-full" onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 pr-20 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                autoComplete="off"
              />
              <div className="absolute right-0 top-0 h-full flex items-center">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
            <SearchSuggestions
              query={searchQuery}
              isOpen={showSuggestions}
              onClose={closeSuggestions}
              onSearch={(query) => {
                setSearchQuery(query);
                setShowSuggestions(false);
              }}
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#131921] pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {username ? (
              <>
                <div className="px-3 py-2 text-white">
                  <p className="text-base font-medium">Hello, {username}</p>
                </div>
                <Link
                  to="/account"
                  className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={toggleMobileMenu}
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={toggleMobileMenu}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="w-full text-left text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            )}
            <Link
              to="/wishlist"
              className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={toggleMobileMenu}
            >
              Wishlist
            </Link>
            <Link
              to="/cart"
              className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={toggleMobileMenu}
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};