'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { BrandMark } from '@/components/ascii/BrandMark';
import { Cursor } from '@/components/ui/Cursor';
import { StatusBanner } from '@/components/ascii/StatusBanner';

type BootStage = 'idle' | 'init' | 'connect' | 'sync' | 'awaiting' | 'ready';

const BOOT_SEQUENCE: Array<{ stage: BootStage; line: string; delay: number; tone: 'normal' | 'success' | 'info' | 'warn' }> = [
  { stage: 'init', line: '> INITIALIZING SIGNAL_LOSS PROTOCOL v0.1.0', delay: 250, tone: 'normal' },
  { stage: 'init', line: '> LOADING ENCRYPTION MODULES................. [OK]', delay: 320, tone: 'success' },
  { stage: 'init', line: '> PROVISIONING AI LISTEN NODE HANDLER........ [OK]', delay: 280, tone: 'success' },
  { stage: 'init', line: '> CHECKING INTENT ENCRYPTION CIPHER.......... [AES-256-GCM]', delay: 200, tone: 'info' },
  { stage: 'connect', line: '> CONNECTING TO SOLANA MAINNET...............', delay: 350, tone: 'normal' },
  { stage: 'connect', line: '> HANDSHAKE WITH RPC CLUSTER.................. [TRITON/HELIUS]', delay: 320, tone: 'info' },
  { stage: 'connect', line: '> AUTHENTICATING SECURE CHANNEL............... [OK]', delay: 280, tone: 'success' },
  { stage: 'sync', line: '> SYNCING BLOCK HEIGHT.......................', delay: 400, tone: 'normal' },
  { stage: 'sync', line: '> CURRENT SLOT: 312,847,221  EPOCH: 728  TICK: 41', delay: 220, tone: 'info' },
  { stage: 'sync', line: '> SYNCING LISTEN NODE STAKES................. [47 ACTIVE]', delay: 300, tone: 'info' },
  { stage: 'sync', line: '> SYNCING DARKPOOL LIQUIDITY................. [12,440.27 SOL]', delay: 280, tone: 'info' },
  { stage: 'awaiting', line: '', delay: 200, tone: 'normal' },
  { stage: 'awaiting', line: '> AWAITING_SECURE_CHANNEL_AUTH', delay: 0, tone: 'warn' },
];

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showAuth, setShowAuth] = useState(false);
  const [authStep, setAuthStep] = useState<'idle' | 'authenticating' | 'authenticated'>('idle');
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    let cumulative = 0;
    BOOT_SEQUENCE.forEach((entry, idx) => {
      cumulative += entry.delay;
      const timeout = setTimeout(() => {
        setVisibleLines(idx + 1);
        if (entry.stage === 'awaiting') {
          setShowAuth(true);
        }
      }, cumulative);
      timeoutsRef.current.push(timeout);
    });
    return clearTimeouts;
  }, [clearTimeouts]);

  const handleAuth = () => {
    if (authStep !== 'idle') return;
    setAuthStep('authenticating');
    setTimeout(() => {
      setAuthStep('authenticated');
      setTimeout(() => {
        onComplete();
      }, 800);
    }, 1400);
  };

  // Keyboard shortcut: ENTER to auth
  useEffect(() => {
    if (!showAuth || authStep !== 'idle') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleAuth();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAuth, authStep]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-void p-8 overflow-hidden">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Brand mark */}
        <div className="flex justify-center opacity-90">
          <BrandMark size="md" />
        </div>

        {/* Subtitle */}
        <div className="text-center font-accent text-amber-dim text-xs tracking-widest">
          // SOLANA AI-INTENT DARKPOOL // CLASSIFIED // EST. 2026
        </div>

        {/* Boot log */}
        <div className="border border-grid bg-void-2 p-4 font-mono text-sm h-80 overflow-y-auto">
          {BOOT_SEQUENCE.slice(0, visibleLines).map((entry, idx) => {
            const isLast = idx === visibleLines - 1 && !showAuth;
            return (
              <div
                key={idx}
                className={clsx(
                  'leading-relaxed sl-decode',
                  entry.tone === 'success' && 'text-green',
                  entry.tone === 'info' && 'text-bone-dim',
                  entry.tone === 'warn' && 'text-amber',
                  entry.tone === 'normal' && 'text-bone'
                )}
              >
                {entry.line || '\u00A0'}
                {isLast && <Cursor color="amber" className="ml-1" />}
              </div>
            );
          })}

          {showAuth && authStep === 'idle' && (
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleAuth}
                className="font-mono text-sm uppercase tracking-widest border border-amber text-amber bg-transparent px-4 py-2 hover:bg-amber hover:text-void transition-colors duration-75 cursor-pointer sl-row-scan relative"
              >
                [ENTER] &gt; AUTHENTICATE_SECURE_CHANNEL
              </button>
            </div>
          )}

          {authStep === 'authenticating' && (
            <>
              <div className="text-amber leading-relaxed">
                &gt; AUTHENTICATING_SECURE_CHANNEL
                <Cursor color="amber" className="ml-1" />
              </div>
              <div className="text-bone-dim leading-relaxed">
                &gt; CHALLENGE_GENERATED........................ 0xA7F2...E9C1
              </div>
              <div className="text-bone-dim leading-relaxed">
                &gt; AWAITING WALLET SIGNATURE..................
                <Cursor color="amber" className="ml-1" />
              </div>
            </>
          )}

          {authStep === 'authenticated' && (
            <>
              <div className="text-green leading-relaxed">
                &gt; CHANNEL_AUTHENTICATED
              </div>
              <div className="text-green leading-relaxed">
                &gt; OPERATIVE_FILE LOADED
              </div>
              <div className="text-amber leading-relaxed">
                &gt; ROUTING TO DASHBOARD
                <Cursor color="amber" className="ml-1" />
              </div>
            </>
          )}
        </div>

        {/* Footer status bar */}
        <div className="flex items-center justify-between font-mono text-xs text-bone-dim uppercase tracking-widest border-t border-grid pt-3">
          <div className="flex items-center gap-4">
            <span>SYS_OK</span>
            <span className="text-grid-2">|</span>
            <span>RPC_HEALTHY</span>
            <span className="text-grid-2">|</span>
            <span>CLUSTER: MAINNET</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={clsx('inline-block w-2 h-2', authStep === 'authenticated' ? 'bg-green' : 'bg-amber', 'sl-dot')} />
            <span>{authStep === 'authenticated' ? 'TRANSMISSION_CONFIRMED' : 'ACQUIRING_SIGNAL_LOCK'}</span>
          </div>
        </div>

        {/* Status hint */}
        <div className="text-center font-mono text-xs text-grid-2 uppercase tracking-widest">
          [ENTER] TO AUTHENTICATE  //  [ESC] TO ABORT
        </div>
      </div>
    </div>
  );
}
