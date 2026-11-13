import React, { useEffect, useState } from 'react';
import { Dumbbell, ShieldCheck, Star, Award, Instagram, Facebook, Linkedin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Blueprint Default Expert Trainers
  const defaultTrainers = [
    {
      _id: 'tr-1',
      name: 'Ahmed Raza',
      specialization: 'Strength & Conditioning',
      experienceYears: '6+ Years Experience',
      photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop',
      bio: 'Former national powerlifting competitor specializing in compound mechanics, linear periodization, and maximal strength development.',
    },
    {
      _id: 'tr-2',
      name: 'Sara Malik',
      specialization: 'Fitness & Weight Loss',
      experienceYears: '5+ Years Experience',
      photo: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop',
      bio: 'Certified clinical exercise physiologist and fat-loss specialist focusing on metabolic conditioning and lifestyle body recomposition.',
    },
    {
      _id: 'tr-3',
      name: 'Bilal Khan',
      specialization: 'Body Building',
      experienceYears: '8+ Years Experience',
      photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
      bio: 'Master hypertrophy coach with 8+ years coaching competitive bodybuilders on progressive volume accumulation and pose prep.',
    },
    {
      _id: 'tr-4',
      name: 'Ayesha Noor',
      specialization: 'Functional Training',
      experienceYears: '4+ Years Experience',
      photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      bio: 'CrossFit Level-2 certified coach specializing in agility, high-density kettlebell protocols, and mobility restoration.',
    },
  ];

  useEffect(() => {
    api.get('/trainers')
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          // Merge with default photos and details if backend trainers are present
          const merged = res.data.data.map((tr, idx) => ({
            ...tr,
            photo: tr.avatar || defaultTrainers[idx % defaultTrainers.length].photo,
            experienceYears: `${tr.experienceYears || (idx + 4)}+ Years Experience`,
            specialization: tr.specialization || defaultTrainers[idx % defaultTrainers.length].specialization,
          }));
          setTrainers(merged);
        } else {
          setTrainers(defaultTrainers);
        }
      })
      .catch(() => setTrainers(defaultTrainers))
      .finally(() => setLoading(false));
  }, []);

  const displayTrainers = trainers.length > 0 ? trainers : defaultTrainers;

  return (
    <div className="bg-[#191D20] text-white overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO BANNER (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-24 overflow-hidden border-b border-[#333e40] bg-[#111613]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Pro Expert Trainers"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.78] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111613] via-[#111613]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191D20] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none">
              OUR EXPERT TRAINERS
            </h1>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#AEB5B2] uppercase tracking-wider">
              <Link to="/" className="hover:text-neon transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-neon">Trainers</span>
            </div>
            <p className="text-sm sm:text-base text-[#AEB5B2] pt-2 leading-relaxed">
              Meet the professionals behind your progress. Certified master coaches dedicated to prescribing scientific, personalized training.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. TRAINER CARDS GRID (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
            MASTER COACHING STAFF
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            DEDICATED TO YOUR PROGRESS
          </h2>
          <p className="text-xs sm:text-sm text-[#AEB5B2] mt-3">
            Every member has the option to be assigned directly to one of our certified coaches for personalized workout logging and bi-weekly audits.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTrainers.map((tr, idx) => (
              <div
                key={tr._id || idx}
                className="group rounded-3xl overflow-hidden bg-[#22292A] border border-[#333e40] hover:border-neon transition-all duration-300 flex flex-col shadow-xl"
              >
                {/* Photo with Gradient Mask */}
                <div className="relative h-80 overflow-hidden bg-[#111613]">
                  <img
                    src={tr.photo || tr.avatar}
                    alt={tr.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#22292A] via-[#22292A]/30 to-transparent" />
                </div>

                {/* Profile Information */}
                <div className="p-6 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="font-display text-xl font-black uppercase text-white group-hover:text-neon transition-colors">
                      {tr.name}
                    </h3>
                    <p className="text-xs font-bold text-neon uppercase tracking-wider mt-1">
                      {tr.specialization}
                    </p>
                    <span className="text-[11px] text-[#AEB5B2] font-semibold block mt-1">
                      {tr.experienceYears}
                    </span>
                    <p className="text-xs text-[#AEB5B2] mt-3 line-clamp-3 leading-relaxed text-left">
                      {tr.bio}
                    </p>
                  </div>

                  {/* Social Media Links matching blueprint */}
                  <div className="mt-5 pt-4 border-t border-[#333e40] flex items-center justify-center gap-3">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-[#191D20] border border-[#333e40] flex items-center justify-center text-gray-400 hover:text-black hover:bg-neon hover:border-neon transition-all"
                      aria-label={`${tr.name} Instagram`}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-[#191D20] border border-[#333e40] flex items-center justify-center text-gray-400 hover:text-black hover:bg-neon hover:border-neon transition-all"
                      aria-label={`${tr.name} Facebook`}
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-[#191D20] border border-[#333e40] flex items-center justify-center text-gray-400 hover:text-black hover:bg-neon hover:border-neon transition-all"
                      aria-label={`${tr.name} LinkedIn`}
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. COACHING PHILOSOPHY & REVIEWS */}
      {/* ======================================================== */}
      <section className="py-20 bg-[#111613] border-t border-[#333e40]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-[#22292A] border border-[#333e40]">
              <Award className="w-6 h-6 text-neon mb-3" />
              <h4 className="font-display text-lg font-black uppercase text-white mb-2">
                Internationally Certified
              </h4>
              <p className="text-xs text-[#AEB5B2] leading-relaxed">
                Our coaches hold NSCA-CSCS, ACE, and ISSA certifications, guaranteeing scientific biomechanics and progressive overload.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#22292A] border border-[#333e40]">
              <Dumbbell className="w-6 h-6 text-neon mb-3" />
              <h4 className="font-display text-lg font-black uppercase text-white mb-2">
                1-on-1 Assigned Oversight
              </h4>
              <p className="text-xs text-[#AEB5B2] leading-relaxed">
                Every member can be paired with an assigned coach in the mobile portal to receive weekly workout updates and guidance.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#22292A] border border-[#333e40]">
              <ShieldCheck className="w-6 h-6 text-neon mb-3" />
              <h4 className="font-display text-lg font-black uppercase text-white mb-2">
                Nutritional Periodization
              </h4>
              <p className="text-xs text-[#AEB5B2] leading-relaxed">
                Complement your training with custom macronutrient benchmarks and supplement advice aligned with your body composition goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CTA */}
      {/* ======================================================== */}
      <section className="py-24 bg-[#191D20] border-t border-[#333e40]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            READY TO TRAIN WITH A MASTER COACH?
          </h2>
          <p className="text-xs sm:text-sm text-[#AEB5B2] max-w-xl mx-auto">
            Enroll today in our Pro or Elite membership tier to receive dedicated 1-on-1 trainer guidance and digital progress monitoring.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-neon-glow flex items-center gap-2 transition-all">
                Enroll with a Coach
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/contact">
              <button className="border border-white/30 hover:border-neon hover:text-neon text-white font-display font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full transition-all bg-[#22292A]">
                Ask Coach a Question
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
