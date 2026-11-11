import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  PlusCircle,
  FileCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [membershipStats, setMembershipStats] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, revRes, memRes, attRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/revenue'),
          api.get('/dashboard/membership-stats'),
          api.get('/dashboard/attendance-stats'),
        ]);

        if (sumRes.data.success) setSummary(sumRes.data.data);
        if (revRes.data.success) setRevenueTrends(revRes.data.data);
        if (memRes.data.success) setMembershipStats(memRes.data.data);
        if (attRes.data.success) setAttendanceTrends(attRes.data.data);
      } catch (err) {
        console.error('Admin Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling gym business analytics & telemetry..." />;
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Executive Dashboard</h1>
          <p className="text-xs text-gym-muted mt-1">
            Real-time club metrics, revenue verification, and operational controls
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/admin/members">
            <Button size="sm" variant="secondary" icon={PlusCircle}>
              Add Member
            </Button>
          </Link>
          <Link to="/admin/payments">
            <Button size="sm" variant="outline" icon={CreditCard}>
              Verify Payments
            </Button>
          </Link>
          <Link to="/admin/attendance">
            <Button size="sm" variant="primary" icon={CheckCircle2}>
              Member Check-In
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Members"
          value={summary?.totalMembers || 0}
          subtext={`${summary?.activeMembers || 0} active, ${summary?.expiredMembers || 0} expired`}
          icon={Users}
          color="primary"
        />

        <StatCard
          title="Verified Revenue"
          value={`Rs. ${(summary?.totalRevenue || 0).toLocaleString()}`}
          subtext={`This month: Rs. ${(summary?.thisMonthRevenue || 0).toLocaleString()}`}
          icon={CreditCard}
          color="primary"
        />

        <StatCard
          title="Outstanding Dues"
          value={`Rs. ${(summary?.pendingDues || 0).toLocaleString()}`}
          subtext="Unpaid / partial balances"
          icon={DollarSign}
          color={summary?.pendingDues > 0 ? 'warning' : 'primary'}
        />

        <StatCard
          title="Pending Requests"
          value={summary?.pendingRequests || 0}
          subtext="Memberships awaiting activation"
          icon={FileCheck}
          color={summary?.pendingRequests > 0 ? 'warning' : 'info'}
        />
      </div>

      {/* Secondary Operational Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gym-surface border border-gym-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-gym-muted font-medium">Active Coaches</p>
            <h4 className="text-xl font-bold text-gym-text mt-1">{summary?.totalTrainers || 0} Trainers</h4>
            <p className="text-[11px] text-gym-muted mt-0.5">
              Monthly obligations: Rs. {(summary?.salaryObligations || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-gym-primary/10 text-gym-primary rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gym-surface border border-gym-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-gym-muted font-medium">Salary Confirmations</p>
            <h4 className="text-xl font-bold text-gym-text mt-1">{summary?.pendingSalaryConfirmations || 0} Pending</h4>
            <p className="text-[11px] text-gym-muted mt-0.5">
              Marked paid, awaiting coach confirmation
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gym-surface border border-gym-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-gym-muted font-medium">Today's Attendance</p>
            <h4 className="text-xl font-bold text-gym-text mt-1">{summary?.todayAttendanceCount || 0} Check-ins</h4>
            <p className="text-[11px] text-gym-muted mt-0.5">Unique biometric / front-desk visits</p>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Collection Trend */}
        <Card
          className="lg:col-span-2"
          title="Monthly Verified Revenue Trend (Rs.)"
          subtitle="Realized income calculated strictly from verified payments"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C3A33" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#191F1C', borderColor: '#2C3A33', borderRadius: '8px' }}
                  itemStyle={{ color: '#10B981', fontWeight: 600 }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Membership Status Distribution */}
        <Card
          title="Membership Breakdown"
          subtitle="Active vs Expired vs Pending"
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={membershipStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {membershipStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#191F1C', borderColor: '#2C3A33', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around pt-2 border-t border-gym-border text-xs">
            {membershipStats.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-gym-muted">{item.name}:</span>
                <span className="font-bold text-gym-text">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 7-Day Attendance Trend */}
      <Card
        title="Weekly Athlete Footfall Trend"
        subtitle="Daily gym visit entries across the past 7 days"
      >
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C3A33" />
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#191F1C', borderColor: '#2C3A33', borderRadius: '8px' }}
                itemStyle={{ color: '#34D399' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
