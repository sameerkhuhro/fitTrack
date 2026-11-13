import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  Dumbbell,
  Calendar,
  TrendingUp,
  CheckSquare,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Badge from '../components/common/Badge';

export default function MemberLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const notifRes = await api.get('/notifications');
        if (notifRes.data.success) {
          setUnreadCount(notifRes.data.unreadCount || 0);
        }

        const summaryRes = await api.get('/dashboard/member-summary');
        if (summaryRes.data.success) {
          setDaysRemaining(summaryRes.data.data.daysRemaining);
        }
      } catch (e) {}
    };

    fetchMemberData();
    const interval = setInterval(fetchMemberData, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/member', icon: LayoutDashboard, end: true },
    { name: 'My Membership', path: '/member/membership', icon: ShieldCheck },
    { name: 'Payments & Dues', path: '/member/payments', icon: CreditCard },
    { name: 'Assigned Workouts', path: '/member/workouts', icon: Dumbbell },
    { name: 'Workout Calendar', path: '/member/calendar', icon: Calendar },
    { name: 'Fitness Progress', path: '/member/progress', icon: TrendingUp },
    { name: 'Attendance History', path: '/member/attendance', icon: CheckSquare },
    { name: 'Notifications', path: '/member/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile & Settings', path: '/member/profile', icon: User },
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
              FitTrack <span className="text-gym-primary">Member</span>
            </h1>
            <p className="text-[10px] text-gym-muted -mt-0.5 uppercase tracking-wider">Athlete Portal</p>
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
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gym-danger text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-gym-border bg-gym-surfaceLight/30 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gym-primary/20 text-gym-primary font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name?.[0] || 'M'}
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
            className="text-gym-muted hover:text-gym-danger p-1.5 rounded-lg hover:bg-gym-surfaceLight"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
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
              <h2 className="text-sm font-semibold text-gym-text">Athlete Dashboard</h2>
              <p className="text-xs text-gym-muted">Your Training & Subscription Statistics</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {daysRemaining !== null && daysRemaining > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gym-primary/10 border border-gym-primary/30 rounded-full text-xs text-gym-primary font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{daysRemaining} Days Left</span>
              </div>
            )}

            <Link
              to="/member/notifications"
              className="relative p-2 rounded-lg text-gym-muted hover:text-gym-text hover:bg-gym-surfaceLight transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gym-danger ring-2 ring-gym-surface"></span>
              )}
            </Link>

            <div className="h-6 w-px bg-gym-border"></div>

            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">Member</Badge>
              <span className="text-xs font-semibold text-gym-text hidden sm:inline">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">
            <Outlet />
          </div>
          <footer className="mt-8 pt-4 border-t border-gym-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gym-muted">
            <p>&copy; {new Date().getFullYear()} FitTrack Pro Fitness Club. All Rights Reserved.</p>
            <p>
              Developed by{' '}
              <a
                href="https://www.linkedin.com/in/sameer-khuhro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gym-primary font-semibold hover:underline"
              >
                Sameer Khuhro
              </a>
            </p>
          </footer>
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
                <span className="font-bold text-gym-text">FitTrack Member</span>
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
    </div>
  );
}

