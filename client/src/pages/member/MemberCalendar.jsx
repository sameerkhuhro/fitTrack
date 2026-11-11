import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MemberCalendar() {
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
        <h1 className="text-2xl font-bold text-gym-text">Workout Sessions & Appointments</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Upcoming one-on-one training sessions with your certified coach
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching workout calendar..." />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Sessions Scheduled"
          description="You currently have no scheduled training appointments with your coach."
        />
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <Card key={s._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-gym-primary/10 text-gym-primary border border-gym-primary/20 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gym-text">
                    Personal Coaching Session with {s.trainer?.name}
                  </h4>
                  <p className="text-xs text-gym-muted mt-1">
                    Date & Time: <span className="text-gym-text font-medium">{new Date(s.sessionDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span> ({s.durationMinutes} minutes)
                  </p>
                  {s.trainerNotes && (
                    <p className="text-[11px] text-gym-accent mt-1 italic">
                      Coach Note: "{s.trainerNotes}"
                    </p>
                  )}
                </div>
              </div>

              <Badge
                variant={
                  s.status === 'completed'
                    ? 'success'
                    : s.status === 'scheduled'
                    ? 'info'
                    : 'danger'
                }
              >
                {s.status}
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

