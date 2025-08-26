import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  TicketPercent,
  Users
} from "lucide-react";

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

  const sidebarLinks: SidebarLink[] = [
    { id: 1, path: "/admin-dashboard", name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 2, path: "/admin-dashboard/products", name: "Products", icon: <Package className="h-5 w-5" /> },
    { id: 3, path: "/admin-dashboard/categories", name: "Categories", icon: <Layers className="h-5 w-5" /> },
    { id: 4, path: "/admin-dashboard/orders", name: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { id: 5, path: "/admin-dashboard/discounts", name: "Discounts", icon: <TicketPercent className="h-5 w-5" /> },
    { id: 6, path: "/admin-dashboard/user-management", name: "User Management", icon: <Users className="h-5 w-5" /> },
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