import React, { useEffect, useState } from 'react';
import { Dumbbell, Calendar, Clock, CheckCircle2, Award, UserCheck } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MemberWorkouts() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/workouts/my')
      .then((res) => {
        if (res.data.success) {
          setPlans(res.data.data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching your customized workout routines..." />;
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Assigned Workout Routines</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Progressive overload splits and exercise cues tailored by your certified coach
        </p>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="No Workout Plans Assigned Yet"
          description="Your personal trainer has not yet configured your workout routine. Please check back shortly or speak with your coach."
        />
      ) : (
        <div className="space-y-8">
          {plans.map((p) => (
            <Card key={p._id} className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gym-text">{p.title}</h2>
                    <Badge variant="success" size="sm">Active Routine</Badge>
                  </div>
                  <p className="text-xs text-gym-muted mt-1">
                    Coach: <span className="text-gym-accent font-semibold">{p.trainer?.name}</span> ({p.trainer?.phone})
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gym-muted bg-gym-bg px-3 py-1.5 rounded-lg border border-gym-border">
                  <Calendar className="w-4 h-4 text-gym-primary" />
                  <span>Target Days: {p.scheduleDays?.join(', ') || 'Flexible'}</span>
                </div>
              </div>

              {p.description && (
                <div className="mb-6 p-4 rounded-xl bg-gym-bg border border-gym-border text-xs text-gym-muted leading-relaxed">
                  <span className="font-semibold text-gym-text block mb-0.5">Coach Instructions:</span>
                  {p.description}
                </div>
              )}

              {/* Exercises List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gym-muted">
                  Prescribed Movements & Set Targets
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {p.exercises?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-gym-bg border border-gym-border flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-gym-primary/10 text-gym-primary font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-gym-text">{item.exercise?.name}</h4>
                        </div>
                        <p className="text-[11px] text-gym-muted mt-1">
                          Category: <span className="uppercase text-gym-text font-medium">{item.exercise?.category}</span> • Equipment: {item.exercise?.equipment || 'None'}
                        </p>
                        {item.exercise?.targetMuscles && (
                          <p className="text-[10px] text-gym-accent mt-0.5">
                            Target: {item.exercise.targetMuscles.join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[11px] text-gym-muted italic mt-2 bg-gym-surface p-2 rounded border border-gym-border">
                            Cues: "{item.notes}"
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 rounded bg-gym-primary/10 border border-gym-primary/20 text-gym-primary font-bold text-xs block">
                          {item.sets} Sets × {item.reps}
                        </span>
                        <span className="text-[10px] text-gym-muted flex items-center justify-end gap-1 mt-1.5">
                          <Clock className="w-3 h-3 text-gym-primary" />
                          {item.restSeconds}s rest
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

