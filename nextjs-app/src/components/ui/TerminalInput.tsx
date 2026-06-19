'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface TerminalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  prefixColor?: 'amber' | 'green' | 'bone' | 'red';
}

const prefixColorClasses = {
  amber: 'text-amber',
  green: 'text-green',
  bone: 'text-bone',
  red: 'text-red',
};

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ prefix, prefixColor = 'amber', className, ...rest }, ref) => {
    return (
      <div className="flex items-center gap-2 border border-grid bg-void px-3 py-2 focus-within:border-amber transition-colors duration-75">
        {prefix && (
          <span className={clsx('font-mono text-sm select-none', prefixColorClasses[prefixColor])}>
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            'flex-1 bg-transparent font-mono text-bone text-sm',
            'placeholder:text-grid-2 placeholder:uppercase placeholder:tracking-widest',
            'caret-amber outline-none',
            className
          )}
          {...rest}
        />
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';
