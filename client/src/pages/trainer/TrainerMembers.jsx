import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, TrendingUp, Dumbbell, Phone, Mail, Eye, Activity } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function TrainerMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Athlete Progress Modal
  const [selectedMember, setSelectedMember] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressRecords, setProgressRecords] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    api.get('/members')
      .then((res) => {
        if (res.data.success) setMembers(res.data.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleInspectProgress = async (member) => {
    setSelectedMember(member);
    setShowProgressModal(true);
    setProgressLoading(true);
    try {
      const res = await api.get(`/progress/member/${member._id}`);
      if (res.data.success) {
        setProgressRecords(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProgressLoading(false);
    }
  };

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">My Assigned Athletes</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Athletes assigned to you by gym administration for personal programming
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gym-surface border border-gym-border rounded-xl px-4 py-2 max-w-sm w-full">
          <Search className="w-4 h-4 text-gym-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assigned athlete..."
            className="bg-transparent text-xs text-gym-text placeholder-gym-muted focus:outline-none w-full"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your athlete roster..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Assigned Athletes"
          description="You currently have no athletes assigned by the gym administrator."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <Card key={m._id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gym-primary/10 border border-gym-primary/30 text-gym-primary font-bold flex items-center justify-center text-sm">
                      {m.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gym-text">{m.name}</h3>
                      <p className="text-[11px] text-gym-muted">{m.email}</p>
                    </div>
                  </div>
                  <Badge variant={m.isActive ? 'success' : 'danger'} size="sm">
                    {m.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 py-3 border-t border-b border-gym-border text-xs text-gym-muted">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gym-primary" />
                    <span>{m.phone}</span>
                  </div>
                  {m.emergencyContact?.name && (
                    <div className="text-[11px] text-gym-muted">
                      Emergency: {m.emergencyContact.name} ({m.emergencyContact.phone})
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Activity}
                  onClick={() => handleInspectProgress(m)}
                >
                  Biometrics
                </Button>
                <Link to={`/trainer/workouts?memberId=${m._id}`}>
                  <Button size="sm" variant="primary" icon={Dumbbell}>
                    Plan Workout
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Biometrics & Measurements */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        title={`Fitness Progress: ${selectedMember?.name}`}
      >
        {progressLoading ? (
          <LoadingSpinner text="Fetching biometric history..." />
        ) : progressRecords.length === 0 ? (
          <p className="text-xs text-gym-muted py-6 text-center">
            This athlete has not logged any body measurements yet.
          </p>
        ) : (
          <div className="space-y-3 text-xs">
            {progressRecords.map((rec) => (
              <div
                key={rec._id}
                className="p-3 bg-gym-bg rounded-xl border border-gym-border flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-gym-primary text-sm block">
                    {rec.weightKg} kg
                  </span>
                  <span className="text-[11px] text-gym-muted">
                    Waist: {rec.waistCm ? `${rec.waistCm}cm` : '—'} • Chest: {rec.chestCm ? `${rec.chestCm}cm` : '—'}
                  </span>
                  {rec.notes && (
                    <span className="text-[10px] text-gym-accent italic block mt-0.5">"{rec.notes}"</span>
                  )}
                </div>
                <span className="text-[11px] text-gym-muted font-mono">
                  {new Date(rec.recordedDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
