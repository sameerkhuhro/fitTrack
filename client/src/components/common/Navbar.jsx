import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dumbbell, Menu, X, ArrowRight, ArrowUpRight } from 'lucide-react';
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
          ? 'bg-[#191D20]/95 backdrop-blur-md border-b border-[#333e40] shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-[#191D20]/90 via-[#191D20]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo matching reference blueprint */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-neon flex items-center justify-center text-black font-black font-display shadow-neon-glow group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 -rotate-45 stroke-[2.8]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black uppercase tracking-tight text-white leading-none">
                FITTRACK <span className="text-neon">PRO</span>
              </span>
              <span className="text-[9px] tracking-[0.22em] uppercase font-bold text-[#AEB5B2] leading-none mt-1">
                FITNESS CLUB
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links with Small Neon-Green Active Indicator */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-neon font-bold'
                      : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_8px_#C6FF00] inline-block" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Action: Login / Dashboard Neon Button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(getDashboardPath())}
                className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-full shadow-neon-glow flex items-center gap-1.5 transition-all"
              >
                Dashboard
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:text-neon transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-full shadow-neon-glow flex items-center gap-1.5 transition-all"
                >
                  Join Now
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#191D20]/98 backdrop-blur-xl border-b border-[#333e40] px-6 pt-4 pb-8 space-y-3 mt-3 animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'border-l-2 border-neon text-neon bg-neon/10'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="pt-4 border-t border-[#243426] flex flex-col gap-2.5">
            {isAuthenticated ? (
              <button
                className="w-full bg-neon text-black py-3 rounded-full font-display font-black uppercase tracking-wider text-xs shadow-neon-glow flex items-center justify-center gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardPath());
                }}
              >
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-2.5 rounded-full border border-gray-600 font-display font-bold uppercase tracking-wider text-xs text-white">
                    Log In
                  </button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-3 rounded-full bg-neon text-black font-display font-black uppercase tracking-wider text-xs shadow-neon-glow flex items-center justify-center gap-2">
                    Join Now
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
