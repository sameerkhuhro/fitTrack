import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Shield, CreditCard, Banknote, Sparkles } from 'lucide-react';
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
      // Member is logged in, redirect directly to membership request page with preselected plan
      navigate(`/member/memberships?planId=${planId}`);
    } else {
      // Direct visitor to register/login
      navigate(`/register?planId=${planId}`);
    }
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">Membership Pricing</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gym-text">
          Invest in Your Health & Strength
        </h1>
        <p className="mt-4 text-gym-muted text-base sm:text-lg leading-relaxed">
          Simple, upfront pricing. All plans include full gym floor access, locker facilities, and digital progress tracking.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching active gym membership tiers..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const isStandard = plan.name.toLowerCase() === 'standard';
            return (
              <div
                key={plan._id}
                className={`rounded-2xl p-8 flex flex-col justify-between border transition-all duration-200 ${
                  isStandard
                    ? 'bg-gym-surfaceLight border-gym-primary shadow-2xl shadow-gym-primary/10 relative ring-1 ring-gym-primary'
                    : 'bg-gym-surface border-gym-border hover:border-gym-borderLight'
                }`}
              >
                {isStandard && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gym-primary text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold text-gym-text">{plan.name}</h3>
                  <p className="text-xs text-gym-muted mt-1 leading-relaxed">{plan.description}</p>

                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-gym-text">
                      Rs. {plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gym-muted ml-2">
                      / {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                    </span>
                  </div>

                  <div className="text-xs text-gym-accent font-medium mb-6 pb-4 border-b border-gym-border">
                    {plan.durationMonths === 1
                      ? 'Rs. 2,000 / month'
                      : plan.durationMonths === 3
                      ? `Equivalent to Rs. ${Math.round(plan.price / 3).toLocaleString()} / month`
                      : `Equivalent to Rs. ${Math.round(plan.price / 12).toLocaleString()} / month (Best Value)`}
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gym-text mb-4">
                    Plan Inclusions:
                  </p>
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xs sm:text-sm text-gym-muted">
                        <CheckCircle2 className="w-4 h-4 text-gym-primary mr-2.5 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={isStandard ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => handleSelectPlan(plan._id)}
                >
                  Choose {plan.name} Plan
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Methods Notice */}
      <div className="bg-gym-surface border border-gym-border rounded-xl p-8 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-gym-text mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gym-primary" />
          Flexible Payment Options Supported
        </h3>
        <p className="text-sm text-gym-muted mb-6 leading-relaxed">
          FitTrack Pro supports dual payment mechanisms. Whether you prefer to transfer online or pay cash at the gym reception desk, your subscription request is processed smoothly with digital invoices.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gym-bg border border-gym-border">
            <h4 className="text-sm font-semibold text-gym-primary mb-1">Method A: Manual Online Transfer</h4>
            <p className="text-xs text-gym-muted">
              Pay via Bank Transfer, JazzCash, or Easypaisa. Submit your transaction ID & screenshot in the portal for quick admin verification.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gym-bg border border-gym-border">
            <h4 className="text-sm font-semibold text-gym-primary mb-1">Method B: Cash Payment at Gym</h4>
            <p className="text-xs text-gym-muted">
              Indicate cash payment in your portal, hand the fee to gym reception, and receive your official digital verification on the spot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
