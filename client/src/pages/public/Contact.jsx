import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Dumbbell } from 'lucide-react';
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
          text: res.data.message || 'Thank you! Your message has been received by our front desk.',
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
    <div className="bg-gym-bg text-gym-text">
      {/* 1. HERO HEADER */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-gym-border">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=1920&q=80"
            alt="FitTrack Front Desk Reception"
            className="w-full h-full object-cover filter brightness-[0.22]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-4">Front Desk & Member Support</Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gym-text">
            We’re Here to Help You Succeed
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gym-muted max-w-2xl mx-auto leading-relaxed">
            Have questions regarding membership tiers, manual bank verifications, or trainer assignments? Reach out directly to our team.
          </p>
        </div>
      </section>

      {/* 2. DUAL CONTACT LAYOUT */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Direct Form */}
          <Card className="p-8 sm:p-10 border-gym-border/80">
            <h3 className="text-2xl font-bold text-gym-text mb-2">Send Us a Direct Message</h3>
            <p className="text-xs text-gym-muted mb-8">
              Inquiries submitted here are routed directly to the FitTrack administration management portal.
            </p>

            {status && (
              <div
                className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
                  status.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <span className="text-xs sm:text-sm font-medium">{status.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gym-text mb-2 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Asad Umar"
                    className="w-full px-4 py-3 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted focus:outline-none focus:border-gym-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gym-text mb-2 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="asad@example.com"
                    className="w-full px-4 py-3 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted focus:outline-none focus:border-gym-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gym-text mb-2 uppercase tracking-wider">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-3 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted focus:outline-none focus:border-gym-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gym-text mb-2 uppercase tracking-wider">
                    Inquiry Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text focus:outline-none focus:border-gym-primary transition-colors"
                  >
                    <option value="">Select Topic...</option>
                    <option value="Membership Plans">Membership Plans & Pricing</option>
                    <option value="Personal Coaching">Personal Trainer Assignment</option>
                    <option value="Payment Verification">Payment Proof Verification</option>
                    <option value="Facility Tour">Facility Tour & Guest Pass</option>
                    <option value="Other">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gym-text mb-2 uppercase tracking-wider">
                  Detailed Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your fitness background, inquiry, or preferred schedule..."
                  className="w-full px-4 py-3 bg-gym-bg border border-gym-border rounded-xl text-sm text-gym-text placeholder-gym-muted focus:outline-none focus:border-gym-primary transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 text-sm font-bold"
                icon={Send}
                loading={submitting}
              >
                Send Message to Front Desk
              </Button>
            </form>
          </Card>

          {/* Location & Hours Card */}
          <div className="space-y-8">
            <Card className="p-8 border-gym-border/80">
              <h3 className="text-xl font-bold text-gym-text mb-6">Facility Coordinates</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gym-text">Gym Location</h4>
                    <p className="text-xs text-gym-muted mt-1 leading-relaxed">
                      FitTrack Pro Athletic Club <br />
                      Main Boulevard, Sector C, Phase 5 <br />
                      Lahore, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gym-text">Phone Support</h4>
                    <p className="text-xs text-gym-muted mt-1">+92 (042) 3578-9900</p>
                    <p className="text-xs text-gym-muted">Direct WhatsApp: +92 300 1234567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gym-text">Official Email</h4>
                    <p className="text-xs text-gym-muted mt-1">support@fittrack.com</p>
                    <p className="text-xs text-gym-muted">management@fittrack.com</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-gym-border/80">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-gym-primary" />
                <h3 className="text-lg font-bold text-gym-text">Hours of Operation</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-gym-border">
                  <span className="text-gym-muted">Monday – Friday</span>
                  <span className="text-gym-text font-bold">05:00 AM – 11:30 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gym-border">
                  <span className="text-gym-muted">Saturday</span>
                  <span className="text-gym-text font-bold">06:00 AM – 10:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gym-muted">Sunday (Recovery Sessions)</span>
                  <span className="text-gym-text font-bold">08:00 AM – 08:00 PM</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gym-bg border border-gym-border text-xs text-gym-muted">
                <strong className="text-gym-text block mb-1">24/7 Smart Turnstile Access:</strong>
                Active Standard and Premium members have round-the-clock automated QR access through our biometric security turnstiles.
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
