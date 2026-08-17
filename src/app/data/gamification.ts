import { Shield, Zap, Flame, Crown, Sparkles, type LucideIcon } from 'lucide-react';

/** One of the five neon accent colors defined in theme.css / game.css. */
export type NeonKey = 'lime' | 'cyan' | 'violet' | 'magenta' | 'gold';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface LevelDef {
  /** Rank name shown in the UI — "Recluta", "Operador", etc. */
  name: string;
  /** Short line used in level-up moments / tooltips. */
  tagline: string;
  icon: LucideIcon;
  minPoints: number;
  neon: NeonKey;
  /** True only for the top rank — unlocks the animated prismatic ring. */
  prismatic?: boolean;
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: Rarity;
}

/**
 * Rank ladder. Five tiers instead of the original four — "Mítico" is an
 * aspirational top rank that keeps the most engaged collaborators chasing
 * something even after "Leyenda", without touching how points are earned.
 */
export const LEVELS: LevelDef[] = [
  {
    name: 'Recluta',
    tagline: 'Acabas de entrar al juego. ¡A sumar tus primeros puntos!',
    icon: Shield,
    minPoints: 0,
    neon: 'lime',
  },
  {
    name: 'Operador',
    tagline: 'Ya tienes el ritmo. Sigue completando módulos.',
    icon: Zap,
    minPoints: 150,
    neon: 'cyan',
  },
  {
    name: 'Elite',
    tagline: 'Pocos llegan hasta aquí. Tu constancia se nota.',
    icon: Flame,
    minPoints: 400,
    neon: 'violet',
  },
  {
    name: 'Leyenda',
    tagline: 'Referente de tu sede. Un rango que se gana.',
    icon: Crown,
    minPoints: 750,
    neon: 'magenta',
  },
  {
    name: 'Mítico',
    tagline: 'El rango más alto de la plataforma. Estás en la cima.',
    icon: Sparkles,
    minPoints: 1500,
    neon: 'gold',
    prismatic: true,
  },
];

export const BADGES: BadgeDef[] = [
  {
    id: 'first_course',
    name: 'Primera Capacitación',
    description: 'Completaste tu primer curso exitosamente',
    emoji: '🎓',
    rarity: 'common',
  },
  {
    id: 'streak_3',
    name: 'Racha de 3 Días',
    description: '3 días consecutivos activo en la plataforma',
    emoji: '�',
    rarity: 'common',
  },
  {
    id: 'no_errors',
    name: 'Sin Errores',
    description: 'Aprobaste un examen con 100% en tu primer intento',
    emoji: '✨',
    rarity: 'rare',
  },
  {
    id: 'streak_7',
    name: 'Dedicado',
    description: '7 días consecutivos activo en la plataforma',
    emoji: '⚡',
    rarity: 'rare',
  },
  {
    id: 'perfect_score',
    name: 'Puntaje Perfecto',
    description: 'Obtuviste 100% en un examen',
    emoji: '💯',
    rarity: 'epic',
  },
  {
    id: 'weekly_streak',
    name: 'Constante',
    description: 'Completaste módulos durante 3 semanas seguidas',
    emoji: '🚀',
    rarity: 'epic',
  },
  {
    id: 'champion',
    name: 'Campeón de Sede',
    description: 'Completaste todos los cursos disponibles',
    emoji: '🏆',
    rarity: 'legendary',
  },
];

export const POINTS_CONFIG = {
  MODULE_COMPLETE: 15,
  PASS_EXAM_70: 50,
  PASS_EXAM_80: 75,
  PASS_EXAM_90: 100,
  PASS_EXAM_100: 150,
};

export function getLevelForPoints(pts: number): LevelDef {
  const sorted = [...LEVELS].sort((a, b) => b.minPoints - a.minPoints);
  return sorted.find(l => pts >= l.minPoints) ?? LEVELS[0];
}

export function getNextLevel(pts: number): LevelDef | null {
  const current = getLevelForPoints(pts);
  const idx = LEVELS.findIndex(l => l.name === current.name);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getPointsForExamScore(score: number): number {
  if (score >= 100) return POINTS_CONFIG.PASS_EXAM_100;
  if (score >= 90) return POINTS_CONFIG.PASS_EXAM_90;
  if (score >= 80) return POINTS_CONFIG.PASS_EXAM_80;
  return POINTS_CONFIG.PASS_EXAM_70;
}

export function getLevelProgress(pts: number): number {
  const current = getLevelForPoints(pts);
  const next = getNextLevel(pts);
  if (!next) return 100;
  const range = next.minPoints - current.minPoints;
  const earned = pts - current.minPoints;
  return Math.round((earned / range) * 100);
}

export function getBadgeById(id: string): BadgeDef | undefined {
  return BADGES.find(b => b.id === id);
}
