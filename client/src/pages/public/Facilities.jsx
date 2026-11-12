import React from 'react';
import { ShieldCheck, Dumbbell, Activity, Flame, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

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
    <div className="bg-gym-bg text-gym-text">
      {/* 1. HERO HEADER */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-gym-border">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1920&q=80"
            alt="FitTrack Pro Facilities"
            className="w-full h-full object-cover filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-4">15,000 Sq. Ft Sanctuary</Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gym-text">
            Engineered For Pure Performance
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gym-muted max-w-2xl mx-auto leading-relaxed">
            Every piece of iron, machine, and recovery suite has been selected with zero compromises on quality, safety, and hygiene.
          </p>
        </div>
      </section>

      {/* 2. FACILITY ZONES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilityZones.map((zone, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden bg-gym-surface border border-gym-border hover:border-gym-primary/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={zone.image}
                  alt={zone.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gym-surface via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge variant="primary">{zone.category}</Badge>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gym-text group-hover:text-gym-primary transition-colors">
                    {zone.title}
                  </h3>
                  <p className="mt-2 text-xs text-gym-muted leading-relaxed">
                    {zone.desc}
                  </p>

                  <div className="mt-6 space-y-2 border-t border-gym-border pt-4">
                    {zone.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2.5 text-xs text-gym-text">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gym-primary shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/register">
            <Button size="lg" variant="primary" icon={ArrowRight}>
              Schedule Your Free Facility Tour & Workout
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
