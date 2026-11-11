import React, { useEffect, useState } from 'react';
import { Award, Mail, Phone, Calendar, Dumbbell, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
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

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-3">Our Coaching Staff</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gym-text">
          Certified Fitness Specialists
        </h1>
        <p className="mt-4 text-gym-muted text-base sm:text-lg leading-relaxed">
          Every coach at FitTrack Pro is internationally certified with proven expertise in biomechanics, hypertrophy, fat loss, and strength conditioning.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading trainer profiles..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <Card key={trainer._id} hoverEffect className="overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-28 h-28 rounded-full bg-gym-surfaceLight border-2 border-gym-primary/40 mx-auto mb-5 flex items-center justify-center text-gym-primary text-3xl font-bold shadow-lg shadow-black/50 overflow-hidden">
                  {trainer.profileImage ? (
                    <img src={trainer.profileImage} alt={trainer.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{trainer.name.split(' ').map((n) => n[0]).join('')}</span>
                  )}
                </div>

                <Badge variant="primary" size="sm" className="mb-2">
                  Elite Coach
                </Badge>

                <h3 className="text-xl font-bold text-gym-text">{trainer.name}</h3>
                <p className="text-xs text-gym-primary font-medium mt-1">{trainer.specialization}</p>

                <p className="text-xs text-gym-muted mt-4 leading-relaxed">
                  Passionate about helping members master proper form, break plateaus, and maintain disciplined nutritional habits.
                </p>

                <div className="mt-6 pt-6 border-t border-gym-border space-y-2 text-xs text-gym-muted text-left">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gym-primary" />
                    <span>{trainer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gym-primary" />
                    <span>{trainer.phone}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
