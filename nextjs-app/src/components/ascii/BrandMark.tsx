'use client';

import clsx from 'clsx';

/**
 * SIGNAL_LOSS brand mark.
 * Pure ASCII — no SVG, no images.
 * Resize via font-size.
 */
export function BrandMark({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={clsx('font-display text-amber leading-[1.05] select-none', sizeClasses[size], className)}>
      <pre className="m-0 p-0">
{` ____   ___  __  __ ___ ____  _      ____
/ ___| / _ \\|  \\/  |_ _/ ___|| |    / ___|
\\___ \\| | | | |\\/| || | |    | |    \\___ \\
 ___) | |_| | |  | || | |___ | |___  ___) |
|____/ \\___/|_|  |_|___\\____||_____|____/
                                          `}
      </pre>
    </div>
  );
}

/**
 * Compact horizontal lockup.
 */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center gap-2 font-display text-amber text-2xl tracking-widest', className)}>
      <span>[</span>
      <span>SIGNAL_LOSS</span>
      <span>]</span>
    </div>
  );
}
