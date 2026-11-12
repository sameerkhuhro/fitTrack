import React from 'react';
import { Shield, Target, Users, Award, HeartHandshake, CheckCircle2, Dumbbell, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

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
    <div className="bg-gym-bg text-gym-text">
      {/* 1. HERO BANNER */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-gym-border">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80"
            alt="About FitTrack Pro"
            className="w-full h-full object-cover filter brightness-[0.25] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-4">Our Heritage & Mission</Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gym-text">
            More Than a Gym. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-primary via-emerald-300 to-teal-400">
              A Standard of Excellence.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gym-muted max-w-3xl mx-auto leading-relaxed">
            FitTrack Pro was forged to eliminate the chaos of commercial fitness: broken machines, unverified payments, paper workout notebooks, and indifferent staff.
          </p>
        </div>
      </section>

      {/* 2. DUAL MANIFESTO SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="primary" className="mb-3">The FitTrack Philosophy</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-gym-text">
              Built on Science, Hard Iron & Digital Precision.
            </h2>
            <p className="mt-4 text-gym-muted text-base leading-relaxed">
              We believe real progress requires three components: world-class hardware that doesn't hold you back, qualified coaching that guides your recovery, and transparent software that tracks every rep and transaction.
            </p>
            <p className="mt-4 text-gym-muted text-base leading-relaxed">
              Our gym operates on an integrated ecosystem where every member receives an assigned workout plan, digital biometric charts, and automated expiry alerts so training momentum is never interrupted.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-gym-border pt-6">
              <div>
                <div className="text-3xl font-extrabold text-gym-primary">15,000+</div>
                <div className="text-xs text-gym-muted mt-1 uppercase font-semibold">Square Feet Floor</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-gym-primary">100%</div>
                <div className="text-xs text-gym-muted mt-1 uppercase font-semibold">Verified Receipts</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gym-border shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80"
                alt="Olympic Lifting at FitTrack"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES GRID */}
      <section className="py-20 bg-gym-surface border-y border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-3">Pillars of Culture</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-gym-text">
              What Defines Our Space
            </h2>
            <p className="mt-4 text-gym-muted text-sm sm:text-base">
              The ethical and training principles governing our coaching staff, facilities, and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-gym-bg border border-gym-border hover:border-gym-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gym-text">{v.title}</h3>
                    <p className="mt-3 text-xs text-gym-muted leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TIMELINE / MILESTONES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-3">Evolution</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-gym-text">
            Our Journey of Growth
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-gym-surface border border-gym-border relative">
              <span className="text-2xl font-black text-gym-primary">{m.year}</span>
              <h4 className="text-base font-bold text-gym-text mt-2">{m.title}</h4>
              <p className="text-xs text-gym-muted mt-2 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/plans">
            <Button size="lg" variant="primary">
              Explore Our Membership Packages
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
