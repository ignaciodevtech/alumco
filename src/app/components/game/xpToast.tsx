import { toast } from 'sonner';
import { Zap } from 'lucide-react';

/** A game-styled toast for "+N XP" moments (module complete, exam passed).
 * Swaps the default sonner card for a dark, glowing HUD pill so earning
 * points reads as a reward, not a system notification. */
export function showXPToast(points: number, message: string) {
  toast.custom(
    () => (
      <div
        data-game-panel
        className="flex items-center gap-3 rounded-xl border border-game-border px-4 py-3 shadow-lg glow-amber"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-game-surface-2">
          <Zap className="size-5 text-neon-amber" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-display text-lg font-bold leading-none text-neon-amber text-glow-amber">
            +{points} XP
          </p>
          <p className="text-xs text-game-ink-muted mt-1">{message}</p>
        </div>
      </div>
    ),
    { duration: 2600 },
  );
}
