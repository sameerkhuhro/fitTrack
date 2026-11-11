import React, { useEffect, useState } from 'react';
import { MessageSquare, Mail, Phone, CheckCircle2, Clock } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminContact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/contact/${id}`, { status });
      fetchMessages();
    } catch (e) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Visitor Inquiries & Lead Management</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Inquiries submitted via the public FitTrack Pro website contact portal
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading contact messages..." />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Inquiries Received"
          description="Inquiries submitted via the public contact form will appear here."
        />
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m._id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gym-border">
                <div>
                  <h3 className="text-base font-bold text-gym-text">{m.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-gym-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gym-primary" /> {m.email}
                    </span>
                    {m.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gym-primary" /> {m.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      m.status === 'replied' ? 'success' : m.status === 'read' ? 'info' : 'warning'
                    }
                  >
                    {m.status}
                  </Badge>
                  <span className="text-[11px] text-gym-muted">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs font-semibold text-gym-accent uppercase mb-1">
                  Subject: {m.subject}
                </p>
                <p className="text-xs text-gym-text leading-relaxed bg-gym-bg p-3.5 rounded-xl border border-gym-border">
                  {m.message}
                </p>
              </div>

              <div className="mt-4 pt-3 flex justify-end gap-2">
                {m.status !== 'replied' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(m._id, 'replied')}
                  >
                    Mark as Replied
                  </Button>
                )}
                {m.status === 'new' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateStatus(m._id, 'read')}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
