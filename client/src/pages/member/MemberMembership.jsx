import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Plus } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MemberMembership() {
  const [searchParams] = useSearchParams();
  const preselectedPlanId = searchParams.get('planId');

  const [membershipData, setMembershipData] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Request Subscription Modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(preselectedPlanId || '');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const fetchMembership = async () => {
    try {
      const [memRes, planRes] = await Promise.all([
        api.get('/memberships/my'),
        api.get('/plans'),
      ]);

      if (memRes.data.success) setMembershipData(memRes.data.data);
      if (planRes.data.success) {
        setAvailablePlans(planRes.data.data);
        if (!selectedPlanId && planRes.data.data.length > 0) {
          setSelectedPlanId(planRes.data.data[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembership();
    if (preselectedPlanId) {
      setShowRequestModal(true);
    }
  }, [preselectedPlanId]);

  const handleRequestMembership = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/memberships/request', {
        planId: selectedPlanId,
        notes,
      });

      if (res.data.success) {
        setShowRequestModal(false);
        fetchMembership();
        navigate('/member/payments');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Membership request failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenewal = async (membershipId) => {
    if (!window.confirm('Request a renewal for this subscription? A new pending renewal record will be generated in your membership history.')) {
      return;
    }

    try {
      const res = await api.post(`/memberships/${membershipId}/renew`);
      if (res.data.success) {
        alert('Renewal requested! Please submit payment to activate.');
        fetchMembership();
        navigate('/member/payments');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Renewal request failed.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching your membership records..." />;
  }

  const active = membershipData?.activeMembership;
  const pending = membershipData?.pendingMembership;
  const history = membershipData?.history || [];
  const daysRemaining = membershipData?.daysRemaining || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">My Membership & Subscriptions</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Manage your active gym pass, view expiration dates, and request package renewals
          </p>
        </div>

        {!active && !pending && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowRequestModal(true)}
          >
            Select Membership Plan
          </Button>
        )}
      </div>

      {/* Active Membership Hero Card */}
      {active ? (
        <Card className="p-8 border-gym-primary/40 bg-gradient-to-r from-gym-surface via-gym-surfaceLight to-gym-surface">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="success" size="md">
                  Active Subscription
                </Badge>
                <span className="text-xs text-gym-muted">ID: {active._id}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gym-text">
                {active.plan?.name} Membership Tier
              </h2>
              <p className="text-sm text-gym-muted mt-1 max-w-xl">
                {active.plan?.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs">
                <div>
                  <span className="text-gym-muted block uppercase text-[10px]">Start Date:</span>
                  <span className="font-semibold text-gym-text">
                    {new Date(active.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gym-muted block uppercase text-[10px]">Expiry Date:</span>
                  <span className="font-semibold text-gym-text">
                    {new Date(active.expiryDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gym-muted block uppercase text-[10px]">Package Total:</span>
                  <span className="font-bold text-gym-primary">
                    Rs. {active.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gym-muted block uppercase text-[10px]">Payment Clearance:</span>
                  <Badge variant={active.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {active.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Countdown Badge & Renew */}
            <div className="text-center md:text-right shrink-0">
              <div className="inline-block p-4 rounded-2xl bg-gym-bg border border-gym-border mb-4">
                <p className="text-4xl font-extrabold text-gym-primary">{daysRemaining}</p>
                <p className="text-[11px] uppercase tracking-wider text-gym-muted font-semibold mt-1">
                  Days Remaining
                </p>
              </div>
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  icon={RefreshCw}
                  onClick={() => handleRenewal(active._id)}
                >
                  Request Renewal
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : pending ? (
        <Card className="p-8 border-amber-500/40 bg-amber-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <Badge variant="warning" size="md" className="mb-2">
                Request Pending Admin Activation
              </Badge>
              <h2 className="text-2xl font-bold text-gym-text">
                {pending.plan?.name} Plan — Rs. {pending.totalAmount?.toLocaleString()}
              </h2>
              <p className="text-xs text-gym-muted mt-2 max-w-lg">
                Your request has been received by gym management. Once payment is verified (via bank receipt or cash at gym reception), an admin will activate your subscription.
              </p>
            </div>
            <Link to="/member/payments">
              <Button variant="primary" icon={ArrowRight}>
                Submit Payment Proof
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center bg-gym-surface">
          <ShieldCheck className="w-12 h-12 text-gym-primary mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gym-text">No Active Membership</h3>
          <p className="text-xs text-gym-muted max-w-md mx-auto mt-2">
            You do not currently hold an active gym subscription. Choose from our Basic, Standard, or Premium plans below to start training.
          </p>
          <div className="mt-6">
            <Button variant="primary" onClick={() => setShowRequestModal(true)}>
              Browse Available Plans
            </Button>
          </div>
        </Card>
      )}

      {/* Available Plans Grid */}
      <div>
        <h3 className="text-lg font-bold text-gym-text mb-4">Available Gym Subscription Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan) => (
            <Card
              key={plan._id}
              className="flex flex-col justify-between"
              title={plan.name}
              subtitle={`${plan.durationMonths} ${plan.durationMonths === 1 ? 'Month' : 'Months'} Access`}
            >
              <div className="my-4">
                <span className="text-3xl font-extrabold text-gym-text">
                  Rs. {plan.price.toLocaleString()}
                </span>
                <p className="text-xs text-gym-muted mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-gym-muted">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gym-primary mr-2 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setSelectedPlanId(plan._id);
                  setShowRequestModal(true);
                }}
              >
                Request {plan.name}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Historical Memberships Table */}
      <div>
        <h3 className="text-lg font-bold text-gym-text mb-4">Subscription History & Archive</h3>
        {history.length === 0 ? (
          <p className="text-xs text-gym-muted">No historical subscriptions on record.</p>
        ) : (
          <Card noPadding className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gym-border bg-gym-surfaceLight/50 text-gym-muted uppercase font-semibold">
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Fee Amount</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Payment Clearance</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border">
                {history.map((h) => (
                  <tr key={h._id} className="hover:bg-gym-surfaceLight/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gym-text">{h.plan?.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-gym-text">
                      Rs. {h.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-gym-muted">
                      {h.startDate ? new Date(h.startDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-gym-muted">
                      {h.expiryDate ? new Date(h.expiryDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          h.paymentStatus === 'paid'
                            ? 'success'
                            : h.paymentStatus === 'partial'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {h.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          h.status === 'active'
                            ? 'success'
                            : h.status === 'pending'
                            ? 'warning'
                            : 'default'
                        }
                        size="sm"
                      >
                        {h.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Modal: Request Membership */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Select Gym Membership Package"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleRequestMembership} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Choose Plan Tier *</label>
            <select
              required
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text font-semibold"
            >
              {availablePlans.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.durationMonths} Months) — Rs. {p.price?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block uppercase text-gym-muted font-semibold mb-1">Notes / Preferences (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Morning training preference"
              className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
            />
          </div>

          <p className="text-[11px] text-gym-muted leading-relaxed">
            * Note: Submitting a request creates a pending membership record. You will next be prompted to select your payment method (Online Transfer or Cash at Gym).
          </p>

          <Button type="submit" variant="primary" loading={actionLoading} className="w-full">
            Submit Membership Request
          </Button>
        </form>
      </Modal>
    </div>
  );
}

