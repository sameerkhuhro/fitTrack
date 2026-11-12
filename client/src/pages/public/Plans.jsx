import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Shield,
  CreditCard,
  Banknote,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  HelpCircle,
  Clock,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isMember } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/plans')
      .then((res) => {
        if (res.data.success) {
          setPlans(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectPlan = (planId) => {
    if (isAuthenticated && isMember) {
      navigate(`/member/membership?planId=${planId}`);
    } else {
      navigate(`/register?planId=${planId}`);
    }
  };

  const comparisonFeatures = [
    { name: 'Gym Floor & Free Weights Access', basic: true, standard: true, premium: true },
    { name: 'Locker Rooms & Shower Facilities', basic: true, standard: true, premium: true },
    { name: 'Digital Biometric Progress Tracking', basic: true, standard: true, premium: true },
    { name: '24/7 Extended Turnstile Access', basic: false, standard: true, premium: true },
    { name: 'Free Initial Fitness Consultation', basic: false, standard: true, premium: true },
    { name: 'Sauna & Hydro-Recovery Access', basic: false, standard: true, premium: true },
    { name: 'Dedicated 1-on-1 Certified Personal Coach', basic: false, standard: false, premium: true },
    { name: 'Custom Periodized Workout Programming', basic: false, standard: false, premium: true },
    { name: 'Complimentary Monthly Guest Passes', basic: false, standard: false, premium: true },
  ];

  return (
    <div className="bg-gym-bg text-gym-text overflow-hidden">
      {/* 1. HERO BANNER */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-gym-border/80">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Membership Tiers"
            className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="font-display text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
            Investment in Longevity
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-[0.9]">
            Transparent <br />
            <span className="text-gym-primary">Membership Plans.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            No hidden maintenance charges or surprise registration fees. Select your commitment level with full access to our mobile terminal and training zones.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-transparent z-20" />
      </section>

      {/* 2. DYNAMIC PRICING CARDS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner text="Compiling membership tiers from Atlas..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((p, idx) => {
              const isFeatured = idx === 1;
              return (
                <div
                  key={p._id}
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                    isFeatured
                      ? 'bg-gradient-to-b from-gym-surface to-gym-bg border-2 border-gym-primary shadow-2xl shadow-gym-primary/10 scale-105 z-10'
                      : 'bg-gym-surface border border-gym-border hover:border-gym-primary/50'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gym-primary text-black text-[11px] font-black uppercase tracking-widest shadow-md">
                      Recommended Athlete Pass
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl font-black uppercase text-white">{p.name}</h3>
                      <span className="text-xs text-gray-400 font-semibold">{p.durationMonths} Month(s)</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{p.description}</p>

                    <div className="my-6 pt-5 border-t border-gym-border/60">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs uppercase text-gray-400 font-bold">PKR</span>
                        <span className="font-display text-5xl font-black text-white tracking-tight">
                          {p.price?.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium">Single payment / full period</span>
                    </div>

                    <div className="space-y-3 pt-2">
                      <span className="font-display text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                        Included Privileges:
                      </span>
                      {p.features?.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-gym-primary shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gym-border/60">
                    <button
                      onClick={() => handleSelectPlan(p._id)}
                      className={`w-full py-4 px-6 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                        isFeatured
                          ? 'bg-gym-primary hover:bg-emerald-400 text-black shadow-emerald-500/20'
                          : 'bg-white hover:bg-neutral-200 text-black'
                      }`}
                    >
                      Select {p.name} Plan
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. DUAL PAYMENT ARCHITECTURE EXPLAINER */}
      <section className="py-20 bg-gym-surface/40 border-y border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
              Financial Integrity
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
              Dual Payment Methods
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Pay using your preferred banking method with instant digital receipts generated directly into your portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-3xl bg-gym-surface border border-gym-border">
              <div className="w-12 h-12 rounded-2xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-black uppercase text-white">Method A: Online Bank & Wallet Transfer</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Direct remittance via Meezan Bank, Standard Chartered, JazzCash, or EasyPaisa. Upload your transaction screenshot or reference number for rapid administrative clearance.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gym-surface border border-gym-border">
              <div className="w-12 h-12 rounded-2xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary mb-5">
                <Banknote className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-black uppercase text-white">Method B: Cash Handover at Front Desk</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Physical cash payment directly to the front desk reception. The receptionist inputs the amount, instantly issuing an official voucher code (REC-YYYYMMDD-XXXX).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPREHENSIVE FEATURE COMPARISON MATRIX */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
            Side-by-Side Breakdown
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Plan Comparison Matrix
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-gym-border bg-gym-surface">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gym-border bg-gym-bg/80">
                <th className="p-5 font-display text-sm font-black uppercase text-white">Feature Specification</th>
                <th className="p-5 font-display text-sm font-black uppercase text-white text-center">Basic</th>
                <th className="p-5 font-display text-sm font-black uppercase text-gym-primary text-center">Standard</th>
                <th className="p-5 font-display text-sm font-black uppercase text-white text-center">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border/60">
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx} className="hover:bg-gym-bg/40 transition-colors">
                  <td className="p-5 font-medium text-gray-300">{row.name}</td>
                  <td className="p-5 text-center">
                    {row.basic ? (
                      <Check className="w-4 h-4 text-gym-primary mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="p-5 text-center bg-gym-primary/5">
                    {row.standard ? (
                      <Check className="w-4 h-4 text-gym-primary mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="p-5 text-center">
                    {row.premium ? (
                      <Check className="w-4 h-4 text-gym-primary mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
