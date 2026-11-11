import React, { useEffect, useState } from 'react';
import { CreditCard, Banknote, Upload, CheckCircle2, AlertCircle, FileText, Building, Smartphone } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MemberPayments() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submit Payment Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Form State
  const [membershipId, setMembershipId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [transactionReference, setTransactionReference] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchPaymentsData = async () => {
    try {
      const [payRes, memRes, accRes] = await Promise.all([
        api.get('/payments/my'),
        api.get('/memberships/my'),
        api.get('/payments/config/account-details'),
      ]);

      if (payRes.data.success) {
        setPayments(payRes.data.data);
        setSummary(payRes.data.summary);
      }
      if (memRes.data.success) {
        const mems = memRes.data.data.history || [];
        setMemberships(mems);
        if (!membershipId && mems.length > 0) {
          const target = mems.find((m) => m.status === 'pending' || m.status === 'active') || mems[0];
          setMembershipId(target._id);
          setAmount(target.totalAmount);
        }
      }
      if (accRes.data.success) {
        setAccountDetails(accRes.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('membershipId', membershipId);
    formData.append('amount', amount);
    formData.append('paymentMethod', paymentMethod);
    formData.append('transactionReference', transactionReference);
    if (proofFile) {
      formData.append('proofImage', proofFile);
    }

    try {
      const res = await api.post('/payments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setShowSubmitModal(false);
        setTransactionReference('');
        setProofFile(null);
        fetchPaymentsData();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment submission failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading payment ledger and dues..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Payments, Receipts & Dues Clearance</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Submit manual online payment proofs, request cash desk processing, and view verified receipts
          </p>
        </div>

        <Button
          variant="primary"
          icon={CreditCard}
          onClick={() => {
            setErrorMsg('');
            setShowSubmitModal(true);
          }}
        >
          Submit Payment / Pay Cash
        </Button>
      </div>

      {/* Dues Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-gym-surface border border-gym-border">
          <p className="text-xs uppercase font-semibold text-gym-muted">Total Package Fee</p>
          <h3 className="text-2xl font-extrabold text-gym-text mt-1">
            Rs. {(summary?.totalFees || 0).toLocaleString()}
          </h3>
          <p className="text-[11px] text-gym-muted mt-1">Sum of historical and current packages</p>
        </div>

        <div className="p-5 rounded-2xl bg-gym-surface border border-gym-border">
          <p className="text-xs uppercase font-semibold text-gym-muted">Verified Amount Paid</p>
          <h3 className="text-2xl font-extrabold text-gym-primary mt-1">
            Rs. {(summary?.verifiedPaid || 0).toLocaleString()}
          </h3>
          <p className="text-[11px] text-gym-muted mt-1">Cleared by gym administration</p>
        </div>

        <div className={`p-5 rounded-2xl border ${
          (summary?.pendingBalance || 0) > 0
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-gym-surface border-gym-border text-gym-text'
        }`}>
          <p className="text-xs uppercase font-semibold text-gym-muted">Outstanding Balance</p>
          <h3 className="text-2xl font-extrabold mt-1">
            Rs. {(summary?.pendingBalance || 0).toLocaleString()}
          </h3>
          <p className="text-[11px] text-gym-muted mt-1">
            {summary?.pendingBalance === 0 ? 'No outstanding fees' : 'Clear balance to avoid interruption'}
          </p>
        </div>
      </div>

      {/* Gym Configured Deposit Account Details */}
      {accountDetails && (
        <Card title="Official Gym Payment Accounts" subtitle="Transfer fees directly to any of our verified channels below">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-gym-bg rounded-xl border border-gym-border space-y-1.5">
              <div className="flex items-center gap-2 text-gym-primary font-bold">
                <Building className="w-4 h-4" />
                <span>Bank Transfer</span>
              </div>
              <p className="text-gym-text font-semibold">{accountDetails.bank.name}</p>
              <p className="text-gym-muted">Title: {accountDetails.bank.title}</p>
              <p className="font-mono text-gym-text font-bold">A/C: {accountDetails.bank.number}</p>
              <p className="font-mono text-[10px] text-gym-accent truncate">IBAN: {accountDetails.bank.iban}</p>
            </div>

            <div className="p-4 bg-gym-bg rounded-xl border border-gym-border space-y-1.5">
              <div className="flex items-center gap-2 text-gym-primary font-bold">
                <Smartphone className="w-4 h-4" />
                <span>JazzCash Mobile Account</span>
              </div>
              <p className="text-gym-muted">Merchant: {accountDetails.jazzcash.title}</p>
              <p className="font-mono text-gym-text font-extrabold text-sm">{accountDetails.jazzcash.number}</p>
              <p className="text-[11px] text-gym-muted">Instant transfer via JazzCash app or retailer</p>
            </div>

            <div className="p-4 bg-gym-bg rounded-xl border border-gym-border space-y-1.5">
              <div className="flex items-center gap-2 text-gym-primary font-bold">
                <Smartphone className="w-4 h-4" />
                <span>Easypaisa Mobile Account</span>
              </div>
              <p className="text-gym-muted">Merchant: {accountDetails.easypaisa.title}</p>
              <p className="font-mono text-gym-text font-extrabold text-sm">{accountDetails.easypaisa.number}</p>
              <p className="text-[11px] text-gym-muted">Instant transfer via Easypaisa app or agent</p>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Records Table */}
      <div>
        <h3 className="text-lg font-bold text-gym-text mb-4">Payment Transactions & Receipt History</h3>
        {payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No Payment Submissions"
            description="You have not submitted any online proofs or cash requests yet."
          />
        ) : (
          <Card noPadding className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Transaction / Ref</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gym-text">
                      {p.membership?.plan?.name || 'Gym Package'}
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
                      {p.rejectionReason && (
                        <span className="text-[10px] text-rose-400 block mt-0.5">
                          Reason: {p.rejectionReason}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-gym-accent">
                      {p.receiptNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-gym-muted">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.receiptNumber ? (
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setShowReceiptModal(true);
                          }}
                          className="text-xs text-gym-primary hover:underline font-semibold flex items-center gap-1 ml-auto"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-gym-muted italic text-[11px]">Awaiting verification</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Modal: Submit Payment */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Payment Clearance"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Target Membership Package *</label>
            <select
              required
              value={membershipId}
              onChange={(e) => {
                setMembershipId(e.target.value);
                const mem = memberships.find((m) => m._id === e.target.value);
                if (mem) setAmount(mem.totalAmount);
              }}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text font-semibold"
            >
              {memberships.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.plan?.name} Plan — Total: Rs. {m.totalAmount?.toLocaleString()} ({m.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Select Payment Channel *</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bank_transfer', label: 'Bank Transfer' },
                { id: 'jazzcash', label: 'JazzCash' },
                { id: 'easypaisa', label: 'Easypaisa' },
                { id: 'cash', label: 'Cash at Gym Desk' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors ${
                    paymentMethod === m.id
                      ? 'bg-gym-primary/15 border-gym-primary text-gym-primary'
                      : 'bg-gym-bg border-gym-border text-gym-muted hover:text-gym-text'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Amount Being Paid (Rs.) *</label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text font-bold"
            />
          </div>

          {paymentMethod !== 'cash' ? (
            <>
              <div>
                <label className="block uppercase text-gym-muted font-semibold mb-1">
                  Transaction Reference / TID *
                </label>
                <input
                  type="text"
                  required
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder="e.g. 1837492021"
                  className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text font-mono"
                />
              </div>

              <div>
                <label className="block uppercase text-gym-muted font-semibold mb-1">
                  Upload Payment Screenshot / Proof
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setProofFile(e.target.files[0])}
                  className="w-full px-3 py-1.5 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-muted file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gym-surfaceLight file:text-gym-text hover:file:bg-gym-surfaceHover"
                />
              </div>
            </>
          ) : (
            <div className="p-3 bg-gym-surfaceLight/50 rounded-xl border border-gym-border text-xs text-gym-muted">
              You selected <strong>Cash Payment at Gym</strong>. Please hand the cash to gym reception upon your visit. The receptionist will verify and confirm your payment on the spot.
            </div>
          )}

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            {paymentMethod === 'cash' ? 'Record Cash Intention' : 'Submit Payment for Verification'}
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
                <p className="text-[10px] text-gym-muted">Official Verified Digital Receipt</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-gym-muted">Payment Channel:</span>
                  <span className="uppercase text-gym-text font-semibold">
                    {selectedPayment.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gym-muted">Date & Time Cleared:</span>
                  <span className="text-gym-text">
                    {new Date(selectedPayment.verifiedAt || selectedPayment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gym-muted">Transaction Reference:</span>
                  <span className="font-mono text-gym-accent font-semibold">
                    {selectedPayment.transactionReference || 'CASH-REC'}
                  </span>
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
              <Button size="sm" variant="secondary" onClick={() => window.print()}>
                Print / Save Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

