import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  DollarSign,
  Dumbbell,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

export default function TrainerLayout() {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Forced password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (user?.mustChangePassword) {
      setShowPasswordModal(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.data.success) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (e) {}
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdError('');
    try {
      await changePassword(currentPassword, newPassword);
      setShowPasswordModal(false);
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Password update failed.');
    } finally {
      setPwdLoading(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/trainer', icon: LayoutDashboard, end: true },
    { name: 'Assigned Members', path: '/trainer/members', icon: Users },
    { name: 'Workout Plans', path: '/trainer/workouts', icon: ClipboardList },
    { name: 'Training Schedule', path: '/trainer/schedule', icon: Calendar },
    { name: 'Salary & Confirmation', path: '/trainer/salaries', icon: DollarSign },
    { name: 'Exercise Library', path: '/trainer/exercises', icon: Dumbbell },
    { name: 'My Profile', path: '/trainer/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gym-bg text-gym-text flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gym-surface border-r border-gym-border shrink-0 fixed inset-y-0 z-30">
        <div className="h-20 flex items-center px-6 border-b border-gym-border gap-3">
          <div className="w-9 h-9 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary">
            <Dumbbell className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gym-text">
              FitTrack <span className="text-gym-primary">Coach</span>
            </h1>
            <p className="text-[10px] text-gym-muted -mt-0.5 uppercase tracking-wider">Trainer Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-gym-primary text-black font-semibold shadow-sm'
                      : 'text-gym-muted hover:text-gym-text hover:bg-gym-surfaceLight'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-gym-border bg-gym-surfaceLight/30 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gym-primary/20 text-gym-primary font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name?.[0] || 'T'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-gym-text truncate">{user?.name}</p>
              <p className="text-[10px] text-gym-muted truncate">{user?.specialization || 'Certified Trainer'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Log Out"
            className="text-gym-muted hover:text-gym-danger p-1.5 rounded-lg hover:bg-gym-surfaceLight"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-gym-surface/80 backdrop-blur-md border-b border-gym-border sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gym-muted hover:text-gym-text hover:bg-gym-surfaceLight"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-gym-text">Trainer Command Hub</h2>
              <p className="text-xs text-gym-muted">Assigned Athlete Workouts & Sessions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/trainer/salaries"
              className="relative p-2 rounded-lg text-gym-muted hover:text-gym-text hover:bg-gym-surfaceLight transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gym-danger ring-2 ring-gym-surface"></span>
              )}
            </Link>

            <div className="h-6 w-px bg-gym-border"></div>

            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">Trainer</Badge>
              <span className="text-xs font-semibold text-gym-text hidden sm:inline">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Forced Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {}}
        title="Security Notice: First-Time Password Change"
      >
        <p className="text-xs text-gym-muted mb-4">
          Your account was provisioned with a temporary password. You must configure your permanent personal password before continuing.
        </p>
        {pwdError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {pwdError}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Current Temporary Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">New Password (min 6 characters)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>
          <Button type="submit" variant="primary" loading={pwdLoading} className="w-full">
            Save New Password & Continue
          </Button>
        </form>
      </Modal>
    </div>
  );
}

