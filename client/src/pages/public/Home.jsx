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
  Zap,
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
    { label: 'Active Members', value: '1,200+', suffix: 'Athletes' },
    { label: 'Certified Coaches', value: '12+', suffix: 'Master Staff' },
    { label: 'Facility Space', value: '15,000+', suffix: 'Sq. Ft' },
    { label: 'Verified Integrity', value: '100%', suffix: 'Digital Dues' },
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

  // Marquee repeated keywords
  const marqueeItems = [
    'STRENGTH TRAINING',
    'CARDIO',
    'PERSONAL TRAINING',
    'BODY BUILDING',
    'FITNESS',
    'ATHLETIC PERFORMANCE',
    'RECOVERY LAB',
    'POWERLIFTING',
    'HYPERTROPHY',
    'METABOLIC CONDITIONING',
  ];

  return (
    <div className="bg-[#111413] text-white overflow-hidden selection:bg-neon selection:text-black">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION (REFERENCE 1 + REFERENCE 2 COHESION) */}
      {/* ======================================================== */}
      <section className="relative min-h-[94vh] lg:min-h-screen flex items-center overflow-hidden pt-24 lg:pt-16 pb-12 lg:pb-8">
        
        {/* Cinematic dark gym interior background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Pro Elite Gym Interior"
            className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-[1.25]"
          />
          {/* Subtle multi-stop gradient overlay preserving gym visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111413] via-[#111413]/85 to-[#172017]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111413] via-transparent to-black/60" />
        </div>

        {/* Concentric Decorative Radial Rings from Reference 2 */}
        <div className="absolute right-0 lg:right-16 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none z-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 700 700" fill="none">
            <circle cx="350" cy="350" r="140" stroke="#B7FF00" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="350" cy="350" r="220" stroke="#B7FF00" strokeWidth="1" />
            <circle cx="350" cy="350" r="300" stroke="#B7FF00" strokeWidth="1" strokeDasharray="10 10" />
            <circle cx="350" cy="350" r="340" stroke="#B7FF00" strokeWidth="0.75" />
          </svg>
        </div>

        {/* Hero Grid Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[75vh]">
            
            {/* Left Side: Editorial Content, Main Heading, CTAs & Stats */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center space-y-5 lg:space-y-6 text-left">
              
              {/* Eyebrow with Neon ++ Badge (Inspired by Reference 2) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172017] border border-[#243426] text-xs font-semibold tracking-wider text-gray-300 w-fit">
                <span className="text-neon font-black font-display text-sm tracking-tighter">++</span>
                <span className="font-display font-black uppercase text-white tracking-[0.2em] text-[11px]">
                  FITTRACK PRO FITNESS CLUB
                </span>
              </div>

              {/* Main Heading with High-Voltage Neon Accents */}
              <h1 className="font-display font-black uppercase text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-white tracking-tight leading-[0.88] drop-shadow-2xl">
                BUILD STRENGTH.
                <br />
                <span className="text-neon text-neon-glow font-black">TRANSFORM</span> YOUR BODY.
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base lg:text-lg text-gym-muted max-w-xl font-normal leading-relaxed">
                Push beyond your limits with expert coaching, premium gym facilities and personalized training programs designed to help you become stronger.
              </p>

              {/* Two CTA Buttons Inspired by Reference 1 & 2 */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link to="/register" className="group">
                  <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider px-7 sm:px-8 py-4 rounded-full shadow-neon-glow flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]">
                    START TRAINING
                    <ArrowRight className="w-4 h-4 stroke-[2.8] transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>

                <Link to="/plans" className="group">
                  <button className="border border-white/60 hover:border-neon hover:text-neon text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider px-7 sm:px-8 py-4 rounded-full transition-all duration-200 bg-[#172017]/70 backdrop-blur-sm flex items-center gap-2">
                    EXPLORE MEMBERSHIPS
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 stroke-[2.5]" />
                  </button>
                </Link>
              </div>

              {/* Compact Statistics Row Inspired by Reference 1 & 2 */}
              <div className="pt-6 border-t border-[#243426] grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-lg">
                {stats.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {item.value}
                    </span>
                    <span className="font-display text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neon mt-0.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Side: Athlete Centerpiece, Neon Orbit Lines & Floating Cards */}
            <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center lg:justify-end min-h-[480px] sm:min-h-[580px] lg:min-h-[640px]">
              
              {/* Neon Orbit Lines SVG Ribbon (Inspired by Reference 2) */}
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <svg className="w-full h-full max-w-[580px] max-h-[660px]" viewBox="0 0 600 680" fill="none">
                  {/* Glowing Blurred Underlayer */}
                  <path
                    d="M 520,60 C 440,40 280,100 290,220 C 300,340 480,290 450,440 C 420,590 200,530 310,650"
                    stroke="#B7FF00"
                    strokeWidth="7"
                    strokeLinecap="round"
                    className="filter blur-[8px] opacity-60"
                  />
                  {/* Crisp Foreground Neon Orbit */}
                  <path
                    d="M 520,60 C 440,40 280,100 290,220 C 300,340 480,290 450,440 C 420,590 200,530 310,650"
                    stroke="#B7FF00"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_12px_#B7FF00]"
                  />
                </svg>
              </div>

              {/* Circular Athletic Stamp Badge from Reference 2 */}
              <div className="absolute top-4 right-4 sm:top-10 sm:right-8 z-20 pointer-events-none">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <svg className="w-full h-full animate-spinSlow" viewBox="0 0 100 100">
                    <defs>
                      <path
                        id="circlePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      />
                    </defs>
                    <text fontSize="8.2" fontWeight="900" fill="#B7FF00" letterSpacing="2.2">
                      <textPath href="#circlePath">
                        WORKOUT • GYM • FITTRACK • POWER •
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-neon flex items-center justify-center text-black shadow-neon-glow">
                    <Dumbbell className="w-4 h-4 -rotate-45 stroke-[2.8]" />
                  </div>
                </div>
              </div>

              {/* Muscular Athlete Performing Dumbbell Exercise */}
              <div className="relative z-10 w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] h-[480px] sm:h-[580px] lg:h-[640px] flex items-end justify-center">
                <img
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop"
                  alt="FitTrack Pro Athletic Bodybuilder"
                  className="w-full h-full object-cover object-top scale-105 filter contrast-[1.12] brightness-[1.05] drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]"
                />
              </div>

              {/* ======================================================== */}
              {/* FLOATING FITNESS CARDS (FROM REFERENCE 1) */}
              {/* ======================================================== */}
              
              {/* Floating Card 1: WEEKLY GOAL Progress Ring */}
              <div className="absolute top-1/3 -left-4 sm:left-4 z-30 bg-[#172017]/92 backdrop-blur-md border border-neon/40 p-3.5 sm:p-4 rounded-2xl shadow-card-dark animate-floatSlow max-w-[155px]">
                <div className="flex items-center gap-3">
                  {/* SVG Circular Progress Ring */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-700"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-neon drop-shadow-[0_0_8px_#B7FF00]"
                        strokeDasharray="85, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-display font-black text-xs text-white">85%</span>
                  </div>
                  <div>
                    <span className="font-display font-black text-[11px] uppercase tracking-wider text-neon block">
                      WEEKLY GOAL
                    </span>
                    <span className="text-[9px] text-gym-muted font-medium block">
                      4 of 5 Sessions
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: LIVE SESSIONS Schedule */}
              <div className="absolute bottom-16 sm:bottom-20 -left-2 sm:left-10 z-30 bg-[#172017]/95 backdrop-blur-md border border-emerald-500/40 p-4 rounded-2xl shadow-card-dark animate-floatDelay max-w-[210px] hidden sm:block">
                <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-[#243426]">
                  <Clock className="w-3.5 h-3.5 text-neon" />
                  <span className="font-display font-black text-[11px] uppercase tracking-wider text-white">
                    LIVE SESSIONS
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-gray-300 text-[11px] font-medium">
                      <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                      Power Clean
                    </span>
                    <span className="text-[10px] font-mono text-neon font-bold">10:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-gray-300 text-[11px] font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Recovery Drill
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">11:15 AM</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 3: AI / COACH INSIGHT (Bottom Banner) */}
              <div className="absolute -bottom-4 right-2 sm:right-6 z-30 bg-[#172017]/95 backdrop-blur-md border border-neon/30 p-3.5 sm:p-4 rounded-2xl shadow-card-dark max-w-xs sm:max-w-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neon/15 border border-neon/30 flex items-center justify-center text-neon shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-display font-black text-[11px] uppercase tracking-wider text-neon">
                    COACH INSIGHT
                  </h5>
                  <p className="text-[10px] sm:text-[11px] text-gray-300 leading-tight mt-0.5">
                    Recovery is optimal. Progressive overload recommended: +5% compound load today.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. BRIGHT NEON-LIME SCROLLING BRAND STRIP (FROM REFERENCE 2) */}
      {/* ======================================================== */}
      <div className="relative z-20 w-full bg-neon py-3.5 overflow-hidden shadow-neon-strong border-y border-black">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex items-center space-x-8 shrink-0 px-4">
              {marqueeItems.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center space-x-8">
                  <span className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-black">
                    {item}
                  </span>
                  <span className="text-black font-black text-sm">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ABOUT THE GYM – DUAL IMAGE & EDITORIAL MANIFESTO */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Atmospheric Photography Collage */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#243426]">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80"
                alt="FitTrack Pro Training Culture"
                className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111413] via-transparent to-transparent opacity-80" />
            </div>

            {/* Overlaid Feature Card */}
            <div className="absolute -bottom-8 -right-6 bg-[#172017]/95 backdrop-blur-md border border-neon/40 p-5 rounded-2xl shadow-2xl max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon/20 text-neon flex items-center justify-center shrink-0">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172017] border border-neon/30 text-neon text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              The FitTrack Pro Philosophy
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-[1.0]">
              Built for <span className="text-neon text-neon-glow">Relentless</span> Athletes
            </h2>

            <p className="text-sm sm:text-base text-gym-muted leading-relaxed">
              We engineered FitTrack Pro as the antidote to generic, crowded commercial fitness clubs. Every square foot is optimized for biomechanical progression, power output, and metabolic conditioning.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-neon/10 text-neon mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Full Physiological Tracking</h4>
                  <p className="text-xs text-gym-muted mt-0.5">Bi-weekly biometric audits tracking lean tissue accrual, waist reduction, and strength milestones.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-neon/10 text-neon mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-white">Verified Accounting & Transparency</h4>
                  <p className="text-xs text-gym-muted mt-0.5">Instant verifiable cash receipts, multi-channel online bank proofs, and zero unrecorded financial handovers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-neon/10 text-neon mt-1">
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
                <button className="bg-[#172017] hover:bg-[#1f2b20] border border-[#243426] hover:border-neon text-white hover:text-neon px-6 py-3 rounded-full font-display uppercase tracking-wider text-xs font-bold flex items-center gap-2 transition-all">
                  Read Our Full Story
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. TRAINING ZONES & FACILITY HIGHLIGHTS */}
      {/* ======================================================== */}
      <section className="py-24 bg-[#172017]/50 border-y border-[#243426]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-widest text-neon">
                Engineered Performance Arenas
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
                World-Class Facility Zones
              </h2>
            </div>
            <Link to="/facilities">
              <button className="px-5 py-2.5 rounded-full border border-gray-600 hover:border-neon text-xs font-display font-bold uppercase tracking-wider text-white hover:text-neon flex items-center gap-2 transition-colors">
                View All Zones
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-[#172017] border border-[#243426] hover:border-neon/50 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172017] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-neon border border-neon/30">
                    {fac.badge}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-black uppercase text-white group-hover:text-neon transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-gym-muted mt-2 leading-relaxed">{fac.desc}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-[#243426] flex items-center text-xs text-neon font-semibold">
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
          <span className="font-display text-xs font-bold uppercase tracking-widest text-neon">
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
                    ? 'bg-gradient-to-b from-[#172017] to-[#111413] border-2 border-neon shadow-neon-strong scale-105 z-10'
                    : 'bg-[#172017] border border-[#243426] hover:border-neon/50'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-neon text-black text-[11px] font-black uppercase tracking-widest shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-black uppercase text-white">{p.name}</h3>
                    <span className="text-xs text-gym-muted font-medium">{p.durationMonths} Months</span>
                  </div>
                  <p className="text-xs text-gym-muted mt-1">{p.description}</p>

                  <div className="my-6 pt-4 border-t border-[#243426]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs uppercase text-gym-muted font-semibold">PKR</span>
                      <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {p.price?.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-neon font-medium">Billed every {p.durationMonths} month(s)</span>
                  </div>

                  <ul className="space-y-3 text-xs text-gym-muted">
                    {p.features?.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-neon shrink-0" />
                        <span className="text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-[#243426]">
                  <Link to={`/register?planId=${p._id}`}>
                    <button
                      className={`w-full font-display uppercase tracking-wider text-xs font-bold py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 transition-all ${
                        isFeatured
                          ? 'bg-neon hover:bg-neon-hover text-black shadow-neon-glow'
                          : 'bg-[#111413] hover:bg-[#172017] border border-[#243426] hover:border-neon text-white hover:text-neon'
                      }`}
                    >
                      Subscribe to {p.name}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
      <section className="py-24 bg-[#172017]/40 border-t border-[#243426]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-widest text-neon">
                Elite Athletic Mentorship
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
                Certified Coaching Staff
              </h2>
            </div>
            <Link to="/trainers">
              <button className="px-5 py-2.5 rounded-full border border-gray-600 hover:border-neon text-xs font-display font-bold uppercase tracking-wider text-white hover:text-neon flex items-center gap-2 transition-colors">
                Meet All Coaches
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((tr, idx) => (
              <div
                key={tr._id || idx}
                className="group bg-[#172017] border border-[#243426] rounded-3xl overflow-hidden hover:border-neon/50 transition-all duration-300"
              >
                <div className="relative h-72 overflow-hidden bg-[#111413]">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172017] via-transparent to-transparent opacity-90" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-neon/15 backdrop-blur-md text-[10px] font-bold text-neon border border-neon/30 uppercase tracking-wider">
                    {tr.specialization || 'Master Strength Coach'}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-black uppercase text-white group-hover:text-neon transition-colors">
                    {tr.name}
                  </h3>
                  <p className="text-xs text-gym-muted mt-2 line-clamp-2">
                    {tr.bio || 'Specialized in compound movement mechanics, hypertrophy protocols, and athletic power development.'}
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#243426] flex items-center justify-between text-xs text-gym-muted">
                    <span>{tr.experienceYears || '5+'} Years Experience</span>
                    <span className="text-neon font-semibold">{tr.activeClientsCount || '15+'} Active Trainees</span>
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
          <span className="font-display text-xs font-bold uppercase tracking-widest text-neon">
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
                className="p-8 rounded-3xl bg-[#172017] border border-[#243426] hover:border-neon/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon mb-5 shadow-neon-glow">
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
      <section className="py-24 bg-[#172017]/40 border-y border-[#243426]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-neon">
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
                className="p-8 rounded-3xl bg-[#172017] border border-[#243426] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-neon mb-4">
                    {[...Array(testi.rating)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-neon text-neon" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 italic leading-relaxed">"{testi.quote}"</p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#243426] flex items-center gap-3">
                  <img
                    src={testi.avatar}
                    alt={testi.name}
                    className="w-10 h-10 rounded-full object-cover border border-neon/40"
                  />
                  <div>
                    <h4 className="font-display text-sm font-black uppercase text-white">{testi.name}</h4>
                    <span className="text-[10px] text-neon font-medium block">{testi.achievement}</span>
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
            className="w-full h-full object-cover filter brightness-[0.22]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111413] via-[#111413]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-neon">
            Commit to Excellence
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-white leading-tight">
            Ready to <span className="text-neon text-neon-glow">Redefine</span> Your Physical Limits?
          </h2>
          <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto">
            Join hundreds of dedicated athletes. Register in 60 seconds, choose your membership tier, and access elite training facilities today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-neon-glow flex items-center gap-2 transition-all">
                Join FitTrack Pro Now
                <ArrowRight className="w-4 h-4 stroke-[2.8]" />
              </button>
            </Link>
            <Link to="/contact">
              <button className="border border-white/70 hover:border-neon hover:text-neon text-white font-display font-black text-sm uppercase tracking-wider px-8 py-4 rounded-full transition-all bg-[#172017]/70">
                Schedule a Club Tour
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
