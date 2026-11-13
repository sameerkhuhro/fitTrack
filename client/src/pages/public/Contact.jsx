import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Dumbbell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

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
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: 'error',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await api.post('/public/contact', formData);
      if (res.data.success) {
        setStatus({
          type: 'success',
          text: res.data.message || 'Thank you! Your inquiry has been submitted to gym reception.',
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit inquiry. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#191D20] text-white overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO BANNER (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-24 overflow-hidden border-b border-[#333e40] bg-[#111613]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Pro Front Desk"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.78] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111613] via-[#111613]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191D20] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none">
              GET IN TOUCH
            </h1>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#AEB5B2] uppercase tracking-wider">
              <Link to="/" className="hover:text-neon transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-neon">Contact</span>
            </div>
            <p className="text-sm sm:text-base text-[#AEB5B2] pt-2 leading-relaxed">
              Have questions? We're here to help. Reach out to our concierge, schedule a physical tour, or submit an inquiry.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SPLIT CONTACT SECTION (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Coordinates Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
                DIRECT CONTACT
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white">
                WE'D LOVE TO HEAR FROM YOU
              </h2>
              <p className="text-xs sm:text-sm text-[#AEB5B2] leading-relaxed">
                Whether you have questions regarding membership tiers, corporate wellness, or personal training, our front desk is at your service.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Location Card */}
              <div className="p-5 rounded-2xl bg-[#22292A] border border-[#333e40] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Our Location</h4>
                  <p className="text-xs text-[#AEB5B2] mt-1">123 Fitness Avenue, Lahore, Pakistan</p>
                </div>
              </div>

              {/* Call Us Card */}
              <div className="p-5 rounded-2xl bg-[#22292A] border border-[#333e40] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Call Us</h4>
                  <p className="text-xs text-[#AEB5B2] mt-1">+92 300 1234567</p>
                  <p className="text-[11px] text-[#777F7B] mt-0.5">Toll-free front desk assistance</p>
                </div>
              </div>

              {/* Email Us Card */}
              <div className="p-5 rounded-2xl bg-[#22292A] border border-[#333e40] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Email Us</h4>
                  <p className="text-xs text-[#AEB5B2] mt-1">info@fittrackpro.com</p>
                  <p className="text-[11px] text-[#777F7B] mt-0.5">Average reply time under 2 hours</p>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="p-5 rounded-2xl bg-[#22292A] border border-[#333e40] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Working Hours</h4>
                  <p className="text-xs text-[#AEB5B2] mt-1">Monday – Saturday: 06:00 AM – 11:00 PM</p>
                  <p className="text-xs text-[#AEB5B2]">Sunday: 08:00 AM – 08:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (Matching Blueprint) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#22292A] border border-[#333e40] shadow-2xl">
              <h3 className="font-display text-2xl font-black uppercase text-white mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-[#AEB5B2] mb-6">
                Fill out the form below and an administrator will respond directly to your email.
              </p>

              {status && (
                <div
                  className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-xs ${
                    status.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{status.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#AEB5B2] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Usman Tariq"
                    className="w-full bg-[#191D20] border border-[#333e40] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#AEB5B2] mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. usman@example.com"
                      className="w-full bg-[#191D20] border border-[#333e40] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#AEB5B2] mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full bg-[#191D20] border border-[#333e40] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#AEB5B2] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Inquiring about Pro Membership or Personal Training"
                    className="w-full bg-[#191D20] border border-[#333e40] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#AEB5B2] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your questions or tell us about your fitness targets..."
                    className="w-full bg-[#191D20] border border-[#333e40] rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-neon hover:bg-neon-hover disabled:opacity-60 text-black font-display font-black text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-neon-glow flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
                  >
                    {submitting ? 'Submitting Message...' : 'Send Message'}
                    <ArrowRight className="w-4 h-4 stroke-[2.8]" />
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
