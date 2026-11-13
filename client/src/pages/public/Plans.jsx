import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Shield,
  CreditCard,
  Banknote,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  HelpCircle,
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isMember } = useAuth();
  const navigate = useNavigate();

  // Blueprint Default Fallback Plans
  const defaultPlans = [
    {
      _id: 'basic-plan',
      name: 'Basic',
      price: 29,
      durationMonths: 1,
      description: 'Get started with essential gym access.',
      features: ['Full gym access', 'Basic equipment', 'Locker facility', 'Mobile member portal'],
    },
    {
      _id: 'pro-plan',
      name: 'Pro',
      price: 49,
      durationMonths: 1,
      popular: true,
      description: 'Our most popular plan for serious results.',
      features: ['Full gym access', 'All training zones', 'Group classes included', '1x Trainer consultation', 'Biometric progress tracking'],
    },
    {
      _id: 'elite-plan',
      name: 'Elite',
      price: 79,
      durationMonths: 1,
      description: 'Maximum support for your fitness journey.',
      features: ['Everything in Pro', 'Personal training (2x/month)', 'Custom workout plan', 'Trainer progress tracking', 'Full hydro-recovery & sauna'],
    },
  ];

  useEffect(() => {
    api.get('/plans')
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setPlans(res.data.data);
        } else {
          setPlans(defaultPlans);
        }
      })
      .catch(() => setPlans(defaultPlans))
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
    { name: 'Gym Floor & Free Weights Access', basic: true, pro: true, elite: true },
    { name: 'Keyless Locker Rooms & Showers', basic: true, pro: true, elite: true },
    { name: 'Digital Progress & Biometrics Tracking', basic: true, pro: true, elite: true },
    { name: 'Extended Turnstile Access Hours', basic: false, pro: true, elite: true },
    { name: 'Group Conditioning & HIIT Classes', basic: false, pro: true, elite: true },
    { name: 'Cedar Sauna & Recovery Lab Access', basic: false, pro: true, elite: true },
    { name: 'Assigned 1-on-1 Certified Personal Coach', basic: false, false: false, pro: false, elite: true },
    { name: 'Custom Periodized Workout Programming', basic: false, pro: false, elite: true },
    { name: 'Bi-Weekly InBody Body Composition Audits', basic: false, pro: false, elite: true },
  ];

  const faqs = [
    {
      q: 'How does membership activation work after I register?',
      a: 'After selecting a plan and registering, you can submit an online bank/wallet payment proof or pay cash directly at our front desk. Once our reception confirms the payment, your turnstile QR and member dashboard are instantly activated.',
    },
    {
      q: 'Can I pay cash at the gym reception?',
      a: 'Yes! FitTrack Pro supports verified cash receipts. Simply request your plan, visit reception to make payment, and the receptionist will issue a verifiable printed receipt and activate your account on the spot.',
    },
    {
      q: 'Are there any hidden sign-up or locker fees?',
      a: 'None. Every tier includes keyless locker room access, rain showers, towel service, and full mobile web dashboard features.',
    },
    {
      q: 'Can I upgrade or switch my membership plan later?',
      a: 'Yes. At any time from your Member Portal, you can request a tier upgrade. Outstanding dues and credit are automatically calculated.',
    },
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <div className="bg-[#191D20] text-white overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO BANNER (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-24 overflow-hidden border-b border-[#333e40] bg-[#111613]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Pro Memberships"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.78] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111613] via-[#111613]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191D20] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none">
              MEMBERSHIP PLANS
            </h1>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#AEB5B2] uppercase tracking-wider">
              <Link to="/" className="hover:text-neon transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-neon">Memberships</span>
            </div>
            <p className="text-sm sm:text-base text-[#AEB5B2] pt-2 leading-relaxed">
              Choose the perfect plan for your fitness journey. Transparent dues, automated turnstiles, and no hidden enrollment charges.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PRICING CARDS (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
            CHOOSE YOUR MEMBERSHIP
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            FLEXIBLE PRICING FOR EVERY GOAL
          </h2>
          <p className="text-xs sm:text-sm text-[#AEB5B2] mt-3">
            Select a tier to begin. When you select a plan, it is automatically pre-filled in your enrollment application.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {displayPlans.map((plan, idx) => {
              const isPopular = plan.popular || idx === 1;
              return (
                <div
                  key={plan._id || idx}
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#22292A] to-[#191D20] border-2 border-neon shadow-neon-strong scale-105 z-10'
                      : 'bg-[#22292A] border border-[#333e40] hover:border-neon/50'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-neon text-black text-[11px] font-black uppercase tracking-widest shadow-md">
                      Popular Choice
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl font-black uppercase text-white">{plan.name}</h3>
                      <span className="text-xs text-[#AEB5B2] font-semibold">{plan.durationMonths || 1} Month(s)</span>
                    </div>
                    <p className="text-xs text-[#AEB5B2] mt-1.5 leading-relaxed">{plan.description}</p>

                    <div className="my-6 pt-5 border-t border-[#333e40]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm uppercase text-neon font-bold">$</span>
                        <span className="font-display text-5xl font-black text-white tracking-tight">
                          {plan.price}
                        </span>
                        <span className="text-xs text-[#AEB5B2] font-medium">/ month</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                        Turnstile QR & digital locker access included
                      </span>
                    </div>

                    <ul className="space-y-3 text-xs text-[#AEB5B2]">
                      {plan.features?.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-neon shrink-0" />
                          <span className="text-gray-200">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#333e40]">
                    <button
                      onClick={() => handleSelectPlan(plan._id)}
                      className={`w-full font-display uppercase tracking-wider text-xs font-black py-4 rounded-full flex items-center justify-center gap-2 transition-all ${
                        isPopular
                          ? 'bg-neon hover:bg-neon-hover text-black shadow-neon-glow hover:scale-102'
                          : 'bg-[#191D20] hover:bg-neon hover:text-black border border-[#333e40] hover:border-neon text-white'
                      }`}
                    >
                      Choose {plan.name}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. DETAILED FEATURE COMPARISON TABLE */}
      {/* ======================================================== */}
      <section className="py-20 bg-[#111613] border-y border-[#333e40]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
              FEATURE MATRIX
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
              COMPARE MEMBERSHIP TIERS
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333e40]">
                  <th className="py-4 px-4 text-sm font-display font-black uppercase text-white">Feature</th>
                  <th className="py-4 px-4 text-center text-sm font-display font-black uppercase text-gray-300">Basic</th>
                  <th className="py-4 px-4 text-center text-sm font-display font-black uppercase text-neon">Pro</th>
                  <th className="py-4 px-4 text-center text-sm font-display font-black uppercase text-white">Elite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333e40]/60 text-xs">
                {comparisonFeatures.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#22292A]/40 transition-colors">
                    <td className="py-3.5 px-4 text-gray-200 font-medium">{row.name}</td>
                    <td className="py-3.5 px-4 text-center">
                      {row.basic ? <Check className="w-4 h-4 text-neon mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.pro ? <Check className="w-4 h-4 text-neon mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.elite ? <Check className="w-4 h-4 text-neon mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. DUAL PAYMENT WORKFLOW NOTICE */}
      {/* ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#22292A] border border-[#333e40] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neon mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>DUAL PAYMENT ARCHITECTURE</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-white leading-tight">
              Flexible Online & In-Gym Payment Methods
            </h3>
            <p className="text-xs sm:text-sm text-[#AEB5B2] mt-3 leading-relaxed">
              We eliminate financial ambiguity. Submit your online bank transfer or wallet receipt directly inside your member portal, or pay in physical cash at our front reception. Both methods issue an instant verifiable digital receipt.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#191D20] border border-[#333e40]">
              <CreditCard className="w-6 h-6 text-neon mb-2" />
              <h4 className="font-display text-sm font-black uppercase text-white">Online Transfer</h4>
              <p className="text-[11px] text-[#AEB5B2] mt-1">Bank transfer, Raast & JazzCash proof uploads.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#191D20] border border-[#333e40]">
              <Banknote className="w-6 h-6 text-neon mb-2" />
              <h4 className="font-display text-sm font-black uppercase text-white">Front Desk Cash</h4>
              <p className="text-[11px] text-[#AEB5B2] mt-1">Instant reception count and printed digital dues receipt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      {/* ======================================================== */}
      <section className="py-20 bg-[#111613] border-t border-[#333e40]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
              GOT QUESTIONS?
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
              MEMBERSHIP FAQS
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, fIdx) => (
              <div key={fIdx} className="p-6 rounded-2xl bg-[#22292A] border border-[#333e40]">
                <h4 className="font-display text-base font-black uppercase text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-neon shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-[#AEB5B2] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
