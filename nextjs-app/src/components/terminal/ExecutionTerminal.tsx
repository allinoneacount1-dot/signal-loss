'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { Cursor } from '@/components/ui/Cursor';
import { Divider } from '@/components/ui/Divider';
import { TerminalButton } from '@/components/ui/TerminalButton';
import { StatusBanner } from '@/components/ascii/StatusBanner';
import { parseIntent, type ParsedIntent } from '@/lib/parser/intentParser';

type OutputLine = {
  id: string;
  type: 'command' | 'response' | 'json' | 'error' | 'info' | 'success' | 'system';
  content: string;
  timestamp: number;
};

const WELCOME_LINES: OutputLine[] = [
  { id: 'w1', type: 'system', content: '> EXECUTION_TERMINAL ONLINE', timestamp: 0 },
  { id: 'w2', type: 'info', content: '> AGENT: NODE_47  STATUS: ARMED  STAKE: 12.5 SOL', timestamp: 0 },
  { id: 'w3', type: 'info', content: '> ACCEPTED COMMAND FORMS:', timestamp: 0 },
  { id: 'w4', type: 'response', content: '  > LONG 500 USDC SOLANA @ MAX_SLIPPAGE 0.5% WITHIN 2 BLOCKS', timestamp: 0 },
  { id: 'w5', type: 'response', content: '  > SHORT 100 SOL JTO @ SLIPPAGE 1% EXPIRES 5 BLOCKS', timestamp: 0 },
  { id: 'w6', type: 'response', content: '  > EXECUTE <SIGNAL_ID>  //  STATUS  //  CANCEL <ID>', timestamp: 0 },
  { id: 'w7', type: 'info', content: '> ENCRYPTED PAYLOAD ROUTES TO DEAD-DROP CONTRACT ON SUBMIT', timestamp: 0 },
  { id: 'w8', type: 'info', content: '', timestamp: 0 },
];

interface ExecutionTerminalProps {
  selectedSignalId?: string;
  onExecuted?: (intent: ParsedIntent) => void;
}

export function ExecutionTerminal({ selectedSignalId, onExecuted }: ExecutionTerminalProps) {
  const [history, setHistory] = useState<OutputLine[]>(WELCOME_LINES);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastIntent, setLastIntent] = useState<ParsedIntent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const counterRef = useRef(0);

  // Auto-scroll to bottom on history change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isProcessing]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLine = useCallback((line: Omit<OutputLine, 'id' | 'timestamp'>) => {
    counterRef.current += 1;
    setHistory((prev) => [
      ...prev,
      { ...line, id: `l${counterRef.current}`, timestamp: Math.floor(Date.now() / 1000) },
    ]);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim();
      if (!cmd || isProcessing) return;

      // Echo command
      addLine({ type: 'command', content: `> ${cmd}` });
      setInput('');

      // Special commands
      const upper = cmd.toUpperCase();
      if (upper === 'CLEAR' || upper === 'CLS') {
        setHistory(WELCOME_LINES);
        return;
      }
      if (upper === 'HELP' || upper === '?') {
        addLine({ type: 'response', content: 'AVAILABLE COMMANDS: LONG, SHORT, EXECUTE, STATUS, CANCEL, HELP, CLEAR' });
        return;
      }
      if (upper === 'STATUS') {
        addLine({ type: 'info', content: '> RPC: HEALTHY  CLUSTER: MAINNET  SLOT: ' + Math.floor(Date.now() / 400) });
        addLine({ type: 'info', content: '> AGENT_STAKE: 12.5 SOL  REPUTATION: 0.847  SLASH_COUNT: 0' });
        return;
      }

      // Parse intent
      setIsProcessing(true);
      await new Promise((r) => setTimeout(r, 380));

      const parsed = parseIntent(cmd);
      if (!parsed) {
        addLine({ type: 'error', content: '!! PARSE_FAILURE: unable to interpret command' });
        addLine({ type: 'info', content: '> expected: <DIRECTION> <AMOUNT> <TOKEN> <PAIR> @ SLIPPAGE <PCT> [WITHIN N BLOCKS]' });
        setIsProcessing(false);
        return;
      }

      setLastIntent(parsed);
      addLine({ type: 'success', content: '> INTENT_PARSED' });
      addLine({ type: 'json', content: JSON.stringify(parsed, null, 2) });
      addLine({ type: 'info', content: '> SIMULATING ROUTE............................' });
      await new Promise((r) => setTimeout(r, 240));
      addLine({ type: 'info', content: '> ESTIMATED_OUTPUT: ' + (parsed.amount * 1.024).toFixed(2) + ' ' + parsed.tokenOut });
      addLine({ type: 'info', content: '> ROUTE: ' + (parsed.route || 'JUP_v6 / 2 hops') });
      addLine({ type: 'info', content: '> JITO_BUNDLE_PROBABILITY: 0.87' });
      addLine({ type: 'info', content: '> TOTAL_FEE: 0.00015 SOL' });
      addLine({ type: 'info', content: '' });
      addLine({ type: 'system', content: '> PRESS [EXECUTE] TO TRANSMIT  //  [ESC] TO ABORT' });

      setIsProcessing(false);
    },
    [input, isProcessing, addLine]
  );

  const handleExecute = useCallback(async () => {
    if (!lastIntent) return;
    setIsProcessing(true);
    addLine({ type: 'command', content: '> EXECUTE' });
    addLine({ type: 'info', content: '> ENCRYPTING PAYLOAD...........................' });
    await new Promise((r) => setTimeout(r, 320));
    addLine({ type: 'info', content: '> SUBMITTING TO DEAD-DROP CONTRACT.............' });
    await new Promise((r) => setTimeout(r, 480));
    addLine({ type: 'success', content: '> INTENT_WHISPERED // TX: 0xA7F2...E9C1' });
    addLine({ type: 'info', content: '> COLLATERAL_LOCKED: ' + lastIntent.collateral + ' USDC' });
    addLine({ type: 'info', content: '> EXPIRY_SLOT: ' + (Math.floor(Date.now() / 400) + lastIntent.timeDecay) });
    addLine({ type: 'info', content: '> AWAITING LISTEN NODE PARSE...................' });
    await new Promise((r) => setTimeout(r, 600));
    addLine({ type: 'success', content: '> SIGNAL_PARSED // 0x' + Math.random().toString(16).slice(2, 10).toUpperCase().padEnd(8, '0') });
    addLine({ type: 'info', content: '> ENTERING DARKPOOL BIDDING....................' });
    addLine({ type: 'info', content: '> 3 AGENTS BIDDING  //  WINNER: NODE_47  //  FEE: 0.00015 SOL' });
    await new Promise((r) => setTimeout(r, 800));
    addLine({ type: 'success', content: '> TRANSMISSION_CONFIRMED' });
    addLine({ type: 'success', content: '> SIGNAL_LOCKED' });
    addLine({ type: 'info', content: '> TX_SIGNATURE: 5xK8n...3HpQ2vR9mE4wY7jC1aL6bN0dF8sT' });
    onExecuted?.(lastIntent);
    setIsProcessing(false);
  }, [lastIntent, addLine, onExecuted]);

  const handleCancel = useCallback(() => {
    if (isProcessing) return;
    setInput('');
    setLastIntent(null);
  }, [isProcessing]);

  return (
    <div className="flex flex-col h-full">
      {/* Output area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line) => (
          <div
            key={line.id}
            className={clsx(
              'whitespace-pre-wrap break-all',
              line.type === 'command' && 'text-amber',
              line.type === 'response' && 'text-bone-dim',
              line.type === 'json' && 'text-green',
              line.type === 'error' && 'text-red',
              line.type === 'info' && 'text-bone-dim',
              line.type === 'success' && 'text-green',
              line.type === 'system' && 'text-amber'
            )}
          >
            {line.content}
          </div>
        ))}
        {isProcessing && (
          <div className="text-amber flex items-center gap-1">
            <span>PROCESSING</span>
            <Cursor color="amber" />
          </div>
        )}
      </div>

      <Divider variant="plus" className="px-3" />

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-grid bg-void">
        <span className="font-mono text-amber text-sm select-none">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
          placeholder="LONG 500 USDC SOL @ SLIPPAGE 0.5% WITHIN 2 BLOCKS"
          className="flex-1 bg-transparent font-mono text-bone text-sm placeholder:text-grid-2 placeholder:uppercase tracking-wide caret-amber outline-none disabled:opacity-50"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={handleCancel}
          className="font-mono text-xs uppercase tracking-widest text-bone-dim hover:text-amber px-2"
        >
          [ESC]
        </button>
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="font-mono text-xs uppercase tracking-widest text-amber border border-amber px-3 py-1 hover:bg-amber hover:text-void transition-colors duration-75 disabled:border-grid-2 disabled:text-grid-2 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-grid-2"
        >
          [ENTER]
        </button>
      </form>

      {/* Action bar */}
      {lastIntent && (
        <div className="border-t border-grid bg-void-2 p-3 flex items-center justify-between gap-3">
          <StatusBanner state="ok">INTENT_READY: {lastIntent.direction} {lastIntent.amount} {lastIntent.tokenIn} → {lastIntent.tokenOut}</StatusBanner>
          <div className="flex items-center gap-2">
            <TerminalButton variant="ghost" size="sm" onClick={handleCancel}>
              ABORT
            </TerminalButton>
            <TerminalButton variant="primary" size="sm" onClick={handleExecute} disabled={isProcessing}>
              EXECUTE_SIGNAL
            </TerminalButton>
          </div>
        </div>
      )}

      {selectedSignalId && !lastIntent && (
        <div className="border-t border-grid bg-void-2 p-3 flex items-center justify-between gap-3">
          <StatusBanner state="wait">SELECTED: {selectedSignalId.slice(0, 8)}</StatusBanner>
          <TerminalButton variant="ghost" size="sm" onClick={() => setInput(`EXECUTE ${selectedSignalId}`)}>
            QUOTE &gt;
          </TerminalButton>
        </div>
      )}
    </div>
  );
}
