import React, { useEffect, useState } from 'react';
import { Dumbbell, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    category: 'chest',
    description: '',
    targetMusclesText: '',
    equipment: '',
    difficulty: 'beginner',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full_body'];

  const fetchExercises = async () => {
    try {
      const url = categoryFilter ? `/exercises?category=${categoryFilter}` : '/exercises';
      const res = await api.get(url);
      if (res.data.success) {
        setExercises(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [categoryFilter]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    const targetMuscles = formData.targetMusclesText
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    try {
      const res = await api.post('/exercises', {
        ...formData,
        targetMuscles,
      });
      if (res.data.success) {
        setShowAddModal(false);
        fetchExercises();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add exercise.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    const targetMuscles = formData.targetMusclesText
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    try {
      const res = await api.put(`/exercises/${selectedExercise._id}`, {
        ...formData,
        targetMuscles,
      });
      if (res.data.success) {
        setShowEditModal(false);
        fetchExercises();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update exercise.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (exercise) => {
    if (!window.confirm(`Delete ${exercise.name} from gym library?`)) return;
    try {
      await api.delete(`/exercises/${exercise._id}`);
      fetchExercises();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.targetMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Exercise Movement Library</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Master database of movements, target muscular groups, and bio-mechanical cues
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setErrorMsg('');
            setFormData({
              name: '',
              category: 'chest',
              description: '',
              targetMusclesText: '',
              equipment: '',
              difficulty: 'beginner',
            });
            setShowAddModal(true);
          }}
        >
          Add New Movement
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-gym-surface border border-gym-border rounded-xl px-4 py-2.5 max-w-md w-full">
          <Search className="w-4 h-4 text-gym-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movement name or target muscles..."
            className="bg-transparent text-xs text-gym-text placeholder-gym-muted focus:outline-none w-full"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto bg-gym-surface p-1 rounded-xl border border-gym-border max-w-full">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${
              categoryFilter === '' ? 'bg-gym-primary text-black' : 'text-gym-muted hover:text-gym-text'
            }`}
          >
            All Movements
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${
                categoryFilter === cat ? 'bg-gym-primary text-black' : 'text-gym-muted hover:text-gym-text'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching movement encyclopedia..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="No Exercises Found"
          description="Try selecting a different category or click 'Add New Movement' to expand the library."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ex) => (
            <Card
              key={ex._id}
              title={ex.name}
              subtitle={`Category: ${ex.category.toUpperCase()}`}
              headerAction={
                <Badge
                  variant={
                    ex.difficulty === 'advanced'
                      ? 'danger'
                      : ex.difficulty === 'intermediate'
                      ? 'warning'
                      : 'success'
                  }
                  size="sm"
                >
                  {ex.difficulty}
                </Badge>
              }
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gym-muted">Equip: {ex.equipment || 'None'}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setSelectedExercise(ex);
                        setFormData({
                          name: ex.name,
                          category: ex.category,
                          description: ex.description || '',
                          targetMusclesText: ex.targetMuscles.join(', '),
                          equipment: ex.equipment || '',
                          difficulty: ex.difficulty || 'beginner',
                        });
                        setShowEditModal(true);
                      }}
                      className="text-xs text-gym-primary hover:underline font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ex)}
                      className="text-xs text-gym-muted hover:text-gym-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              }
            >
              <p className="text-xs text-gym-muted mb-3 leading-relaxed">
                {ex.description || 'Standard technical lifting movement.'}
              </p>

              <div className="flex flex-wrap gap-1 mt-2">
                {ex.targetMuscles.map((muscle, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-gym-surfaceLight text-[10px] text-gym-text font-medium border border-gym-border"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Add Exercise */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Exercise Movement"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Exercise Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Romanian Deadlift"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text uppercase"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Difficulty *</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text capitalize"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">
              Target Muscles (Comma-separated)
            </label>
            <input
              type="text"
              value={formData.targetMusclesText}
              onChange={(e) => setFormData({ ...formData, targetMusclesText: e.target.value })}
              placeholder="Hamstrings, Glutes, Erector Spinae"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Required Equipment</label>
            <input
              type="text"
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              placeholder="Barbell, Weight Plates"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Technique / Execution Cues</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Hinge at the hips keeping a neutral spine..."
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text resize-none"
            />
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Save Movement
          </Button>
        </form>
      </Modal>

      {/* Modal: Edit Exercise */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Exercise: ${selectedExercise?.name}`}
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Exercise Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text uppercase"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text capitalize"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Target Muscles</label>
            <input
              type="text"
              value={formData.targetMusclesText}
              onChange={(e) => setFormData({ ...formData, targetMusclesText: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Equipment</label>
            <input
              type="text"
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text resize-none"
            />
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Save Updates
          </Button>
        </form>
      </Modal>
    </div>
  );
}
