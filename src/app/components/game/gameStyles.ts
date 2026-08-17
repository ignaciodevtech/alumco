import type { NeonKey, Rarity } from '../../data/gamification';

/**
 * Tailwind class strings for each neon accent, written out in full so the
 * Tailwind v4 content scanner (which looks for literal class names, not
 * runtime-built strings) always finds them.
 */
interface NeonClasses {
  text: string;
  textGlow: string;
  border: string;
  bgSoft: string;
  bgSolid: string;
  glow: string;
  ring: string;
}

export const NEON_STYLES: Record<NeonKey, NeonClasses> = {
  lime: {
    text: 'text-neon-lime',
    textGlow: 'text-neon-lime text-glow-lime',
    border: 'border-neon-lime',
    bgSoft: 'bg-neon-lime/10',
    bgSolid: 'bg-neon-lime',
    glow: 'glow-lime',
    ring: 'ring-neon-lime',
  },
  cyan: {
    text: 'text-neon-cyan',
    textGlow: 'text-neon-cyan text-glow-cyan',
    border: 'border-neon-cyan',
    bgSoft: 'bg-neon-cyan/10',
    bgSolid: 'bg-neon-cyan',
    glow: 'glow-cyan',
    ring: 'ring-neon-cyan',
  },
  violet: {
    text: 'text-neon-violet',
    textGlow: 'text-neon-violet text-glow-violet',
    border: 'border-neon-violet',
    bgSoft: 'bg-neon-violet/10',
    bgSolid: 'bg-neon-violet',
    glow: 'glow-violet',
    ring: 'ring-neon-violet',
  },
  magenta: {
    text: 'text-neon-magenta',
    textGlow: 'text-neon-magenta text-glow-magenta',
    border: 'border-neon-magenta',
    bgSoft: 'bg-neon-magenta/10',
    bgSolid: 'bg-neon-magenta',
    glow: 'glow-magenta',
    ring: 'ring-neon-magenta',
  },
  gold: {
    text: 'text-neon-gold',
    textGlow: 'text-neon-gold text-glow-gold',
    border: 'border-neon-gold',
    bgSoft: 'bg-neon-gold/10',
    bgSolid: 'bg-neon-gold',
    glow: 'glow-gold',
    ring: 'ring-neon-gold',
  },
};

interface RarityMeta {
  label: string;
  neon: NeonKey;
  classes: NeonClasses;
}

/** Hex fallbacks for canvas-confetti (fed straight to canvas fillStyle —
 * hex keeps this reliable across older browsers that don't parse oklch()
 * inside a 2d canvas context). Approximate matches to the neon tokens. */
export const CONFETTI_HEX: Record<NeonKey, string[]> = {
  lime: ['#a3e635', '#4ade80', '#ffffff'],
  cyan: ['#22d3ee', '#38bdf8', '#ffffff'],
  violet: ['#a78bfa', '#8b5cf6', '#ffffff'],
  magenta: ['#f472b6', '#e879f9', '#ffffff'],
  gold: ['#fbbf24', '#facc15', '#ffffff'],
};

export const RARITY_STYLES: Record<Rarity, RarityMeta> = {
  common: { label: 'Común', neon: 'lime', classes: NEON_STYLES.lime },
  rare: { label: 'Rara', neon: 'cyan', classes: NEON_STYLES.cyan },
  epic: { label: 'Épica', neon: 'violet', classes: NEON_STYLES.violet },
  legendary: { label: 'Legendaria', neon: 'gold', classes: NEON_STYLES.gold },
};
