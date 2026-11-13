import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dumbbell,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function Register() {
  const [searchParams] = useSearchParams();
  const preselectedPlanId = searchParams.get('planId');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
        },
      });

      if (preselectedPlanId) {
        navigate(`/member/membership?planId=${preselectedPlanId}`);
      } else {
        navigate('/member/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-gym-border/80 bg-gym-surface/90 shadow-2xl shadow-black/60">
        
        {/* Left Side: Membership Benefits Editorial Showcase */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-10 overflow-hidden bg-gym-bg">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transform hover:scale-100 transition-transform duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop')`,
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
              Athlete Onboarding
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-auto py-8">
            <h2 className="font-display text-3xl font-black text-gym-text tracking-tight uppercase leading-tight">
              Begin Your <span className="text-gym-primary">Transformation</span> Today
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-gym-muted">
              Register in under 60 seconds. Unlock Olympic lifting zones, recovery hydrotherapy suites, and dedicated coaching routines.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-gym-primary/20 text-gym-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gym-text">Tiered Subscription Plans</h4>
                  <p className="text-[11px] text-gym-muted">Flexible monthly, quarterly, and annual passes with transparent dues.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-gym-primary/20 text-gym-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gym-text">Online & Reception Payments</h4>
                  <p className="text-[11px] text-gym-muted">Pay securely via JazzCash, EasyPaisa, Bank Transfer, or Cash at the front desk.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-gym-primary/20 text-gym-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gym-text">Biometric & Routine Telemetry</h4>
                  <p className="text-[11px] text-gym-muted">Log weekly weight and waist measurements while viewing trainer-curated splits.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-gym-border/40 flex items-center justify-between text-[11px] text-gym-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gym-primary" />
              Verified Encrypted Registration
            </span>
            <span className="text-gym-primary font-mono">Enterprise Verified</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
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
            <div className="flex items-center justify-between">
              <h3 className="font-display text-3xl font-black text-gym-text tracking-tight uppercase">
                Create Account
              </h3>
              {preselectedPlanId && (
                <span className="px-2.5 py-1 rounded-full bg-gym-primary/10 border border-gym-primary/30 text-[10px] font-bold text-gym-primary uppercase tracking-wider">
                  Plan Selected
                </span>
              )}
            </div>
            <p className="text-xs text-gym-muted mt-1">
              Enter your details to create your athlete profile and initiate club enrollment
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
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gym-muted mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Farhan Siddiqui"
                  className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gym-muted mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="farhan@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gym-muted mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gym-muted">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-gym-primary hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gym-muted mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-2 border-t border-gym-border/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gym-muted flex items-center gap-1.5 mb-2.5">
                <HeartHandshake className="w-3.5 h-3.5 text-gym-primary" />
                Emergency Contact Details (Optional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Contact Name (e.g. Brother / Parent)"
                  className="w-full px-3.5 py-2.5 bg-gym-bg border border-gym-border rounded-xl text-xs text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary transition-all"
                />
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="Contact Phone Number"
                  className="w-full px-3.5 py-2.5 bg-gym-bg border border-gym-border rounded-xl text-xs text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-3 shadow-lg shadow-gym-primary/20 hover:shadow-gym-primary/40 text-sm font-bold uppercase tracking-wider"
              loading={loading}
              icon={ArrowRight}
            >
              Complete Registration & Enter
            </Button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-5 pt-4 border-t border-gym-border/60 text-center">
            <p className="text-xs text-gym-muted">
              Already have an active FitTrack account?{' '}
              <Link to="/login" className="text-gym-primary hover:underline font-bold">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
