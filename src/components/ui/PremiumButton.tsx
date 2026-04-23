import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function PremiumButton({
  children,
  onClick,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  disabled = false
}: PremiumButtonProps) {
  const variants = {
    primary: 'bg-[var(--premium-accent)] text-white hover:bg-[var(--premium-accent-hover)] shadow-lg shadow-[var(--premium-accent)]/20 border border-[var(--premium-accent)]/10',
    secondary: 'bg-[var(--premium-surface)] text-[var(--premium-text)] border border-[var(--premium-border)] hover:bg-[var(--premium-bg)] backdrop-blur-md',
    danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white',
    ghost: 'bg-transparent text-[var(--premium-text-secondary)] hover:text-[var(--premium-text)] hover:bg-[var(--premium-accent)]/5'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-xl',
    md: 'px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest',
    lg: 'px-10 py-5 text-sm rounded-[24px] font-bold tracking-tight'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group haptic-button',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      {children}
    </motion.button>
  );
}
