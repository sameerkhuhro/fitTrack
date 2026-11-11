import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Dumbbell,
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertCircle,
  UserCheck,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MemberDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/member-summary')
      .then((res) => {
        if (res.data.success) {
          setSummary(res.data.data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading athlete dashboard..." />;
  }

  const active = summary?.activeMembership;
  const pending = summary?.pendingMembership;
  const daysRemaining = summary?.daysRemaining || 0;
  const outstandingDues = summary?.outstandingDues || 0;
  const verifiedPaid = summary?.verifiedPaid || 0;
  const latestProgress = summary?.latestProgress;
  const activePlan = summary?.activePlan;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Welcome Back, Athlete!</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Your personalized fitness overview, upcoming training blocks, and account status
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!active && (
            <Link to="/member/membership">
              <Button size="sm" variant="primary" icon={ShieldCheck}>
                Subscribe to Plan
              </Button>
            </Link>
          )}
          {outstandingDues > 0 && (
            <Link to="/member/payments">
              <Button size="sm" variant="outline" icon={CreditCard}>
                Pay Outstanding Dues
              </Button>
            </Link>
          )}
          <Link to="/member/progress">
            <Button size="sm" variant="secondary" icon={TrendingUp}>
              Log Biometrics
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Membership Notice */}
      {pending && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Membership Request Pending Verification
              </h4>
              <p className="text-xs text-gym-text mt-0.5">
                Your request for the <strong>{pending.plan?.name} Plan (Rs. {pending.totalAmount?.toLocaleString()})</strong> is under administrative review. Please submit payment proof to expedite activation.
              </p>
            </div>
          </div>
          <Link to="/member/payments">
            <Button size="sm" variant="secondary">
              Submit Payment
            </Button>
          </Link>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Membership Status"
          value={active ? active.plan?.name : pending ? 'Pending' : 'Inactive'}
          subtext={
            active
              ? `${daysRemaining} days remaining`
              : pending
              ? 'Awaiting payment verification'
              : 'Choose a subscription plan'
          }
          icon={ShieldCheck}
          color={active ? 'primary' : pending ? 'warning' : 'danger'}
        />

        <StatCard
          title="Outstanding Dues"
          value={`Rs. ${outstandingDues.toLocaleString()}`}
          subtext={outstandingDues === 0 ? 'All fees settled' : 'Payment clearance required'}
          icon={CreditCard}
          color={outstandingDues > 0 ? 'warning' : 'primary'}
        />

        <StatCard
          title="Verified Payments"
          value={`Rs. ${verifiedPaid.toLocaleString()}`}
          subtext="Total officially cleared"
          icon={CheckCircle2}
          color="primary"
        />

        <StatCard
          title="Current Weight"
          value={latestProgress ? `${latestProgress.weightKg} kg` : 'Not Logged'}
          subtext={
            latestProgress
              ? `Logged on ${new Date(latestProgress.recordedDate).toLocaleDateString()}`
              : 'Click to add initial entry'
          }
          icon={TrendingUp}
          color="info"
        />
      </div>

      {/* Active Workout Program Preview & Coach Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workout Plan Card */}
        <Card
          title="Current Workout Routine"
          subtitle="Programmed by your certified gym coach"
          headerAction={
            <Link to="/member/workouts" className="text-xs text-gym-primary hover:underline font-semibold flex items-center gap-1">
              View Routine <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {activePlan ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gym-border">
                <div>
                  <h4 className="text-sm font-bold text-gym-text">{activePlan.title}</h4>
                  <p className="text-gym-muted mt-0.5">
                    Coach: <span className="text-gym-accent font-semibold">{activePlan.trainer?.name}</span>
                  </p>
                </div>
                <Badge variant="success">Active Split</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase font-semibold text-gym-muted">Included Movements:</p>
                <div className="space-y-1.5">
                  {activePlan.exercises?.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-gym-bg border border-gym-border flex items-center justify-between"
                    >
                      <span className="font-semibold text-gym-text">{item.exercise?.name}</span>
                      <span className="font-mono text-gym-primary font-bold">
                        {item.sets} Sets × {item.reps}
                      </span>
                    </div>
                  ))}
                  {activePlan.exercises?.length > 4 && (
                    <p className="text-[11px] text-gym-muted text-center pt-1">
                      + {activePlan.exercises.length - 4} more movements in full workout plan
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Dumbbell className="w-8 h-8 text-gym-muted mx-auto mb-2" />
              <p className="text-xs text-gym-muted">No workout routine assigned yet.</p>
              <p className="text-[11px] text-gym-muted mt-0.5">
                Your assigned trainer will configure your exercises shortly.
              </p>
            </div>
          )}
        </Card>

        {/* Assigned Personal Coach & Quick Links */}
        <Card title="Personal Coach & Support" subtitle="Your gym mentor">
          {activePlan?.trainer ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gym-bg border border-gym-border">
                <div className="w-12 h-12 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary font-bold text-lg">
                  {activePlan.trainer.name[0]}
                </div>
                <div>
                  <h4 className="text-base font-bold text-gym-text">{activePlan.trainer.name}</h4>
                  <p className="text-gym-primary font-medium">{activePlan.trainer.specialization}</p>
                  <p className="text-[11px] text-gym-muted mt-0.5">{activePlan.trainer.phone}</p>
                </div>
              </div>

              <div className="pt-2">
                <h5 className="font-semibold text-gym-text uppercase tracking-wider mb-2">
                  Training Priorities
                </h5>
                <ul className="space-y-2 text-gym-muted text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gym-primary" />
                    <span>Follow prescribed sets, repetitions, and rest intervals.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gym-primary" />
                    <span>Log weekly body measurements in your biometrics tab.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gym-primary" />
                    <span>Scan in at the reception turnstile on every gym visit.</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gym-muted">
              <UserCheck className="w-8 h-8 text-gym-muted mx-auto mb-2" />
              <p>Self-Guided Membership.</p>
              <p className="text-[11px] mt-0.5">
                Contact gym administration if you wish to be assigned a dedicated personal coach.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

