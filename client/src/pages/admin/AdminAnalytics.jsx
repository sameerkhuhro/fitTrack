import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, CreditCard, Award } from 'lucide-react';
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
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminAnalytics() {
  const [summary, setSummary] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [membershipStats, setMembershipStats] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/dashboard/revenue'),
      api.get('/dashboard/membership-stats'),
      api.get('/dashboard/attendance-stats'),
    ])
      .then(([sRes, rRes, mRes, aRes]) => {
        if (sRes.data.success) setSummary(sRes.data.data);
        if (rRes.data.success) setRevenueTrends(rRes.data.data);
        if (mRes.data.success) setMembershipStats(mRes.data.data);
        if (aRes.data.success) setAttendanceTrends(aRes.data.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Generating analytical audit reports..." />;
  }

  // Calculate Collection Rate
  const totalDue = (summary?.totalRevenue || 0) + (summary?.pendingDues || 0);
  const collectionRate = totalDue > 0 ? Math.round(((summary?.totalRevenue || 0) / totalDue) * 100) : 100;

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Financial & Operational Analytics</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Audited income metrics, collection ratios, and athlete retention reports
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Verified Revenue"
          value={`Rs. ${(summary?.totalRevenue || 0).toLocaleString()}`}
          subtext="Total collected & settled"
          icon={CreditCard}
          color="primary"
        />
        <StatCard
          title="Collection Efficiency"
          value={`${collectionRate}%`}
          subtext={`Pending dues: Rs. ${(summary?.pendingDues || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="primary"
        />
        <StatCard
          title="Monthly Coach Payroll"
          value={`Rs. ${(summary?.salaryObligations || 0).toLocaleString()}`}
          subtext="Committed trainer obligations"
          icon={DollarSign}
          color="warning"
        />
        <StatCard
          title="Active Subscriptions"
          value={summary?.activeMembers || 0}
          subtext={`Out of ${summary?.totalMembers || 0} total members`}
          icon={Users}
          color="info"
        />
      </div>

      {/* Revenue & Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card
          title="Revenue Realization (Past 6 Months)"
          subtitle="Monthly verified payment receipts"
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

        <Card
          title="Athlete Attendance Trends"
          subtitle="Daily check-in volume"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C3A33" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#191F1C', borderColor: '#2C3A33', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#34D399" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

