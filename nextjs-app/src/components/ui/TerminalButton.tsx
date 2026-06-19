'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'danger' | 'ghost' | 'success';

interface TerminalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'border-amber text-amber hover:bg-amber hover:text-void',
  danger: 'border-red text-red hover:bg-red hover:text-void',
  ghost: 'border-grid text-bone hover:border-amber hover:text-amber',
  success: 'border-green text-green hover:bg-green hover:text-void',
};

const sizeClasses = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const TerminalButton = forwardRef<HTMLButtonElement, TerminalButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, children, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          'font-mono uppercase tracking-widest',
          'border bg-transparent',
          'transition-colors duration-75',
          'active:translate-y-px',
          'disabled:border-grid-2 disabled:text-grid-2 disabled:cursor-not-allowed',
          'disabled:hover:bg-transparent disabled:hover:text-grid-2',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

TerminalButton.displayName = 'TerminalButton';
