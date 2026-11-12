import React, { useEffect, useState } from 'react';
import { Award, Mail, Phone, Calendar, Dumbbell, ShieldCheck, Star, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trainers')
      .then((res) => {
        if (res.data.success) {
          setTrainers(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const defaultTrainerImages = [
    'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
  ];

  return (
    <div className="bg-[#111413] text-white overflow-hidden">
      {/* 1. HERO BANNER */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-[#243426]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Certified Coaching Staff"
            className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111413] via-[#111413]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172017] border border-neon/30 text-neon text-xs font-bold uppercase tracking-widest">
            <span className="font-black text-neon">++</span>
            <span>Master Fitness Specialists</span>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-[0.9]">
            Our Certified <br />
            <span className="text-neon text-neon-glow">Coaching Staff.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Every coach at FitTrack Pro holds international certifications and is dedicated to prescribing personalized, biomechanically sound workout routines.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-neon via-emerald-400 to-transparent z-20" />
      </section>

      {/* 2. TRAINER ROSTER (DYNAMIC ATLAS DATA) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner text="Loading coach profiles from Atlas..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((tr, idx) => (
              <div
                key={tr._id}
                className="group rounded-3xl overflow-hidden bg-[#172017] border border-[#243426] hover:border-neon/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-80 overflow-hidden bg-[#111413]">
                    <img
                      src={tr.avatar || defaultTrainerImages[idx % defaultTrainerImages.length]}
                      alt={tr.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172017] via-transparent to-transparent opacity-90" />
                    <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-neon/15 backdrop-blur-md text-[10px] font-bold text-neon border border-neon/30 uppercase tracking-wider">
                      {tr.specialization || 'Master Strength Coach'}
                    </span>
                  </div>

                  <div className="p-7">
                    <h3 className="font-display text-2xl font-black uppercase text-white group-hover:text-neon transition-colors">
                      {tr.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {tr.bio || 'Specialized in compound movement mechanics, hypertrophy protocols, and athletic power development.'}
                    </p>

                    <div className="mt-6 pt-5 border-t border-[#243426] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-gray-400">Coaching Experience</span>
                        <span className="font-display font-bold uppercase">{tr.experienceYears || '5+'} Years</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-gray-400">Active Roster</span>
                        <span className="font-display font-bold uppercase text-neon">{tr.activeClientsCount || '15+'} Athletes</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-gray-400">Accreditations</span>
                        <span className="font-display font-bold uppercase text-white">NASM, ISSA, CSCS</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-7 pb-7">
                  <Link to="/register">
                    <button className="w-full py-3 px-4 rounded-full bg-[#111413] border border-[#243426] hover:border-neon font-display text-xs font-black uppercase tracking-wider text-white hover:text-neon transition-all flex items-center justify-center gap-1.5">
                      Request Coach Assignment
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. COACHING PROTOCOL */}
      <section className="py-24 bg-[#172017]/40 border-t border-[#243426]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-neon">
                The FitTrack Protocol
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
                How Our Coaching System Operates
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                When you enroll at FitTrack Pro, you aren't handed a generic template. Your coach conducts a movement screen, builds custom split programming in your athlete dashboard, and reviews weekly measurements.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-neon/10 text-neon mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-black uppercase text-white">Movement Screening & Biometrics</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Assessing joint mobility, squat depth, and initial body metrics before prescribing load.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-neon/10 text-neon mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-black uppercase text-white">In-App Workout Plan Configuration</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Custom exercises, target sets, reps, and rest intervals viewable on your mobile terminal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-neon/10 text-neon mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-black uppercase text-white">Bi-Weekly Progressive Overload Audit</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Systematic adjustments to volume and intensity to prevent plateaus and optimize recovery.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-[#243426] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
                alt="Coaching in action"
                className="w-full h-[460px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
