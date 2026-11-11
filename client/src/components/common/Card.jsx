import React from 'react';

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  footer,
  noPadding = false,
  hoverEffect = false,
  ...props
}) {
  return (
    <div
      className={`bg-gym-surface border border-gym-border rounded-xl overflow-hidden transition-all duration-200 ${
        hoverEffect ? 'hover:border-gym-primary/40 hover:shadow-lg hover:shadow-black/40' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gym-border flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-gym-text">{title}</h3>}
            {subtitle && <p className="text-xs text-gym-muted mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className={noPadding ? '' : 'p-6'}>{children}</div>

      {footer && (
        <div className="px-6 py-3.5 bg-gym-surfaceLight/50 border-t border-gym-border text-sm">
          {footer}
        </div>
      )}
    </div>
  );
}

