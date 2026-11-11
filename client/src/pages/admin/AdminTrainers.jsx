import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, Edit, Trash2, Key, DollarSign, Phone, Mail, Award } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [tempPasswordNotice, setTempPasswordNotice] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    monthlySalary: '',
    tempPassword: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTrainers = async () => {
    try {
      const res = await api.get('/trainers');
      if (res.data.success) {
        setTrainers(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/trainers', formData);
      if (res.data.success) {
        setShowAddModal(false);
        setTempPasswordNotice({
          name: res.data.data.name,
          email: res.data.data.email,
          tempPassword: res.data.temporaryPassword,
        });
        setFormData({ name: '', email: '', phone: '', specialization: '', monthlySalary: '', tempPassword: '' });
        fetchTrainers();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create trainer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTrainer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    try {
      const res = await api.put(`/trainers/${selectedTrainer._id}`, {
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        monthlySalary: formData.monthlySalary,
      });
      if (res.data.success) {
        setShowEditModal(false);
        fetchTrainers();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update trainer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (trainer) => {
    if (!window.confirm(`Are you sure you want to ${trainer.isActive ? 'deactivate' : 'reactivate'} ${trainer.name}?`)) {
      return;
    }
    try {
      await api.put(`/trainers/${trainer._id}`, { isActive: !trainer.isActive });
      fetchTrainers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Trainer & Coach Management</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Administers certified coaching staff, monthly salaries, and credentials
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setErrorMsg('');
            setFormData({ name: '', email: '', phone: '', specialization: '', monthlySalary: '', tempPassword: 'Trainer@FitTrack2026!' });
            setShowAddModal(true);
          }}
        >
          Add Certified Trainer
        </Button>
      </div>

      {/* Temporary Password Created Banner */}
      {tempPasswordNotice && (
        <div className="p-4 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-gym-primary">Trainer Account Provisioned Successfully</h4>
            <p className="text-xs text-gym-text mt-1">
              Account for <span className="font-semibold">{tempPasswordNotice.name}</span> ({tempPasswordNotice.email}) was initialized.
            </p>
            <p className="text-xs text-gym-accent font-mono mt-1">
              Temporary Password: <span className="font-bold bg-gym-bg px-2 py-0.5 rounded border border-gym-primary/30">{tempPasswordNotice.tempPassword}</span>
            </p>
            <p className="text-[11px] text-gym-muted mt-1">
              * The trainer will be prompted to change this temporary password upon their first login.
            </p>
          </div>
          <button
            onClick={() => setTempPasswordNotice(null)}
            className="text-xs text-gym-muted hover:text-gym-text underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Trainers Table */}
      {loading ? (
        <LoadingSpinner text="Fetching trainer roster..." />
      ) : trainers.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No Trainers Added"
          description="Click 'Add Certified Trainer' above to register the gym's coaching team."
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Coach Name</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Monthly Salary</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Password Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {trainers.map((t) => (
                <tr key={t._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-xs">
                        {t.name[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-gym-text block">{t.name}</span>
                        <span className="text-[11px] text-gym-muted">{t.email} • {t.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gym-primary font-medium">{t.specialization}</td>
                  <td className="py-3.5 px-4 font-semibold text-gym-text">
                    Rs. {(t.monthlySalary || 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted">
                    {new Date(t.joiningDate || t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {t.mustChangePassword ? (
                      <Badge variant="warning" size="sm">Must Change</Badge>
                    ) : (
                      <Badge variant="success" size="sm">Active Password</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={t.isActive ? 'success' : 'danger'} size="sm">
                      {t.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedTrainer(t);
                        setFormData({
                          name: t.name,
                          email: t.email,
                          phone: t.phone,
                          specialization: t.specialization,
                          monthlySalary: t.monthlySalary,
                          tempPassword: '',
                        });
                        setShowEditModal(true);
                      }}
                      title="Edit Trainer"
                      className="p-1.5 rounded-lg text-gym-muted hover:text-gym-text hover:bg-gym-surfaceLight"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(t)}
                      title={t.isActive ? 'Deactivate Trainer' : 'Activate Trainer'}
                      className="p-1.5 rounded-lg text-gym-muted hover:text-gym-danger hover:bg-gym-surfaceLight"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal: Add Trainer */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Certified Trainer"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleAddTrainer} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Trainer Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Bilal Qureshi"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="bilal.trainer@fittrack.com"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 9876543"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Specialization *</label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. Strength & Conditioning"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Monthly Salary (Rs.) *</label>
              <input
                type="number"
                required
                value={formData.monthlySalary}
                onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                placeholder="60000"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Temporary Initial Password</label>
            <input
              type="text"
              required
              value={formData.tempPassword}
              onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text font-mono"
            />
            <p className="text-[11px] text-gym-muted mt-1">
              Trainer will be forced to create a permanent password upon first login.
            </p>
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Register Trainer Account
          </Button>
        </form>
      </Modal>

      {/* Modal: Edit Trainer */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Trainer: ${selectedTrainer?.name}`}
      >
        <form onSubmit={handleEditTrainer} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Specialization</label>
            <input
              type="text"
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Monthly Salary (Rs.)</label>
            <input
              type="number"
              required
              value={formData.monthlySalary}
              onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>
          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Save Trainer Information
          </Button>
        </form>
      </Modal>
    </div>
  );
}

