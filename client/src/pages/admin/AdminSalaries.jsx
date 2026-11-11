import React, { useEffect, useState } from 'react';
import { DollarSign, Plus, CheckCircle2, Clock, AlertTriangle, Eye, Send } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    trainerId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: '',
    adminNotes: '',
  });

  const [payForm, setPayForm] = useState({
    paymentMethod: 'bank_transfer',
    transactionReference: '',
    adminNotes: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchSalaries = async () => {
    try {
      let query = `?month=${selectedMonth}&year=${selectedYear}`;
      if (statusFilter) query += `&status=${statusFilter}`;

      const [salRes, trainRes] = await Promise.all([
        api.get(`/salaries${query}`),
        api.get('/trainers'),
      ]);

      if (salRes.data.success) setSalaries(salRes.data.data);
      if (trainRes.data.success) setTrainers(trainRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [selectedMonth, selectedYear, statusFilter]);

  const handleCreateSalary = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/salaries', createForm);
      if (res.data.success) {
        setShowCreateModal(false);
        fetchSalaries();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create salary record.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkPaid = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.patch(`/salaries/${selectedSalary._id}/mark-paid`, payForm);
      if (res.data.success) {
        setShowMarkPaidModal(false);
        fetchSalaries();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Trainer Salary Obligations & Disbursements</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Administers monthly payroll, records bank/wallet remittances, and audits coach confirmations
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setErrorMsg('');
            setCreateForm({
              trainerId: trainers[0]?._id || '',
              month: selectedMonth,
              year: selectedYear,
              amount: trainers[0]?.monthlySalary || '',
              adminNotes: '',
            });
            setShowCreateModal(true);
          }}
        >
          Generate Salary Record
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-gym-surface border border-gym-border rounded-xl p-3">
        <div>
          <span className="text-[10px] font-semibold uppercase text-gym-muted block mb-1">Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-1.5 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase text-gym-muted block mb-1">Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase text-gym-muted block mb-1">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text capitalize"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid_awaiting_confirmation">Awaiting Confirmation</option>
            <option value="confirmed">Confirmed by Coach</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </div>

      {/* Salary Table */}
      {loading ? (
        <LoadingSpinner text="Loading coach salary ledger..." />
      ) : salaries.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No Salary Records For This Period"
          description="Click 'Generate Salary Record' above to initialize a monthly salary slip for any coach."
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Trainer Name</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Salary Amount</th>
                <th className="py-3 px-4">Disbursement Status</th>
                <th className="py-3 px-4">Payment Method / Ref</th>
                <th className="py-3 px-4">Coach Confirmation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {salaries.map((s) => (
                <tr key={s._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gym-text block">{s.trainer?.name}</span>
                    <span className="text-[11px] text-gym-muted">{s.trainer?.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gym-text font-medium">
                    {months[s.month - 1]} {s.year}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gym-text">
                    Rs. {s.amount?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        s.status === 'confirmed'
                          ? 'success'
                          : s.status === 'paid_awaiting_confirmation'
                          ? 'warning'
                          : s.status === 'disputed'
                          ? 'danger'
                          : 'default'
                      }
                      size="sm"
                    >
                      {s.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted">
                    {s.paidAt ? (
                      <div>
                        <span className="uppercase block font-medium text-gym-text">{s.paymentMethod.replace('_', ' ')}</span>
                        <span className="font-mono text-[10px] text-gym-muted">{s.transactionReference || 'No Ref'}</span>
                      </div>
                    ) : (
                      <span className="italic">Not yet disbursed</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {s.status === 'confirmed' ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirmed on {new Date(s.confirmedAt).toLocaleDateString()}
                      </span>
                    ) : s.status === 'disputed' ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Disputed: "{s.disputeReason}"
                      </span>
                    ) : s.status === 'paid_awaiting_confirmation' ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Sent. Waiting for coach
                      </span>
                    ) : (
                      <span className="text-gym-muted">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {s.status === 'pending' || s.status === 'disputed' ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setSelectedSalary(s);
                          setPayForm({
                            paymentMethod: 'bank_transfer',
                            transactionReference: '',
                            adminNotes: '',
                          });
                          setShowMarkPaidModal(true);
                        }}
                      >
                        Mark as Paid
                      </Button>
                    ) : (
                      <span className="text-[11px] text-gym-muted">Disbursed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal: Generate Salary Record */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Generate Monthly Salary Obligation"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleCreateSalary} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Select Coach *</label>
            <select
              required
              value={createForm.trainerId}
              onChange={(e) => {
                const trainer = trainers.find((t) => t._id === e.target.value);
                setCreateForm({
                  ...createForm,
                  trainerId: e.target.value,
                  amount: trainer?.monthlySalary || '',
                });
              }}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            >
              {trainers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} (Monthly Base: Rs. {t.monthlySalary})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Month</label>
              <select
                value={createForm.month}
                onChange={(e) => setCreateForm({ ...createForm, month: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Year</label>
              <input
                type="number"
                required
                value={createForm.year}
                onChange={(e) => setCreateForm({ ...createForm, year: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Salary Amount (Rs.) *</label>
            <input
              type="number"
              required
              value={createForm.amount}
              onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Admin Notes</label>
            <input
              type="text"
              value={createForm.adminNotes}
              onChange={(e) => setCreateForm({ ...createForm, adminNotes: e.target.value })}
              placeholder="e.g. Standard monthly coaching contract"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Create Salary Slip
          </Button>
        </form>
      </Modal>

      {/* Modal: Mark Paid */}
      <Modal
        isOpen={showMarkPaidModal}
        onClose={() => setShowMarkPaidModal(false)}
        title="Disburse Salary & Notify Coach"
      >
        {selectedSalary && (
          <form onSubmit={handleMarkPaid} className="space-y-4">
            <div className="p-3 bg-gym-surfaceLight/50 rounded-xl border border-gym-border text-xs space-y-1">
              <p className="text-gym-muted">Coach: <span className="font-bold text-gym-text">{selectedSalary.trainer?.name}</span></p>
              <p className="text-gym-muted">Amount Due: <span className="font-bold text-gym-primary text-sm">Rs. {selectedSalary.amount?.toLocaleString()}</span></p>
              <p className="text-gym-muted">Period: <span className="text-gym-text font-medium">{months[selectedSalary.month - 1]} {selectedSalary.year}</span></p>
            </div>

            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Disbursement Channel *</label>
              <select
                value={payForm.paymentMethod}
                onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text uppercase"
              >
                <option value="bank_transfer">Bank Transfer (Meezan/SCB/HBL)</option>
                <option value="jazzcash">JazzCash Corporate</option>
                <option value="easypaisa">Easypaisa Merchant</option>
                <option value="cash">Direct Cash Handover</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Transaction Ref / Cheque #</label>
              <input
                type="text"
                value={payForm.transactionReference}
                onChange={(e) => setPayForm({ ...payForm, transactionReference: e.target.value })}
                placeholder="e.g. FT-PAY-98762"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text font-mono"
              />
            </div>

            <p className="text-[11px] text-gym-accent">
              * Marking as paid will transition status to <strong>paid_awaiting_confirmation</strong> and send an immediate in-app notification to the coach to verify their bank account and confirm.
            </p>

            <Button type="submit" variant="primary" loading={actionLoading} className="w-full" icon={Send}>
              Dispatch Payment Record
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
