import React, { useEffect, useState } from 'react';
import { CheckSquare, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MemberAttendance() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/my')
      .then((res) => {
        if (res.data.success) {
          setRecords(res.data.data);
          setStats(res.data.stats);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Gym Turnstile Attendance Record</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Audited logs of your gym visits and daily workout consistency
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
        <StatCard
          title="Total Gym Visits"
          value={stats?.totalVisits || 0}
          subtext="Lifetime check-in entries"
          icon={CheckSquare}
          color="primary"
        />
        <StatCard
          title="Visits This Month"
          value={stats?.thisMonthVisits || 0}
          subtext="Current workout consistency streak"
          icon={Calendar}
          color="primary"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your attendance logs..." />
      ) : records.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No Attendance Logs Found"
          description="Your attendance will be automatically recorded whenever your turnstile card or fingerprint is scanned at gym reception."
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Check-Out Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gym-text">{r.dateString}</td>
                  <td className="py-3.5 px-4 font-mono text-gym-primary font-bold">
                    {new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gym-muted">
                    {r.checkOut ? (
                      new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ) : (
                      <span className="text-amber-400 italic">Logged present</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm">Present</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted italic">{r.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

