import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  ShieldCheck,
  Award,
  Users,
  Flame,
  CheckCircle2,
  Calendar,
  CreditCard,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    // Fetch plans for preview
    api.get('/plans')
      .then((res) => {
        if (res.data.success) setPlans(res.data.data.slice(0, 3));
      })
      .catch(() => {});

    // Fetch trainers for preview
    api.get('/trainers')
      .then((res) => {
        if (res.data.success) setTrainers(res.data.data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-gym-bg via-gym-surface to-gym-bg border-b border-gym-border">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gym-primary/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gym-primary/10 border border-gym-primary/25 text-gym-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Smart Gym Management & Subscription Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gym-text max-w-4xl mx-auto leading-tight sm:leading-none">
            Manage Your Gym. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-primary via-emerald-300 to-teal-400">
              Empower Your Fitness.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gym-muted max-w-2xl mx-auto leading-relaxed">
            FitTrack Pro brings world-class workout tracking, certified coaching, seamless online and cash membership subscriptions, and automated health analytics under one roof.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight}>
                Start Your Membership
              </Button>
            </Link>
            <Link to="/plans">
              <Button size="lg" variant="secondary">
                Explore Membership Plans
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-gym-border/80">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-gym-primary">500+</p>
              <p className="text-xs uppercase tracking-wider text-gym-muted mt-1 font-medium">Active Athletes</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-gym-text">100%</p>
              <p className="text-xs uppercase tracking-wider text-gym-muted mt-1 font-medium">Verified Payments</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-gym-primary">15+</p>
              <p className="text-xs uppercase tracking-wider text-gym-muted mt-1 font-medium">Certified Coaches</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-gym-text">24/7</p>
              <p className="text-xs uppercase tracking-wider text-gym-muted mt-1 font-medium">VIP Club Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE GYM & BENEFITS */}
      <section className="py-20 bg-gym-bg border-b border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-3">Why FitTrack Pro</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gym-text">
              Engineered for Serious Lifters, Athletes & Daily Fitness
            </h2>
            <p className="text-gym-muted mt-4 text-base">
              A comprehensive club experience with cutting-edge equipment, high-energy coaching, and an intelligent digital portal to monitor your physical transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverEffect className="relative">
              <div className="p-3 w-12 h-12 rounded-xl bg-gym-primary/10 text-gym-primary border border-gym-primary/20 flex items-center justify-center mb-5">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gym-text mb-2">Olympic & Free Weight Zones</h3>
              <p className="text-sm text-gym-muted leading-relaxed">
                Calibrated bumper plates, competition power racks, Eleiko barbells, and dumbbell racks ranging from 2.5 kg up to 60 kg.
              </p>
            </Card>

            <Card hoverEffect className="relative">
              <div className="p-3 w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gym-text mb-2">Certified Personal Coaches</h3>
              <p className="text-sm text-gym-muted leading-relaxed">
                Work directly with accredited trainers who build structured workout splits, evaluate biometrics, and guide recovery.
              </p>
            </Card>

            <Card hoverEffect className="relative">
              <div className="p-3 w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gym-text mb-2">Digital Progress & Dues Tracking</h3>
              <p className="text-sm text-gym-muted leading-relaxed">
                Every member gets an interactive portal to log body weight, chest, waist, view attendance streaks, and verify receipts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. MEMBERSHIP PLANS PREVIEW */}
      <section className="py-20 bg-gym-surface border-b border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="primary" className="mb-2">Transparent Pricing</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gym-text">
                Membership Plans Designed For You
              </h2>
              <p className="text-gym-muted mt-2 text-sm max-w-xl">
                Choose the subscription that matches your fitness goals. Both manual online payments (Bank, JazzCash, Easypaisa) and in-person cash payments are accepted.
              </p>
            </div>
            <Link to="/plans" className="mt-4 md:mt-0">
              <Button variant="outline" size="sm" icon={ChevronRight}>
                View All Plans & Features
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-200 ${
                  plan.name.toLowerCase() === 'standard'
                    ? 'bg-gym-surfaceLight border-gym-primary shadow-xl shadow-gym-primary/10 relative ring-1 ring-gym-primary'
                    : 'bg-gym-bg border-gym-border hover:border-gym-borderLight'
                }`}
              >
                {plan.name.toLowerCase() === 'standard' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gym-primary text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-gym-text">{plan.name}</h3>
                  <p className="text-xs text-gym-muted mt-1">{plan.description}</p>

                  <div className="my-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gym-text">
                      Rs. {plan.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gym-muted ml-2">
                      / {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs sm:text-sm text-gym-muted">
                        <CheckCircle2 className="w-4 h-4 text-gym-primary mr-2.5 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/register" className="w-full">
                  <Button
                    variant={plan.name.toLowerCase() === 'standard' ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    Select {plan.name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRAINERS PREVIEW */}
      <section className="py-20 bg-gym-bg border-b border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-3">Expert Team</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gym-text">
              Meet Our Certified Coaches
            </h2>
            <p className="text-gym-muted mt-3 text-sm">
              Our trainers create bespoke workout splits, monitor your lifting technique, and ensure you remain accountable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((t) => (
              <Card key={t._id} hoverEffect className="text-center p-8">
                <div className="w-24 h-24 rounded-full bg-gym-surfaceLight border-2 border-gym-primary/40 mx-auto mb-4 flex items-center justify-center text-gym-primary text-2xl font-bold overflow-hidden">
                  {t.profileImage ? (
                    <img src={t.profileImage} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{t.name.split(' ').map(n => n[0]).join('')}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gym-text">{t.name}</h3>
                <p className="text-xs text-gym-primary font-medium mt-1">{t.specialization}</p>
                <p className="text-xs text-gym-muted mt-3 leading-relaxed">
                  Dedicated to structured progressive overload, nutritional balance, and injury-free athletic longevity.
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/trainers">
              <Button variant="secondary" size="md">
                View All Trainers & Specializations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-gym-surface via-gym-surfaceLight to-gym-surface border-b border-gym-border">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gym-text">
            Ready to Transform Your Fitness?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gym-muted max-w-2xl mx-auto">
            Join hundreds of members achieving their peak physical condition. Sign up in under 2 minutes and submit your membership request.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight}>
                Register as Member
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Visit Gym / Book a Tour
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
