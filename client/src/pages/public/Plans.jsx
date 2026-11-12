import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Shield,
  CreditCard,
  Banknote,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
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
    <div className="bg-gym-bg text-gym-text">
      {/* 1. HERO HEADER */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-gym-border">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1920&q=80"
            alt="FitTrack Membership Tiers"
            className="w-full h-full object-cover filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-4">Transparent Investment</Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gym-text">
            Invest in Your Health & Strength
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gym-muted max-w-2xl mx-auto leading-relaxed">
            Straightforward pricing without hidden fees or surprise renewal clauses. Choose the duration that matches your fitness goals.
          </p>
        </div>
      </section>

      {/* 2. DYNAMIC PRICING CARDS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner text="Fetching active gym membership tiers from Atlas..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isStandard = plan.name.toLowerCase() === 'standard';
              const isPremium = plan.name.toLowerCase() === 'premium';

              return (
                <div
                  key={plan._id}
                  className={`rounded-2xl p-8 flex flex-col justify-between border transition-all duration-300 relative ${
                    isStandard
                      ? 'bg-gradient-to-b from-gym-surfaceLight to-gym-surface border-gym-primary shadow-2xl shadow-gym-primary/10'
                      : 'bg-gym-surface border-gym-border hover:border-gym-primary/50'
                  }`}
                >
                  {isStandard && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gym-primary text-black font-extrabold text-xs uppercase px-4 py-1 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gym-text">{plan.name}</h3>
                      <span className="text-xs font-semibold text-gym-muted uppercase px-2.5 py-1 rounded bg-gym-bg border border-gym-border">
                        {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                      </span>
                    </div>

                    <p className="text-xs text-gym-muted min-h-[38px] mb-6">{plan.description}</p>

                    <div className="mb-6 pb-6 border-b border-gym-border">
                      <span className="text-4xl sm:text-5xl font-black text-gym-text">
                        Rs. {plan.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gym-muted ml-2">/ billing period</span>
                    </div>

                    <div className="space-y-3.5 mb-8">
                      {plan.features?.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-gym-primary shrink-0" />
                          <span className="text-xs text-gym-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant={isStandard ? 'primary' : 'secondary'}
                    className="w-full font-bold py-3.5"
                    icon={ArrowRight}
                    onClick={() => handleSelectPlan(plan._id)}
                  >
                    Select {plan.name} Plan
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. DUAL PAYMENT METHODS BREAKDOWN */}
      <section className="py-20 bg-gym-surface border-y border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-3">Payment Flexibility</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-gym-text">
              Two Transparent Ways to Pay
            </h2>
            <p className="mt-4 text-gym-muted text-sm sm:text-base">
              FitTrack Pro supports dual audited payment workflows to accommodate all athletes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl bg-gym-bg border border-gym-border flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary mb-6">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gym-text">Method A: Manual Online Transfer</h3>
                <p className="mt-3 text-xs sm:text-sm text-gym-muted leading-relaxed">
                  Transfer directly to the gym's official Meezan Bank account, JazzCash, or Easypaisa wallet. Upload your screenshot proof and enter the transaction reference in your athlete portal for swift admin verification.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gym-border text-xs text-gym-primary font-semibold">
                ✔ Instant Digital Receipt (REC-XXXX) Issued Upon Verification
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-gym-bg border border-gym-border flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                  <Banknote className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gym-text">Method B: Cash Payment at Reception</h3>
                <p className="mt-3 text-xs sm:text-sm text-gym-muted leading-relaxed">
                  Mark your intention to pay in cash online, then visit our front desk coordinator. Our staff records the physical cash received, updates your dues balance, and prints your official verified digital invoice.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gym-border text-xs text-emerald-400 font-semibold">
                ✔ Physical Cash Counted & Audited on the Spot
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE COMPARISON MATRIX */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-3">Feature Matrix</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-gym-text">
            Compare Plan Features
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gym-border rounded-xl bg-gym-surface">
            <thead>
              <tr className="border-b border-gym-border bg-gym-surfaceLight">
                <th className="p-4 sm:p-5 text-sm font-bold text-gym-text">Plan Feature</th>
                <th className="p-4 sm:p-5 text-sm font-bold text-gym-muted text-center">Basic (1 Mo)</th>
                <th className="p-4 sm:p-5 text-sm font-bold text-gym-primary text-center">Standard (3 Mo)</th>
                <th className="p-4 sm:p-5 text-sm font-bold text-emerald-400 text-center">Premium (12 Mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border text-xs sm:text-sm">
              {comparisonFeatures.map((f, i) => (
                <tr key={i} className="hover:bg-gym-surfaceLight/50 transition-colors">
                  <td className="p-4 sm:p-5 text-gym-text font-medium">{f.name}</td>
                  <td className="p-4 sm:p-5 text-center">
                    {f.basic ? <Check className="w-4 h-4 text-gym-primary mx-auto" /> : <X className="w-4 h-4 text-gym-muted/40 mx-auto" />}
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    {f.standard ? <Check className="w-4 h-4 text-gym-primary mx-auto" /> : <X className="w-4 h-4 text-gym-muted/40 mx-auto" />}
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    {f.premium ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-gym-muted/40 mx-auto" />}
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
