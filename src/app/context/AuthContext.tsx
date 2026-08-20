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
  completedModuleIds: string[];
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
  /** True until the initial localStorage session lookup finishes. Routes
   * must not redirect-to-login while this is true, or a page reload would
   * always bounce the user out before their session had a chance to load
   * (see AuthProvider's init effect for why). */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, sede?: Sede) => Promise<boolean>;
  logout: () => void;
  updateUserProgress: (courseId: string, score: number, courseName: string, totalCourses: number, isFirstAttempt: boolean) => void;
  awardModulePoints: (moduleId: string, courseId: string) => void;
  recordDailyActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Every user's profile (progress, points, badges, certificates...) is
// persisted permanently under its own key, keyed by user id, so it survives
// logging out. `SESSION_KEY` only tracks *which* profile is currently signed
// in — logging out must forget that pointer, never the profile data itself.
const PROFILE_PREFIX = 'alumco_profile_';
const SESSION_KEY = 'alumco_session_user_id';
// Old, single-profile storage scheme this app used to use. `logout()` used to
// wipe this key outright, permanently deleting whoever's progress was in it.
const LEGACY_USER_KEY = 'user';
const LEGACY_MODULES_KEY = 'completedModules';

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
    completedModuleIds: [],
    ...u,
  } as User;
}

function profileKey(id: string) {
  return `${PROFILE_PREFIX}${id}`;
}

function loadProfile(id: string): User | null {
  const raw = localStorage.getItem(profileKey(id));
  if (!raw) return null;
  try {
    return ensureGamification(JSON.parse(raw));
  } catch {
    return null;
  }
}

function persistProfile(u: User) {
  localStorage.setItem(profileKey(u.id), JSON.stringify(u));
}

/** One-time upgrade from the old single-key storage scheme to the per-user
 * profile scheme above. Safe to call on every mount — it's a no-op once a
 * session key exists. */
function migrateLegacyStorage() {
  if (localStorage.getItem(SESSION_KEY)) return;

  const legacyRaw = localStorage.getItem(LEGACY_USER_KEY);
  if (!legacyRaw) return;

  try {
    const legacyUser = JSON.parse(legacyRaw);
    if (!legacyUser?.id) return;

    const legacyMods = localStorage.getItem(LEGACY_MODULES_KEY);
    const migrated = ensureGamification({
      ...legacyUser,
      completedModuleIds: legacyMods ? JSON.parse(legacyMods) : [],
    });

    persistProfile(migrated);
    localStorage.setItem(SESSION_KEY, migrated.id);
  } catch {
    // Malformed legacy data — ignore, the user just starts fresh.
  } finally {
    localStorage.removeItem(LEGACY_USER_KEY);
    localStorage.removeItem(LEGACY_MODULES_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Starts true and flips to false once the localStorage lookup below runs.
  // React fires effects bottom-up (children before parents), so on a page
  // reload a protected page's own "redirect if not authenticated" effect
  // would otherwise run *before* this one restores the session — kicking
  // a perfectly logged-in user back to /login every time. Consumers (see
  // Layout.tsx) hold off rendering routes until isLoading is false, which
  // means this effect always resolves before any page-level effect can fire.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    migrateLegacyStorage();
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      const profile = loadProfile(sessionId);
      if (profile) {
        setUser(profile);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  function save(u: User) {
    setUser(u);
    persistProfile(u);
    localStorage.setItem(SESSION_KEY, u.id);
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

    // Restore this user's persisted profile if they've logged in before on
    // this browser, otherwise start a fresh one. Either way, save() below
    // never deletes anything — a later logout won't lose this progress.
    const existing = loadProfile(base.id!);
    save(existing ?? ensureGamification(base));
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
    // Only forget *which* profile is signed in — the profile itself (points,
    // badges, certificates, completed courses) stays in localStorage under
    // its own key so it's there again next time this user logs in.
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
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
    if (user.completedModuleIds.includes(key)) return;

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

    save({
      ...user,
      points: newPoints,
      badges: newBadges,
      weeklyModuleDates: weekDates,
      completedModuleIds: [...user.completedModuleIds, key],
    });
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
        isLoading,
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
