import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dumbbell, Menu, X, ArrowUpRight, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Memberships', path: '/plans' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'trainer') return '/trainer/dashboard';
    return '/member/dashboard';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gym-bg/95 backdrop-blur-md border-b border-gym-border/80 shadow-2xl py-3'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo matching the reference aesthetic */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-black font-black font-display text-sm tracking-tighter shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-5 h-5 -rotate-45 text-black stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black uppercase tracking-tight text-white leading-none">
                  FitTrack <span className="text-gym-primary font-bold">Pro</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-gym-muted -mt-0.5">
                  Fitness Club
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links with Reference-Style Active Outline */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'border border-white text-white bg-white/5 shadow-sm'
                      : 'border border-transparent text-gray-300 hover:text-white hover:border-white/30'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(getDashboardPath())}
                icon={ArrowUpRight}
                className="font-display uppercase tracking-wider text-xs font-bold"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-gym-primary text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  Join Now
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gym-surface"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gym-surface/98 backdrop-blur-xl border-b border-gym-border px-6 pt-4 pb-8 space-y-3 mt-3 animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'border-l-2 border-gym-primary text-gym-primary bg-gym-primary/10'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="pt-4 border-t border-gym-border/80 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Button
                variant="primary"
                className="w-full uppercase font-display tracking-wider font-bold"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardPath());
                }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full uppercase tracking-wider text-xs">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full uppercase tracking-wider text-xs">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
