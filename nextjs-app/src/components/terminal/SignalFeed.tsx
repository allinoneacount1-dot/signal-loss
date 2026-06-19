'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Divider } from '@/components/ui/Divider';
import { StatusDot } from '@/components/ui/StatusDot';
import { Cursor } from '@/components/ui/Cursor';

export interface SignalRow {
  id: string;
  timestamp: number;
  signalId: string;       // first 8 hex
  pair: string;
  confidence: number;     // 0-100
  status: 'ACTIVE' | 'PENDING' | 'FAILED' | 'EXPIRED' | 'PARSED' | 'EXECUTED';
  agent?: string;
  route?: string;
  size?: string;
}

const MOCK_SIGNALS: SignalRow[] = [
  { id: '1', timestamp: 1781896083, signalId: '0xA7F2E9C1', pair: 'SOL/USDC', confidence: 94.2, status: 'ACTIVE', agent: 'NODE_47', route: 'JUP_v6', size: '500 USDC' },
  { id: '2', timestamp: 1781896081, signalId: '0x4D9B2F88', pair: 'JTO/SOL', confidence: 88.7, status: 'PARSED', agent: 'NODE_12', route: 'JUP_v6', size: '1200 SOL' },
  { id: '3', timestamp: 1781896077, signalId: '0xE1C8A05B', pair: 'WIF/USDC', confidence: 76.3, status: 'PENDING', agent: 'NODE_03', route: 'JUP_v6', size: '200 USDC' },
  { id: '4', timestamp: 1781896070, signalId: '0x88B3D4E2', pair: 'BONK/SOL', confidence: 91.8, status: 'EXECUTED', agent: 'NODE_47', route: 'JUP_v6', size: '50 SOL' },
  { id: '5', timestamp: 1781896062, signalId: '0x73F1B2AA', pair: 'SOL/USDT', confidence: 42.1, status: 'EXPIRED', agent: 'NODE_22', route: 'JUP_v6', size: '3000 USDC' },
  { id: '6', timestamp: 1781896055, signalId: '0xCD92A481', pair: 'PYTH/USDC', confidence: 81.0, status: 'ACTIVE', agent: 'NODE_31', route: 'JUP_v6', size: '850 USDC' },
  { id: '7', timestamp: 1781896048, signalId: '0x5A4B1F7C', pair: 'JUP/SOL', confidence: 67.5, status: 'FAILED', agent: 'NODE_09', route: 'JUP_v6', size: '5 SOL' },
  { id: '8', timestamp: 1781896042, signalId: '0x9B1E0D4A', pair: 'SOL/USDC', confidence: 89.3, status: 'PARSED', agent: 'NODE_47', route: 'JUP_v6', size: '1200 USDC' },
  { id: '9', timestamp: 1781896038, signalId: '0xF472A1B5', pair: 'RENDER/SOL', confidence: 55.8, status: 'EXPIRED', agent: 'NODE_18', route: 'JUP_v6', size: '200 SOL' },
  { id: '10', timestamp: 1781896031, signalId: '0x2A88E3B1', pair: 'SOL/USDC', confidence: 96.4, status: 'EXECUTED', agent: 'NODE_12', route: 'JUP_v6', size: '5000 USDC' },
];

const statusState = (s: SignalRow['status']): 'active' | 'pending' | 'failed' | 'idle' => {
  if (s === 'ACTIVE' || s === 'PARSED' || s === 'EXECUTED') return 'active';
  if (s === 'PENDING') return 'pending';
  if (s === 'FAILED' || s === 'EXPIRED') return 'failed';
  return 'idle';
};

const statusTextColor = (s: SignalRow['status']): string => {
  if (s === 'ACTIVE' || s === 'PARSED' || s === 'EXECUTED') return 'text-green';
  if (s === 'PENDING') return 'text-amber';
  if (s === 'FAILED' || s === 'EXPIRED') return 'text-red';
  return 'text-bone-dim';
};

const formatTimestamp = (ts: number): string => ts.toString();

interface SignalFeedProps {
  onSelect?: (signal: SignalRow) => void;
  selectedId?: string;
}

export function SignalFeed({ onSelect, selectedId }: SignalFeedProps) {
  const [signals, setSignals] = useState<SignalRow[]>(MOCK_SIGNALS);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'FAILED'>('ALL');

  // Simulate new signal arrivals
  useEffect(() => {
    const interval = setInterval(() => {
      const newSignal: SignalRow = {
        id: String(Date.now()),
        timestamp: Math.floor(Date.now() / 1000),
        signalId: `0x${Math.random().toString(16).slice(2, 10).toUpperCase().padEnd(8, '0')}`,
        pair: ['SOL/USDC', 'JTO/SOL', 'WIF/USDC', 'BONK/SOL', 'PYTH/USDC'][Math.floor(Math.random() * 5)],
        confidence: Math.floor(Math.random() * 40) + 60,
        status: 'PARSED',
        agent: `NODE_${String(Math.floor(Math.random() * 50)).padStart(2, '0')}`,
        route: 'JUP_v6',
        size: `${Math.floor(Math.random() * 5000) + 100} USDC`,
      };
      setSignals((prev) => [newSignal, ...prev.slice(0, 49)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'ALL' ? signals : signals.filter((s) => s.status === filter);

  const counts = {
    ALL: signals.length,
    ACTIVE: signals.filter((s) => s.status === 'ACTIVE' || s.status === 'PARSED' || s.status === 'EXECUTED').length,
    PENDING: signals.filter((s) => s.status === 'PENDING').length,
    FAILED: signals.filter((s) => s.status === 'FAILED' || s.status === 'EXPIRED').length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="flex items-center gap-1 px-2 py-2 border-b border-grid bg-void">
        {(['ALL', 'ACTIVE', 'PENDING', 'FAILED'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'font-mono text-xs uppercase tracking-widest px-2 py-1 border transition-colors duration-75',
              filter === f
                ? 'border-amber text-amber bg-void-2'
                : 'border-transparent text-bone-dim hover:text-amber hover:border-amber-dim'
            )}
          >
            {f}[{counts[f]}]
          </button>
        ))}
      </div>

      {/* Column header */}
      <div className="grid grid-cols-[110px_90px_1fr_60px_80px] gap-2 px-2 py-2 border-b border-grid bg-void font-accent text-xs text-grid-2 uppercase tracking-widest">
        <span>UNIX_TS</span>
        <span>SIGNAL_ID</span>
        <span>PAIR</span>
        <span>CONF%</span>
        <span>STATUS</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
            <div className="font-mono text-amber-dim text-sm uppercase tracking-widest">
              NO_SIGNALS_DETECTED
            </div>
            <div className="font-mono text-grid-2 text-xs uppercase tracking-widest mt-2">
              NOISE_FLOOR_NORMAL
            </div>
            <Cursor color="amber" className="mt-4" />
          </div>
        ) : (
          filtered.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelect?.(s)}
              className={clsx(
                'grid grid-cols-[110px_90px_1fr_60px_80px] gap-2 px-2 py-2 border-b border-grid text-xs font-mono cursor-pointer relative overflow-hidden transition-colors duration-75',
                selectedId === s.id
                  ? 'bg-void text-amber'
                  : 'hover:bg-void text-bone',
                'sl-row-scan'
              )}
            >
              <span className="text-bone-dim">{formatTimestamp(s.timestamp)}</span>
              <span className="text-amber">{s.signalId}</span>
              <span className="truncate">{s.pair}</span>
              <span className={clsx(
                s.confidence >= 85 ? 'text-green' : s.confidence >= 70 ? 'text-amber' : 'text-bone-dim'
              )}>
                {s.confidence.toFixed(1)}
              </span>
              <span className={clsx('flex items-center gap-1', statusTextColor(s.status))}>
                <StatusDot state={statusState(s.status)} />
                <span className="uppercase tracking-widest">{s.status}</span>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-grid bg-void px-2 py-2 font-mono text-xs text-bone-dim uppercase tracking-widest flex items-center justify-between">
        <span>FEED_ACTIVE // POLL_RATE: 8s</span>
        <span className="text-amber">[{filtered.length} ROWS]</span>
      </div>
    </div>
  );
}
