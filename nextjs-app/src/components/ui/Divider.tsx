'use client';

import clsx from 'clsx';

interface DividerProps {
  variant?: 'plus' | 'dash' | 'wave' | 'bar';
  className?: string;
}

const variants = {
  plus: '----+----+----+----+----+----+----+----+----+',
  dash: '----------------------------------------',
  wave: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  bar: '========================================',
};

export function Divider({ variant = 'plus', className }: DividerProps) {
  return (
    <div
      className={clsx('font-accent text-grid-2 text-xs tracking-widest select-none overflow-hidden whitespace-nowrap', className)}
      aria-hidden="true"
    >
      {variants[variant]}
    </div>
  );
}
