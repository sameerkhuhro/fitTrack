import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Phone, Mail, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gym-bg border-t border-gym-border/80 text-gray-400 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-black font-black font-display shadow-lg shadow-emerald-500/20">
                <Dumbbell className="w-5 h-5 -rotate-45 text-black stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black uppercase tracking-tight text-white leading-none">
                  FitTrack <span className="text-gym-primary font-bold">Pro</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-gym-muted">
                  Fitness Club
                </span>
              </div>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed">
              Manage Your Gym. Empower Your Fitness. State-of-the-art strength arenas, certified personal coaches, automated turnstiles, and comprehensive digital progress tracking.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>PBL University Edition & Enterprise Stack</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-white mb-4">
              Club Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-gym-primary transition-colors flex items-center justify-between">
                  <span>Home</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-600" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gym-primary transition-colors flex items-center justify-between">
                  <span>About Our Club</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-600" />
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-gym-primary transition-colors flex items-center justify-between">
                  <span>Training Facilities</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-600" />
                </Link>
              </li>
              <li>
                <Link to="/trainers" className="hover:text-gym-primary transition-colors flex items-center justify-between">
                  <span>Coaching Staff</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-600" />
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-gym-primary transition-colors flex items-center justify-between">
                  <span>Membership Tiers</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-600" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gym-primary transition-colors flex items-center justify-between">
                  <span>Contact Front Desk</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-white mb-4">
              Hours of Operation
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gym-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Monday – Saturday</span>
                  <span className="text-gray-400">06:00 AM – 11:30 PM</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gym-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Sunday</span>
                  <span className="text-gray-400">08:00 AM – 08:00 PM</span>
                </div>
              </li>
              <li className="text-[11px] text-emerald-400 font-semibold pt-1">
                * Turnstiles operate on automated holiday schedules.
              </li>
            </ul>
          </div>

          {/* Direct Coordinates */}
          <div>
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-white mb-4">
              Club Location
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gym-primary shrink-0 mt-0.5" />
                <span className="text-gray-400">Plot 44-C, Sector 5, Phase 6, DHA, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gym-primary shrink-0" />
                <span className="text-gray-400">+92 (21) 3584-9021</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gym-primary shrink-0" />
                <span className="text-gray-400">info@fittrackpro.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-gym-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} FitTrack Pro Fitness Club. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <Link to="/login" className="hover:text-gym-primary transition-colors">Staff Portal</Link>
            <span>•</span>
            <Link to="/register" className="hover:text-gym-primary transition-colors">Athlete Enrollment</Link>
            <span>•</span>
            <span className="text-emerald-400">Production Build v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
