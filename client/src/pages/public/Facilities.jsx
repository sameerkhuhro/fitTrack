import React from 'react';
import { ShieldCheck, Dumbbell, Activity, Flame, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Facilities() {
  const facilityZones = [
    {
      title: 'Olympic Lifting & Power Cage Bay',
      category: 'Heavy Free Weights',
      desc: 'Equipped with 8 Eleiko power cages, competition lifting platforms, calibrated bumper plates, and Texas power bars.',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
      specs: ['8 Dedicated Power Cages', 'Calibrated Steel & Bumper Plates', 'Chalk Stations & Lifting Platforms'],
    },
    {
      title: 'Biomechanic Hypertrophy Floor',
      category: 'Pin & Plate Loaded',
      desc: 'Full lineup of Hammer Strength and Prime Fitness iso-lateral machines designed along convergent and divergent movement arcs.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
      specs: ['Iso-Lateral Chest & Shoulder Presses', 'Dual Lat Pulldowns & Low Rows', 'Hack Squats & 45-Degree Leg Presses'],
    },
    {
      title: 'Cardiovascular & Endurance Studio',
      category: 'Aerobic Conditioning',
      desc: 'Assault air bikes, Concept2 rowers and SkiErgs, curved non-motorized treadmills, and commercial stairmasters.',
      image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1000&q=80',
      specs: ['Woodway Curved Treadmills', 'Concept2 RowErg & SkiErg Suites', 'Real-time Heart Rate Telemetry'],
    },
    {
      title: 'Functional Turf & Calisthenics Track',
      category: 'Movement & Speed',
      desc: '30-meter high-density sled turf track with heavy prowlers, battle ropes, plyometric boxes, and gymnastics rings.',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1000&q=80',
      specs: ['30m Sprint & Prowler Turf', 'Competition Kettlebells (8kg - 48kg)', 'Wall-Mounted Pull-Up Rigs'],
    },
    {
      title: 'Hydro-Therapy, Sauna & Steam Lab',
      category: 'Muscle Recovery',
      desc: 'Finnish cedar dry heat sauna and eucalyptus steam rooms configured to accelerate lactic acid clearance and muscle repair.',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
      specs: ['Traditional Finnish Dry Sauna (90°C)', 'Eucalyptus Infused Steam Bath', 'Cold Plunge Contrast Showers'],
    },
    {
      title: 'Luxury Locker Suites & Grooming',
      category: 'Amenities',
      desc: 'Keyless biometric lockers, rain showers, blow-dry stations, and complimentary clean towel service for all active members.',
      image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1000&q=80',
      specs: ['Smart Electronic Keyless Lockers', 'Private Rain Showers', 'Complimentary Fresh Towel Bar'],
    },
  ];

  return (
    <div className="bg-[#111413] text-white overflow-hidden">
      {/* 1. HERO HEADER */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-[#243426]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=2000&auto=format&fit=crop"
            alt="FitTrack Pro Facilities"
            className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111413] via-[#111413]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172017] border border-neon/30 text-neon text-xs font-bold uppercase tracking-widest">
            <span className="font-black text-neon">++</span>
            <span>Engineered Training Spaces</span>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-[0.9]">
            Architected for <br />
            <span className="text-neon text-neon-glow">Maximum Power.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Spanning 15,000 square feet, FitTrack Pro is segmented into dedicated training arenas fitted with Eleiko, Hammer Strength, and Concept2 fleets.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-neon via-emerald-400 to-transparent z-20" />
      </section>

      {/* 2. SIX FACILITY ZONES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilityZones.map((zone, idx) => (
            <div
              key={idx}
              className="group rounded-3xl overflow-hidden bg-[#172017] border border-[#243426] hover:border-neon/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={zone.image}
                    alt={zone.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172017] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-bold text-neon border border-neon/30 uppercase tracking-wider">
                    {zone.category}
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="font-display text-xl font-black uppercase text-white group-hover:text-neon transition-colors">
                    {zone.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">{zone.desc}</p>

                  <div className="mt-6 pt-5 border-t border-[#243426] space-y-2">
                    <span className="font-display text-[11px] font-bold uppercase tracking-wider text-neon block">
                      Equipment Specifications:
                    </span>
                    {zone.specs.map((sp, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-7 pb-7">
                <Link to="/plans">
                  <button className="w-full py-3 px-4 rounded-full bg-[#111413] border border-[#243426] hover:border-neon font-display text-xs font-black uppercase tracking-wider text-white hover:text-neon transition-all flex items-center justify-center gap-1.5">
                    Access via Membership
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CTA */}
      <section className="py-20 bg-[#172017]/40 border-t border-[#243426]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            Experience the Arena in Person
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Book a complimentary club walkthrough. Our master coaches will guide you through our training zones and assess your goals.
          </p>
          <div className="pt-2">
            <Link to="/contact">
              <button className="bg-neon hover:bg-neon-hover text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-full inline-flex items-center gap-2 shadow-neon-glow transition-all">
                Book a Private Facility Tour
                <ArrowUpRight className="w-4 h-4 stroke-[2.8]" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
