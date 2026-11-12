import React from 'react';
import { Shield, Target, Users, Award, CheckCircle2, Dumbbell, Sparkles, Trophy, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    {
      title: 'Biomechanical Integrity',
      desc: 'We prioritize joint health, natural movement arcs, and scientific progressive overload over dangerous ego-lifting.',
      icon: Target,
    },
    {
      title: 'Absolute Transparency',
      desc: 'Every fee, verified payment, salary remittance, and check-in is logged with an immutable digital timestamp.',
      icon: Shield,
    },
    {
      title: 'Coaching Meritocracy',
      desc: 'Our trainers are certified professionals who continually audit and adapt member programming based on biometric metrics.',
      icon: Award,
    },
    {
      title: 'Inclusive Intensity',
      desc: 'Whether you are deadlifting 250 kg or stepping onto the gym floor for the first time, our standards of respect remain equal.',
      icon: Users,
    },
  ];

  const milestones = [
    { year: '2023', title: 'Facility Groundwork', desc: 'Acquisition of 15,000 sq.ft facility and installation of industrial-grade Eleiko & Hammer Strength equipment.' },
    { year: '2024', title: 'Smart Platform Launch', desc: 'Deployment of FitTrack Pro digital platform with automated turnstiles and dual online/cash payments.' },
    { year: '2025', title: '500+ Member Milestone', desc: 'Reached 500+ active transformed athletes with a 99.4% retention and verified review score.' },
    { year: '2026', title: 'Advanced Recovery Lab', desc: 'Expansion into hydro-recovery, cedar wood contrast saunas, and biometric body fat scanning.' },
  ];

  return (
    <div className="bg-gym-bg text-gym-text overflow-hidden">
      {/* 1. HERO BANNER */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-gym-border/80">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2000&auto=format&fit=crop"
            alt="About FitTrack Pro"
            className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="font-display text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
            Our Heritage & Mission
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-[0.9]">
            More Than a Gym. <br />
            <span className="text-gym-primary">A Standard of Excellence.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            FitTrack Pro was forged to eliminate the chaos of commercial fitness: broken machines, unverified payments, lost paper workout notebooks, and indifferent staff.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-transparent z-20" />
      </section>

      {/* 2. DUAL MANIFESTO SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
              The FitTrack Philosophy
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              Built on Science, Hard Iron & Digital Precision.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              We believe real progress requires three components: world-class hardware that doesn't hold you back, qualified coaching that guides your recovery, and transparent software that tracks every rep and transaction.
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Our gym operates on an integrated ecosystem where every member receives an assigned workout plan, digital biometric charts, and automated expiry alerts so training momentum is never interrupted.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-gym-border/80 pt-6">
              <div>
                <div className="font-display text-4xl sm:text-5xl font-black text-white">15,000+</div>
                <div className="font-display text-xs text-emerald-400 mt-1 uppercase font-bold tracking-wider">Square Feet Floor Space</div>
              </div>
              <div>
                <div className="font-display text-4xl sm:text-5xl font-black text-white">100%</div>
                <div className="font-display text-xs text-emerald-400 mt-1 uppercase font-bold tracking-wider">Verified Digital Receipts</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-gym-border shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop"
                alt="Olympic Lifting at FitTrack"
                className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gym-surface/95 backdrop-blur-md border border-gym-primary/40 p-5 rounded-2xl shadow-2xl max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gym-primary/20 text-gym-primary flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Zero Compromise</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Every barbell, rack, and platform meets international federation specifications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE VALUES */}
      <section className="py-24 bg-gym-surface/40 border-y border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
              Our Non-Negotiables
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
              Core Cultural Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="p-8 rounded-2xl bg-gym-surface border border-gym-border hover:border-gym-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-black uppercase text-white">{v.title}</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EVOLUTION TIMELINE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
            Continuous Progression
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            FitTrack Evolution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-gym-surface border border-gym-border relative flex flex-col justify-between">
              <div>
                <span className="font-display text-3xl font-black text-gym-primary">{m.year}</span>
                <h4 className="font-display text-base font-black uppercase text-white mt-2">{m.title}</h4>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/register">
            <button className="bg-white hover:bg-neutral-200 text-black font-display font-black text-sm uppercase tracking-wider px-8 py-4 inline-flex items-center gap-2 shadow-xl transition-all">
              Become Part of Our Community
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
