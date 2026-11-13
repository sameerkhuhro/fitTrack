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
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Clock,
  HeartPulse,
  Trophy,
  Zap,
  Play,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import api from '../../services/api';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    // Fetch live plans from Atlas fittrack database
    api.get('/plans')
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setPlans(res.data.data.slice(0, 3));
        }
      })
      .catch(() => {});

    // Fetch live trainers from Atlas fittrack database
    api.get('/trainers')
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setTrainers(res.data.data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  // Fallback plans if database plans are loading or empty
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

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  // Facilities from Blueprint
  const facilities = [
    {
      id: 'strength',
      title: 'Strength Zone',
      desc: 'Build muscle and power with Olympic calibrated plates and power racks.',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      icon: Dumbbell,
    },
    {
      id: 'cardio',
      title: 'Cardio Zone',
      desc: 'Improve stamina and heart health on curved treadmills and Concept2 rowers.',
      image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
      icon: Zap,
    },
    {
      id: 'functional',
      title: 'Functional Training',
      desc: 'Full-body, real-world fitness on turf sled tracks with kettlebells & ropes.',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
      icon: Flame,
    },
    {
      id: 'recovery',
      title: 'Recovery Zone',
      desc: 'Relax and recharge in cedar wood saunas and contrast shower suites.',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
      icon: HeartPulse,
    },
  ];

  // Testimonials from Blueprint
  const testimonials = [
    {
      name: 'Ali Khan',
      role: 'Member since 2024',
      quote: 'FitTrack Pro completely transformed my fitness journey. Amazing trainers and world-class equipment!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      achievement: 'Lost 12 kg & Gained 4 kg Lean Mass',
    },
    {
      name: 'Sara Ahmed',
      role: 'Member since 2025',
      quote: 'The environment is motivating and the staff is super supportive. Clean, modern and result-oriented.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      achievement: 'Consistent 5-day Weekly Streak',
    },
    {
      name: 'Hamza Raza',
      role: 'Competitive Athlete',
      quote: 'Best gym in the city! Clean, modern and result-oriented with authentic competition lifting platforms.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      achievement: '210 kg Deadlift Verified PR',
    },
  ];

  // Marquee repeated brand keywords from reference blueprint
  const marqueeItems = [
    'STRENGTH TRAINING',
    'CARDIO',
    '➔ PERSONAL TRAINING',
    'BODY BUILDING',
    'FITNESS',
    'PERFORMANCE',
    'RECOVERY',
  ];

  return (
    <div className="bg-[#191D20] text-white overflow-hidden selection:bg-neon selection:text-black">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION (STRICT BLUEPRINT REPRODUCTION) */}
      {/* ======================================================== */}
      <section className="relative min-h-[92vh] lg:min-h-screen flex items-center overflow-hidden pt-28 lg:pt-20 pb-8 lg:pb-0 bg-[#191D20]">
        
        {/* Subtle Dark Gym Background Texture */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Pro Elite Gym Atmosphere"
            className="w-full h-full object-cover object-center filter brightness-[0.15] contrast-[1.2]"
          />
          {/* Graphite Charcoal Overlay with Radial Depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#191D20] via-[#191D20]/90 to-[#191D20]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191D20] via-transparent to-[#191D20]/60" />
        </div>

        {/* Ambient Warm-Green Radial Glow Centered Behind Athlete */}
        <div className="absolute right-0 lg:right-24 top-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(198,255,0,0.14)_0%,_rgba(34,41,42,0.5)_45%,_transparent_72%)] pointer-events-none z-0" />

        {/* Concentric Circular Background Rings */}
        <div className="absolute right-0 lg:right-12 top-1/2 -translate-y-1/2 w-[720px] h-[720px] pointer-events-none z-0 opacity-25">
          <svg className="w-full h-full" viewBox="0 0 720 720" fill="none">
            <circle cx="390" cy="360" r="130" stroke="#C6FF00" strokeWidth="1" strokeDasharray="5 5" />
            <circle cx="390" cy="360" r="210" stroke="#C6FF00" strokeWidth="1" />
            <circle cx="390" cy="360" r="290" stroke="#C6FF00" strokeWidth="1" strokeDasharray="8 8" />
            <circle cx="390" cy="360" r="360" stroke="#C6FF00" strokeWidth="0.75" />
            <circle cx="390" cy="360" r="430" stroke="#C6FF00" strokeWidth="0.5" strokeDasharray="12 12" />
          </svg>
        </div>

        {/* Hero Content Grid Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[78vh]">
            
            {/* Left Side: Editorial Typography, CTAs & Counters */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center space-y-5 lg:space-y-6 text-left">
              
              {/* Eyebrow: COMMIT TO EXCELLENCE */}
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neon">
                <span>COMMIT TO EXCELLENCE</span>
              </div>

              {/* Main Headline: READY TO REDEFINE YOUR PHYSICAL LIMITS? */}
              <h1 className="font-display font-black uppercase text-4xl sm:text-5xl lg:text-6xl xl:text-6xl text-white tracking-tight leading-[0.96] max-w-xl">
                READY TO <span className="text-neon italic">REDEFINE</span>
                <br />
                YOUR PHYSICAL LIMITS?
              </h1>

              {/* Supporting Subtitle Paragraph */}
              <p className="text-sm sm:text-base text-[#AEB5B2] max-w-lg font-normal leading-relaxed">
                Join hundreds of dedicated athletes. Register in 60 seconds, choose your membership tier, and access elite training facilities today.
              </p>

              {/* CTA Buttons Row (Neon Pill + Schedule a Club Tour) */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link to="/register">
                  <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider px-7 sm:px-8 py-3.5 rounded-full shadow-neon-glow flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]">
                    JOIN FITTRACK PRO NOW
                    <ArrowRight className="w-4 h-4 stroke-[2.8]" />
                  </button>
                </Link>

                <Link to="/contact">
                  <button className="border border-white/20 hover:border-neon hover:text-neon text-white font-display font-bold text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-7 py-3.5 rounded-full transition-all duration-200 bg-[#22292A]/60 backdrop-blur-sm flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-neon text-[10px]">
                      ▶
                    </span>
                    SCHEDULE A CLUB TOUR
                  </button>
                </Link>
              </div>

              {/* Compact Statistics Row with Icons */}
              <div className="pt-6 sm:pt-8 border-t border-[#333e40]/70 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center text-neon shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight block">
                      1,200+
                    </span>
                    <span className="text-[11px] text-[#AEB5B2] font-semibold tracking-wide">
                      Active Members
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center text-neon shrink-0">
                    <Dumbbell className="w-5 h-5 -rotate-45" />
                  </div>
                  <div>
                    <span className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight block">
                      12+
                    </span>
                    <span className="text-[11px] text-[#AEB5B2] font-semibold tracking-wide">
                      Expert Trainers
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center text-neon shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight block">
                      35+
                    </span>
                    <span className="text-[11px] text-[#AEB5B2] font-semibold tracking-wide">
                      Training Programs
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side: Standing Muscular Athlete + Neon Orbit Ribbon + Rotating Badge */}
            <div className="lg:col-span-6 xl:col-span-6 relative flex items-end justify-center lg:justify-end min-h-[500px] sm:min-h-[600px] lg:min-h-[680px]">
              
              {/* Neon Orbit Lines SVG Ribbon */}
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <svg className="w-full h-full max-w-[640px] max-h-[720px]" viewBox="0 0 640 720" fill="none">
                  {/* Glowing Blurred Underlayer */}
                  <path
                    d="M 640,150 C 530,165 375,220 390,345 C 405,475 580,410 540,570 C 500,710 350,670 425,750"
                    stroke="#C6FF00"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="filter blur-[8px] opacity-60"
                  />
                  {/* Crisp Foreground Neon Orbit */}
                  <path
                    d="M 640,150 C 530,165 375,220 390,345 C 405,475 580,410 540,570 C 500,710 350,670 425,750"
                    stroke="#C6FF00"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_12px_#C6FF00]"
                  />
                </svg>
              </div>

              {/* Circular Athletic Stamp Badge */}
              <div className="absolute top-2 right-2 sm:top-6 sm:right-6 z-20 pointer-events-none">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <svg className="w-full h-full animate-spinSlow" viewBox="0 0 100 100">
                    <defs>
                      <path
                        id="circlePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      />
                    </defs>
                    <text fontSize="8.2" fontWeight="900" fill="#C6FF00" letterSpacing="2.2">
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

              {/* Standing Muscular Athlete Holding Dumbbells in Both Hands */}
              <div className="relative z-10 w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[560px] h-[500px] sm:h-[600px] lg:h-[680px] flex items-end justify-center">
                <img
                  src="/athlete-prowess.png"
                  alt="FitTrack Pro Standing Muscular Bodybuilder"
                  className="w-full h-full object-contain object-bottom filter contrast-[1.08] brightness-[1.02] drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
                />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. BRIGHT NEON-LIME SCROLLING BRAND STRIP (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <div className="relative z-20 w-full bg-neon py-3.5 overflow-hidden shadow-neon-strong border-y border-black">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex items-center space-x-6 shrink-0 px-4">
              {marqueeItems.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center space-x-6">
                  <span className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-black">
                    {item}
                  </span>
                  <span className="text-black font-black text-base">//</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ABOUT FITTRACK PRO PREVIEW (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neon">
              <span>ABOUT FITTRACK PRO</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-[1.0]">
              MORE THAN A GYM.<br />
              <span className="text-white">A FITNESS COMMUNITY.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#AEB5B2] leading-relaxed">
              We provide a world-class training environment, expert coaching and modern facilities to help you achieve your fitness goals. Every square foot is engineered for optimal performance, joint health, and progressive overload.
            </p>

            {/* 3 Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#22292A] border border-[#333e40]">
                <Users className="w-4 h-4 text-neon shrink-0" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Expert Coaches</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#22292A] border border-[#333e40]">
                <Dumbbell className="w-4 h-4 text-neon shrink-0" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Modern Equipment</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#22292A] border border-[#333e40]">
                <Calendar className="w-4 h-4 text-neon shrink-0" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Personalized Plans</span>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/about">
                <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-full shadow-neon-glow flex items-center gap-2 transition-all">
                  Learn More
                  <ArrowRight className="w-4 h-4 stroke-[2.8]" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Gym Interior Photo with Play Overlay */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#333e40] group">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                alt="FitTrack Pro Community Training"
                className="w-full h-[400px] sm:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#191D20]/90 via-[#191D20]/40 to-transparent" />
              
              {/* Glowing Play Button Overlay */}
              <Link
                to="/facilities"
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-neon/90 hover:bg-neon flex items-center justify-center text-black shadow-neon-strong transition-all duration-300 hover:scale-110"
                aria-label="Watch Facility Tour"
              >
                <Play className="w-7 h-7 fill-black ml-1" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. OUR FACILITIES SECTION (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="py-24 bg-[#111613] border-y border-[#333e40]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
              OUR FACILITIES
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
              TRAIN WITH THE BEST EQUIPMENT
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB5B2] mt-3">
              Everything you need for strength, cardio, and total body fitness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac) => {
              const Icon = fac.icon;
              return (
                <Link
                  key={fac.id}
                  to="/facilities"
                  className="group relative rounded-2xl overflow-hidden bg-[#22292A] border border-[#333e40] hover:border-neon transition-all duration-300 flex flex-col shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={fac.image}
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#22292A] via-[#22292A]/30 to-transparent" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-neon" />
                        <h3 className="font-display text-lg font-black uppercase text-white group-hover:text-neon transition-colors">
                          {fac.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[#AEB5B2] leading-relaxed line-clamp-2">
                        {fac.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#333e40] flex items-center justify-between text-xs text-neon font-bold uppercase tracking-wider">
                      <span>Explore Zone</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. MEMBERSHIP PLANS WITH ATHLETE INTEGRATION (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
            MEMBERSHIP PLANS
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            CHOOSE YOUR FITNESS PLAN
          </h2>
          <p className="text-xs sm:text-sm text-[#AEB5B2] mt-3">
            Flexible memberships for every goal and fitness level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: 3 Pricing Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
            {displayPlans.map((p, idx) => {
              const isPopular = p.popular || idx === 1;
              return (
                <div
                  key={p._id || idx}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#22292A] to-[#191D20] border-2 border-neon shadow-neon-strong scale-102 z-10'
                      : 'bg-[#22292A] border border-[#333e40] hover:border-neon/50'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-neon text-black text-[10px] font-black uppercase tracking-widest shadow-md">
                      Popular
                    </div>
                  )}

                  <div>
                    <h3 className="font-display text-2xl font-black uppercase text-white">{p.name}</h3>
                    <p className="text-[11px] text-[#AEB5B2] mt-1 line-clamp-2">{p.description}</p>

                    <div className="my-5 pt-3 border-t border-[#333e40]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs uppercase text-neon font-bold">$</span>
                        <span className="font-display text-4xl font-black text-white tracking-tight">
                          {p.price}
                        </span>
                        <span className="text-[11px] text-[#AEB5B2]">/ month</span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-[#AEB5B2]">
                      {p.features?.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                          <span className="text-gray-300 text-[11px]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#333e40]">
                    <Link to={`/register?planId=${p._id}`}>
                      <button
                        className={`w-full font-display uppercase tracking-wider text-xs font-black py-3 rounded-full flex items-center justify-center gap-2 transition-all ${
                          isPopular
                            ? 'bg-neon hover:bg-neon-hover text-black shadow-neon-glow'
                            : 'bg-[#191D20] hover:bg-[#22292A] border border-[#333e40] hover:border-neon text-white hover:text-neon'
                        }`}
                      >
                        Choose Plan
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Athletic Male Bodybuilder/Athlete with Dumbbells & Neon Orbit Graphic */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="relative w-full max-w-[340px] h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-[#333e40] bg-[#191D20] group">
              <img
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80"
                alt="FitTrack Pro Muscular Male Athlete"
                className="w-full h-full object-cover object-top filter contrast-[1.1] brightness-[0.95] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#191D20] via-transparent to-black/20" />

              {/* Neon Glow & Orbit Rings */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-neon/50 pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-44 h-44 rounded-full border border-neon/40 pointer-events-none" />

              {/* Floating Performance Badge */}
              <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-[#111613]/90 backdrop-blur-md border border-neon/30 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#AEB5B2] block">Performance Goal</span>
                  <span className="text-xs font-black text-white uppercase tracking-wider">Hypertrophy & Strength</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center text-black font-black text-xs">
                  PRO
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. MEMBER TESTIMONIALS (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="py-24 bg-[#111613] border-y border-[#333e40]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
                MEMBER TESTIMONIALS
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
                REAL RESULTS, REAL PEOPLE
              </h2>
            </div>
            {/* Slider Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTestimonialIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-[#22292A] border border-[#333e40] flex items-center justify-center text-white hover:border-neon hover:text-neon transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTestimonialIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full bg-[#22292A] border border-[#333e40] flex items-center justify-center text-white hover:border-neon hover:text-neon transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testi, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-[#22292A] border transition-all duration-300 flex flex-col justify-between ${
                  idx === testimonialIdx ? 'border-neon shadow-neon-glow' : 'border-[#333e40]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1 text-neon mb-3">
                    {[...Array(5)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-3.5 h-3.5 fill-neon text-neon" />
                    ))}
                  </div>
                  <p className="text-xs text-[#AEB5B2] italic leading-relaxed">
                    "{testi.quote}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#333e40] flex items-center gap-3">
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
      {/* 7. FINAL CALL TO ACTION (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="relative py-28 overflow-hidden bg-[#191D20]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Gym Culture"
            className="w-full h-full object-cover filter brightness-[0.16]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191D20] via-[#191D20]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              START YOUR FITNESS JOURNEY TODAY
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB5B2] leading-relaxed">
              Join FitTrack Pro and get access to expert trainers, modern facilities and programs designed for real results.
            </p>
          </div>

          <Link to="/register" className="shrink-0">
            <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-sm uppercase tracking-wider px-9 py-4 rounded-full shadow-neon-glow flex items-center gap-2 transition-all hover:scale-105">
              Join Now
              <ArrowRight className="w-4 h-4 stroke-[2.8]" />
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
