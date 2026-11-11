import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Clock, User, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sessions')
      .then((res) => {
        if (res.data.success) setSessions(res.data.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Coaching Sessions & Appointments</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Master calendar of scheduled personal training appointments
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching workout schedules..." />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Scheduled Sessions"
          description="Coaches and athletes can schedule one-on-one sessions in their portals."
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Assigned Coach</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Trainer Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {sessions.map((s) => (
                <tr key={s._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gym-text">{s.member?.name}</td>
                  <td className="py-3.5 px-4 text-gym-primary font-medium">{s.trainer?.name}</td>
                  <td className="py-3.5 px-4 text-gym-text">
                    {new Date(s.sessionDate).toLocaleString()}
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
                  <td className="py-3.5 px-4 text-gym-muted italic">
                    {s.trainerNotes || 'No notes logged.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
