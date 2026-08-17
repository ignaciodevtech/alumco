import { Flame } from 'lucide-react';
import { cn } from '../ui/utils';

interface StreakFlameProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  /** 'dark' (default) tunes colors + glow for the dark game panels.
   * 'light' swaps in WCAG-safe solid colors for use on white/light cards. */
  tone?: 'dark' | 'light';
  className?: string;
}

const SIZE_STYLES = {
  sm: { icon: 'size-4', text: 'text-sm' },
  md: { icon: 'size-6', text: 'text-2xl' },
  lg: { icon: 'size-9', text: 'text-4xl' },
} as const;

/** Streak counter whose glow intensity ramps up with longer streaks —
 * 1 day reads as a calm ember, 7+ reads as a blazing, glowing flame. */
export function StreakFlame({ streak, size = 'md', tone = 'dark', className }: StreakFlameProps) {
  const sizing = SIZE_STYLES[size];
  const intensity = streak >= 7 ? 'hot' : streak >= 3 ? 'warm' : 'spark';

  const colorClass = tone === 'dark'
    ? intensity === 'hot'
      ? 'text-neon-magenta text-glow-magenta'
      : intensity === 'warm'
        ? 'text-neon-amber text-glow-amber'
        : 'text-game-ink-muted'
    : intensity === 'hot'
      ? 'text-fuchsia-600'
      : intensity === 'warm'
        ? 'text-amber-600'
        : 'text-muted-foreground';

  return (
    <div className={cn('inline-flex items-center gap-1.5 font-display font-bold', sizing.text, colorClass, className)}>
      <Flame
        className={cn(sizing.icon, streak >= 3 && 'animate-flame-flicker')}
        strokeWidth={2.25}
        fill={streak >= 3 ? 'currentColor' : 'none'}
        fillOpacity={streak >= 3 ? 0.25 : 0}
      />
      <span>{streak}</span>
    </div>
  );
}
