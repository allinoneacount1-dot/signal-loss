'use client';

import { useState } from 'react';
import { TerminalInput } from '@/components/ui/TerminalInput';
import { TerminalButton } from '@/components/ui/TerminalButton';
import { Cursor } from '@/components/ui/Cursor';

export default function TestComponentsPage() {
  const [val, setVal] = useState('');
  return (
    <div className="min-h-screen bg-void p-8">
      <div className="max-w-2xl mx-auto space-y-8 font-mono">
        <h1 className="text-amber text-2xl">// COMPONENT_TEST_HARNESS</h1>
        <div className="space-y-4">
          <TerminalButton variant="primary">EXECUTE_SIGNAL</TerminalButton>
          <TerminalButton variant="danger">SLASH_AGENT</TerminalButton>
          <TerminalButton variant="ghost">CALIBRATION</TerminalButton>
          <TerminalButton variant="success">SIGNAL_LOCKED</TerminalButton>
        </div>
        <TerminalInput prefix=">" prefixColor="amber" placeholder="ENTER COMMAND" value={val} onChange={(e) => setVal(e.target.value)} />
        <div className="text-amber">CURSOR: <Cursor color="amber" /></div>
      </div>
    </div>
  );
}
