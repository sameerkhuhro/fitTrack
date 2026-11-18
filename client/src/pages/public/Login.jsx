import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Activity,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-gym-border/80 bg-gym-surface/90 shadow-2xl shadow-black/60">
        
        {/* Left Side: Editorial Fitness Showcase */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-10 overflow-hidden bg-gym-bg">
          {/* Background Image with Dark Vignette */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transform hover:scale-100 transition-transform duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gym-surface/80" />

          {/* Top Brand */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary group-hover:bg-gym-primary group-hover:text-black transition-all">
                <Dumbbell className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gym-text">
                FitTrack <span className="text-gym-primary">Pro</span>
              </span>
            </Link>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gym-primary/10 border border-gym-primary/20 text-[11px] font-semibold text-gym-primary uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Enterprise Club System
            </div>
          </div>

          {/* Center Motivational Copy */}
          <div className="relative z-10 my-auto py-8">
            <h2 className="font-display text-3xl font-black text-gym-text tracking-tight uppercase leading-tight">
              Elevate Your <span className="text-gym-primary">Strength</span> & Operations
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-gym-muted">
              Unified digital infrastructure connecting club administration, elite strength coaches, and dedicated athletes through real-time telemetry.
            </p>

            {/* Feature Highlights */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gym-text">Role-segregated JWT authenticated portals</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gym-text">Custom exercise routines & biometric progress tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gym-text">Automated membership dues, payroll & cash receipting</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-gym-border/40 flex items-center justify-between text-[11px] text-gym-muted">
            <span>TLS / SSL Encrypted</span>
            <span className="text-gym-primary">v2.4.0 Production</span>
          </div>
        </div>

        {/* Right Side: Authentication Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-gym-surface/95 backdrop-blur-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 group mb-3">
              <div className="w-9 h-9 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary">
                <Dumbbell className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gym-text">
                FitTrack <span className="text-gym-primary">Pro</span>
              </span>
            </Link>
          </div>

          <div className="mb-6">
            <h3 className="font-display text-3xl font-black text-gym-text tracking-tight uppercase">
              Portal Access
            </h3>
            <p className="text-xs text-gym-muted mt-1">
              Enter your credentials to access your dedicated terminal
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="text-xs">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gym-muted mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@fittrack.com"
                  className="w-full pl-10 pr-4 py-3 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary focus:ring-1 focus:ring-gym-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gym-muted">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-gym-primary hover:underline flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary focus:ring-1 focus:ring-gym-primary transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 mt-2 shadow-lg shadow-gym-primary/20 hover:shadow-gym-primary/40 text-sm font-bold uppercase tracking-wider"
              loading={loading}
              icon={ArrowRight}
            >
              Sign In to Terminal
            </Button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-5 border-t border-gym-border/60 text-center">
            <p className="text-xs text-gym-muted">
              New athlete seeking membership?{' '}
              <Link to="/register" className="text-gym-primary hover:underline font-bold">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
