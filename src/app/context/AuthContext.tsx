import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLevelForPoints, getPointsForExamScore, POINTS_CONFIG, BADGES } from '../data/gamification';

export const SEDES = ['Santiago Centro', 'Las Condes', 'Providencia', 'Ñuñoa', 'Maipú'] as const;
export type Sede = (typeof SEDES)[number];

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'teacher';
  sede: Sede;
  completedCourses: string[];
  certificates: Certificate[];
  // Gamification
  points: number;
  badges: string[];
  streak: number;
  lastActivity: string | null;
  weeklyModuleDates: string[];
}

interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  completedAt: string;
  score: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, sede?: Sede) => Promise<boolean>;
  logout: () => void;
  updateUserProgress: (courseId: string, score: number, courseName: string, totalCourses: number, isFirstAttempt: boolean) => void;
  awardModulePoints: (moduleId: string, courseId: string) => void;
  recordDailyActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function ensureGamification(u: Partial<User>): User {
  return {
    sede: 'Santiago Centro',
    points: 0,
    badges: [],
    streak: 1,
    lastActivity: null,
    weeklyModuleDates: [],
    completedCourses: [],
    certificates: [],
    ...u,
  } as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(ensureGamification(parsed));
    }
    const mods = localStorage.getItem('completedModules');
    if (mods) setCompletedModuleIds(new Set(JSON.parse(mods)));
  }, []);

  function save(u: User) {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  }

  function saveMods(mods: Set<string>) {
    setCompletedModuleIds(mods);
    localStorage.setItem('completedModules', JSON.stringify([...mods]));
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    let base: Partial<User>;

    if (email === 'admin@example.com' && password === 'admin123') {
      base = { id: 'admin-1', email, name: 'Administrador', role: 'admin', sede: 'Santiago Centro' };
    } else if (email === 'teacher@example.com' && password === 'teacher123') {
      base = { id: 'teacher-1', email, name: 'Prof. Carmen Silva', role: 'teacher', sede: 'Las Condes' };
    } else {
      base = { id: `u-${email}`, email, name: email.split('@')[0], role: 'user', sede: 'Providencia' };
    }

    const u = ensureGamification(base);
    // Restore persisted gamification data if same user
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.id === u.id) {
        save(ensureGamification(parsed));
        return true;
      }
    }
    save(u);
    return true;
  };

  const register = async (email: string, password: string, name: string, sede: Sede = 'Santiago Centro'): Promise<boolean> => {
    const u = ensureGamification({
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      sede,
    });
    save(u);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('completedModules');
    setCompletedModuleIds(new Set());
  };

  const recordDailyActivity = () => {
    if (!user) return;
    const todayStr = today();
    if (user.lastActivity === todayStr) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];

    const newStreak = user.lastActivity === yStr ? user.streak + 1 : 1;

    const newBadges = [...user.badges];
    if (newStreak >= 3 && !newBadges.includes('streak_3')) newBadges.push('streak_3');
    if (newStreak >= 7 && !newBadges.includes('streak_7')) newBadges.push('streak_7');

    save({ ...user, streak: newStreak, lastActivity: todayStr, badges: newBadges });
  };

  const awardModulePoints = (moduleId: string, courseId: string) => {
    if (!user) return;
    const key = `${courseId}:${moduleId}`;
    if (completedModuleIds.has(key)) return;

    const newMods = new Set(completedModuleIds);
    newMods.add(key);
    saveMods(newMods);

    const newPoints = user.points + POINTS_CONFIG.MODULE_COMPLETE;
    const newBadges = [...user.badges];

    // Weekly module streak badge
    const todayStr = today();
    const weekDates = [...user.weeklyModuleDates, todayStr].filter((d, i, a) => a.indexOf(d) === i);
    // Check 3 distinct weeks (ISO week number)
    const weekNumbers = weekDates.map(d => {
      const dt = new Date(d);
      const startOfYear = new Date(dt.getFullYear(), 0, 1);
      return Math.ceil(((dt.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    });
    const uniqueWeeks = [...new Set(weekNumbers)].sort((a, b) => b - a);
    const consecutiveWeeks = uniqueWeeks.reduce((acc, w, i) => {
      if (i === 0) return 1;
      return uniqueWeeks[i - 1] - w === 1 ? acc + 1 : acc;
    }, 0);
    if (consecutiveWeeks >= 3 && !newBadges.includes('weekly_streak')) {
      newBadges.push('weekly_streak');
    }

    save({ ...user, points: newPoints, badges: newBadges, weeklyModuleDates: weekDates });
  };

  const updateUserProgress = (
    courseId: string,
    score: number,
    courseName: string,
    totalCourses: number,
    isFirstAttempt: boolean,
  ) => {
    if (!user) return;

    const certificate: Certificate = {
      id: Date.now().toString(),
      courseId,
      courseName,
      completedAt: new Date().toISOString(),
      score,
    };

    const newCompleted = [...user.completedCourses, courseId];
    const newCerts = [...user.certificates, certificate];
    const examPts = getPointsForExamScore(score);
    const newPoints = user.points + examPts;
    const newBadges = [...user.badges];

    // Badge: first course
    if (newCompleted.length === 1 && !newBadges.includes('first_course')) {
      newBadges.push('first_course');
    }
    // Badge: all courses completed (champion)
    if (newCompleted.length >= totalCourses && !newBadges.includes('champion')) {
      newBadges.push('champion');
    }
    // Badge: perfect score
    if (score >= 100 && !newBadges.includes('perfect_score')) {
      newBadges.push('perfect_score');
    }
    // Badge: no errors on first attempt
    if (score >= 100 && isFirstAttempt && !newBadges.includes('no_errors')) {
      newBadges.push('no_errors');
    }

    save({
      ...user,
      completedCourses: newCompleted,
      certificates: newCerts,
      points: newPoints,
      badges: newBadges,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProgress,
        awardModulePoints,
        recordDailyActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
