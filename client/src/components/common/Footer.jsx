import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Phone, Mail, ArrowRight, Instagram, Facebook, Twitter, Youtube, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative bg-[#111613] border-t border-[#333e40] text-[#AEB5B2] pt-16 pb-10 overflow-hidden">
      {/* Background Gym Texture with Dark Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2000&auto=format&fit=crop"
          alt="Gym interior texture"
          className="w-full h-full object-cover filter brightness-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111613] via-[#111613]/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* 1. Brand Info & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center text-black font-black font-display shadow-neon-glow group-hover:scale-105 transition-transform">
                <Dumbbell className="w-5 h-5 -rotate-45 stroke-[2.8]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black uppercase tracking-tight text-white leading-none">
                  FITTRACK <span className="text-neon">PRO</span>
                </span>
                <span className="text-[9px] tracking-[0.22em] uppercase font-bold text-[#AEB5B2] leading-none mt-1">
                  FITNESS CLUB
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#AEB5B2] max-w-sm leading-relaxed">
              Your destination for strength, fitness, and a healthier lifestyle. World-class Eleiko strength arenas, certified personal coaches, and biometric progress tracking.
            </p>

            {/* Social Icons matching blueprint */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#22292A] border border-[#333e40] flex items-center justify-center text-gray-400 hover:text-black hover:bg-neon hover:border-neon transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#22292A] border border-[#333e40] flex items-center justify-center text-gray-400 hover:text-black hover:bg-neon hover:border-neon transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#22292A] border border-[#333e40] flex items-center justify-center text-gray-400 hover:text-black hover:bg-neon hover:border-neon transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#22292A] border border-[#333e40] flex items-center justify-center text-gray-400 hover:text-black hover:bg-neon hover:border-neon transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-[#AEB5B2] hover:text-neon transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-[#AEB5B2] hover:text-neon transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/facilities" className="text-[#AEB5B2] hover:text-neon transition-colors">Facilities</Link>
              </li>
              <li>
                <Link to="/trainers" className="text-[#AEB5B2] hover:text-neon transition-colors">Trainers</Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#AEB5B2] hover:text-neon transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* 3. Membership */}
          <div>
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-white mb-4">
              Membership
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/plans" className="text-[#AEB5B2] hover:text-neon transition-colors">Basic Plan</Link>
              </li>
              <li>
                <Link to="/plans" className="text-[#AEB5B2] hover:text-neon transition-colors">Pro Plan</Link>
              </li>
              <li>
                <Link to="/plans" className="text-[#AEB5B2] hover:text-neon transition-colors">Elite Plan</Link>
              </li>
              <li>
                <Link to="/plans" className="text-[#AEB5B2] hover:text-neon transition-colors">Compare Plans</Link>
              </li>
              <li>
                <Link to="/register" className="text-[#AEB5B2] hover:text-neon transition-colors">Enroll Today</Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Us & Newsletter */}
          <div>
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-[#AEB5B2] mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-neon shrink-0 mt-0.5" />
                <span>123 Fitness Avenue, Lahore</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neon shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neon shrink-0" />
                <span>info@fittrackpro.com</span>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div>
              <h5 className="font-display text-xs font-black uppercase tracking-wider text-white mb-1.5">
                Newsletter
              </h5>
              <p className="text-[11px] text-[#777F7B] mb-2.5">
                Get fitness tips, offers and updates.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-neon/10 border border-neon/30 text-neon text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribed successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[#22292A] border border-[#333e40] rounded-l-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="bg-neon hover:bg-neon-hover text-black px-3.5 py-2 rounded-r-lg font-bold text-xs transition-colors shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-[#333e40]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777F7B]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>
              &copy; {new Date().getFullYear()} FitTrack Pro Fitness Club. All Rights Reserved.
            </p>
            <span className="hidden sm:inline text-[#333e40]">•</span>
            <p className="text-[#AEB5B2]">
              Developed by{' '}
              <a
                href="https://www.linkedin.com/in/sameer-khuhro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon font-bold hover:underline hover:text-white transition-colors"
              >
                Sameer Khuhro
              </a>
            </p>
          </div>
          <div className="flex items-center gap-5 text-xs text-[#AEB5B2]">
            <Link to="/login" className="hover:text-neon transition-colors">Staff Login</Link>
            <span>•</span>
            <Link to="/register" className="hover:text-neon transition-colors">Join FitTrack Pro</Link>
            <span>•</span>
            <span className="text-emerald-400 font-mono">v2.4 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
