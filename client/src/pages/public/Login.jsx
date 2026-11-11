import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Lock, Mail, ArrowRight, AlertCircle, ShieldAlert, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'trainer') {
        navigate('/trainer');
      } else {
        navigate('/member');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for University PBL demonstrations
  const fillCredentials = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@fittrack.com');
      setPassword('Admin@FitTrack2026!');
    } else if (role === 'trainer') {
      setEmail('hamza.trainer@fittrack.com');
      setPassword('Trainer@FitTrack2026!');
    } else if (role === 'member') {
      setEmail('ali.member@fittrack.com');
      setPassword('Member@FitTrack2026!');
    }
  };

  return (
    <div className="py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-160px)]">
      <div className="max-w-md w-full">
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
          <h2 className="text-2xl font-extrabold text-gym-text">Sign In to Your Account</h2>
          <p className="text-xs text-gym-muted mt-1">
            Access your workouts, payments, and management portals
          </p>
        </div>

        {/* Demo Fast-Switch Buttons */}
        <div className="bg-gym-surface border border-gym-border rounded-xl p-3.5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gym-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gym-primary" />
              Demo Fast-Login (1-Click Fill)
            </span>
            <span className="text-[10px] text-gym-accent font-medium">PBL Evaluation</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gym-bg border border-gym-border hover:border-gym-primary text-gym-text transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('trainer')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gym-bg border border-gym-border hover:border-gym-primary text-gym-text transition-colors"
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('member')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gym-bg border border-gym-border hover:border-gym-primary text-gym-text transition-colors"
            >
              Member
            </button>
          </div>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
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
              Log In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gym-border text-center">
            <p className="text-xs text-gym-muted">
              Don't have a gym membership yet?{' '}
              <Link to="/register" className="text-gym-primary hover:underline font-semibold">
                Register as Member
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

