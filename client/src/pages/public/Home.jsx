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
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Clock,
  MapPin,
  Star,
  Activity,
  HeartPulse,
  Trophy,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    // Fetch live plans from Atlas fittrack database
    api.get('/plans')
      .then((res) => {
        if (res.data.success) setPlans(res.data.data.slice(0, 3));
      })
      .catch(() => {});

    // Fetch live trainers from Atlas fittrack database
    api.get('/trainers')
      .then((res) => {
        if (res.data.success) setTrainers(res.data.data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: 'Floor Space', value: '15,000+', suffix: 'Sq. Ft', sub: 'Olympic & Cardio Arenas' },
    { label: 'Active Members', value: '650+', suffix: 'Athletes', sub: 'Transforming daily' },
    { label: 'Certified Coaches', value: '12+', suffix: 'Specialists', sub: 'NASM & ISSA accredited' },
    { label: 'Satisfaction Rate', value: '99.4%', suffix: 'Positive', sub: 'Verified member feedback' },
  ];

  const facilities = [
    {
      title: 'Olympic Power & Heavy Free Weights',
      desc: 'Calibrated Eleiko plates, Texas power bars, dual-pulley cable towers, and 8 dedicated power cages.',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      badge: 'Strength Arena',
    },
    {
      title: 'Cardio & Endurance Studio',
      desc: 'Commercial curved treadmills, Concept2 rowing ergs, assault bikes, and heart rate telemetry monitors.',
      image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
      badge: 'Conditioning',
    },
    {
      title: 'Functional Turf & Movement Zone',
      desc: 'Sled tracks, battle ropes, plyometric boxes, kettlebell racks, and open mobility areas.',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
      badge: 'Agility & Speed',
    },
    {
      title: 'Luxury Hydro-Recovery & Sauna',
      desc: 'Post-workout cedar wood sauna, steam rooms, and contrast shower suites for fast muscle recovery.',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
      badge: 'Recovery Lab',
    },
  ];

  const whyChooseUs = [
    {
      icon: ShieldCheck,
      title: 'Smart Turnstile Check-In',
      desc: 'Instant QR and biometric check-ins with anti-duplicate daily turnstile constraints.',
    },
    {
      icon: Users,
      title: 'Assigned Personal Coaching',
      desc: 'Direct 1-on-1 oversight from certified trainers with weekly workout updates.',
    },
    {
      icon: TrendingUp,
      title: 'Digital Biometric Tracking',
      desc: 'Interactive weight, waist, and body fat trajectory graphs to visualize real results.',
    },
    {
      icon: CreditCard,
      title: 'Dual Payment Architecture',
      desc: 'Submit online bank/wallet proofs or receive instant verifiable cash receipts at reception.',
    },
    {
      icon: Clock,
      title: 'Automated Expiry Alerts',
      desc: 'Smart 7-day, 3-day, and 1-day reminders with automated notification deduplication.',
    },
    {
      icon: Trophy,
      title: 'Hammer Strength & Eleiko Fleet',
      desc: 'Pristine, competition-grade machines and biomechanically calibrated equipment.',
    },
  ];

  const testimonials = [
    {
      name: 'Usman Tariq',
      role: 'Member since 2024',
      quote: 'FitTrack Pro completely changed how I train. The workout logging and biometrics tracking keep me accountable every single week.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      achievement: 'Lost 12 kg & Gained 4 kg Lean Mass',
    },
    {
      name: 'Ayesha Siddiqui',
      role: 'Member since 2025',
      quote: 'The facility is immaculate and the coaching staff is truly world-class. Having real-time salary confirmations and receipts verified in minutes gives immense trust.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      achievement: 'Consistent 5-day Weekly Streak',
    },
    {
      name: 'Farhan Malik',
      role: 'Competitive Powerlifter',
      quote: 'The Eleiko equipment, dedicated lifting platforms, and structured workout sessions are better than any commercial gym in the city.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      achievement: '210 kg Deadlift Verified PR',
    },
  ];

  return (
    <div className="bg-gym-bg text-gym-text overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION – DIRECTLY MATCHING REFERENCE SCREENSHOT */}
      {/* ======================================================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden border-b border-gym-border/60 pt-24 lg:pt-0">
        
        {/* Full-width dark gym interior background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Pro Elite Gym Interior"
            className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.2]"
          />
          {/* Subtle cinematic black gradient overlay to ensure perfect contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-transparent to-black/60" />
        </div>

        {/* Hero Grid Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[72vh]">
            
            {/* Left Side: Brand Tagline, Headings & Action Buttons */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:space-y-7 text-left">
              
              {/* Small Top Label */}
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xs sm:text-sm uppercase tracking-[0.22em] text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                  FITTRACK PRO FITNESS CLUB.
                </span>
              </div>

              {/* Main Display Heading */}
              <h1 className="font-display font-black uppercase text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-white tracking-tight leading-[0.88] drop-shadow-2xl">
                BUILD STRENGTH.
                <br />
                <span className="text-gym-primary font-black">TRANSFORM</span> YOUR BODY.
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
                Train smarter, build strength, and achieve your fitness goals with expert trainers and personalized fitness programs.
              </p>

              {/* Two CTA Buttons with Diagonal Arrows Matching Reference */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/plans" className="group">
                  <button className="bg-white hover:bg-neutral-200 text-black font-display font-black text-sm uppercase tracking-wider px-7 py-3.5 flex items-center gap-2 shadow-xl hover:shadow-white/20 transition-all duration-200">
                    Explore Memberships
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 stroke-[2.5]" />
                  </button>
                </Link>

                <Link to="/register" className="group">
                  <button className="border border-white/80 hover:border-gym-primary hover:bg-gym-primary/10 text-white hover:text-gym-primary font-display font-black text-sm uppercase tracking-wider px-7 py-3.5 flex items-center gap-2 transition-all duration-200">
                    Join Now
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 stroke-[2.5]" />
                  </button>
                </Link>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-6 border-t border-gym-border/40 flex items-center gap-8 text-xs text-gym-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gym-primary" />
                  <span>ISO-9001 Certified Training Arena</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Award className="w-4 h-4 text-gym-primary" />
                  <span>12+ Master Coaches</span>
                </div>
              </div>

            </div>

            {/* Right Side: Visual Athlete Showcase with Radiant Green Circle & Diagonal White Slashes */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[520px] aspect-square flex items-center justify-center">
                
                {/* 1. Large Circular Emerald/Lime Gradient Shape */}
                <div className="absolute w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[420px] rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-400 to-teal-800 shadow-[0_0_80px_rgba(16,185,129,0.4)] z-0" />

                {/* 2. Diagonal White Slash Line 1 (Upper Right - Matching Reference) */}
                <div className="absolute top-2 right-4 sm:top-6 sm:right-8 w-3 sm:w-3.5 h-36 sm:h-44 bg-white rotate-[35deg] transform origin-center shadow-2xl z-10" />

                {/* 3. Diagonal White Slash Line 2 (Lower Left - Matching Reference) */}
                <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-8 w-3 sm:w-3.5 h-36 sm:h-44 bg-white rotate-[35deg] transform origin-center shadow-2xl z-10" />

                {/* 4. Large Muscular Fitness Athlete Lifting Dumbbells */}
                <div className="relative z-20 w-[95%] h-[95%] flex items-end justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop"
                    alt="FitTrack Pro Athlete Lifting Dumbbells"
                    className="w-full h-full object-cover object-top scale-105 filter contrast-[1.1] brightness-[1.05] drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]"
                  />
                </div>

                {/* 5. Floating Telemetry Badge */}
                <div className="absolute bottom-4 right-0 z-30 bg-gym-surface/95 backdrop-blur-md border border-gym-primary/40 p-3.5 rounded-2xl shadow-2xl hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-display uppercase tracking-wider text-white">Live Telemetry</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">Overload & Split Tracking</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Thin Emerald/Lime Accent Line Near Bottom of Hero Matching Reference */}
        <div className="absolute bottom-0 left-0 w-3/5 sm:w-2/3 h-1 sm:h-1.5 bg-gradient-to-r from-lime-400 via-emerald-400 to-transparent z-20" />
      </section>

      {/* ======================================================== */}
      {/* 2. LIVE CLUB STATISTICS BAR */}
      {/* ======================================================== */}
      <section className="bg-gym-surface border-b border-gym-border/80 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <div key={idx} className="border-l-2 border-gym-primary/50 pl-6 py-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">{s.value}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gym-primary">{s.suffix}</span>
                </div>
                <div className="font-display text-sm font-bold uppercase tracking-wider text-gym-text mt-1">{s.label}</div>
                <div className="text-xs text-gym-muted mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ABOUT THE GYM – DUAL IMAGE & EDITORIAL MANIFESTO */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Atmospheric Photography Collage */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gym-border">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80"
                alt="FitTrack Pro Training Culture"
                className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-transparent to-transparent opacity-80" />
            </div>

            {/* Overlaid Feature Card */}
            <div className="absolute -bottom-8 -right-6 bg-gym-surface/95 backdrop-blur-md border border-gym-primary/30 p-5 rounded-2xl shadow-2xl max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gym-primary/20 text-gym-primary flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Competition Caliber</h4>
                  <p className="text-[11px] text-gym-muted mt-0.5">Olympic platforms, calibrated steel plates, and custom dumbbell runs to 70kg.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gym-primary/10 border border-gym-primary/30 text-gym-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              The FitTrack Pro Philosophy
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-[1.0]">
              Built for <span className="text-gym-primary">Relentless</span> Athletes
            </h2>

            <p className="text-sm sm:text-base text-gym-muted leading-relaxed">
              We engineered FitTrack Pro as the antidote to generic, crowded commercial fitness clubs. Every square foot is optimized for biomechanical progression, power output, and metabolic conditioning.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-gym-primary/10 text-gym-primary mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Full Physiological Tracking</h4>
                  <p className="text-xs text-gym-muted mt-0.5">Bi-weekly biometric audits tracking lean tissue accrual, waist reduction, and strength milestones.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-gym-primary/10 text-gym-primary mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Verified Accounting & Transparency</h4>
                  <p className="text-xs text-gym-muted mt-0.5">Instant verifiable cash receipts, multi-channel online bank proofs, and zero unrecorded financial handovers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-gym-primary/10 text-gym-primary mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Zero Turnstile Congestion</h4>
                  <p className="text-xs text-gym-muted mt-0.5">High-speed biometric and QR check-ins that validate subscription status in milliseconds.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/about">
                <Button variant="secondary" icon={ArrowRight} className="font-display uppercase tracking-wider text-xs font-bold">
                  Read Our Full Story
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. TRAINING ZONES & FACILITY HIGHLIGHTS */}
      {/* ======================================================== */}
      <section className="py-24 bg-gym-surface/50 border-y border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
                Engineered Performance Arenas
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
                World-Class Facility Zones
              </h2>
            </div>
            <Link to="/facilities">
              <Button variant="outline" icon={ArrowRight} size="sm" className="font-display uppercase tracking-wider text-xs font-bold">
                View All Zones
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden bg-gym-surface border border-gym-border hover:border-gym-primary/50 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gym-surface via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-gym-primary border border-gym-primary/30">
                    {fac.badge}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-black uppercase text-white group-hover:text-gym-primary transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-gym-muted mt-2 leading-relaxed">{fac.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gym-border/50 flex items-center text-xs text-gym-primary font-semibold">
                    <span>Inspect Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. MEMBERSHIP TIERS (LOADED LIVE FROM ATLAS DB) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
            Transparent Pricing Structure
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Choose Your Membership
          </h2>
          <p className="text-xs sm:text-sm text-gym-muted mt-3">
            All tiers include turnstile access, mobile member dashboard, workout programming, and biometric tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => {
            const isFeatured = idx === 1;
            return (
              <div
                key={p._id || idx}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-gym-surface to-gym-bg border-2 border-gym-primary shadow-2xl shadow-gym-primary/10 scale-105 z-10'
                    : 'bg-gym-surface border border-gym-border hover:border-gym-primary/50'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gym-primary text-black text-[11px] font-black uppercase tracking-widest shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-black uppercase text-white">{p.name}</h3>
                    <span className="text-xs text-gym-muted font-medium">{p.durationMonths} Months</span>
                  </div>
                  <p className="text-xs text-gym-muted mt-1">{p.description}</p>

                  <div className="my-6 pt-4 border-t border-gym-border">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs uppercase text-gym-muted font-semibold">PKR</span>
                      <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {p.price?.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">Billed every {p.durationMonths} month(s)</span>
                  </div>

                  <ul className="space-y-3 text-xs text-gym-muted">
                    {p.features?.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gym-primary shrink-0" />
                        <span className="text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-gym-border">
                  <Link to={`/register?planId=${p._id}`}>
                    <Button
                      variant={isFeatured ? 'primary' : 'outline'}
                      className="w-full font-display uppercase tracking-wider text-xs font-bold py-3.5 shadow-md"
                      icon={ArrowRight}
                    >
                      Subscribe to {p.name}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CERTIFIED MASTER COACHES (LOADED LIVE FROM ATLAS DB) */}
      {/* ======================================================== */}
      <section className="py-24 bg-gym-surface/40 border-t border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
                Elite Athletic Mentorship
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
                Certified Coaching Staff
              </h2>
            </div>
            <Link to="/trainers">
              <Button variant="outline" icon={ArrowRight} size="sm" className="font-display uppercase tracking-wider text-xs font-bold">
                Meet All Coaches
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((tr, idx) => (
              <div
                key={tr._id || idx}
                className="group bg-gym-surface border border-gym-border rounded-2xl overflow-hidden hover:border-gym-primary/50 transition-all duration-300"
              >
                <div className="relative h-72 overflow-hidden bg-gym-bg">
                  <img
                    src={
                      tr.avatar ||
                      (idx === 0
                        ? 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80'
                        : idx === 1
                        ? 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80'
                        : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80')
                    }
                    alt={tr.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gym-surface via-transparent to-transparent opacity-90" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-gym-primary/20 backdrop-blur-md text-[10px] font-bold text-gym-primary border border-gym-primary/30 uppercase tracking-wider">
                    {tr.specialization || 'Master Strength Coach'}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-black uppercase text-white group-hover:text-gym-primary transition-colors">
                    {tr.name}
                  </h3>
                  <p className="text-xs text-gym-muted mt-2 line-clamp-2">
                    {tr.bio || 'Specialized in compound movement mechanics, hypertrophy protocols, and athletic power development.'}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gym-border/60 flex items-center justify-between text-xs text-gym-muted">
                    <span>{tr.experienceYears || '5+'} Years Experience</span>
                    <span className="text-emerald-400 font-semibold">{tr.activeClientsCount || '15+'} Active Trainees</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. WHY CHOOSE FITTRACK PRO (6 PILLARS) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
            The FitTrack Standard
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Why Train at FitTrack Pro
          </h2>
          <p className="text-xs sm:text-sm text-gym-muted mt-3">
            Combining old-school iron discipline with modern software engineering for an unparalleled training experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-gym-surface border border-gym-border hover:border-gym-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-black uppercase text-white">{pillar.title}</h3>
                <p className="text-xs text-gym-muted mt-2 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. ATHLETE TESTIMONIALS */}
      {/* ======================================================== */}
      <section className="py-24 bg-gym-surface/40 border-y border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-gym-primary">
              Verified Transformations
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
              Member Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testi, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-gym-surface border border-gym-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(testi.rating)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 italic leading-relaxed">"{testi.quote}"</p>
                </div>

                <div className="mt-6 pt-5 border-t border-gym-border/60 flex items-center gap-3">
                  <img
                    src={testi.avatar}
                    alt={testi.name}
                    className="w-10 h-10 rounded-full object-cover border border-gym-primary/40"
                  />
                  <div>
                    <h4 className="font-display text-sm font-black uppercase text-white">{testi.name}</h4>
                    <span className="text-[10px] text-gym-primary font-medium block">{testi.achievement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. STRONG FINAL CALL TO ACTION */}
      {/* ======================================================== */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Gym Atmosphere"
            className="w-full h-full object-cover filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
            Commit to Excellence
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-white leading-tight">
            Ready to <span className="text-gym-primary">Redefine</span> Your Physical Limits?
          </h2>
          <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto">
            Join hundreds of dedicated athletes. Register in 60 seconds, choose your membership tier, and access elite training facilities today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <button className="bg-white hover:bg-neutral-200 text-black font-display font-black text-sm uppercase tracking-wider px-8 py-4 flex items-center gap-2 shadow-2xl transition-all">
                Join FitTrack Pro Now
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>
            <Link to="/contact">
              <button className="border border-white/80 hover:border-gym-primary hover:bg-gym-primary/10 text-white font-display font-black text-sm uppercase tracking-wider px-8 py-4 flex items-center gap-2 transition-all">
                Schedule a Club Tour
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
