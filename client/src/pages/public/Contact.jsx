import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Dumbbell, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

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
    <div className="bg-[#111413] text-white overflow-hidden">
      {/* 1. HERO HEADER */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-[#243426]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Front Desk Reception"
            className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111413] via-[#111413]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172017] border border-neon/30 text-neon text-xs font-bold uppercase tracking-widest">
            <span className="font-black text-neon">++</span>
            <span>Front Desk & Concierge</span>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-[0.9]">
            Connect with <br />
            <span className="text-neon text-neon-glow">FitTrack Pro.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding membership tiers, corporate packages, or private coaching? Contact our front desk reception directly.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-neon via-emerald-400 to-transparent z-20" />
      </section>

      {/* 2. CONTACT CARDS & INTERACTIVE FORM */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#172017] border border-[#243426] flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0 shadow-neon-glow">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display text-lg font-black uppercase text-white">Facility Coordinates</h4>
                <p className="text-xs text-gray-400 mt-1">Plot 44-C, Commercial Sector 5, Phase 6, DHA</p>
                <p className="text-xs text-gray-400">Karachi, Pakistan</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#172017] border border-[#243426] flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0 shadow-neon-glow">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display text-lg font-black uppercase text-white">Direct Line</h4>
                <p className="text-xs text-gray-400 mt-1">Front Desk: +92 (21) 3584-9021</p>
                <p className="text-xs text-gray-400">WhatsApp Help: +92 (300) 829-1144</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#172017] border border-[#243426] flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0 shadow-neon-glow">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display text-lg font-black uppercase text-white">Operating Hours</h4>
                <p className="text-xs text-gray-400 mt-1">Mon – Sat: 06:00 AM – 11:30 PM</p>
                <p className="text-xs text-gray-400">Sun: 08:00 AM – 08:00 PM</p>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Inquiry Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#172017] border border-[#243426]">
            <h3 className="font-display text-2xl font-black uppercase text-white mb-2">
              Send Direct Message
            </h3>
            <p className="text-xs text-gray-400 mb-8">
              Fill out the form below. Our reception desk responds within 2 business hours.
            </p>

            {status && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs ${
                  status.type === 'success'
                    ? 'bg-neon/10 border border-neon/30 text-neon'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{status.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-display text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Bilal Hussain"
                    className="w-full px-4 py-3 bg-[#111413] border border-[#243426] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all"
                  />
                </div>

                <div>
                  <label className="block font-display text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="bilal@example.com"
                    className="w-full px-4 py-3 bg-[#111413] border border-[#243426] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-display text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 (300) 1234567"
                    className="w-full px-4 py-3 bg-[#111413] border border-[#243426] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all"
                  />
                </div>

                <div>
                  <label className="block font-display text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Inquiry Topic
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. VIP Plan or Corporate Pass"
                    className="w-full px-4 py-3 bg-[#111413] border border-[#243426] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-display text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Message Details *
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your fitness goals or questions..."
                  className="w-full px-4 py-3 bg-[#111413] border border-[#243426] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-neon hover:bg-neon-hover text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-neon-glow rounded-full transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Transmitting to Front Desk...' : 'Transmit Message to Reception'}
                <ArrowUpRight className="w-4 h-4 stroke-[2.8]" />
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
