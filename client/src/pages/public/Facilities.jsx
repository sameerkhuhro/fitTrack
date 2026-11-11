import React from 'react';
import { Dumbbell, HeartPulse, Zap, ShieldAlert, Sparkles, Wind, Droplets, ShowerHead } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Facilities() {
  const facilityList = [
    {
      title: 'Heavy Strength & Free Weights Zone',
      icon: Dumbbell,
      desc: 'Featuring competition power cages, Olympic platforms, chalk stations, dumbbells ranging from 2.5 kg to 60 kg, and custom calibrated steel plates.',
    },
    {
      title: 'Advanced Cardio Deck',
      icon: HeartPulse,
      desc: 'Top-tier LifeFitness & Matrix treadmills, StairMasters, ski-ergs, rowing machines, and assault bikes equipped with integrated heart-rate telemetry.',
    },
    {
      title: 'Functional Turf & CrossFit Arena',
      icon: Zap,
      desc: '30-meter high-density sled push turf, battle ropes, plyometric boxes, kettlebell racks, and suspension rings for athletic agility and HIIT conditioning.',
    },
    {
      title: 'Steam Bath & Recovery Sauna',
      icon: Wind,
      desc: 'Promoting muscular relaxation, toxin flushing, and accelerated recovery after strenuous lifting sessions in our heated cedar-wood sauna.',
    },
    {
      title: 'Luxury Locker Rooms & Showers',
      icon: ShowerHead,
      desc: 'Spotless private showering cubicles, secure RFID pin lockers, high-velocity hair dryers, and grooming stations with complimentary bath essentials.',
    },
    {
      title: 'Hydration & Nutrition Bar',
      icon: Droplets,
      desc: 'Chilled reverse-osmosis electrolyte water stations, premium pre-workout scoops, whey isolate protein shakes, and healthy high-protein snacks.',
    },
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">World-Class Equipment</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gym-text">
          Gym Facilities Built for Peak Performance
        </h1>
        <p className="mt-4 text-gym-muted text-base sm:text-lg leading-relaxed">
          Over 10,000 square feet of meticulously maintained training floors, modern air purification systems, and competition-ready gear.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {facilityList.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} hoverEffect className="p-8">
              <div className="p-3.5 w-14 h-14 rounded-2xl bg-gym-primary/10 text-gym-primary border border-gym-primary/20 flex items-center justify-center mb-6">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gym-text mb-3">{item.title}</h3>
              <p className="text-sm text-gym-muted leading-relaxed">{item.desc}</p>
            </Card>
          );
        })}
      </div>

      {/* Safety & Hygiene Guarantee */}
      <div className="bg-gym-surface border border-gym-border rounded-xl p-8 max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-gym-text mb-2">Sanitization & Hygiene Standards</h3>
        <p className="text-sm text-gym-muted max-w-2xl mx-auto leading-relaxed">
          All equipment is disinfected multiple times daily. Antimicrobial wipes and hand sanitizers are positioned throughout the facility, and our hospital-grade HEPA ventilation cycles 100% fresh air every 12 minutes.
        </p>
      </div>
    </div>
  );
}

