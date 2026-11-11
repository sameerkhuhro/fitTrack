import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Clock, User, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function TrainerSchedule() {
  const [sessions, setSessions] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [trainerNotes, setTrainerNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSchedule = async () => {
    try {
      const [sesRes, memRes] = await Promise.all([
        api.get('/sessions'),
        api.get('/members'),
      ]);
      if (sesRes.data.success) setSessions(sesRes.data.data);
      if (memRes.data.success) {
        setMembers(memRes.data.data);
        if (memRes.data.data.length > 0) setMemberId(memRes.data.data[0]._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post('/sessions', {
        memberId,
        sessionDate,
        durationMinutes: Number(durationMinutes),
        trainerNotes,
      });
      if (res.data.success) {
        setShowScheduleModal(false);
        setTrainerNotes('');
        fetchSchedule();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule session.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/sessions/${id}/status`, { status });
      fetchSchedule();
    } catch (e) {
      alert('Failed to update session.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Training Calendar & Appointments</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Organize personal training sessions and track client attendance
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            const defaultDate = new Date();
            defaultDate.setHours(defaultDate.getHours() + 2);
            setSessionDate(defaultDate.toISOString().slice(0, 16));
            setShowScheduleModal(true);
          }}
        >
          Book Training Session
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading appointment calendar..." />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Sessions Scheduled"
          description="Click 'Book Training Session' to set up a workout slot with an assigned athlete."
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Session Date & Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {sessions.map((s) => (
                <tr key={s._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gym-text">{s.member?.name}</td>
                  <td className="py-3.5 px-4 text-gym-text">
                    {new Date(s.sessionDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted">{s.durationMinutes} mins</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        s.status === 'completed'
                          ? 'success'
                          : s.status === 'scheduled'
                          ? 'info'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {s.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted italic">{s.trainerNotes || '—'}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {s.status === 'scheduled' && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUpdateStatus(s._id, 'completed')}
                        >
                          Completed
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleUpdateStatus(s._id, 'missed')}
                        >
                          Missed
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal: Schedule Session */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Coaching Session"
      >
        <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Select Athlete *</label>
            <select
              required
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            >
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Session Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Duration (Minutes)</label>
            <input
              type="number"
              min={15}
              step={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Session Objective / Notes</label>
            <input
              type="text"
              value={trainerNotes}
              onChange={(e) => setTrainerNotes(e.target.value)}
              placeholder="e.g. Squat biomechanics & mobility focus"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Book Appointment
          </Button>
        </form>
      </Modal>
    </div>
  );
}

