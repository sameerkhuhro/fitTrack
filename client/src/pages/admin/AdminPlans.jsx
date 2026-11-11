import React, { useEffect, useState } from 'react';
import { ClipboardList, Plus, Edit, Trash2, CheckCircle2, DollarSign } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationMonths: '',
    featuresText: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plans');
      if (res.data.success) {
        setPlans(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAddPlan = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');

    const features = formData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    try {
      const res = await api.post('/plans', {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        durationMonths: Number(formData.durationMonths),
        features,
      });
      if (res.data.success) {
        setShowAddModal(false);
        setFormData({ name: '', description: '', price: '', durationMonths: '', featuresText: '' });
        fetchPlans();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create plan.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditPlan = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');

    const features = formData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    try {
      const res = await api.put(`/plans/${selectedPlan._id}`, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        durationMonths: Number(formData.durationMonths),
        features,
      });
      if (res.data.success) {
        setShowEditModal(false);
        fetchPlans();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update plan.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (plan) => {
    if (!window.confirm(`Are you sure you want to ${plan.isActive ? 'deactivate' : 'reactivate'} ${plan.name} plan?`)) {
      return;
    }
    try {
      await api.put(`/plans/${plan._id}`, { isActive: !plan.isActive });
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Membership Plan Management</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Configure subscription packages, demonstration pricing, and included privileges
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setErrorMsg('');
            setFormData({ name: '', description: '', price: '', durationMonths: '', featuresText: '' });
            setShowAddModal(true);
          }}
        >
          Create New Plan
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching gym membership tiers..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan._id}
              className="flex flex-col justify-between"
              headerAction={
                <Badge variant={plan.isActive ? 'success' : 'danger'} size="sm">
                  {plan.isActive ? 'Active' : 'Inactive'}
                </Badge>
              }
              title={plan.name}
              subtitle={`${plan.durationMonths} ${plan.durationMonths === 1 ? 'Month' : 'Months'} Validity`}
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gym-muted">ID: {plan._id.slice(-6)}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setFormData({
                          name: plan.name,
                          description: plan.description || '',
                          price: plan.price,
                          durationMonths: plan.durationMonths,
                          featuresText: plan.features.join('\n'),
                        });
                        setShowEditModal(true);
                      }}
                      className="text-xs font-semibold text-gym-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(plan)}
                      className="text-xs font-semibold text-gym-muted hover:text-gym-danger"
                    >
                      {plan.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              }
            >
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-gym-text">
                  Rs. {plan.price.toLocaleString()}
                </span>
                <p className="text-xs text-gym-muted mt-1">{plan.description}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gym-border">
                <p className="text-[11px] font-semibold uppercase text-gym-muted">Features:</p>
                <ul className="space-y-1.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start text-xs text-gym-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gym-primary mr-2 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Add Plan */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Membership Plan"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleAddPlan} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Plan Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. VIP Platinum"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Price (Rs.) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2000"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Duration (Months) *</label>
              <input
                type="number"
                required
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                placeholder="1"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Short Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Suitable for fitness enthusiasts"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">
              Included Features (One feature per line)
            </label>
            <textarea
              rows={4}
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              placeholder="Full Gym Floor Access&#10;Locker & Shower Access&#10;1 Complimentary Trainer Consultation"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text resize-none"
            />
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Save Membership Plan
          </Button>
        </form>
      </Modal>

      {/* Modal: Edit Plan */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Plan: ${selectedPlan?.name}`}
      >
        <form onSubmit={handleEditPlan} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Plan Name</label>
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
              <label className="block text-xs uppercase text-gym-muted mb-1">Price (Rs.)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Duration (Months)</label>
              <input
                type="number"
                required
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Features (One per line)</label>
            <textarea
              rows={4}
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text resize-none"
            />
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Update Plan Details
          </Button>
        </form>
      </Modal>
    </div>
  );
}

