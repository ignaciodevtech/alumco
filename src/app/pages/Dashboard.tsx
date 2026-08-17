import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { BookOpen, Award, TrendingUp, ArrowRight, Trophy, Star } from 'lucide-react';
import { courses } from '../data/courses';
import {
  getLevelForPoints, getNextLevel, getLevelProgress, BADGES,
} from '../data/gamification';
import { RankBadge } from '../components/game/RankBadge';
import { XPBar } from '../components/game/XPBar';
import { StreakFlame } from '../components/game/StreakFlame';
import { BadgeTile } from '../components/game/BadgeTile';
import { NEON_STYLES } from '../components/game/gameStyles';

export function Dashboard() {
  const { user, isAuthenticated, recordDailyActivity } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    recordDailyActivity();
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const completedCount = user.completedCourses.length;
  const totalCourses = courses.length;
  const progressPercentage = (completedCount / totalCourses) * 100;

  const inProgressCourses = courses
    .filter(c => !user.completedCourses.includes(c.id))
    .slice(0, 3);

  // Gamification
  const level = getLevelForPoints(user.points);
  const nextLevel = getNextLevel(user.points);
  const levelProgress = getLevelProgress(user.points);
  const earnedBadges = BADGES.filter(b => user.badges.includes(b.id));
  const levelStyles = NEON_STYLES[level.neon];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">¡Bienvenido, {user.name}!</h1>
        <p className="text-gray-600">Continúa tu camino de aprendizaje · Sede: {user.sede}</p>
      </div>

      {/* ── Gamification HUD ─────────────────────────────────── */}
      <div data-game-panel data-game-grid className="mb-8 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <RankBadge level={level} size="lg" />

          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <div>
                <p className="text-[11px] font-display uppercase tracking-[0.25em] text-game-ink-muted">Rango actual</p>
                <p className={`font-display text-2xl font-bold uppercase tracking-wide ${levelStyles.textGlow}`}>
                  {level.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-game-ink">{user.points}</p>
                <p className="text-[11px] text-game-ink-muted uppercase tracking-wide">puntos</p>
              </div>
            </div>

            <XPBar value={levelProgress} neon={level.neon} />

            <p className="text-xs text-game-ink-muted mt-1.5">
              {nextLevel
                ? <>{levelProgress}% hacia <span className={NEON_STYLES[nextLevel.neon].text}>{nextLevel.name}</span> · faltan {nextLevel.minPoints - user.points} pts</>
                : '¡Rango máximo alcanzado! Eres una leyenda de la plataforma.'}
            </p>
          </div>

          <div className="shrink-0 flex sm:flex-col items-center gap-2 border-t sm:border-t-0 sm:border-l border-game-border pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-center">
            <StreakFlame streak={user.streak} size="lg" />
            <p className="text-[11px] text-game-ink-muted uppercase tracking-wide">días de racha</p>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cursos Completados</CardTitle>
            <BookOpen className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-gray-600">de {totalCourses} disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Certificados Obtenidos</CardTitle>
            <Award className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.certificates.length}</div>
            <p className="text-xs text-gray-600">certificaciones activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Progreso General</CardTitle>
            <TrendingUp className="size-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* ── Badges / Insignias ───────────────────────────── */}
      <div data-game-panel className="mb-8 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-game-ink">
              <Star className="size-5 text-neon-gold" />
              Mis Insignias
            </h3>
            <p className="text-sm text-game-ink-muted">
              {earnedBadges.length} de {BADGES.length} insignias obtenidas
            </p>
          </div>
          <Link to="/ranking">
            <Button variant="outline" size="sm" className="gap-1 bg-transparent border-game-border text-game-ink hover:bg-game-surface-2 hover:text-game-ink">
              <Trophy className="size-4" /> Ver Ranking
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((badge, i) => (
            <BadgeTile key={badge.id} badge={badge} earned={user.badges.includes(badge.id)} index={i} />
          ))}
        </div>
      </div>

      {/* ── Certificates ─────────────────────────────────── */}
      {user.certificates.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Certificados Recientes</CardTitle>
            <CardDescription>Tus últimos logros obtenidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.certificates.slice(-3).reverse().map(cert => (
                <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Award className="size-8 text-yellow-500" />
                    <div>
                      <h4 className="font-semibold">{cert.courseName}</h4>
                      <p className="text-sm text-gray-600">
                        Completado el {new Date(cert.completedAt).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">Puntuación: {cert.score}%</Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/certificate/${cert.id}`}>Ver Certificado</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Continue Learning ────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Continúa Aprendiendo</CardTitle>
              <CardDescription>Cursos disponibles para ti</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/courses">
                Ver Todos <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {inProgressCourses.map(course => (
              <div key={course.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-primary to-neon-violet flex items-center justify-center">
                  <BookOpen className="size-12 text-white" />
                </div>
                <div className="p-4">
                  <Badge className="mb-2">{course.level}</Badge>
                  <h4 className="font-semibold mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  <p className="text-xs font-semibold text-amber-700 mb-3">
                    +{15 * course.modules.length} pts por módulos · +{
                      course.exam.passingScore >= 90 ? 100 : course.exam.passingScore >= 80 ? 75 : 50
                    } pts por examen
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{course.duration}</span>
                    <Button size="sm" asChild>
                      <Link to={`/courses/${course.id}`}>Comenzar</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {inProgressCourses.length === 0 && (
            <div className="text-center py-8">
              <Award className="size-16 mx-auto mb-4 text-yellow-500" />
              <h3 className="font-semibold text-lg mb-2">¡Felicitaciones!</h3>
              <p className="text-gray-600">Has completado todos los cursos disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
