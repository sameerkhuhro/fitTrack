import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardList, Plus, Dumbbell, Clock, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function TrainerWorkouts() {
  const [searchParams] = useSearchParams();
  const initialMemberId = searchParams.get('memberId') || '';

  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [memberId, setMemberId] = useState(initialMemberId);
  const [description, setDescription] = useState('');
  const [scheduleDays, setScheduleDays] = useState(['Monday', 'Wednesday', 'Friday']);
  const [selectedExercises, setSelectedExercises] = useState([
    { exercise: '', sets: 3, reps: '10-12', restSeconds: 60, notes: '' },
  ]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchData = async () => {
    try {
      const [wpRes, memRes, exRes] = await Promise.all([
        api.get('/workouts'),
        api.get('/members'),
        api.get('/exercises'),
      ]);

      if (wpRes.data.success) setWorkoutPlans(wpRes.data.data);
      if (memRes.data.success) {
        setMembers(memRes.data.data);
        if (!memberId && memRes.data.data.length > 0) {
          setMemberId(memRes.data.data[0]._id);
        }
      }
      if (exRes.data.success) {
        setExercises(exRes.data.data);
        if (selectedExercises[0].exercise === '' && exRes.data.data.length > 0) {
          setSelectedExercises([
            { exercise: exRes.data.data[0]._id, sets: 3, reps: '10-12', restSeconds: 60, notes: '' },
          ]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExerciseRow = () => {
    const firstEx = exercises[0]?._id || '';
    setSelectedExercises([
      ...selectedExercises,
      { exercise: firstEx, sets: 3, reps: '10-12', restSeconds: 60, notes: '' },
    ]);
  };

  const handleRemoveExerciseRow = (index) => {
    if (selectedExercises.length === 1) return;
    const updated = [...selectedExercises];
    updated.splice(index, 1);
    setSelectedExercises(updated);
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...selectedExercises];
    updated[index][field] = value;
    setSelectedExercises(updated);
  };

  const handleToggleDay = (day) => {
    if (scheduleDays.includes(day)) {
      setScheduleDays(scheduleDays.filter((d) => d !== day));
    } else {
      setScheduleDays([...scheduleDays, day]);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/workouts', {
        title,
        memberId,
        description,
        scheduleDays,
        exercises: selectedExercises,
      });

      if (res.data.success) {
        setShowCreateModal(false);
        setTitle('');
        setDescription('');
        fetchData();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create workout plan.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Workout Program Architect</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Design structured progressive lifting routines for your assigned athletes
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setErrorMsg('');
            setShowCreateModal(true);
          }}
        >
          Build Workout Routine
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading workout plans..." />
      ) : workoutPlans.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Active Workout Plans Programmed"
          description="Click 'Build Workout Routine' to assemble an exercise split for an assigned member."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans.map((wp) => (
            <Card
              key={wp._id}
              title={wp.title}
              subtitle={`Athlete: ${wp.member?.name}`}
              headerAction={
                <Badge variant={wp.status === 'active' ? 'success' : 'default'} size="sm">
                  {wp.status}
                </Badge>
              }
              footer={
                <div className="flex items-center justify-between text-xs text-gym-muted">
                  <span>Assigned: {new Date(wp.createdAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-gym-primary">{wp.exercises?.length} Movements</span>
                </div>
              }
            >
              <p className="text-xs text-gym-muted mb-4">{wp.description || 'Custom tailored workout regimen.'}</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gym-muted">
                  <Calendar className="w-3.5 h-3.5 text-gym-primary" />
                  <span>Days: {wp.scheduleDays?.join(', ') || 'Flexible'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Create Workout Plan */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Assemble Athlete Workout Program"
        maxWidth="max-w-3xl"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreatePlan} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Workout Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 4-Day Hypertrophy Push/Pull/Legs"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>

            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Target Athlete *</label>
              <select
                required
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              >
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Program Cues / Notes</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Focus on progressive overload; 2 RIR on compound lifts"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          {/* Days of Week */}
          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-2">Training Days</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => {
                const isSelected = scheduleDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => handleToggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-gym-primary text-black'
                        : 'bg-gym-bg border border-gym-border text-gym-muted hover:text-gym-text'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exercises Dynamic Rows */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="uppercase text-gym-muted font-semibold">Programmed Movements</label>
              <Button size="sm" variant="outline" icon={Plus} onClick={handleAddExerciseRow}>
                Add Movement
              </Button>
            </div>

            <div className="space-y-3">
              {selectedExercises.map((row, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gym-bg border border-gym-border rounded-xl space-y-2 relative"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-gym-muted uppercase block mb-0.5">Exercise Movement</label>
                      <select
                        required
                        value={row.exercise}
                        onChange={(e) => handleExerciseChange(idx, 'exercise', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-gym-surface border border-gym-border rounded-lg text-xs text-gym-text"
                      >
                        {exercises.map((ex) => (
                          <option key={ex._id} value={ex._id}>
                            {ex.name} ({ex.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gym-muted uppercase block mb-0.5">Sets</label>
                      <input
                        type="number"
                        min={1}
                        value={row.sets}
                        onChange={(e) => handleExerciseChange(idx, 'sets', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-gym-surface border border-gym-border rounded-lg text-xs text-gym-text"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gym-muted uppercase block mb-0.5">Reps</label>
                      <input
                        type="text"
                        value={row.reps}
                        onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                        placeholder="e.g. 8-10"
                        className="w-full px-2.5 py-1.5 bg-gym-surface border border-gym-border rounded-lg text-xs text-gym-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                    <div>
                      <label className="text-[10px] text-gym-muted uppercase block mb-0.5">Rest Seconds</label>
                      <input
                        type="number"
                        value={row.restSeconds}
                        onChange={(e) => handleExerciseChange(idx, 'restSeconds', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-gym-surface border border-gym-border rounded-lg text-xs text-gym-text"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-gym-muted uppercase block mb-0.5">Form / Weight Notes</label>
                      <input
                        type="text"
                        value={row.notes}
                        onChange={(e) => handleExerciseChange(idx, 'notes', e.target.value)}
                        placeholder="e.g. 2 sec eccentric; pause at bottom"
                        className="w-full px-2.5 py-1.5 bg-gym-surface border border-gym-border rounded-lg text-xs text-gym-text"
                      />
                    </div>
                    <div className="pt-4 text-right">
                      {selectedExercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExerciseRow(idx)}
                          className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Assign Routine to Athlete
          </Button>
        </form>
      </Modal>
    </div>
  );
}
