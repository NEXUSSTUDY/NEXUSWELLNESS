import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, animate = true, onClick }: GlassCardProps) {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      onClick={onClick}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      exit={animate ? { opacity: 0, y: -20 } : undefined}
      className={cn(
        'glass-card rounded-[40px] p-10',
        className
      )}
    >
      {children}
    </Component>
  );
}
