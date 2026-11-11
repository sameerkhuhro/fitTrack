import React, { useEffect, useState } from 'react';
import { TrendingUp, Plus, Activity, Calendar, Trash2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MemberProgress() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    weightKg: '',
    heightCm: '',
    waistCm: '',
    chestCm: '',
    armsCm: '',
    bodyFatPercentage: '',
    notes: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress/me');
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleLogProgress = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/progress', formData);
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          weightKg: '',
          heightCm: '',
          waistCm: '',
          chestCm: '',
          armsCm: '',
          bodyFatPercentage: '',
          notes: '',
        });
        fetchProgress();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save biometric entry.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this measurement entry?')) return;
    try {
      await api.delete(`/progress/${id}`);
      fetchProgress();
    } catch (e) {
      alert('Delete failed.');
    }
  };

  const chartData = records.map((r) => ({
    date: new Date(r.recordedDate).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    weight: r.weightKg,
    waist: r.waistCm,
    chest: r.chestCm,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Fitness Biometrics & Progress Tracking</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Log body composition metrics and visualize physical transformation over time
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setErrorMsg('');
            setShowModal(true);
          }}
        >
          Log New Biometric Entry
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your biometric records..." />
      ) : records.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No Progress Recorded Yet"
          description="Click 'Log New Biometric Entry' above to save your starting body weight and body measurements."
        />
      ) : (
        <>
          {/* Progress Trajectory Chart */}
          <Card
            title="Weight & Circumference Trajectory"
            subtitle="Bodyweight (kg) vs Waist/Chest (cm) across historical entries"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C3A33" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#191F1C', borderColor: '#2C3A33', borderRadius: '8px' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={3} name="Weight (kg)" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="waist" stroke="#F59E0B" strokeWidth={2} name="Waist (cm)" />
                  <Line type="monotone" dataKey="chest" stroke="#38BDF8" strokeWidth={2} name="Chest (cm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Historical Table */}
          <div>
            <h3 className="text-lg font-bold text-gym-text mb-4">Historical Check-In Log</h3>
            <Card noPadding className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Waist</th>
                    <th className="py-3 px-4">Chest</th>
                    <th className="py-3 px-4">Arms</th>
                    <th className="py-3 px-4">Body Fat %</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gym-border">
                  {records.map((r) => (
                    <tr key={r._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                      <td className="py-3.5 px-4 text-gym-text">
                        {new Date(r.recordedDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gym-primary">{r.weightKg} kg</td>
                      <td className="py-3.5 px-4 text-gym-muted">{r.waistCm ? `${r.waistCm} cm` : '—'}</td>
                      <td className="py-3.5 px-4 text-gym-muted">{r.chestCm ? `${r.chestCm} cm` : '—'}</td>
                      <td className="py-3.5 px-4 text-gym-muted">{r.armsCm ? `${r.armsCm} cm` : '—'}</td>
                      <td className="py-3.5 px-4 text-gym-muted">{r.bodyFatPercentage ? `${r.bodyFatPercentage}%` : '—'}</td>
                      <td className="py-3.5 px-4 text-gym-muted italic">{r.notes || '—'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(r._id)}
                          title="Delete Entry"
                          className="text-gym-muted hover:text-gym-danger p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </>
      )}

      {/* Modal: Log Biometric Entry */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Log Fitness Biometric Entry"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogProgress} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Body Weight (kg) *</label>
            <input
              type="number"
              step="0.1"
              required
              min={20}
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
              placeholder="e.g. 78.5"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Height (cm)</label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                placeholder="e.g. 178"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.bodyFatPercentage}
                onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                placeholder="e.g. 14.5"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Waist (cm)</label>
              <input
                type="number"
                step="0.5"
                value={formData.waistCm}
                onChange={(e) => setFormData({ ...formData, waistCm: e.target.value })}
                placeholder="e.g. 82"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Chest (cm)</label>
              <input
                type="number"
                step="0.5"
                value={formData.chestCm}
                onChange={(e) => setFormData({ ...formData, chestCm: e.target.value })}
                placeholder="e.g. 102"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Arms (cm)</label>
              <input
                type="number"
                step="0.5"
                value={formData.armsCm}
                onChange={(e) => setFormData({ ...formData, armsCm: e.target.value })}
                placeholder="e.g. 38"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Notes / Physical Reflections</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Feeling energetic; increased deadlift weight"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Save Progress Entry
          </Button>
        </form>
      </Modal>
    </div>
  );
}

