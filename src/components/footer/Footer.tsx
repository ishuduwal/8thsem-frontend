import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#222222] text-white pt-12 pb-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Kyanjinri</h3>
            <p className="text-gray-400 mb-4">
              Your premier destination for authentic Himalayan products and crafts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-purple-500 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-purple-500 transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-purple-500 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-purple-500 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-purple-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-purple-500 transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-purple-500 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-purple-500 transition-colors">Return Policy</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-purple-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-purple-500 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates on new arrivals and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 w-full rounded-l text-gray-800 focus:outline-none"
              />
              <button className="bg-[#454444] px-4 py-2 rounded-r transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Kyanjinri. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};