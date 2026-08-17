import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import type { LevelDef } from '../../data/gamification';
import { CONFETTI_HEX, NEON_STYLES } from './gameStyles';
import { RankBadge } from './RankBadge';

interface LevelUpCelebrationProps {
  level: LevelDef | null;
  onClose: () => void;
}

/** Full-screen celebration shown the moment a student crosses into a new
 * rank — fires a confetti burst in the new rank's color and reveals the
 * rank badge with a spring pop. Mounted once (in Layout) so it triggers
 * no matter which page awarded the points. */
export function LevelUpCelebration({ level, onClose }: LevelUpCelebrationProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!level || prefersReducedMotion) return;
    const colors = CONFETTI_HEX[level.neon];
    const end = Date.now() + 700;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [level, prefersReducedMotion]);

  const styles = level ? NEON_STYLES[level.neon] : null;

  return (
    <AnimatePresence>
      {level && styles && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Subiste de rango: ${level.name}`}
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            data-game-panel
            data-game-grid
            className="relative w-full max-w-sm rounded-2xl border border-game-border p-8 text-center shadow-2xl"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 16 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-3 right-3 text-game-ink-muted hover:text-game-ink transition-colors"
            >
              <X className="size-5" />
            </button>

            <p className="text-xs font-display uppercase tracking-[0.3em] text-game-ink-muted mb-4">
              ¡Subiste de rango!
            </p>

            <div className="flex justify-center mb-4">
              <RankBadge level={level} size="lg" />
            </div>

            <h2 className={`font-display text-3xl font-bold uppercase tracking-wide mb-2 ${styles.textGlow}`}>
              {level.name}
            </h2>
            <p className="text-sm text-game-ink-muted mb-6">{level.tagline}</p>

            <Button onClick={onClose} className="w-full">
              Seguir jugando
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
