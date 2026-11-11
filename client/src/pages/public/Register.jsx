import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Dumbbell, User, Mail, Lock, Phone, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

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
        navigate(`/member/memberships?planId=${preselectedPlanId}`);
      } else {
        navigate('/member');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-160px)]">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary group-hover:bg-gym-primary group-hover:text-black transition-all">
              <Dumbbell className="w-6 h-6 -rotate-45" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gym-text">
              FitTrack <span className="text-gym-primary">Pro</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-gym-text">Create Member Account</h2>
          <p className="text-xs text-gym-muted mt-1">
            Sign up to select a membership plan, track workouts, and monitor dues
          </p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Usman Tariq"
                  className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usman@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-2 border-t border-gym-border">
              <span className="text-[11px] font-semibold uppercase text-gym-muted block mb-3">
                Emergency Contact (Optional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Guardian / Contact Name"
                  className="w-full px-3.5 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                />
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="Emergency Phone #"
                  className="w-full px-3.5 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              loading={loading}
              icon={ArrowRight}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gym-border text-center">
            <p className="text-xs text-gym-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-gym-primary hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

