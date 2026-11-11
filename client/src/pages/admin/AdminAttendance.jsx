import React, { useEffect, useState } from 'react';
import { CheckSquare, Plus, Clock, Search, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Modal
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInMemberId, setCheckInMemberId] = useState('');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAttendance = async () => {
    try {
      const [attRes, memRes] = await Promise.all([
        api.get(`/attendance?date=${selectedDate}`),
        api.get('/members'),
      ]);
      if (attRes.data.success) setRecords(attRes.data.data);
      if (memRes.data.success) setMembers(memRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/attendance/check-in', {
        memberId: checkInMemberId,
        notes,
      });
      if (res.data.success) {
        setShowCheckInModal(false);
        setCheckInMemberId('');
        setNotes('');
        fetchAttendance();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Check-in failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const res = await api.patch(`/attendance/${id}/check-out`);
      if (res.data.success) {
        fetchAttendance();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Daily Gym Turnstile Attendance</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Biometric & front-desk check-in logs with strict anti-duplicate enforcement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-gym-surface border border-gym-border rounded-lg text-xs text-gym-text"
          />

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setErrorMsg('');
              setCheckInMemberId(members[0]?._id || '');
              setShowCheckInModal(true);
            }}
          >
            Record Check-In
          </Button>
        </div>
      </div>

      {/* Attendance Log Table */}
      {loading ? (
        <LoadingSpinner text="Querying attendance logs..." />
      ) : records.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No Check-ins on this Date"
          description={`No member entries recorded for ${selectedDate}. Click 'Record Check-In' to log attendance.`}
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Check-Out Time</th>
                <th className="py-3 px-4">Recorded By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gym-text block">{r.member?.name}</span>
                    <span className="text-[11px] text-gym-muted">{r.member?.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gym-text">
                    {new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gym-muted">
                    {r.checkOut ? (
                      new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ) : (
                      <span className="text-amber-400 italic">On Gym Floor</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted">{r.recordedBy?.name || 'Front Desk'}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm">Present</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {!r.checkOut && (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={LogOut}
                        onClick={() => handleCheckOut(r._id)}
                      >
                        Check-Out
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal: Check-In */}
      <Modal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        title="Record Member Check-In"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleCheckIn} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Select Member *</label>
            <select
              required
              value={checkInMemberId}
              onChange={(e) => setCheckInMemberId(e.target.value)}
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
            <label className="block text-xs uppercase text-gym-muted mb-1">Reception Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Card scanned at main turnstile"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <p className="text-[11px] text-gym-muted">
            * The system will enforce a unique daily check-in constraint to prevent duplicate entries for the same member on the same date.
          </p>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Confirm Check-In
          </Button>
        </form>
      </Modal>
    </div>
  );
}
