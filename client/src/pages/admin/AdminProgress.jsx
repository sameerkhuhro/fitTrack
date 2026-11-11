import React, { useEffect, useState } from 'react';
import { TrendingUp, User, Calendar, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminProgress() {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/members')
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedMemberId(res.data.data[0]._id);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      api.get(`/progress/member/${selectedMemberId}`)
        .then((res) => {
          if (res.data.success) {
            setProgressData(res.data.data);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [selectedMemberId]);

  const chartFormatted = progressData.map((d) => ({
    date: new Date(d.recordedDate).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    weight: d.weightKg,
    waist: d.waistCm,
    chest: d.chestCm,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Athlete Biometric Progress Audit</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Monitor client body composition trends, weight milestones, and measurement logs
          </p>
        </div>

        {/* Member Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gym-muted">Select Athlete:</span>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-3 py-1.5 bg-gym-surface border border-gym-border rounded-lg text-xs text-gym-text"
          >
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {progressData.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No Progress Entries Recorded"
          description="This athlete has not yet logged body weight or measurements."
        />
      ) : (
        <>
          {/* Chart */}
          <Card
            title="Weight & Circumference Trajectory"
            subtitle="Bodyweight (kg) vs Waist/Chest (cm) across historical check-ins"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartFormatted}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C3A33" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#191F1C', borderColor: '#2C3A33', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2.5} name="Weight (kg)" />
                  <Line type="monotone" dataKey="waist" stroke="#F59E0B" strokeWidth={2} name="Waist (cm)" />
                  <Line type="monotone" dataKey="chest" stroke="#38BDF8" strokeWidth={2} name="Chest (cm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Historical Log Table */}
          <Card noPadding className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                  <th className="py-3 px-4">Date Logged</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Waist (cm)</th>
                  <th className="py-3 px-4">Chest (cm)</th>
                  <th className="py-3 px-4">Arms (cm)</th>
                  <th className="py-3 px-4">Body Fat %</th>
                  <th className="py-3 px-4">Athlete Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border">
                {progressData.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                    <td className="py-3.5 px-4 text-gym-text">
                      {new Date(rec.recordedDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gym-primary">{rec.weightKg} kg</td>
                    <td className="py-3.5 px-4 text-gym-text">{rec.waistCm ? `${rec.waistCm} cm` : '—'}</td>
                    <td className="py-3.5 px-4 text-gym-text">{rec.chestCm ? `${rec.chestCm} cm` : '—'}</td>
                    <td className="py-3.5 px-4 text-gym-text">{rec.armsCm ? `${rec.armsCm} cm` : '—'}</td>
                    <td className="py-3.5 px-4 text-gym-text">{rec.bodyFatPercentage ? `${rec.bodyFatPercentage}%` : '—'}</td>
                    <td className="py-3.5 px-4 text-gym-muted italic">{rec.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}

