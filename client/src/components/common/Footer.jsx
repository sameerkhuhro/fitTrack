import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gym-surface border-t border-gym-border text-gym-muted pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gym-primary/10 border border-gym-primary/30 flex items-center justify-center text-gym-primary">
                <Dumbbell className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-bold text-gym-text">
                FitTrack <span className="text-gym-primary">Pro</span>
              </span>
            </div>
            <p className="text-sm text-gym-muted leading-relaxed">
              Manage Your Gym. Empower Your Fitness. State-of-the-art strength zones, expert personal trainers, and comprehensive digital progress tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gym-text uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-gym-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gym-primary transition-colors">About the Gym</Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-gym-primary transition-colors">Membership Plans</Link>
              </li>
              <li>
                <Link to="/trainers" className="hover:text-gym-primary transition-colors">Certified Trainers</Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-gym-primary transition-colors">Gym Facilities</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gym-primary transition-colors">Contact & Support</Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-sm font-semibold text-gym-text uppercase tracking-wider mb-4">
              Operating Hours
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gym-primary" />
                <span>Monday – Friday: 06:00 AM – 11:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gym-primary" />
                <span>Saturday: 07:00 AM – 10:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gym-primary" />
                <span>Sunday: 08:00 AM – 08:00 PM</span>
              </li>
              <li className="text-xs text-gym-accent font-medium mt-2">
                VIP / Premium Members enjoy 24/7 RFID biometric access.
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-gym-text uppercase tracking-wider mb-4">
              Club Location
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gym-primary mt-1 shrink-0" />
                <span>Sector F-7/2, Jinnah Super Avenue, Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gym-primary shrink-0" />
                <span>+92 51 1234567 / +92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gym-primary shrink-0" />
                <span>contact@fittrack.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gym-border flex flex-col sm:flex-row items-center justify-between text-xs text-gym-muted gap-4">
          <p>© {new Date().getFullYear()} FitTrack Pro. All rights reserved. University PBL & Professional Portfolio Showcase.</p>
          <div className="flex items-center gap-6">
            <span>Production MERN Stack</span>
            <span>Docker & Nginx Integrated</span>
            <span className="text-gym-primary font-medium">Role-Based Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
