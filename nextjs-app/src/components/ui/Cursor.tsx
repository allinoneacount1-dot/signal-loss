'use client';

import clsx from 'clsx';

interface CursorProps {
  color?: 'amber' | 'green' | 'red';
  className?: string;
}

export function Cursor({ color = 'amber', className }: CursorProps) {
  return (
    <span
      className={clsx(
        'inline-block w-[0.6em] h-[1em] align-text-bottom animate-blink',
        color === 'amber' && 'bg-amber',
        color === 'green' && 'bg-green',
        color === 'red' && 'bg-red',
        className
      )}
      aria-hidden="true"
    />
  );
}
