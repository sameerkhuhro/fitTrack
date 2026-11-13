import React from 'react';
import { Shield, Target, Users, Award, CheckCircle2, Dumbbell, Sparkles, Trophy, ArrowRight, ArrowUpRight } from 'lucide-react';
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

  return (
    <div className="bg-[#191D20] text-white overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO BANNER WITH BATTLE ROPES ATHLETE (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-24 overflow-hidden border-b border-[#333e40] bg-[#111613]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2000&auto=format&fit=crop"
            alt="About FitTrack Pro Athletes"
            className="w-full h-full object-cover object-[70%_center] filter brightness-[0.80] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111613] via-[#111613]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191D20] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none">
              ABOUT US
            </h1>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#AEB5B2] uppercase tracking-wider">
              <Link to="/" className="hover:text-neon transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-neon">About Us</span>
            </div>
            <p className="text-sm sm:text-base text-[#AEB5B2] pt-2 leading-relaxed">
              We are dedicated to building a high-performance training culture where science, calibrated iron, and personalized mentorship converge.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. OUR STORY (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Realistic Gym Interior Photography */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#333e40] shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop"
                alt="FitTrack Pro Gym Floor"
                className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#191D20] via-transparent to-transparent opacity-70" />
            </div>
          </div>

          {/* Right: Story Content & 3 Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neon">
              <span>OUR STORY</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              BUILDING A STRONGER, HEALTHIER COMMUNITY
            </h2>

            <p className="text-sm sm:text-base text-[#AEB5B2] leading-relaxed">
              FitTrack Pro was created with a simple mission — to make fitness accessible, effective and inspiring for everyone. Whether you are stepping into a gym for the first time or training for competition, our world-class facilities and expert coaches are here to support your journey.
            </p>

            <p className="text-sm text-[#AEB5B2] leading-relaxed">
              We eliminated broken equipment, crowded waiting times, and unguided workouts by engineering an integrated ecosystem combining certified master trainers with automated progress metrics.
            </p>

            {/* 3 Statistics Row matching blueprint */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#333e40]">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-neon mb-1">
                  <Users className="w-4 h-4" />
                  <span className="font-display text-2xl sm:text-3xl font-black text-white">1,200+</span>
                </div>
                <span className="text-[11px] text-[#AEB5B2] font-semibold">Trusted by Members</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-neon mb-1">
                  <Dumbbell className="w-4 h-4 -rotate-45" />
                  <span className="font-display text-2xl sm:text-3xl font-black text-white">12+</span>
                </div>
                <span className="text-[11px] text-[#AEB5B2] font-semibold">Professional Trainers</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-neon mb-1">
                  <Trophy className="w-4 h-4" />
                  <span className="font-display text-2xl sm:text-3xl font-black text-white">15,000+</span>
                </div>
                <span className="text-[11px] text-[#AEB5B2] font-semibold">Modern Facilities (Sq. Ft)</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/facilities">
                <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs uppercase tracking-wider px-7 py-3.5 rounded-full shadow-neon-glow flex items-center gap-2 transition-all">
                  Explore Facilities
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. MISSION AND VISION */}
      {/* ======================================================== */}
      <section className="py-20 bg-[#111613] border-y border-[#333e40]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#22292A] border border-[#333e40] relative overflow-hidden group hover:border-neon transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-black uppercase text-white mb-3">
                Our Mission
              </h3>
              <p className="text-sm text-[#AEB5B2] leading-relaxed">
                To empower individuals of all athletic backgrounds to unlock their fullest physical and mental potential through evidence-based training protocols, competition-grade equipment, and uncompromised coaching standards.
              </p>
            </div>

            {/* Vision Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#22292A] border border-[#333e40] relative overflow-hidden group hover:border-neon transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-black uppercase text-white mb-3">
                Our Vision
              </h3>
              <p className="text-sm text-[#AEB5B2] leading-relaxed">
                To redefine the gym landscape by establishing the premier standard for athletic facilities — where every workout is tracked with digital precision, every member receives individualized attention, and healthy lifestyles flourish permanently.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHY CHOOSE FITTRACK PRO PILLARS */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
            THE FITTRACK STANDARD
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            WHY TRAIN AT FITTRACK PRO
          </h2>
          <p className="text-xs sm:text-sm text-[#AEB5B2] mt-3">
            Built on science, heavy calibrated iron, and digital transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#22292A] border border-[#333e40] hover:border-neon/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-black uppercase text-white mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs text-[#AEB5B2] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CALL TO ACTION */}
      {/* ======================================================== */}
      <section className="relative py-24 bg-[#111613] border-t border-[#333e40]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            READY TO JOIN OUR COMMUNITY?
          </h2>
          <p className="text-xs sm:text-sm text-[#AEB5B2] max-w-xl mx-auto">
            Choose your membership tier today and begin training in our world-class facilities with certified coaching staff.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-neon-glow flex items-center gap-2 transition-all">
                Join FitTrack Pro Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/plans">
              <button className="border border-white/30 hover:border-neon hover:text-neon text-white font-display font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full transition-all bg-[#22292A]">
                View Membership Plans
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
