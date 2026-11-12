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
  Clock,
  MapPin,
  Star,
  Activity,
  HeartPulse,
  Trophy,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    // Fetch live plans from Atlas
    api.get('/plans')
      .then((res) => {
        if (res.data.success) setPlans(res.data.data.slice(0, 3));
      })
      .catch(() => {});

    // Fetch live trainers from Atlas
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
      desc: 'Pay online via Bank Transfer, JazzCash, Easypaisa, or settle cash at reception.',
    },
    {
      icon: Clock,
      title: '24/7 Extended Facility Access',
      desc: 'Workout on your own schedule with round-the-clock secure athlete turnstiles.',
    },
    {
      icon: Trophy,
      title: 'Periodized Training Blocks',
      desc: 'Custom exercise programming customized to hypertrophy, strength, or fat loss.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Zeeshan Haider',
      role: 'Member since 2024',
      quote: 'FitTrack Pro transformed how I train. The ability to view my assigned workout plan directly on my phone and record progress with verified bank transfers has made fitness frictionless.',
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
    <div className="bg-gym-bg text-gym-text">
      {/* ======================================================== */}
      {/* 1. HERO SECTION WITH RICH GYM PHOTOGRAPHY */}
      {/* ======================================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-gym-border">
        {/* Background Photo with Cinematic Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80"
            alt="FitTrack Pro Elite Gym Floor"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15]"
          />
          {/* Subtle brand glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gym-bg/90 via-transparent to-gym-bg/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gym-primary/10 border border-gym-primary/30 text-gym-primary text-xs sm:text-sm font-semibold uppercase tracking-widest mb-8 backdrop-blur-md animate-pulse">
            <Sparkles className="w-4 h-4" />
            The Premier Strength & Athletic Conditioning Club
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight uppercase text-gym-text max-w-5xl mx-auto leading-[1.05]">
            Transform Your Body. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-primary via-emerald-300 to-teal-400">
              Elevate Your Life.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-gym-muted max-w-3xl mx-auto font-normal leading-relaxed">
            FitTrack Pro unites heavy iron, international certified coaches, intelligent turnstile access, and digital biometric tracking into one modern fitness sanctuary.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" icon={ArrowRight} className="w-full shadow-lg shadow-gym-primary/20 hover:shadow-gym-primary/40 text-base py-4 px-8 font-bold">
                Join Now – Start Training
              </Button>
            </Link>
            <Link to="/plans" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full text-base py-4 px-8 border-gym-border/80 hover:border-gym-primary">
                Explore Membership Plans
              </Button>
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="mt-14 pt-8 border-t border-gym-border/40 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-gym-primary shrink-0" />
              <span className="text-xs text-gym-muted leading-snug"><strong className="text-gym-text block">100% Verified</strong> Bank & Cash Dues</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-gym-primary shrink-0" />
              <span className="text-xs text-gym-muted leading-snug"><strong className="text-gym-text block">Certified Coaches</strong> NASM / ISSA</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-gym-primary shrink-0" />
              <span className="text-xs text-gym-muted leading-snug"><strong className="text-gym-text block">Daily Biometrics</strong> Weight & Waist Tracker</span>
            </div>
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-gym-primary shrink-0" />
              <span className="text-xs text-gym-muted leading-snug"><strong className="text-gym-text block">Hammer Strength</strong> & Eleiko Equipment</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. LIVE CLUB STATISTICS BAR */}
      {/* ======================================================== */}
      <section className="bg-gym-surface border-b border-gym-border py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <div key={idx} className="border-l-2 border-gym-primary/40 pl-6 py-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gym-text tracking-tight">{s.value}</span>
                  <span className="text-xs font-semibold uppercase text-gym-primary">{s.suffix}</span>
                </div>
                <div className="text-sm font-semibold text-gym-text mt-1">{s.label}</div>
                <div className="text-xs text-gym-muted mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ABOUT THE GYM – DUAL IMAGE & MANIFESTO */}
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

            {/* Floating Overlaid Feature Card */}
            <div className="absolute -bottom-8 -right-6 bg-gym-surface/95 backdrop-blur-md border border-gym-primary/30 p-5 rounded-xl shadow-2xl max-w-xs hidden sm:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gym-primary/20 flex items-center justify-center text-gym-primary">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gym-text">Built For Real Growth</div>
                  <div className="text-xs text-gym-primary font-medium">Science-Based Systems</div>
                </div>
              </div>
              <p className="text-xs text-gym-muted leading-relaxed">
                Every barbell, cable station, and dumbbell is calibrated to maximize biomechanical hypertrophy.
              </p>
            </div>
          </div>

          {/* Right: Narrative & Principles */}
          <div className="space-y-6">
            <Badge variant="primary" className="mb-2">Our Athletic Standard</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gym-text leading-tight uppercase">
              Not Just a Gym. <br />
              <span className="text-gym-primary">A High-Performance Sanctuary.</span>
            </h2>
            <p className="text-gym-muted text-base sm:text-lg leading-relaxed">
              Founded on the belief that fitness should be structured, measurable, and free of administrative chaos. We eliminated long front-desk queues, paper logbooks, and unconfirmed payments.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gym-text">Calibrated Commercial Grade Equipment</h4>
                  <p className="text-xs text-gym-muted mt-0.5">High-tensile Olympic barbells, competition bumper plates, and biomechanically aligned pin-loaded machines.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gym-text">Zero Unverified Dues Manipulation</h4>
                  <p className="text-xs text-gym-muted mt-0.5">Every rupee transferred or paid in cash generates an immutable digital receipt with full audit trail.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gym-text">Individualized Coaching Portals</h4>
                  <p className="text-xs text-gym-muted mt-0.5">Personalized routines prescribed by certified coaches, complete with exact sets, reps, and rest periods.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/about">
                <Button variant="secondary" icon={ChevronRight}>
                  Learn More About Our Facility
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WORLD-CLASS FACILITIES WITH IMAGE CARDS */}
      {/* ======================================================== */}
      <section className="py-20 bg-gym-surface border-y border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-3">Architected For Athletes</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gym-text uppercase tracking-tight">
              World-Class Facilities
            </h2>
            <p className="mt-4 text-gym-muted text-base sm:text-lg">
              Explore our meticulously curated training zones designed to push you beyond previous plateaus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((f, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden bg-gym-bg border border-gym-border hover:border-gym-primary/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={f.image}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary">{f.badge}</Badge>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gym-text group-hover:text-gym-primary transition-colors">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-xs text-gym-muted leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/facilities">
              <Button variant="secondary" icon={ArrowRight}>
                View Full Equipment Catalog & Amenities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. MEMBERSHIP TIERS (DYNAMIC ATLAS DATA) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-3">Transparent Investment</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gym-text uppercase tracking-tight">
            Membership Plans
          </h2>
          <p className="mt-4 text-gym-muted text-base sm:text-lg">
            No hidden registration fees. Digital turnstile access, locker amenities, and progress tracking included.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isStandard = plan.name.toLowerCase() === 'standard';
            return (
              <div
                key={plan._id}
                className={`rounded-2xl p-8 flex flex-col justify-between border transition-all duration-300 relative ${
                  isStandard
                    ? 'bg-gradient-to-b from-gym-surfaceLight to-gym-surface border-gym-primary shadow-xl shadow-gym-primary/10'
                    : 'bg-gym-surface border-gym-border hover:border-gym-primary/40'
                }`}
              >
                {isStandard && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gym-primary text-black font-extrabold text-xs uppercase px-4 py-1 rounded-full shadow-md">
                    Most Popular Choice
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
                    <span className="text-4xl font-black text-gym-text">Rs. {plan.price?.toLocaleString()}</span>
                    <span className="text-xs text-gym-muted ml-2">/ billing period</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features?.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-gym-primary shrink-0" />
                        <span className="text-xs text-gym-text">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to={`/register?planId=${plan._id}`}>
                  <Button
                    variant={isStandard ? 'primary' : 'secondary'}
                    className="w-full font-bold"
                    icon={ArrowRight}
                  >
                    Select {plan.name} Plan
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CERTIFIED COACHING STAFF (DYNAMIC ATLAS DATA) */}
      {/* ======================================================== */}
      <section className="py-24 bg-gym-surface border-y border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-3">Master Instructors</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gym-text uppercase tracking-tight">
              Elite Coaching Team
            </h2>
            <p className="mt-4 text-gym-muted text-base sm:text-lg">
              Every trainer on our floor is internationally accredited and brings years of competitive bodybuilding, powerlifting, or functional conditioning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((t, idx) => {
              const defaultImages = [
                'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80',
              ];
              const trainerPhoto = t.profileImage || defaultImages[idx % defaultImages.length];

              return (
                <div
                  key={t._id}
                  className="rounded-2xl overflow-hidden bg-gym-bg border border-gym-border hover:border-gym-primary/50 transition-all duration-300 group"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={trainerPhoto}
                      alt={t.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <Badge variant="primary">{t.specialization || 'Head Coach'}</Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gym-text group-hover:text-gym-primary transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-gym-muted mt-1">Certified Fitness Specialist</p>

                    <div className="mt-4 pt-4 border-t border-gym-border flex items-center justify-between text-xs">
                      <span className="text-gym-muted">Assigned Trainees</span>
                      <span className="text-gym-primary font-bold">Open for Registration</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/trainers">
              <Button variant="secondary" icon={ArrowRight}>
                View All Trainer Bios & Specializations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. WHY CHOOSE US (6-PILLAR GRID) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-3">The FitTrack Edge</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gym-text uppercase tracking-tight">
            Why Elite Athletes Train With Us
          </h2>
          <p className="mt-4 text-gym-muted text-base sm:text-lg">
            Engineered from the ground up for serious progress, zero friction, and accountable results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((w, idx) => {
            const Icon = w.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-gym-surface border border-gym-border hover:border-gym-primary/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary mb-6 group-hover:bg-gym-primary group-hover:text-black transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gym-text group-hover:text-gym-primary transition-colors">
                  {w.title}
                </h3>
                <p className="mt-2 text-xs text-gym-muted leading-relaxed">
                  {w.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. ATHLETE TESTIMONIALS & SUCCESS STORIES */}
      {/* ======================================================== */}
      <section className="py-24 bg-gym-surface border-y border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-3">Real Stories. Real Metrics.</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gym-text uppercase tracking-tight">
              Member Testimonials
            </h2>
            <p className="mt-4 text-gym-muted text-base sm:text-lg">
              Hear directly from the athletes who make FitTrack Pro their daily discipline ground.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-gym-bg border border-gym-border hover:border-gym-primary/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-emerald-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emerald-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gym-text/90 italic leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gym-border flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border border-gym-primary/40 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gym-text">{t.name}</h4>
                    <p className="text-[11px] text-gym-muted">{t.role}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-gym-primary bg-gym-primary/10 px-2 py-0.5 rounded">
                      {t.achievement}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FINAL HIGH-IMPACT CALL TO ACTION */}
      {/* ======================================================== */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1920&q=80"
            alt="FitTrack Gym Call to Action"
            className="w-full h-full object-cover filter brightness-[0.22]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gym-bg via-gym-bg/80 to-gym-bg" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-4">No Commitments. Real Discipline.</Badge>
          <h2 className="text-4xl sm:text-6xl font-black uppercase text-gym-text tracking-tight">
            Ready to Redefine Your Strength?
          </h2>
          <p className="mt-6 text-base sm:text-xl text-gym-muted max-w-2xl mx-auto leading-relaxed">
            Step onto the floor today. Pick your subscription, upload your payment reference or pay cash at the desk, and unlock your personalized training portal.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight} className="font-bold text-base px-10 py-4 shadow-xl shadow-gym-primary/25">
                Register New Membership
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="text-base px-10 py-4">
                Schedule a Gym Tour
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
