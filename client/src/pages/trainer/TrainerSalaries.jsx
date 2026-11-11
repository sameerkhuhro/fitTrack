import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle2, Clock, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function TrainerSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchSalaries = async () => {
    try {
      const res = await api.get('/salaries/my');
      if (res.data.success) {
        setSalaries(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleConfirmReceived = async () => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/salaries/${selectedSalary._id}/confirm-received`);
      if (res.data.success) {
        setShowConfirmModal(false);
        fetchSalaries();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Confirmation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispute = async (e) => {
    e.preventDefault();
    if (!disputeReason) return alert('Please enter dispute reason.');
    setActionLoading(true);
    try {
      const res = await api.patch(`/salaries/${selectedSalary._id}/dispute`, { disputeReason });
      if (res.data.success) {
        setShowDisputeModal(false);
        setDisputeReason('');
        fetchSalaries();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Dispute submission failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Salary History & Disbursement Confirmation</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Verify monthly gym remittances and confirm personal funds clearance
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching salary ledger..." />
      ) : salaries.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No Salary Records Found"
          description="Gym management has not yet issued monthly compensation slips for your account."
        />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Salary Amount</th>
                <th className="py-3 px-4">Disbursement Status</th>
                <th className="py-3 px-4">Payment Method / Ref</th>
                <th className="py-3 px-4">Remittance Date</th>
                <th className="py-3 px-4">Your Confirmation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {salaries.map((s) => (
                <tr key={s._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gym-text">
                    {months[s.month - 1]} {s.year}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-gym-primary text-sm">
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
                        <span className="uppercase block font-medium text-gym-text">
                          {s.paymentMethod.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-[10px] text-gym-muted">
                          {s.transactionReference || 'N/A'}
                        </span>
                      </div>
                    ) : (
                      <span className="italic">Pending processing by admin</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gym-muted">
                    {s.paidAt ? new Date(s.paidAt).toLocaleDateString() : '—'}
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
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Action Required: Confirm receipt
                      </span>
                    ) : (
                      <span className="text-gym-muted">Awaiting admin remittance</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {s.status === 'paid_awaiting_confirmation' && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            setSelectedSalary(s);
                            setShowConfirmModal(true);
                          }}
                        >
                          Confirm Received
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setSelectedSalary(s);
                            setDisputeReason('');
                            setShowDisputeModal(true);
                          }}
                        >
                          Dispute
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal: Confirm Received */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Salary Payment Receipt"
      >
        {selectedSalary && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-gym-surfaceLight/50 border border-gym-border space-y-2">
              <div className="flex justify-between">
                <span className="text-gym-muted">Period:</span>
                <span className="font-bold text-gym-text">
                  {months[selectedSalary.month - 1]} {selectedSalary.year}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Salary Amount:</span>
                <span className="font-bold text-gym-primary text-sm">
                  Rs. {selectedSalary.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Payment Channel:</span>
                <span className="uppercase text-gym-text">{selectedSalary.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gym-muted">Reference / Cheque:</span>
                <span className="font-mono text-gym-accent font-semibold">{selectedSalary.transactionReference || 'N/A'}</span>
              </div>
            </div>

            <p className="text-gym-muted leading-relaxed">
              By clicking <strong>"Yes, I Received This Payment"</strong>, you certify that the stated salary funds have credited to your bank account or personal mobile wallet. This action will be timestamped and permanently recorded.
            </p>

            <Button
              variant="primary"
              loading={actionLoading}
              onClick={handleConfirmReceived}
              className="w-full"
              icon={CheckCircle2}
            >
              Yes, I Received This Payment
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal: Dispute */}
      <Modal
        isOpen={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        title="Dispute Salary Remittance"
      >
        <form onSubmit={handleDispute} className="space-y-4 text-xs">
          <p className="text-gym-muted">
            If you did not receive these funds or if the amount transferred does not match your agreement, submit your explanation below for gym management review.
          </p>

          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Reason for Dispute *</label>
            <textarea
              required
              rows={3}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="e.g. Funds not received in Meezan account / Transaction ID not found"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text resize-none"
            />
          </div>

          <Button type="submit" variant="danger" loading={actionLoading} className="w-full">
            Submit Formal Dispute
          </Button>
        </form>
      </Modal>
    </div>
  );
}

