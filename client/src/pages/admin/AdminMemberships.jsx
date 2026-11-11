import React, { useEffect, useState } from 'react';
import { FileCheck, CheckCircle2, Clock, XCircle, Search, AlertCircle, Eye, Calendar, User } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Details Modal
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activatingId, setActivatingId] = useState(null);

  const fetchMemberships = async () => {
    try {
      const url = statusFilter ? `/memberships?status=${statusFilter}` : '/memberships';
      const res = await api.get(url);
      if (res.data.success) {
        setMemberships(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [statusFilter]);

  const handleActivate = async (membershipId) => {
    if (!window.confirm('Are you sure you want to activate this membership? This will start the subscription period and send an in-app confirmation notification to the member.')) {
      return;
    }

    setActivatingId(membershipId);
    try {
      const res = await api.patch(`/memberships/${membershipId}/activate`);
      if (res.data.success) {
        alert('Membership successfully activated!');
        fetchMemberships();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Activation failed.');
    } finally {
      setActivatingId(null);
    }
  };

  const filtered = memberships.filter((m) =>
    m.member?.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.member?.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.plan?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Membership Subscriptions & Requests</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Review incoming requests, verify payment clearances, and activate subscriptions
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-gym-surface p-1 rounded-xl border border-gym-border">
          {['', 'pending', 'active', 'expired'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-gym-primary text-black'
                  : 'text-gym-muted hover:text-gym-text'
              }`}
            >
              {st || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-gym-surface border border-gym-border rounded-xl px-4 py-2.5 max-w-md">
        <Search className="w-4 h-4 text-gym-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by member name, email, plan..."
          className="bg-transparent text-xs text-gym-text placeholder-gym-muted focus:outline-none w-full"
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Fetching membership subscription records..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No Membership Records Found"
          description="No subscriptions match your current filter parameters."
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Fee Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Subscription Status</th>
                <th className="py-3 px-4">Duration / Expiry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {filtered.map((m) => (
                <tr key={m._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gym-surfaceLight text-gym-text font-bold flex items-center justify-center text-xs">
                        {m.member?.name?.[0] || 'M'}
                      </div>
                      <div>
                        <span className="font-semibold text-gym-text block">{m.member?.name}</span>
                        <span className="text-[11px] text-gym-muted">{m.member?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gym-primary">{m.plan?.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-gym-text">
                    Rs. {m.totalAmount?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        m.paymentStatus === 'paid'
                          ? 'success'
                          : m.paymentStatus === 'partial'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {m.paymentStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        m.status === 'active'
                          ? 'success'
                          : m.status === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                      size="sm"
                    >
                      {m.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted">
                    {m.expiryDate ? (
                      <span>Expires {new Date(m.expiryDate).toLocaleDateString()}</span>
                    ) : (
                      <span className="italic">{m.plan?.durationMonths} Months (Pending Activation)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    {m.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="primary"
                        loading={activatingId === m._id}
                        onClick={() => handleActivate(m._id)}
                      >
                        Activate
                      </Button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedMembership(m);
                        setShowDetailModal(true);
                      }}
                      title="Inspect Details"
                      className="p-1.5 rounded-lg text-gym-muted hover:text-gym-text hover:bg-gym-surfaceLight"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal: Membership Inspection */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Membership Details & Activation Status"
      >
        {selectedMembership && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-gym-surfaceLight/50 border border-gym-border space-y-2">
              <div className="flex justify-between">
                <span className="text-gym-muted">Member Name:</span>
                <span className="font-bold text-gym-text">{selectedMembership.member?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Email:</span>
                <span className="text-gym-text">{selectedMembership.member?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Phone:</span>
                <span className="text-gym-text">{selectedMembership.member?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Selected Tier:</span>
                <span className="font-bold text-gym-primary">{selectedMembership.plan?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Total Package Fee:</span>
                <span className="font-bold text-gym-text">Rs. {selectedMembership.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Current Status:</span>
                <Badge variant={selectedMembership.status === 'active' ? 'success' : 'warning'}>
                  {selectedMembership.status}
                </Badge>
              </div>
              {selectedMembership.startDate && (
                <div className="flex justify-between">
                  <span className="text-gym-muted">Validity Interval:</span>
                  <span className="text-gym-text">
                    {new Date(selectedMembership.startDate).toLocaleDateString()} – {new Date(selectedMembership.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {selectedMembership.status === 'pending' && (
              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleActivate(selectedMembership._id);
                  }}
                >
                  Confirm & Activate Subscription
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
