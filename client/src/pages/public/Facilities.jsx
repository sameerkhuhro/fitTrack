import React from 'react';
import { Dumbbell, Zap, Flame, HeartPulse, CheckCircle2, ArrowRight, Trophy, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Facilities() {
  const mainZones = [
    {
      id: 'strength',
      title: 'Strength Training',
      tagline: 'Build Muscle and Power',
      desc: 'Equipped with 8 dedicated Eleiko power cages, competition platforms, Texas power bars, and custom dumbbells up to 70 kg.',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
      icon: Dumbbell,
      specs: ['8 Dedicated Eleiko Power Cages', 'Calibrated Steel & Bumper Plates', 'Dual Pulley Functional Trainers', 'Custom Urethane Dumbbells to 70kg'],
    },
    {
      id: 'cardio',
      title: 'Cardio Zone',
      tagline: 'Improve Stamina & Heart Health',
      desc: 'High-end cardiovascular suite featuring non-motorized Woodway curved runners, Concept2 RowErgs and SkiErgs, and real-time heart telemetry.',
      image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1000&q=80',
      icon: Zap,
      specs: ['Woodway Curved Treadmills', 'Concept2 RowErg & SkiErg Units', 'Assault AirBikes for HIIT', 'StairMaster 10G Steppers'],
    },
    {
      id: 'functional',
      title: 'Functional Training',
      tagline: 'Full-Body, Real-World Fitness',
      desc: '30-meter high-density turf track with competition prowler sleds, heavy battle ropes, Bulgarian bags, and plyometric jump boxes.',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1000&q=80',
      icon: Flame,
      specs: ['30m Sprint & Heavy Sled Turf', 'Cast-Iron Kettlebells (8kg to 48kg)', 'Wall-Mounted Rig & Gymnastic Rings', 'Medicine Balls & Slam Stations'],
    },
    {
      id: 'recovery',
      title: 'Recovery Zone',
      tagline: 'Relax and Recharge',
      desc: 'Finnish dry cedar sauna (90°C), eucalyptus-infused steam rooms, and contrast shower suites engineered to accelerate muscle repair.',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
      icon: HeartPulse,
      specs: ['Finnish Dry Heat Cedar Sauna', 'Eucalyptus Hydro-Steam Bath', 'Contrast Hydrotherapy Showers', 'Post-Workout Mobility Lounge'],
    },
  ];

  return (
    <div className="bg-[#191D20] text-white overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO BANNER (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-24 overflow-hidden border-b border-[#333e40] bg-[#111613]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Pro Facilities Banner"
            className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111613] via-[#111613]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191D20] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none">
              OUR FACILITIES
            </h1>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#AEB5B2] uppercase tracking-wider">
              <Link to="/" className="hover:text-neon transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-neon">Facilities</span>
            </div>
            <p className="text-sm sm:text-base text-[#AEB5B2] pt-2 leading-relaxed">
              Explore 15,000 square feet of competition-grade strength arenas, cardiovascular studios, functional turf, and luxury recovery amenities.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. FOUR FEATURED FACILITY CARDS (FROM BLUEPRINT) */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
            ENGINEERED SPACES
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            TRAIN WITH THE BEST EQUIPMENT
          </h2>
          <p className="text-xs sm:text-sm text-[#AEB5B2] mt-3">
            Each training zone is calibrated for maximal biomechanical progression, safety, and athletic conditioning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mainZones.map((zone) => {
            const Icon = zone.icon;
            return (
              <div
                key={zone.id}
                className="group rounded-3xl overflow-hidden bg-[#22292A] border border-[#333e40] hover:border-neon transition-all duration-300 flex flex-col shadow-xl"
              >
                {/* Photo with Dark Gradient */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={zone.image}
                    alt={zone.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#22292A] via-[#22292A]/40 to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-neon/30 text-neon text-xs font-bold uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{zone.tagline}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white group-hover:text-neon transition-colors">
                      {zone.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#AEB5B2] mt-2.5 leading-relaxed">
                      {zone.desc}
                    </p>

                    {/* Specs Checklist */}
                    <div className="mt-6 pt-5 border-t border-[#333e40] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {zone.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-xs text-[#AEB5B2]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 pt-4 border-t border-[#333e40] flex items-center justify-between">
                    <span className="text-xs font-mono text-neon font-semibold">Active Member Access Included</span>
                    <Link to="/register">
                      <button className="bg-[#191D20] hover:bg-neon hover:text-black text-white px-4 py-2 rounded-full border border-[#333e40] hover:border-neon text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all">
                        Train Here
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FACILITY AMENITIES & HOURS */}
      {/* ======================================================== */}
      <section className="py-20 bg-[#111613] border-t border-[#333e40]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl bg-[#22292A] border border-[#333e40]">
              <Clock className="w-6 h-6 text-neon mb-3" />
              <h4 className="font-display text-lg font-black uppercase text-white mb-2">
                Hours of Operation
              </h4>
              <p className="text-xs text-[#AEB5B2] leading-relaxed">
                Monday – Saturday: 06:00 AM – 11:30 PM<br />
                Sunday: 08:00 AM – 08:00 PM<br />
                Turnstiles open 365 days a year.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#22292A] border border-[#333e40]">
              <ShieldCheck className="w-6 h-6 text-neon mb-3" />
              <h4 className="font-display text-lg font-black uppercase text-white mb-2">
                Automated Turnstiles
              </h4>
              <p className="text-xs text-[#AEB5B2] leading-relaxed">
                Instant contactless QR and biometric entry. Real-time subscription validity checks eliminate front-desk delays.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#22292A] border border-[#333e40]">
              <Trophy className="w-6 h-6 text-neon mb-3" />
              <h4 className="font-display text-lg font-black uppercase text-white mb-2">
                Hygiene & Towel Service
              </h4>
              <p className="text-xs text-[#AEB5B2] leading-relaxed">
                Clean microfiber workout towels, sanitized stations at every cage, and touchless bottle refill points throughout.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SCHEDULE TOUR CTA */}
      {/* ======================================================== */}
      <section className="py-24 bg-[#191D20] border-t border-[#333e40]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            WANT TO EXPERIENCE THE FACILITY IN PERSON?
          </h2>
          <p className="text-xs sm:text-sm text-[#AEB5B2] max-w-xl mx-auto">
            Book a private walk-through with one of our master strength coaches and test our equipment before enrolling.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-neon-glow flex items-center gap-2 transition-all">
                Schedule a Club Tour
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
