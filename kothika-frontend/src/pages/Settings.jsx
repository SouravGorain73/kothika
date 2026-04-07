import React, { useEffect, useState, useContext } from 'react';
import { Settings as SettingsIcon, User, Mail, Hash, Shield, LogOut } from 'lucide-react';
import { userService } from '../api/userService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user: contextUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(contextUser);
  const [loading, setLoading] = useState(!contextUser);

  useEffect(() => {
    if (!contextUser) {
      userService.getCurrentUser()
        .then((res) => setUser(res.data))
        .catch((err) => console.error('Failed to load user:', err))
        .finally(() => setLoading(false));
    }
  }, [contextUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-dark-400/50 px-4 py-3">
          <h1 className="text-xl font-bold text-dark-800">Settings</h1>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-20 skeleton rounded-2xl w-full" />
          <div className="h-40 skeleton rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-dark-400/50 px-4 py-3">
        <h1 className="text-xl font-bold text-dark-800">Settings</h1>
        <p className="text-sm text-dark-600">Manage your account</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-800">{user?.name || 'User'}</h2>
              <p className="text-dark-600 text-sm">{user?.email || 'email@example.com'}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-4">
            <InfoRow icon={User} label="Display Name" value={user?.name} />
            <InfoRow icon={Mail} label="Email Address" value={user?.email} />
            <InfoRow icon={Hash} label="User ID" value={user?.id} mono />
          </div>
        </div>

        {/* Account Section */}
        <div className="glass-card overflow-hidden">
          <h3 className="text-[15px] font-bold text-dark-800 px-4 pt-4 pb-2">Account</h3>

          <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-200 transition-colors text-left">
            <Shield size={18} className="text-dark-600" />
            <div>
              <p className="text-[15px] text-dark-800">Security & Privacy</p>
              <p className="text-xs text-dark-600">Manage your password and privacy settings</p>
            </div>
          </button>

          <div className="border-t border-dark-400/50" />

          <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-200 transition-colors text-left">
            <SettingsIcon size={18} className="text-dark-600" />
            <div>
              <p className="text-[15px] text-dark-800">Preferences</p>
              <p className="text-xs text-dark-600">Notifications, display, and language</p>
            </div>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="glass-card overflow-hidden border-red-500/20">
          <h3 className="text-[15px] font-bold text-dark-800 px-4 pt-4 pb-2">Danger Zone</h3>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 transition-colors text-left text-red-400"
          >
            <LogOut size={18} />
            <span className="text-[15px]">Log out</span>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-dark-600">Kothika v1.0.0 · © 2026</p>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value, mono = false }) => (
  <div className="flex items-center gap-3 py-2 border-b border-dark-400/30 last:border-0">
    <Icon size={16} className="text-dark-600 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-dark-600 mb-0.5">{label}</p>
      <p className={`text-[15px] text-dark-800 truncate ${mono ? 'font-mono text-sm' : ''}`}>
        {value || '—'}
      </p>
    </div>
  </div>
);

export default Settings;