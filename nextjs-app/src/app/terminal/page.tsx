'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { SignalFeed, type SignalRow } from '@/components/terminal/SignalFeed';
import { ExecutionTerminal } from '@/components/terminal/ExecutionTerminal';
import { StackMonitor } from '@/components/terminal/StackMonitor';
import { StatusDot } from '@/components/ui/StatusDot';
import { Cursor } from '@/components/ui/Cursor';
import { BrandLockup } from '@/components/ascii/BrandMark';

export default function TerminalPage() {
  const router = useRouter();
  const [selectedSignal, setSelectedSignal] = useState<SignalRow | undefined>();
  const [clock, setClock] = useState<string>('');
  const [mobilePane, setMobilePane] = useState<'feed' | 'terminal' | 'stack'>('terminal');

  // Live clock
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = d.getUTCHours().toString().padStart(2, '0');
      const mm = d.getUTCMinutes().toString().padStart(2, '0');
      const ss = d.getUTCSeconds().toString().padStart(2, '0');
      setClock(`${hh}:${mm}:${ss} UTC`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard: ESC to go back to landing
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  return (
    <div className="flex flex-col h-screen w-screen bg-void text-bone overflow-hidden">
      {/* Top bar — 48px */}
      <header className="flex items-center justify-between h-12 px-4 border-b border-grid bg-void shrink-0">
        <div className="flex items-center gap-4">
          <BrandLockup className="text-xl" />
          <span className="text-grid-2 hidden md:inline">|</span>
          <span className="font-mono text-xs text-bone-dim uppercase tracking-widest hidden md:inline">
            SOLANA_DARKPOOL // MAINNET-BETA
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
          <div className="hidden md:flex items-center gap-2 text-bone-dim">
            <span>OPERATIVE:</span>
            <span className="text-amber">NODE_47</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-bone-dim">
            <StatusDot state="active" />
            <span>SYNC_OK</span>
          </div>
          <div className="text-bone-dim font-data">{clock}</div>
          <button
            onClick={() => router.push('/')}
            className="text-bone-dim hover:text-amber transition-colors duration-75"
            aria-label="Terminate link"
            title="ESC to terminate link"
          >
            [ESC]
          </button>
        </div>
      </header>

      {/* Mobile pane selector */}
      <div className="md:hidden flex border-b border-grid bg-void shrink-0">
        {(['feed', 'terminal', 'stack'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setMobilePane(p)}
            className={clsx(
              'flex-1 font-mono text-xs uppercase tracking-widest py-2 border-b-2 transition-colors duration-75',
              mobilePane === p ? 'border-amber text-amber' : 'border-transparent text-bone-dim'
            )}
          >
            {p === 'feed' ? '[FEED]' : p === 'terminal' ? '[TERMINAL]' : '[STACK]'}
          </button>
        ))}
      </div>

      {/* Three-pane main grid */}
      <main
        className={clsx(
          'flex-1 min-h-0',
          // Mobile: show only selected pane
          'block md:grid md:gap-px md:grid-cols-[280px_1fr_360px] md:bg-grid'
        )}
      >
        {/* Left: SIGNAL_FEED */}
        <div
          className={clsx(
            'h-full min-h-0',
            mobilePane === 'feed' ? 'block' : 'hidden',
            'md:block'
          )}
        >
          <PaneWrapper id="SIGNAL_FEED" status="LIVE" statusState="active">
            <SignalFeed onSelect={setSelectedSignal} selectedId={selectedSignal?.id} />
          </PaneWrapper>
        </div>

        {/* Center: EXECUTION_TERMINAL */}
        <div
          className={clsx(
            'h-full min-h-0',
            mobilePane === 'terminal' ? 'block' : 'hidden',
            'md:block'
          )}
        >
          <PaneWrapper id="EXECUTION_TERMINAL" status="ARMED" statusState="active">
            <ExecutionTerminal selectedSignalId={selectedSignal?.signalId} />
          </PaneWrapper>
        </div>

        {/* Right: STACK_MONITOR */}
        <div
          className={clsx(
            'h-full min-h-0',
            mobilePane === 'stack' ? 'block' : 'hidden',
            'md:block'
          )}
        >
          <PaneWrapper id="STACK_MONITOR" status="SYNCING" statusState="active">
            <StackMonitor />
          </PaneWrapper>
        </div>
      </main>

      {/* Mobile bottom command hint */}
      <div className="md:hidden border-t border-grid bg-void px-3 py-2 font-mono text-xs text-bone-dim uppercase tracking-widest flex items-center justify-between">
        <span>SLIDE &gt; SWITCH_PANE</span>
        <span className="flex items-center gap-1">
          <Cursor color="amber" /> ARMED
        </span>
      </div>
    </div>
  );
}

function PaneWrapper({
  id,
  status,
  statusState,
  children,
}: {
  id: string;
  status: string;
  statusState: 'active' | 'pending' | 'failed' | 'idle';
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col h-full border border-grid bg-void-2">
      <header className="flex items-center justify-between px-3 py-2 border-b border-grid bg-void text-amber shrink-0">
        <div className="flex items-center gap-2 font-accent text-xs uppercase tracking-widest">
          <span className="text-grid-2">//</span>
          <span>{id}</span>
        </div>
        <span
          className={clsx(
            'font-mono text-xs uppercase tracking-widest',
            statusState === 'active' && 'text-green',
            statusState === 'pending' && 'text-amber',
            statusState === 'failed' && 'text-red',
            statusState === 'idle' && 'text-grid-2'
          )}
        >
          [{status}]
        </span>
      </header>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </section>
  );
}
