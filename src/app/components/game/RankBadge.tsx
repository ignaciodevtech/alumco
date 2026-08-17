import { cn } from '../ui/utils';
import type { LevelDef } from '../../data/gamification';
import { NEON_STYLES } from './gameStyles';

interface RankBadgeProps {
  level: LevelDef;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Show the rank name next to the icon. */
  showLabel?: boolean;
  className?: string;
}

const SIZE_STYLES = {
  xs: { wrap: 'size-5', icon: 'size-3', text: 'text-[10px]' },
  sm: { wrap: 'size-8', icon: 'size-4', text: 'text-xs' },
  md: { wrap: 'size-12', icon: 'size-6', text: 'text-sm' },
  lg: { wrap: 'size-20', icon: 'size-10', text: 'text-lg' },
} as const;

/** A rank/level icon chip with neon glow. Used in the dashboard HUD,
 * ranking podium/list, profile header and the persistent nav. */
export function RankBadge({ level, size = 'md', showLabel = false, className }: RankBadgeProps) {
  const styles = NEON_STYLES[level.neon];
  const sizing = SIZE_STYLES[size];
  const Icon = level.icon;

  const iconChip = (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full shrink-0',
        'bg-game-surface-2',
        sizing.wrap,
        styles.glow,
      )}
    >
      <Icon className={cn(sizing.icon, styles.text)} strokeWidth={2.25} />
    </div>
  );

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      {level.prismatic ? (
        <div className="ring-prismatic rounded-full">{iconChip}</div>
      ) : (
        iconChip
      )}
      {showLabel && (
        <span
          className={cn(
            'font-display font-semibold uppercase tracking-wide',
            sizing.text,
            styles.textGlow,
          )}
        >
          {level.name}
        </span>
      )}
    </div>
  );
}
