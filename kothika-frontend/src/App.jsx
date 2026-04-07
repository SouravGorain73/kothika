import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Home from './pages/Home';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loadingUser } = useContext(AuthContext);
  
  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loadingUser } = useContext(AuthContext);
  
  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

const AppLayout = ({ children, showNav = true }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-dark flex justify-center">
      <div className="flex w-full max-w-[1280px]">
        {/* Left Sidebar Navigation */}
        {showNav && (
          <aside className="hidden md:flex flex-col w-[68px] xl:w-[275px] shrink-0 sticky top-0 h-screen border-r border-dark-400/50">
            <Navbar />
          </aside>
        )}
        
        {/* Main Content */}
        <main className="flex-1 min-w-0 border-r border-dark-400/50 min-h-screen">
          {children}
        </main>

        {/* Right Sidebar (visible on large screens) */}
        <aside className="hidden lg:block w-[350px] shrink-0 sticky top-0 h-screen overflow-y-auto hide-scrollbar p-4">
          <RightSidebar />
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      {showNav && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark border-t border-dark-400/50 z-50">
          <Navbar mobile />
        </div>
      )}
    </div>
  );
};

const RightSidebar = () => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Kothika"
          className="w-full bg-dark-200 border border-dark-400/50 rounded-full px-5 py-2.5 text-sm text-dark-800 placeholder-dark-600 
                     focus:border-brand focus:bg-dark outline-none transition-all duration-200"
        />
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {/* Trending */}
      <div className="glass-card overflow-hidden">
        <h3 className="text-xl font-bold text-dark-800 px-4 pt-4 pb-2">Trends for you</h3>
        <TrendingItem label="Technology" category="Trending in Tech" posts="2,847" />
        <TrendingItem label="AI & Machine Learning" category="Trending" posts="14.5K" />
        <TrendingItem label="Spring Boot" category="Trending in Development" posts="1,204" />
        <TrendingItem label="React 19" category="Trending in Web Dev" posts="5,692" />
        <div className="px-4 py-3">
          <span className="text-brand text-sm hover:underline cursor-pointer">Show more</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 text-xs text-dark-600 space-x-2">
        <span>Terms of Service</span>
        <span>·</span>
        <span>Privacy Policy</span>
        <span>·</span>
        <span>© 2026 Kothika</span>
      </div>
    </div>
  );
};

const TrendingItem = ({ label, category, posts }) => (
  <div className="trending-item">
    <p className="text-xs text-dark-600">{category}</p>
    <p className="font-bold text-dark-800 text-[15px]">{label}</p>
    <p className="text-xs text-dark-600">{posts} posts</p>
  </div>
);

const AppContent = () => {
  return (
    <Routes>
      {/* Public routes (redirect to dashboard if already logged in) */}
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute><Register /></PublicRoute>
      } />

      {/* Public home (no auth required, but shows layout if logged in) */}
      <Route path="/home" element={
        <AppLayout><Home /></AppLayout>
      } />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout><Settings /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}