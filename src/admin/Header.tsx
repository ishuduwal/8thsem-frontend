import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, Settings, LogOut } from 'lucide-react';

export const Header = () => {
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                // Simple token parsing (in a real app, use proper JWT decoding)
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload && payload.username) {
                    setUsername(payload.username);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/admin/login');
    };

    return (
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
            <div>
                <h1 className="text-xs text-gray-500">Welcome Back!</h1>
                <p className="text-xl font-semibold text-gray-800">{username || 'Admin'}</p>
            </div>
            <div className="flex items-center space-x-5">
                {/* User Profile Dropdown */}
                <div className="relative group">
                    <button className="flex items-center space-x-2 focus:outline-none">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                            <User size={18} />
                        </div>
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 border border-gray-100">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm text-gray-800 font-medium">Hello, {username || 'Admin'}</p>
                        </div>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center space-x-2">
                            <Settings size={16} />
                            <span>Settings</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center space-x-2"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};