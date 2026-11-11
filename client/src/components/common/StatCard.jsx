import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend, // { value: '+12%', isPositive: true }
  color = 'primary', // 'primary', 'warning', 'danger', 'info'
}) {
  const iconColors = {
    primary: 'bg-gym-primary/10 text-gym-primary border border-gym-primary/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  };

  return (
    <div className="bg-gym-surface border border-gym-border rounded-xl p-5 hover:border-gym-borderLight transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gym-muted font-medium">{title}</p>
          <h4 className="text-2xl font-bold text-gym-text mt-1">{value}</h4>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconColors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 flex items-center text-xs text-gym-muted">
          {trend && (
            <span
              className={`font-semibold mr-1.5 ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          )}
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
}
