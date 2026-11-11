import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  ClipboardList,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function TrainerDashboard() {
  const [summary, setSummary] = useState(null);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/trainer-summary'),
      api.get('/members'),
      api.get('/sessions'),
    ])
      .then(([sumRes, memRes, sesRes]) => {
        if (sumRes.data.success) setSummary(sumRes.data.data);
        if (memRes.data.success) setAssignedMembers(memRes.data.data);
        if (sesRes.data.success) setSessions(sesRes.data.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading coach dashboard..." />;
  }

  const currentSalary = summary?.currentSalary;
  const isAwaitingConfirmation = currentSalary?.status === 'paid_awaiting_confirmation';

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Coach Headquarters</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Overview of your assigned athletes, daily sessions, and monthly payroll
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/trainer/workouts">
            <Button size="sm" variant="primary" icon={ClipboardList}>
              Create Workout Plan
            </Button>
          </Link>
          <Link to="/trainer/schedule">
            <Button size="sm" variant="secondary" icon={Calendar}>
              Schedule Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Salary Confirmation Alert (If Admin Marked Paid) */}
      {isAwaitingConfirmation && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-400">Monthly Salary Payment Disbursed</h4>
              <p className="text-xs text-gym-text mt-1">
                Admin has remitted Rs. {currentSalary.amount?.toLocaleString()} via {currentSalary.paymentMethod.replace('_', ' ').toUpperCase()} (Ref: {currentSalary.transactionReference || 'N/A'}).
              </p>
              <p className="text-[11px] text-gym-muted mt-0.5">
                Please check your bank account or mobile wallet and confirm receipt.
              </p>
            </div>
          </div>
          <Link to="/trainer/salaries">
            <Button size="sm" variant="primary" icon={CheckCircle2}>
              Review & Confirm Received
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Assigned Athletes"
          value={summary?.assignedMembersCount || 0}
          subtext="Under your personal coaching"
          icon={Users}
          color="primary"
        />

        <StatCard
          title="Today's Sessions"
          value={summary?.todaySessions || 0}
          subtext="Scheduled training blocks"
          icon={Calendar}
          color="info"
        />

        <StatCard
          title="Active Workout Plans"
          value={summary?.activeWorkoutPlans || 0}
          subtext="Personalized routines in progress"
          icon={ClipboardList}
          color="primary"
        />

        <StatCard
          title="Monthly Salary"
          value={currentSalary ? `Rs. ${currentSalary.amount?.toLocaleString()}` : 'Pending Slip'}
          subtext={currentSalary ? `Status: ${currentSalary.status.replace(/_/g, ' ')}` : 'Awaiting slip generation'}
          icon={DollarSign}
          color={isAwaitingConfirmation ? 'warning' : 'primary'}
        />
      </div>

      {/* Assigned Members Quick Peek */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card
          title="Assigned Athletes"
          subtitle="Athletes assigned exclusively to your coaching roster"
          headerAction={
            <Link to="/trainer/members" className="text-xs text-gym-primary hover:underline font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {assignedMembers.length === 0 ? (
            <p className="text-xs text-gym-muted py-4">No athletes currently assigned by gym admin.</p>
          ) : (
            <div className="divide-y divide-gym-border text-xs">
              {assignedMembers.slice(0, 5).map((m) => (
                <div key={m._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gym-primary/10 text-gym-primary font-bold flex items-center justify-center text-xs">
                      {m.name[0]}
                    </div>
                    <div>
                      <span className="font-semibold text-gym-text block">{m.name}</span>
                      <span className="text-[11px] text-gym-muted">{m.phone}</span>
                    </div>
                  </div>
                  <Badge variant={m.isActive ? 'success' : 'danger'} size="sm">
                    {m.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Today's / Upcoming Sessions */}
        <Card
          title="Upcoming Training Sessions"
          subtitle="One-on-one appointments"
          headerAction={
            <Link to="/trainer/schedule" className="text-xs text-gym-primary hover:underline font-semibold flex items-center gap-1">
              Full Schedule <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {sessions.length === 0 ? (
            <p className="text-xs text-gym-muted py-4">No sessions scheduled for this week.</p>
          ) : (
            <div className="divide-y divide-gym-border text-xs">
              {sessions.slice(0, 5).map((s) => (
                <div key={s._id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gym-text block">{s.member?.name}</span>
                    <span className="text-[11px] text-gym-muted">
                      {new Date(s.sessionDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <Badge variant={s.status === 'completed' ? 'success' : 'info'} size="sm">
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

