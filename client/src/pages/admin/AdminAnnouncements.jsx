import React, { useState } from 'react';
import { Megaphone, Send, Users, AlertCircle, CheckCircle2, DollarSign, Clock } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function AdminAnnouncements() {
  const [audience, setAudience] = useState('all_members');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/notifications/send', {
        audience,
        title,
        message,
      });

      if (res.data.success) {
        setStatus({
          type: 'success',
          text: `Announcement delivered to ${res.data.recipientCount} recipients.`,
        });
        setTitle('');
        setMessage('');
      }
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Failed to dispatch broadcast announcement.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Club Broadcasts & Announcements</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Dispatch in-app push alerts and club bulletins to targeted athlete and coach cohorts
        </p>
      </div>

      <Card className="p-8">
        {status && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
              status.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <span className="text-sm">{status.text}</span>
          </div>
        )}

        <form onSubmit={handleBroadcast} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-gym-muted mb-2">
              Select Target Audience
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'all_members', title: 'All Registered Members', desc: 'Broadcast to entire athlete membership roster' },
                { id: 'all_trainers', title: 'All Certified Coaches', desc: 'Internal notice to fitness training staff' },
                { id: 'pending_dues', title: 'Members With Outstanding Dues', desc: 'Alert athletes with pending fee balances' },
                { id: 'near_expiry', title: 'Members Expiring Soon', desc: 'Subscriptions ending within the next 7 days' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setAudience(opt.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    audience === opt.id
                      ? 'bg-gym-primary/10 border-gym-primary text-gym-text'
                      : 'bg-gym-bg border-gym-border text-gym-muted hover:border-gym-borderLight'
                  }`}
                >
                  <p className={`text-xs font-bold ${audience === opt.id ? 'text-gym-primary' : 'text-gym-text'}`}>
                    {opt.title}
                  </p>
                  <p className="text-[11px] mt-1">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
              Announcement Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Eid Holiday Schedule / New Powerlifting Cages Installed"
              className="w-full px-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
              Announcement Message Body *
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Dear members, please note that tomorrow..."
              className="w-full px-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={Send}
            className="w-full"
          >
            Dispatch In-App Broadcast
          </Button>
        </form>
      </Card>
    </div>
  );
}
