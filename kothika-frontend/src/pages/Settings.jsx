import React, { useEffect, useState, useContext } from 'react';
import { Settings as SettingsIcon, User, Mail, Hash, Shield, LogOut, Edit2, X, AlertCircle, Check } from 'lucide-react';
import { userService } from '../api/userService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user: contextUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(contextUser);
  const [loading, setLoading] = useState(!contextUser);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
  
  // Profile Form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileMsg, setProfileMsg] = useState('');
  
  // Password Form
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    if (!contextUser) {
      userService.getCurrentUser()
        .then((res) => {
            setUser(res.data);
            setProfileForm({ name: res.data.name, email: res.data.email });
        })
        .catch((err) => console.error('Failed to load user:', err))
        .finally(() => setLoading(false));
    } else {
        setProfileForm({ name: contextUser.name, email: contextUser.email });
    }
  }, [contextUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileSubmit = async (e) => {
      e.preventDefault();
      try {
          const res = await userService.updateProfile(profileForm);
          setUser(res.data);
          setIsEditingProfile(false);
          setProfileMsg('Profile updated successfully!');
          setTimeout(() => setProfileMsg(''), 3000);
      } catch (err) {
          console.error(err);
          alert('Failed to update profile.');
      }
  };

  const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      setPwdError('');
      setPasswordMsg('');
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          setPwdError('New passwords do not match!');
          return;
      }
      try {
          await userService.updatePassword({ 
              currentPassword: passwordForm.currentPassword, 
              newPassword: passwordForm.newPassword 
          });
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordMsg('Password updated successfully!');
          setTimeout(() => setPasswordMsg(''), 3000);
      } catch (err) {
          setPwdError(err.response?.data?.message || 'Failed to update password.');
      }
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
        <p className="text-sm text-dark-600">Manage your account and privacy</p>
      </div>

      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-800">{user?.name || 'User'}</h2>
              <p className="text-dark-600 text-sm">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-dark-400/50 mb-4 px-2">
            <button 
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 transition-colors ${activeTab === 'profile' ? 'border-brand text-brand font-bold' : 'border-transparent text-dark-600 hover:text-dark-800'}`}
            >
                Edit Profile
            </button>
            <button 
                onClick={() => setActiveTab('security')}
                className={`py-2 px-1 border-b-2 transition-colors ${activeTab === 'security' ? 'border-brand text-brand font-bold' : 'border-transparent text-dark-600 hover:text-dark-800'}`}
            >
                Security & Password
            </button>
        </div>

        {/* Tab Contents */}
        <div className="glass-card p-6">
            {activeTab === 'profile' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-dark-800">Personal Information</h3>
                        {!isEditingProfile && (
                            <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-1 text-sm text-brand hover:underline">
                                <Edit2 size={14} /> Edit
                            </button>
                        )}
                    </div>
                    {profileMsg && <div className="text-green-500 text-sm mb-4 flex items-center gap-1"><Check size={16}/> {profileMsg}</div>}
                    
                    {isEditingProfile ? (
                        <form onSubmit={handleProfileSubmit} className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Display Name</label>
                                <input 
                                    type="text" 
                                    value={profileForm.name} 
                                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                    className="input-dark bg-dark-100" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={profileForm.email} 
                                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                    className="input-dark bg-dark-100" 
                                    required 
                                />
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-outline text-sm px-4 py-1.5">Cancel</button>
                                <button type="submit" className="btn-primary text-sm px-4 py-1.5">Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <InfoRow icon={User} label="Display Name" value={user?.name} />
                            <InfoRow icon={Mail} label="Email Address" value={user?.email} />
                            <InfoRow icon={Hash} label="User ID" value={user?.id} mono />
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'security' && (
                <div>
                    <h3 className="text-lg font-bold text-dark-800 mb-4 flex items-center gap-2"><Shield size={18}/> Update Password</h3>
                    {passwordMsg && <div className="text-green-500 text-sm mb-4 flex items-center gap-1"><Check size={16}/> {passwordMsg}</div>}
                    {pwdError && <div className="text-red-400 text-sm mb-4 flex items-center gap-1"><AlertCircle size={16}/> {pwdError}</div>}
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Current Password</label>
                            <input 
                                type="password" 
                                value={passwordForm.currentPassword} 
                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                className="input-dark bg-dark-100" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                value={passwordForm.newPassword} 
                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                className="input-dark bg-dark-100" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={passwordForm.confirmPassword} 
                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                className="input-dark bg-dark-100" 
                                required 
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="btn-primary text-sm w-full py-2">Update Password</button>
                        </div>
                    </form>
                </div>
            )}
        </div>

        {/* Danger Zone */}
        <div className="glass-card overflow-hidden border-red-500/20 mt-8">
          <h3 className="text-[15px] font-bold text-dark-800 px-4 pt-4 pb-2">Danger Zone</h3>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 transition-colors text-left text-red-400"
          >
            <LogOut size={18} />
            <span className="text-[15px]">Log out from device</span>
          </button>
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