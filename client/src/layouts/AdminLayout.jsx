import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  DollarSign,
  Dumbbell,
  Calendar,
  ClipboardList,
  CheckSquare,
  TrendingUp,
  Bell,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  FileCheck,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

export default function AdminLayout() {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Forced password change modal state
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

  // Fetch unread notifications count
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
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Members', path: '/admin/members', icon: Users },
    { name: 'Trainers', path: '/admin/trainers', icon: UserCheck },
    { name: 'Membership Plans', path: '/admin/plans', icon: ClipboardList },
    { name: 'Subscriptions', path: '/admin/memberships', icon: FileCheck },
    { name: 'Payments & Receipts', path: '/admin/payments', icon: CreditCard },
    { name: 'Trainer Salaries', path: '/admin/salaries', icon: DollarSign },
    { name: 'Exercise Library', path: '/admin/exercises', icon: Dumbbell },
    { name: 'Workout Plans', path: '/admin/workouts', icon: ClipboardList },
    { name: 'Workout Sessions', path: '/admin/sessions', icon: Calendar },
    { name: 'Daily Attendance', path: '/admin/attendance', icon: CheckSquare },
    { name: 'Fitness Progress', path: '/admin/progress', icon: TrendingUp },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell, badge: unreadCount },
    { name: 'Reports & Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Contact Messages', path: '/admin/contact', icon: MessageSquare },
    { name: 'Gym Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gym-bg text-gym-text flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gym-surface border-r border-gym-border shrink-0 fixed inset-y-0 z-30">
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-gym-border gap-3">
          <div className="w-9 h-9 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary">
            <Dumbbell className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gym-text">
              FitTrack <span className="text-gym-primary">Admin</span>
            </h1>
            <p className="text-[10px] text-gym-muted -mt-0.5 uppercase tracking-wider">Gym Control Center</p>
          </div>
        </div>

        {/* Nav Links */}
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
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gym-danger text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-gym-border bg-gym-surfaceLight/30 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gym-primary/20 text-gym-primary font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-gym-text truncate">{user?.name}</p>
              <p className="text-[10px] text-gym-muted truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Log Out"
            className="text-gym-muted hover:text-gym-danger p-1.5 rounded-lg hover:bg-gym-surfaceLight transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-gym-surface/80 backdrop-blur-md border-b border-gym-border sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gym-muted hover:text-gym-text hover:bg-gym-surfaceLight"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-gym-text">Gym Administration Suite</h2>
              <p className="text-xs text-gym-muted">FitTrack Pro Central System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/notifications"
              className="relative p-2 rounded-lg text-gym-muted hover:text-gym-text hover:bg-gym-surfaceLight transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gym-danger ring-2 ring-gym-surface"></span>
              )}
            </Link>

            <div className="h-6 w-px bg-gym-border"></div>

            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">Admin</Badge>
              <span className="text-xs font-semibold text-gym-text hidden sm:inline">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-gym-surface border-r border-gym-border p-4 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gym-border mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-gym-primary" />
                <span className="font-bold text-gym-text">FitTrack Admin</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gym-muted hover:text-gym-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-gym-primary text-black font-semibold' : 'text-gym-muted hover:text-gym-text'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Forced Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {}}
        title="Security Notice: Password Change Required"
      >
        <p className="text-xs text-gym-muted mb-4">
          For system security, your temporary administrative password must be replaced with a secure personal password.
        </p>
        {pwdError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {pwdError}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">New Password (min 6 chars)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>
          <Button type="submit" variant="primary" loading={pwdLoading} className="w-full">
            Update Password & Continue
          </Button>
        </form>
      </Modal>
    </div>
  );
}
