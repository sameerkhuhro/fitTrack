import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  Search,
  FileText,
  AlertCircle,
  Banknote,
  DollarSign,
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Form states
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [cashForm, setCashForm] = useState({
    memberId: '',
    membershipId: '',
    amount: '',
    notes: '',
  });
  const [memberMemberships, setMemberMemberships] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      const url = statusFilter ? `/payments?status=${statusFilter}` : '/payments';
      const [payRes, memRes] = await Promise.all([
        api.get(url),
        api.get('/members'),
      ]);
      if (payRes.data.success) setPayments(payRes.data.data);
      if (memRes.data.success) setMembers(memRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  // When admin selects a member in cash modal, load that member's memberships
  const handleCashMemberSelect = async (memberId) => {
    setCashForm({ ...cashForm, memberId, membershipId: '' });
    if (!memberId) {
      setMemberMemberships([]);
      return;
    }
    try {
      const res = await api.get(`/members/${memberId}`);
      if (res.data.success) {
        setMemberMemberships(res.data.data.memberships || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyPayment = async () => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/payments/${selectedPayment._id}/verify`, { adminNotes });
      if (res.data.success) {
        setShowVerifyModal(false);
        setAdminNotes('');
        fetchPayments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectReason) {
      return alert('Please enter a rejection reason.');
    }
    setActionLoading(true);
    try {
      const res = await api.patch(`/payments/${selectedPayment._id}/reject`, { reason: rejectReason });
      if (res.data.success) {
        setShowRejectModal(false);
        setRejectReason('');
        fetchPayments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordCash = async (e) => {
    e.preventDefault();
    if (!cashForm.membershipId) {
      return alert('Please select a target membership for this cash payment.');
    }
    setActionLoading(true);
    try {
      const res = await api.post('/payments/cash-received', cashForm);
      if (res.data.success) {
        setShowCashModal(false);
        setCashForm({ memberId: '', membershipId: '', amount: '', notes: '' });
        fetchPayments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record cash payment.');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = payments.filter((p) =>
    p.member?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.member?.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.transactionReference?.toLowerCase().includes(search.toLowerCase()) ||
    p.receiptNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Payment Verification & Cash Desk</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Audit manual bank/wallet transfer proofs and record in-person cash receipts
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            icon={Banknote}
            onClick={() => setShowCashModal(true)}
          >
            Record Cash Received
          </Button>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-gym-surface p-1 rounded-xl border border-gym-border">
            {['', 'submitted', 'verified', 'rejected'].map((st) => (
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
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-gym-surface border border-gym-border rounded-xl px-4 py-2.5 max-w-md">
        <Search className="w-4 h-4 text-gym-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by member, transaction ID, or receipt..."
          className="bg-transparent text-xs text-gym-text placeholder-gym-muted focus:outline-none w-full"
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading payment audits..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Payment Records"
          description="No transactions match your search or filter criteria."
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Transaction / Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gym-text block">{p.member?.name}</span>
                    <span className="text-[11px] text-gym-muted">{p.member?.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gym-text">
                    Rs. {p.amount?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-gym-primary font-medium">
                    {p.paymentMethod.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gym-muted">
                    {p.transactionReference || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        p.status === 'verified'
                          ? 'success'
                          : p.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gym-accent font-semibold">
                    {p.receiptNumber || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    {p.status === 'submitted' && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            setSelectedPayment(p);
                            setShowVerifyModal(true);
                          }}
                        >
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setSelectedPayment(p);
                            setRejectReason('');
                            setShowRejectModal(true);
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {p.receiptNumber && (
                      <button
                        onClick={() => {
                          setSelectedPayment(p);
                          setShowReceiptModal(true);
                        }}
                        title="View Official Receipt"
                        className="p-1.5 rounded-lg text-gym-muted hover:text-gym-primary hover:bg-gym-surfaceLight"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal: Verify Payment Proof */}
      <Modal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        title="Verify Submitted Payment"
      >
        {selectedPayment && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-gym-surfaceLight/50 border border-gym-border space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gym-muted">Member:</span>
                <span className="font-semibold text-gym-text">{selectedPayment.member?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Amount Submitted:</span>
                <span className="font-bold text-gym-primary text-sm">
                  Rs. {selectedPayment.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Payment Channel:</span>
                <span className="uppercase text-gym-text">{selectedPayment.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Transaction ID:</span>
                <span className="font-mono text-gym-accent font-semibold">{selectedPayment.transactionReference || 'None'}</span>
              </div>
            </div>

            {selectedPayment.proofImage && (
              <div>
                <p className="text-[11px] font-semibold uppercase text-gym-muted mb-2">Submitted Screenshot / Proof:</p>
                <div className="max-h-60 overflow-hidden rounded-xl border border-gym-border bg-black flex items-center justify-center">
                  <img
                    src={selectedPayment.proofImage}
                    alt="Payment Proof"
                    className="max-h-60 object-contain"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase text-gym-muted mb-1">Optional Admin Verification Note</label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Bank statement transaction verified on Meezan Portal"
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>

            <Button
              variant="primary"
              loading={actionLoading}
              onClick={handleVerifyPayment}
              className="w-full mt-2"
            >
              Confirm Verification & Issue Receipt
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal: Reject Payment */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Payment Submission"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gym-muted">
            The member will receive an in-app alert stating the reason for rejection so they can resubmit valid proof.
          </p>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Reason for Rejection *</label>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Transaction ID was not found in gym bank statement / Screenshot is blurry"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text resize-none"
            />
          </div>

          <Button
            variant="danger"
            loading={actionLoading}
            onClick={handleRejectPayment}
            className="w-full"
          >
            Confirm Rejection
          </Button>
        </div>
      </Modal>

      {/* Modal: Record Cash Received at Gym Desk */}
      <Modal
        isOpen={showCashModal}
        onClose={() => setShowCashModal(false)}
        title="Record Cash Payment (Gym Reception)"
      >
        <form onSubmit={handleRecordCash} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Select Member *</label>
            <select
              required
              value={cashForm.memberId}
              onChange={(e) => handleCashMemberSelect(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            >
              <option value="">-- Choose Member --</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Target Membership Package *</label>
            <select
              required
              value={cashForm.membershipId}
              onChange={(e) => setCashForm({ ...cashForm, membershipId: e.target.value })}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              disabled={!cashForm.memberId}
            >
              <option value="">-- Choose Subscription --</option>
              {memberMemberships.map((mem) => (
                <option key={mem._id} value={mem._id}>
                  {mem.plan?.name} Plan — Total: Rs. {mem.totalAmount} ({mem.status.toUpperCase()})
                </option>
              ))}
            </select>
            {cashForm.memberId && memberMemberships.length === 0 && (
              <p className="text-[11px] text-amber-400 mt-1">
                This member has no membership requests. Create a request first or submit through member portal.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Cash Amount Received (Rs.) *</label>
            <input
              type="number"
              required
              min={1}
              value={cashForm.amount}
              onChange={(e) => setCashForm({ ...cashForm, amount: e.target.value })}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gym-muted mb-1">Receptionist Notes</label>
            <input
              type="text"
              value={cashForm.notes}
              onChange={(e) => setCashForm({ ...cashForm, notes: e.target.value })}
              placeholder="e.g. Paid in cash at reception counter"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Confirm Cash Received & Issue Receipt
          </Button>
        </form>
      </Modal>

      {/* Modal: Official Receipt View */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="Official Verified Payment Receipt"
      >
        {selectedPayment && (
          <div className="space-y-4 text-xs">
            <div className="p-6 rounded-2xl bg-gym-surfaceLight border border-gym-primary/40 space-y-3">
              <div className="text-center pb-3 border-b border-gym-border">
                <h4 className="text-base font-extrabold text-gym-text">FitTrack Pro Fitness Club</h4>
                <p className="text-[11px] text-gym-primary font-mono font-bold mt-0.5">
                  Receipt: {selectedPayment.receiptNumber}
                </p>
                <p className="text-[10px] text-gym-muted">Islamabad Club Branch • Official Tax/Audit Voucher</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-gym-muted">Received From:</span>
                  <span className="font-bold text-gym-text">{selectedPayment.member?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gym-muted">Payment Channel:</span>
                  <span className="uppercase text-gym-text">{selectedPayment.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gym-muted">Date & Time:</span>
                  <span className="text-gym-text">
                    {new Date(selectedPayment.verifiedAt || selectedPayment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gym-muted">Transaction ID:</span>
                  <span className="font-mono text-gym-accent">{selectedPayment.transactionReference || 'CASH-REC'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gym-border flex justify-between items-center">
                <span className="font-bold text-gym-text text-sm">Amount Paid:</span>
                <span className="text-lg font-extrabold text-gym-primary">
                  Rs. {selectedPayment.amount?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-gym-muted">
                System-generated digital proof. This receipt validates that funds have cleared into FitTrack Pro club accounts.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
