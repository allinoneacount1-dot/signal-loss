'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Divider } from '@/components/ui/Divider';
import { StatusDot } from '@/components/ui/StatusDot';

interface ChainStats {
  blockHeight: number;
  slot: number;
  epoch: number;
  tps: number;
  slotLeader: string;
  validatorHealth: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  recentBlockhash: string;
  feeEstimate: number;
  jitoTips: number;
}

const MOCK_VALIDATORS = [
  { name: 'Helius', stake: '12.4M SOL', commission: 4, health: 'OPTIMAL' as const },
  { name: 'Triton', stake: '8.9M SOL', commission: 5, health: 'OPTIMAL' as const },
  { name: 'Galaxy', stake: '6.2M SOL', commission: 6, health: 'DEGRADED' as const },
  { name: 'Coinbase', stake: '5.8M SOL', commission: 5, health: 'OPTIMAL' as const },
  { name: 'Binance', stake: '4.1M SOL', commission: 8, health: 'OPTIMAL' as const },
  { name: 'Jump', stake: '3.7M SOL', commission: 5, health: 'OPTIMAL' as const },
  { name: 'Marinade', stake: '2.9M SOL', commission: 6, health: 'OPTIMAL' as const },
  { name: 'Pyth', stake: '2.1M SOL', commission: 5, health: 'OPTIMAL' as const },
];

const MOCK_SIGNAL_NODES = [
  { id: 'NODE_47', stake: '12.50 SOL', reputation: 0.847, status: 'ACTIVE' as const, parses24h: 1247 },
  { id: 'NODE_12', stake: '8.20 SOL', reputation: 0.792, status: 'ACTIVE' as const, parses24h: 892 },
  { id: 'NODE_31', stake: '5.10 SOL', reputation: 0.681, status: 'ACTIVE' as const, parses24h: 547 },
  { id: 'NODE_09', stake: '5.00 SOL', reputation: 0.401, status: 'ACTIVE' as const, parses24h: 198 },
  { id: 'NODE_22', stake: '5.00 SOL', reputation: 0.523, status: 'ACTIVE' as const, parses24h: 312 },
];

const healthColor = (h: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL'): 'text-green' | 'text-amber' | 'text-red' => {
  if (h === 'OPTIMAL') return 'text-green';
  if (h === 'DEGRADED') return 'text-amber';
  return 'text-red';
};

export function StackMonitor() {
  const [stats, setStats] = useState<ChainStats>({
    blockHeight: 312847221,
    slot: 312847221,
    epoch: 728,
    tps: 3842,
    slotLeader: 'Hel1us...H7n2',
    validatorHealth: 'OPTIMAL',
    recentBlockhash: '0x9A7F2E8C4D1B5F6A3E2D9C1B7F4A8E5D2C6B3A9F7E1D4C8B5A2F9E6D3C7B4A1F8E',
    feeEstimate: 12500,
    jitoTips: 8500,
  });

  // Live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        blockHeight: prev.blockHeight + 1,
        slot: prev.slot + 1,
        tps: Math.max(2000, Math.min(5000, prev.tps + Math.floor((Math.random() - 0.5) * 200))),
        feeEstimate: Math.max(5000, Math.min(50000, prev.feeEstimate + Math.floor((Math.random() - 0.5) * 2000))),
        jitoTips: Math.max(1000, Math.min(20000, prev.jitoTips + Math.floor((Math.random() - 0.5) * 1000))),
      }));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const totalStake = MOCK_VALIDATORS.reduce((acc, v) => acc + parseFloat(v.stake), 0);
  const totalParses = MOCK_SIGNAL_NODES.reduce((acc, n) => acc + n.parses24h, 0);

  return (
    <div className="flex flex-col h-full font-mono text-xs">
      {/* Chain header */}
      <div className="border-b border-grid bg-void p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-amber uppercase tracking-widest text-xs">// CHAIN_TELEMETRY</span>
          <StatusDot state="active" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="BLOCK_HEIGHT" value={stats.blockHeight.toLocaleString()} valueClass="text-bone" />
          <Stat label="SLOT" value={stats.slot.toLocaleString()} valueClass="text-bone" />
          <Stat label="EPOCH" value={stats.epoch.toString()} valueClass="text-amber" />
          <Stat label="TPS" value={stats.tps.toLocaleString()} valueClass="text-green" />
        </div>
      </div>

      {/* Slot + fees */}
      <div className="border-b border-grid bg-void-2 p-3 space-y-2">
        <Row label="SLOT_LEADER" value={stats.slotLeader} valueClass="text-amber" />
        <Row label="PRIORITY_FEE" value={`${stats.feeEstimate.toLocaleString()} μLAMPORTS/CU`} valueClass="text-bone" />
        <Row label="JITO_TIP_AVG" value={`${(stats.jitoTips / 1000).toFixed(2)} SOL`} valueClass="text-bone" />
        <Row
          label="CLUSTER"
          value="MAINNET-BETA"
          valueClass="text-green"
        />
      </div>

      {/* Recent blockhash — faded */}
      <div className="border-b border-grid p-3">
        <div className="text-amber-dim text-xs uppercase tracking-widest mb-1">// RECENT_BLOCKHASH</div>
        <div className="text-grid-2 text-[0.65rem] break-all font-data opacity-60 leading-relaxed">
          {stats.recentBlockhash}
        </div>
      </div>

      <Divider variant="plus" />

      {/* Validators */}
      <div className="border-b border-grid p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-amber uppercase tracking-widest text-xs">// VALIDATORS</span>
          <span className="text-bone-dim text-xs">[{MOCK_VALIDATORS.length}]</span>
        </div>
        <div className="space-y-1.5">
          {MOCK_VALIDATORS.slice(0, 5).map((v) => (
            <div key={v.name} className="flex items-center justify-between text-xs">
              <span className="text-bone-dim">{v.name}</span>
              <span className={healthColor(v.health)}>
                {v.health} <span className="text-bone-dim">|</span> {v.stake}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-grid text-xs text-bone-dim flex items-center justify-between">
          <span>TOTAL_ACTIVE_STAKE</span>
          <span className="text-bone">{totalStake.toFixed(1)}M SOL</span>
        </div>
      </div>

      <Divider variant="plus" />

      {/* Signal Nodes */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-amber uppercase tracking-widest text-xs">// LISTEN_NODES</span>
          <span className="text-bone-dim text-xs">[{MOCK_SIGNAL_NODES.length}/47]</span>
        </div>
        <div className="space-y-1.5">
          {MOCK_SIGNAL_NODES.map((n) => (
            <div key={n.id} className="flex items-center justify-between text-xs">
              <span className="text-amber">{n.id}</span>
              <span className="text-bone-dim">
                R: <span className={n.reputation >= 0.7 ? 'text-green' : n.reputation >= 0.5 ? 'text-amber' : 'text-red'}>{n.reputation.toFixed(2)}</span>
                <span className="text-grid-2"> | </span>
                {n.parses24h}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-grid text-xs text-bone-dim flex items-center justify-between">
          <span>24H_PARSES</span>
          <span className="text-bone">{totalParses.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer status */}
      <div className="border-t border-grid bg-void p-2 text-xs text-bone-dim uppercase tracking-widest flex items-center justify-between">
        <span className="flex items-center gap-1">
          <StatusDot state="active" /> RPC: HELIUS
        </span>
        <span className="text-green">SYNC_OK</span>
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div>
      <div className="text-bone-dim text-[0.65rem] uppercase tracking-widest">{label}</div>
      <div className={clsx('text-base font-data', valueClass)}>{value}</div>
    </div>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-bone-dim uppercase tracking-widest text-[0.65rem]">{label}</span>
      <span className={clsx('text-xs', valueClass)}>{value}</span>
    </div>
  );
}
