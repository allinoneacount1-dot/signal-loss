'use client';

import clsx from 'clsx';

interface FrameProps {
  title: string;
  status?: string;
  statusState?: 'active' | 'pending' | 'failed' | 'idle';
  children: React.ReactNode;
  className?: string;
}

const stateColors = {
  active: 'text-green',
  pending: 'text-amber',
  failed: 'text-red',
  idle: 'text-grid-2',
};

export function Frame({ title, status, statusState = 'idle', children, className }: FrameProps) {
  return (
    <div className={clsx('border border-grid bg-void-2 flex flex-col overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-grid bg-void text-amber font-accent text-xs uppercase tracking-widest">
        <span>┌─[ {title} ]</span>
        {status && (
          <span className={clsx(stateColors[statusState])}>
            [{status}] ─┐
          </span>
        )}
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      <div className="px-3 py-1 border-t border-grid bg-void font-accent text-xs text-grid-2 tracking-widest">
        └──────────────────────────────────────────────────┘
      </div>
    </div>
  );
}
