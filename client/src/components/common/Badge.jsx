import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'default', 'success', 'warning', 'danger', 'info', 'primary'
  size = 'md', // 'sm', 'md'
  className = '',
}) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  const variantStyles = {
    default: 'bg-gym-surfaceLight text-gym-muted border border-gym-border',
    primary: 'bg-gym-primary/15 text-gym-primary border border-gym-primary/30',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    info: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
