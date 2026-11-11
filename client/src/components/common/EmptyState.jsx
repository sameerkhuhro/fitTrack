import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title = 'No records found',
  description = 'There are currently no items to display.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gym-surface/40 rounded-xl border border-dashed border-gym-border my-4">
      {Icon && (
        <div className="p-3 bg-gym-surfaceLight rounded-full text-gym-muted mb-3">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h4 className="text-base font-semibold text-gym-text">{title}</h4>
      <p className="text-xs text-gym-muted max-w-sm mt-1">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
