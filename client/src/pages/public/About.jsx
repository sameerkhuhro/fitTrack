import React from 'react';
import { Shield, Target, Users, Award, HeartHandshake, CheckCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function About() {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">About FitTrack Pro</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gym-text">
          More Than a Gym. A Standard of Excellence.
        </h1>
        <p className="mt-4 text-gym-muted text-base sm:text-lg leading-relaxed">
          Established to combine elite training facilities with a disciplined, data-driven approach to physical culture and community well-being.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <Card className="p-8">
          <div className="p-3 w-12 h-12 rounded-xl bg-gym-primary/10 text-gym-primary border border-gym-primary/20 flex items-center justify-center mb-5">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gym-text mb-3">Our Core Mission</h3>
          <p className="text-sm text-gym-muted leading-relaxed">
            To provide an inspiring, spotless, and technologically empowered training sanctuary where athletes, lifters, and everyday fitness enthusiasts can push past mental barriers and achieve measurable, lasting transformations.
          </p>
        </Card>

        <Card className="p-8">
          <div className="p-3 w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gym-text mb-3">Our Training Philosophy</h3>
          <p className="text-sm text-gym-muted leading-relaxed">
            We reject fitness fads. We believe in progressive overload, compound functional movements, sustainable nutritional practices, and strict accountability guided by certified coaches and transparent progress tracking.
          </p>
        </Card>
      </div>

      {/* Key Gym Pillars */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gym-text text-center mb-10">What Sets Us Apart</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gym-surface border border-gym-border rounded-xl p-6">
            <h4 className="text-lg font-bold text-gym-primary mb-2">1. Industrial-Grade Bio-Mechanical Equipment</h4>
            <p className="text-xs sm:text-sm text-gym-muted leading-relaxed">
              Every cable angle, barbell tolerance, and dumbbell grip is selected to protect joint integrity and maximize muscular recruitment.
            </p>
          </div>

          <div className="bg-gym-surface border border-gym-border rounded-xl p-6">
            <h4 className="text-lg font-bold text-gym-primary mb-2">2. Transparent Subscription Architecture</h4>
            <p className="text-xs sm:text-sm text-gym-muted leading-relaxed">
              No hidden maintenance fees or surprise charges. Support for bank transfers, mobile wallets (JazzCash/Easypaisa), and in-person cash receipts with verifiable digital invoices.
            </p>
          </div>

          <div className="bg-gym-surface border border-gym-border rounded-xl p-6">
            <h4 className="text-lg font-bold text-gym-primary mb-2">3. Integrated Digital Athlete Portal</h4>
            <p className="text-xs sm:text-sm text-gym-muted leading-relaxed">
              Members and coaches stay aligned in real-time. Log body measurements, check upcoming workout calendars, view daily check-in attendance streaks, and stay notified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
