import { useState } from "react";
import { Link } from "react-router-dom";

interface SidebarLink {
  id: number;
  path: string;
  name: string;
  icon: React.ReactNode;
}

export const Sidebar = () => {
  const [activeLink, setActiveLink] = useState<number>(0);
  
  const handleLinkClick = (index: number) => {
    setActiveLink(index);
  };

  // Define all icon components
  const DashboardIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );

  const ProductsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
  );

  const CategoriesIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A1 1 0 019.293 9H17a1 1 0 011 1zm-7.707-7a1 1 0 011.414 0l7 7a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L3.707 10.707a1 1 0 01-1.414-1.414l7-7z" clipRule="evenodd" />
    </svg>
  );

  const OrdersIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
    </svg>
  );

  const DiscountIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.538 1.118L10 14.347l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.286-3.95a1 1 0 00-.364-1.118L2.644 9.377c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.95z" />
    </svg>
  );
  


  const sidebarLinks: SidebarLink[] = [
    { id: 1, path: "/admin-dashboard", name: "Dashboard", icon: DashboardIcon },
    { id: 2, path: "/admin-dashboard/products", name: "Products", icon: ProductsIcon },
    { id: 3, path: "/admin-dashboard/categories", name: "Categories", icon: CategoriesIcon },
    { id: 4, path: "/admin-dashboard/orders", name: "Orders", icon: OrdersIcon },
    { id: 5, path: "/admin-dashboard/discounts", name: "Discounts", icon: DiscountIcon },
  ];

  return (
    <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-screen border-r pt-8 px-4 bg-white">
      <div className="mb-8">
        <p className="w-auto hidden md:block text-lg font-semibold">Ecommerce Mart</p>
        <p className="w-8 block md:hidden text-lg font-semibold">Mart</p>
      </div>
      
      <ul className="space-y-2">
        {sidebarLinks.map((link, index) => (
          <li 
            key={link.id} 
            className={`font-medium rounded-md py-2 px-3 hover:bg-gray-100 hover:text-indigo-500 ${
              activeLink === index ? "bg-indigo-100 text-indigo-500" : ""
            }`}
          >
            <Link 
              to={link.path} 
              className="flex justify-center md:justify-start items-center md:space-x-3"
              onClick={() => handleLinkClick(index)}
            >
              <span className="flex-shrink-0">
                {link.icon}
              </span>
              <span className="text-sm hidden md:inline">{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};