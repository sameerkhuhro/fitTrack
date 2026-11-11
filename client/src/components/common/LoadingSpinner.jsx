import React from 'react';

export default function LoadingSpinner({ text = 'Loading FitTrack Pro...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-gym-border border-t-gym-primary animate-spin"></div>
      </div>
      {text && <p className="mt-4 text-sm text-gym-muted">{text}</p>}
    </div>
  );
}
