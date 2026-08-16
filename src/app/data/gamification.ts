export interface LevelDef {
  name: string;
  emoji: string;
  minPoints: number;
  color: string;
  bgColor: string;
  textColor: string;
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bgColor: string;
  textColor: string;
}

export const LEVELS: LevelDef[] = [
  {
    name: 'Aprendiz',
    emoji: '🌱',
    minPoints: 0,
    color: 'border-green-300',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  {
    name: 'Colaborador',
    emoji: '⭐',
    minPoints: 150,
    color: 'border-blue-300',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    name: 'Experto',
    emoji: '🔥',
    minPoints: 400,
    color: 'border-orange-300',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  {
    name: 'Maestro',
    emoji: '👑',
    minPoints: 750,
    color: 'border-purple-300',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
];

export const BADGES: BadgeDef[] = [
  {
    id: 'first_course',
    name: 'Primera Capacitación',
    description: 'Completaste tu primer curso exitosamente',
    emoji: '🎓',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    id: 'champion',
    name: 'Campeón de Sede',
    description: 'Completaste todos los cursos disponibles',
    emoji: '🏆',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
  },
  {
    id: 'perfect_score',
    name: 'Puntaje Perfecto',
    description: 'Obtuviste 100% en un examen',
    emoji: '💯',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  {
    id: 'no_errors',
    name: 'Sin Errores',
    description: 'Aprobaste un examen con 100% en tu primer intento',
    emoji: '✨',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
  },
  {
    id: 'streak_3',
    name: 'Racha de 3 Días',
    description: '3 días consecutivos activo en la plataforma',
    emoji: '🔥',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  {
    id: 'streak_7',
    name: 'Dedicado',
    description: '7 días consecutivos activo en la plataforma',
    emoji: '⚡',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    id: 'weekly_streak',
    name: 'Constante',
    description: 'Completaste módulos durante 3 semanas seguidas',
    emoji: '🚀',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
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
