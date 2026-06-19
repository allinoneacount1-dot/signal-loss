'use client';

import clsx from 'clsx';

interface StatusBannerProps {
  state: 'ok' | 'fail' | 'wait' | 'warn';
  children: React.ReactNode;
  className?: string;
}

const stateStyles = {
  ok: 'text-green border-green',
  fail: 'text-red border-red',
  wait: 'text-amber border-amber',
  warn: 'text-amber-dim border-amber-dim',
};

const statePrefixes = {
  ok: '[ SIGNAL_LOCKED ]',
  fail: '!! SIGNAL_LOST !!',
  wait: '... AWAITING_TRANSMISSION ...',
  warn: '!! HEURISTIC_ANOMALY !!',
};

export function StatusBanner({ state, children, className }: StatusBannerProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest border px-2 py-1',
        stateStyles[state],
        className
      )}
    >
      <span>{statePrefixes[state]}</span>
      {children && <span className="text-bone-dim">// {children}</span>}
    </div>
  );
}
