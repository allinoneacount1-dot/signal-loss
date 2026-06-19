'use client';

import { type ReactNode } from 'react';
import clsx from 'clsx';

interface TerminalPaneProps {
  id: string;
  status?: string;
  statusState?: 'active' | 'pending' | 'failed' | 'idle';
  children: ReactNode;
  className?: string;
  headerExtra?: ReactNode;
}

const statusColors = {
  active: 'text-green',
  pending: 'text-amber',
  failed: 'text-red',
  idle: 'text-grid-2',
};

export function TerminalPane({
  id,
  status,
  statusState = 'idle',
  children,
  className,
  headerExtra,
}: TerminalPaneProps) {
  return (
    <section className={clsx('border border-grid bg-void-2 flex flex-col overflow-hidden', className)}>
      <header className="flex items-center justify-between px-4 py-2 border-b border-grid bg-void text-amber">
        <div className="flex items-center gap-2 font-accent text-xs uppercase tracking-widest">
          <span className="text-grid-2">//</span>
          <span>{id}</span>
        </div>
        <div className="flex items-center gap-3">
          {headerExtra}
          {status && (
            <span className={clsx('font-mono text-xs uppercase tracking-widest', statusColors[statusState])}>
              [{status}]
            </span>
          )}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </section>
  );
}
