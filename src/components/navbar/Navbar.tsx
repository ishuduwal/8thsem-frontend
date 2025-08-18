import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, User, Menu, X, Search } from 'lucide-react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-[#131921] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-1 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          <div className="flex items-center">
            <button
              className="md:hidden text-white mr-4"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="text-2xl font-bold">
              Kyanjinri
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 px-4 rounded-lg text-gray-800 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-0 top-0 h-full px-3 text-gray-500 rounded-lg">
                <Search size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/wishlist" className="text-white hover:text-gray-300 transition-colors duration-200">
              <Heart size={24} />
            </Link>
            <Link to="/cart" className="text-white hover:text-gray-300 relative transition-colors duration-200">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-purple-500 rounded-full w-4 h-4 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            </Link>
            <Link to="/account" className="text-white hover:text-gray-300 transition-colors duration-200">
              <User size={24} />
            </Link>
          </div>
        </div>

        <div className="md:hidden my-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 px-4 rounded text-gray-800 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-0 top-0 h-full px-3 text-gray-500">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#131921] pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/login"
              className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Login
            </Link>
            <Link
              to="/wishlist"
              className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Wishlist
            </Link>
            <Link
              to="/cart"
              className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Cart
            </Link>
            <Link
              to="/account"
              className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};