import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await api.post('/public/contact', formData);
      if (res.data.success) {
        setStatus({
          type: 'success',
          text: res.data.message || 'Thank you! Your message has been sent.',
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Failed to deliver message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">Get in Touch</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gym-text">
          We’re Here to Help You Succeed
        </h1>
        <p className="mt-4 text-gym-muted text-base sm:text-lg leading-relaxed">
          Have questions regarding membership plans, trainer assignments, or payment verification? Reach out to our front desk team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Form */}
        <Card className="p-8">
          <h3 className="text-xl font-bold text-gym-text mb-6">Send Us a Direct Message</h3>

          {status && (
            <div
              className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
                status.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              )}
              <span className="text-sm">{status.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tariq Malik"
                className="w-full px-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tariq@example.com"
                  className="w-full px-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Membership Inquiry / Tour Request"
                className="w-full px-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gym-muted mb-1.5">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we assist your fitness journey?"
                className="w-full px-4 py-2.5 bg-gym-bg border border-gym-border rounded-lg text-sm text-gym-text placeholder-gym-muted/50 focus:outline-none focus:border-gym-primary resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              loading={submitting}
              icon={Send}
            >
              Submit Inquiry
            </Button>
          </form>
        </Card>

        {/* Contact Info & Details */}
        <div className="space-y-6">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-gym-text mb-6">Club Contact Details</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gym-primary/10 text-gym-primary border border-gym-primary/20 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gym-text">Location</h4>
                  <p className="text-xs text-gym-muted mt-1 leading-relaxed">
                    Sector F-7/2, Jinnah Super Commercial Complex, Islamabad, 44000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gym-primary/10 text-gym-primary border border-gym-primary/20 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gym-text">Gym Reception</h4>
                  <p className="text-xs text-gym-muted mt-1">+92 51 1234567 / +92 300 1234567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gym-primary/10 text-gym-primary border border-gym-primary/20 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gym-text">Direct Inquiries</h4>
                  <p className="text-xs text-gym-muted mt-1">support@fittrack.com</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gym-surfaceLight/40 border-dashed">
            <h4 className="text-sm font-bold text-gym-text mb-2">Member Support Desk Hours</h4>
            <p className="text-xs text-gym-muted leading-relaxed">
              Front desk administrators are stationed on-site daily from 6:00 AM to 10:00 PM for in-person cash payments, fingerprint/RFID enrollments, and trainer consultations.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
