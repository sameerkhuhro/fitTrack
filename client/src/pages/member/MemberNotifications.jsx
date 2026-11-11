import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MemberNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAll = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gym-border">
        <div>
          <h1 className="text-2xl font-bold text-gym-text">Alerts & Gym Announcements</h1>
          <p className="text-xs text-gym-muted mt-0.5">
            Membership expiry reminders, verified payment vouchers, and workout updates
          </p>
        </div>

        {notifications.length > 0 && (
          <Button size="sm" variant="secondary" icon={CheckCheck} onClick={handleMarkAll}>
            Mark All Read
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Alerts Found"
          description="You are completely caught up with all gym notifications."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n._id}
              className={`p-4 transition-colors ${
                !n.isRead ? 'border-gym-primary/40 bg-gym-surface' : 'bg-gym-surface/60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      !n.isRead
                        ? 'bg-gym-primary/10 text-gym-primary'
                        : 'bg-gym-surfaceLight text-gym-muted'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gym-text">{n.title}</h4>
                    <p className="text-xs text-gym-muted mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-gym-muted mt-2 block">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.isRead && (
                  <Badge variant="primary" size="sm">
                    New
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
