'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BootSequence } from '@/components/terminal/BootSequence';

export default function LandingPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  const handleAuth = () => {
    setAuthed(true);
    setTimeout(() => {
      router.push('/terminal');
    }, 600);
  };

  if (authed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-void">
        <div className="font-mono text-amber text-sm uppercase tracking-widest flex items-center gap-2">
          [ CHANNEL_AUTHENTICATED ] // ROUTING TO DASHBOARD
          <span className="inline-block w-3 h-4 bg-amber animate-blink" />
        </div>
      </div>
    );
  }

  return <BootSequence onComplete={handleAuth} />;
}
