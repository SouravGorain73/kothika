import React, { useContext, useState } from 'react';
import { Home, LayoutDashboard, Settings, LogOut, Feather, User, MoreHorizontal } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ mobile = false }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/home', public: true },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', public: false },
    { icon: Settings, label: 'Settings', path: '/settings', public: false },
  ];

  const filteredItems = navItems.filter(item => item.public || isAuthenticated);

  // Mobile bottom nav
  if (mobile) {
    return (
      <div className="flex justify-around items-center py-2 px-4">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`p-3 rounded-full transition-colors ${
                isActive ? 'text-brand' : 'text-dark-700 hover:text-dark-800'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
            </button>
          );
        })}
        {isAuthenticated && (
          <button
            onClick={() => navigate('/dashboard')}
            className="p-3 rounded-full bg-brand text-white"
          >
            <Feather size={20} />
          </button>
        )}
      </div>
    );
  }

  // Desktop sidebar nav
  return (
    <div className="flex flex-col h-full py-2 px-3 xl:pr-8">
      {/* Logo */}
      <button
        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/home')}
        className="p-3 rounded-full hover:bg-dark-200 transition-colors w-fit mb-2"
      >
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
          <span className="text-white font-black text-lg">K</span>
        </div>
      </button>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-link w-full ${isActive ? 'active font-bold' : 'font-normal'}`}
            >
              <Icon size={26} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="hidden xl:inline text-[20px]">{item.label}</span>
            </button>
          );
        })}

        {/* Post Button */}
        {isAuthenticated && (
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full mt-4 hidden xl:flex justify-center items-center gap-2 text-[17px] py-3"
          >
            <Feather size={20} />
            Post
          </button>
        )}

        {/* Mobile post button (icon only) */}
        {isAuthenticated && (
          <button
            onClick={() => navigate('/dashboard')}
            className="xl:hidden btn-primary p-3 rounded-full mt-4 flex items-center justify-center"
          >
            <Feather size={22} />
          </button>
        )}
      </nav>

      {/* User Profile at bottom */}
      {isAuthenticated && user && (
        <div className="relative mt-auto mb-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 w-full p-3 rounded-full hover:bg-dark-200 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || <User size={18} />}
            </div>
            <div className="hidden xl:block flex-1 text-left min-w-0">
              <p className="text-[15px] font-bold text-dark-800 truncate">{user.name}</p>
              <p className="text-sm text-dark-600 truncate">{user.email}</p>
            </div>
            <MoreHorizontal size={18} className="hidden xl:block text-dark-700" />
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 glass-card shadow-2xl overflow-hidden animate-scale-in z-50">
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-200 transition-colors text-left text-[15px]"
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <div className="border-t border-dark-400/50" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-200 transition-colors text-left text-red-400 text-[15px]"
              >
                <LogOut size={18} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;