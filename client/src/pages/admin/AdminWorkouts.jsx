import React, { useEffect, useState } from 'react';
import { ClipboardList, User, Dumbbell, Calendar, Eye, Clock } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminWorkouts() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/workouts')
      .then((res) => {
        if (res.data.success) setPlans(res.data.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Assigned Workout Routines</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Auditing personalized lifting splits assigned by gym coaches to members
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching active workout splits..." />
      ) : plans.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Workout Plans Assigned"
          description="Coaches can build customized splits for their assigned athletes."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card
              key={p._id}
              title={p.title}
              subtitle={`Member: ${p.member?.name}`}
              headerAction={
                <Badge variant={p.status === 'active' ? 'success' : 'default'} size="sm">
                  {p.status}
                </Badge>
              }
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gym-muted">Coach: {p.trainer?.name}</span>
                  <button
                    onClick={() => {
                      setSelectedPlan(p);
                      setShowModal(true);
                    }}
                    className="text-xs font-semibold text-gym-primary hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Exercises
                  </button>
                </div>
              }
            >
              <p className="text-xs text-gym-muted mb-4">{p.description || 'Custom tailored workout regimen.'}</p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gym-muted">
                  <Calendar className="w-3.5 h-3.5 text-gym-primary" />
                  <span>Days: {p.scheduleDays?.join(', ') || 'Flexible'}</span>
                </div>
                <div className="flex items-center gap-2 text-gym-muted">
                  <Dumbbell className="w-3.5 h-3.5 text-gym-primary" />
                  <span>{p.exercises?.length || 0} Exercises Programmed</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: View Workout Exercises */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedPlan?.title || 'Workout Breakdown'}
      >
        {selectedPlan && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-gym-surfaceLight/50 rounded-xl border border-gym-border">
              <p className="text-gym-muted">Athlete: <span className="font-bold text-gym-text">{selectedPlan.member?.name}</span></p>
              <p className="text-gym-muted">Coach: <span className="font-bold text-gym-primary">{selectedPlan.trainer?.name}</span></p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gym-text uppercase tracking-wider">Prescribed Movements</h4>
              {selectedPlan.exercises?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gym-bg rounded-lg border border-gym-border flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-gym-text block">
                      {idx + 1}. {item.exercise?.name || 'Exercise Movement'}
                    </span>
                    <span className="text-[11px] text-gym-muted">
                      Target: {item.exercise?.targetMuscles?.join(', ')}
                    </span>
                    {item.notes && (
                      <span className="text-[10px] text-gym-accent block italic mt-0.5">"{item.notes}"</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-gym-primary font-bold text-xs block">
                      {item.sets} Sets × {item.reps} Reps
                    </span>
                    <span className="text-[10px] text-gym-muted flex items-center justify-end gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {item.restSeconds}s rest
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

