import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    assignedTrainer: '',
    emergencyName: '',
    emergencyPhone: '',
  });
  const [assignTrainerId, setAssignTrainerId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMembers = async () => {
    try {
      const [memRes, trainRes] = await Promise.all([
        api.get('/members'),
        api.get('/trainers'),
      ]);
      if (memRes.data.success) setMembers(memRes.data.data);
      if (trainRes.data.success) setTrainers(trainRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/members', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password || undefined,
        assignedTrainer: formData.assignedTrainer || null,
        emergencyContact: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
        },
      });
      if (res.data.success) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', phone: '', password: '', assignedTrainer: '', emergencyName: '', emergencyPhone: '' });
        fetchMembers();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add member.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditMember = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    try {
      const res = await api.put(`/members/${selectedMember._id}`, {
        name: formData.name,
        phone: formData.phone,
        assignedTrainer: formData.assignedTrainer || null,
        emergencyContact: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
        },
      });
      if (res.data.success) {
        setShowEditModal(false);
        fetchMembers();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update member.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTrainer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.patch(`/members/${selectedMember._id}/assign-trainer`, {
        trainerId: assignTrainerId || null,
      });
      setShowAssignModal(false);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign trainer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (member) => {
    if (!window.confirm(`Are you sure you want to ${member.isActive ? 'deactivate' : 'reactivate'} ${member.name}?`)) {
      return;
    }
    try {
      await api.put(`/members/${member._id}`, { isActive: !member.isActive });
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleViewDetails = async (member) => {
    setSelectedMember(member);
    setShowDetailModal(true);
    try {
      const res = await api.get(`/members/${member._id}`);
      if (res.data.success) {
        setMemberDetails(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Member Management</h1>
          <p className="text-xs text-gym-muted mt-0.5">Manage athletes, subscriptions, and coach assignments</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setErrorMsg('');
            setFormData({ name: '', email: '', phone: '', password: '', assignedTrainer: '', emergencyName: '', emergencyPhone: '' });
            setShowAddModal(true);
          }}
        >
          Add New Member
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-gym-surface border border-gym-border rounded-xl px-4 py-2.5 max-w-md">
        <Search className="w-4 h-4 text-gym-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="bg-transparent text-xs text-gym-text placeholder-gym-muted focus:outline-none w-full"
        />
      </div>

      {/* Members Table */}
      {loading ? (
        <LoadingSpinner text="Fetching gym member roster..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Members Found"
          description={search ? "No members match your search query." : "No registered gym members in database."}
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Assigned Coach</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {filtered.map((member) => (
                <tr key={member._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gym-primary/10 border border-gym-primary/30 text-gym-primary font-bold flex items-center justify-center text-xs">
                        {member.name[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-gym-text block">{member.name}</span>
                        <span className="text-[11px] text-gym-muted">{member.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted">{member.phone}</td>
                  <td className="py-3.5 px-4">
                    {member.assignedTrainer ? (
                      <span className="inline-flex items-center gap-1.5 text-gym-accent font-medium">
                        <UserCheck className="w-3.5 h-3.5" />
                        {member.assignedTrainer.name}
                      </span>
                    ) : (
                      <span className="text-gym-muted italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={member.isActive ? 'success' : 'danger'} size="sm">
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(member)}
                      title="View Details & History"
                      className="p-1.5 rounded-lg text-gym-muted hover:text-gym-primary hover:bg-gym-surfaceLight transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setAssignTrainerId(member.assignedTrainer?._id || '');
                        setShowAssignModal(true);
                      }}
                      title="Assign / Reassign Trainer"
                      className="p-1.5 rounded-lg text-gym-muted hover:text-teal-400 hover:bg-gym-surfaceLight transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setFormData({
                          name: member.name,
                          email: member.email,
                          phone: member.phone,
                          assignedTrainer: member.assignedTrainer?._id || '',
                          emergencyName: member.emergencyContact?.name || '',
                          emergencyPhone: member.emergencyContact?.phone || '',
                        });
                        setShowEditModal(true);
                      }}
                      title="Edit Member"
                      className="p-1.5 rounded-lg text-gym-muted hover:text-gym-text hover:bg-gym-surfaceLight transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(member)}
                      title={member.isActive ? 'Deactivate Member' : 'Activate Member'}
                      className="p-1.5 rounded-lg text-gym-muted hover:text-gym-danger hover:bg-gym-surfaceLight transition-colors"
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

      {/* Modal: Add Member */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Gym Member"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Full Name *</label>
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
              <label className="block text-xs uppercase text-gym-muted mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Assign Trainer (Optional)</label>
            <select
              value={formData.assignedTrainer}
              onChange={(e) => setFormData({ ...formData, assignedTrainer: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            >
              <option value="">No Trainer Assigned</option>
              {trainers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.specialization})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gym-border">
            <div>
              <label className="block text-[11px] uppercase text-gym-muted mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full px-3 py-1.5 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase text-gym-muted mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-1.5 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
          </div>
          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Create Member Record
          </Button>
        </form>
      </Modal>

      {/* Modal: Edit Member */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Member: ${selectedMember?.name}`}
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleEditMember} className="space-y-4">
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
            <label className="block text-xs uppercase text-gym-muted mb-1">Assigned Trainer</label>
            <select
              value={formData.assignedTrainer}
              onChange={(e) => setFormData({ ...formData, assignedTrainer: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            >
              <option value="">No Trainer Assigned</option>
              {trainers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.specialization})
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Save Changes
          </Button>
        </form>
      </Modal>

      {/* Modal: Assign Trainer */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={`Assign Coach to ${selectedMember?.name}`}
      >
        <form onSubmit={handleAssignTrainer} className="space-y-4">
          <p className="text-xs text-gym-muted">
            Select a certified personal trainer to oversee workout routines and fitness metrics for this member.
          </p>
          <div>
            <select
              value={assignTrainerId}
              onChange={(e) => setAssignTrainerId(e.target.value)}
              className="w-full px-3 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            >
              <option value="">-- No Coach (Self-Guided) --</option>
              {trainers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} — {t.specialization}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Update Coach Assignment
          </Button>
        </form>
      </Modal>

      {/* Modal: Member Details & History */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Member Profile & Subscription History"
        maxWidth="max-w-2xl"
      >
        {memberDetails ? (
          <div className="space-y-6 text-xs">
            {/* Bio Row */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gym-surfaceLight/50 border border-gym-border">
              <div className="w-12 h-12 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary font-bold text-lg">
                {memberDetails.member.name[0]}
              </div>
              <div>
                <h4 className="text-base font-bold text-gym-text">{memberDetails.member.name}</h4>
                <p className="text-gym-muted">{memberDetails.member.email} • {memberDetails.member.phone}</p>
                <p className="text-gym-accent mt-0.5">
                  Coach: {memberDetails.member.assignedTrainer?.name || 'None Assigned'}
                </p>
              </div>
            </div>

            {/* Current Active Plan */}
            <div>
              <h5 className="font-semibold text-gym-text uppercase tracking-wider mb-2">Active Subscription</h5>
              {memberDetails.activeMembership ? (
                <div className="p-4 rounded-xl bg-gym-bg border border-gym-primary/30 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-gym-primary block">
                      {memberDetails.activeMembership.plan?.name} Plan
                    </span>
                    <span className="text-gym-muted">
                      Expiry Date: {new Date(memberDetails.activeMembership.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-gym-bg border border-dashed border-gym-border text-gym-muted">
                  No currently active membership subscription.
                </div>
              )}
            </div>

            {/* Payment History */}
            <div>
              <h5 className="font-semibold text-gym-text uppercase tracking-wider mb-2">Payment Transactions</h5>
              {memberDetails.payments.length === 0 ? (
                <p className="text-gym-muted">No payments recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {memberDetails.payments.map((p) => (
                    <div
                      key={p._id}
                      className="p-3 rounded-lg bg-gym-bg border border-gym-border flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-gym-text block">
                          Rs. {p.amount.toLocaleString()} ({p.paymentMethod.replace('_', ' ').toUpperCase()})
                        </span>
                        <span className="text-[11px] text-gym-muted">
                          Receipt: {p.receiptNumber || 'Pending'} • {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge
                        variant={p.status === 'verified' ? 'success' : p.status === 'rejected' ? 'danger' : 'warning'}
                      >
                        {p.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <LoadingSpinner text="Fetching full member history..." />
        )}
      </Modal>
    </div>
  );
}

