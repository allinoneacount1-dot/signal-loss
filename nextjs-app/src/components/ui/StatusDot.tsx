'use client';

import clsx from 'clsx';

interface StatusDotProps {
  state: 'active' | 'pending' | 'failed' | 'idle';
  className?: string;
}

const stateColors = {
  active: 'bg-green',
  pending: 'bg-amber',
  failed: 'bg-red',
  idle: 'bg-grid-2',
};

export function StatusDot({ state, className }: StatusDotProps) {
  return (
    <span
      className={clsx(
        'inline-block w-2 h-2 sl-dot',
        stateColors[state],
        className
      )}
      aria-hidden="true"
    />
  );
}
