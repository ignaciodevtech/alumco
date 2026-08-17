import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../ui/utils';
import type { NeonKey } from '../../data/gamification';
import { NEON_STYLES } from './gameStyles';

interface XPBarProps {
  /** 0–100 */
  value: number;
  neon: NeonKey;
  height?: 'sm' | 'md';
  className?: string;
}

/** Animated XP progress bar — fills with a spring, glows in the rank's
 * neon color, and sweeps a shimmer highlight once it settles. */
export function XPBar({ value, neon, height = 'md', className }: XPBarProps) {
  const styles = NEON_STYLES[neon];
  const prefersReducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-game-surface-2/80 border border-game-border',
        height === 'sm' ? 'h-2' : 'h-3.5',
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn('relative h-full rounded-full shimmer-sweep', styles.bgSolid, styles.glow)}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 90, damping: 18 }
        }
      />
    </div>
  );
}
