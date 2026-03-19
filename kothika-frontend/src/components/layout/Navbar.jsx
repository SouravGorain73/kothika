import React, { useContext, useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center w-full">
      
      {/* Logo */}
      <div 
        className="flex items-center gap-2 text-blue-600 font-bold text-xl cursor-pointer"
        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
      >
        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">K</div>
        othika
      </div>
      
      {/* Right Section */}
      <div className="relative">
        {isAuthenticated ? (
          <>
            {/* Profile Icon */}
            <button 
              onClick={() => setOpen(!open)}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
            >
              <User size={20} />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border">
                
                <button
                  onClick={() => {
                    navigate('/settings');
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>

              </div>
            )}
          </>
        ) : (
          <div className="text-sm font-medium text-gray-500">
            Blog Management System
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;