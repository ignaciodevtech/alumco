import { Lock } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../ui/utils';
import type { BadgeDef } from '../../data/gamification';
import { RARITY_STYLES } from './gameStyles';

interface BadgeTileProps {
  badge: BadgeDef;
  earned: boolean;
  index?: number;
}

/** A single collectible badge card — glowing trading-card treatment when
 * earned (intensity scales with rarity), muted and locked otherwise. */
export function BadgeTile({ badge, earned, index = 0 }: BadgeTileProps) {
  const rarity = RARITY_STYLES[badge.rarity];
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      title={badge.description}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      whileHover={earned && !prefersReducedMotion ? { scale: 1.04, y: -2 } : undefined}
      className={cn(
        'relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center',
        earned
          ? cn('bg-game-surface-2 border-game-border', rarity.classes.glow)
          : 'bg-game-surface/60 border-game-border/60 opacity-50 grayscale',
      )}
    >
      {badge.rarity === 'legendary' && earned && (
        <div className="pointer-events-none absolute inset-0 rounded-xl shimmer-sweep" />
      )}
      <span className="text-3xl leading-none">{badge.emoji}</span>
      <span
        className={cn(
          'text-xs font-semibold leading-tight font-display tracking-wide',
          earned ? rarity.classes.text : 'text-game-ink-muted',
        )}
      >
        {badge.name}
      </span>
      {earned ? (
        <span className={cn('text-[10px] uppercase tracking-widest', rarity.classes.text, 'opacity-80')}>
          {rarity.label}
        </span>
      ) : (
        <Lock className="absolute top-1.5 right-1.5 size-3 text-game-ink-muted" />
      )}
    </motion.div>
  );
}
