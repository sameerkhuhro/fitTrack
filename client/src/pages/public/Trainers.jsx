import React, { useEffect, useState } from 'react';
import { Award, Mail, Phone, Calendar, Dumbbell, ShieldCheck, Star, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trainers')
      .then((res) => {
        if (res.data.success) {
          setTrainers(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const defaultTrainerImages = [
    'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="bg-gym-bg text-gym-text">
      {/* 1. HERO BANNER */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-gym-border">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1920&q=80"
            alt="FitTrack Certified Coaching Staff"
            className="w-full h-full object-cover filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-gym-bg/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-4">Master Fitness Specialists</Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gym-text">
            Our Certified Coaching Staff
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gym-muted max-w-2xl mx-auto leading-relaxed">
            Every coach at FitTrack Pro holds international certifications and is dedicated to prescribing personalized, biomechanically sound workout routines.
          </p>
        </div>
      </section>

      {/* 2. TRAINER ROSTER (DYNAMIC ATLAS DATA) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner text="Loading coach profiles from Atlas..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((t, idx) => {
              const photo = t.profileImage || defaultTrainerImages[idx % defaultTrainerImages.length];

              return (
                <div
                  key={t._id}
                  className="rounded-2xl overflow-hidden bg-gym-surface border border-gym-border hover:border-gym-primary/50 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={photo}
                      alt={t.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gym-surface via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="primary">{t.specialization || 'Certified Coach'}</Badge>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gym-text group-hover:text-gym-primary transition-colors">
                          {t.name}
                        </h3>
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Star className="w-4 h-4 fill-emerald-400" />
                          <span className="text-xs font-bold">5.0</span>
                        </div>
                      </div>

                      <p className="text-xs text-gym-muted mt-2 leading-relaxed">
                        Specializes in periodized hypertrophy, Olympic lifting mechanics, and custom athlete routine design.
                      </p>

                      <div className="mt-6 space-y-2 border-t border-gym-border pt-4 text-xs text-gym-muted">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gym-primary shrink-0" />
                          <span>ISSA / NASM Elite Personal Trainer</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-gym-primary shrink-0" />
                          <span>Verified Active Staff Member</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gym-border">
                      <Link to="/register">
                        <Button variant="secondary" className="w-full text-xs font-bold" icon={ArrowRight}>
                          Train With {t.name.split(' ')[0]}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. COACHING STANDARDS SECTION */}
      <section className="py-20 bg-gym-surface border-t border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <Badge variant="primary" className="mb-3">Accountability Guaranteed</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-gym-text">
            The FitTrack Coaching Protocol
          </h2>
          <p className="mt-4 text-gym-muted text-sm sm:text-base leading-relaxed">
            Our coaches don't count reps passively. Through our integrated digital portal, they prescribe custom sets, reps, and target muscle goals, analyze your weekly weigh-in graphs, and adjust your caloric and training volume over time.
          </p>

          <div className="mt-10 flex justify-center">
            <Link to="/register">
              <Button size="lg" variant="primary">
                Get Assigned a Certified Coach Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
