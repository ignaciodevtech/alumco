import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { BookOpen, Award, TrendingUp, ArrowRight, Flame, Trophy, Star } from 'lucide-react';
import { courses } from '../data/courses';
import {
  getLevelForPoints, getNextLevel, getLevelProgress, getBadgeById, BADGES,
} from '../data/gamification';

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
  const lockedBadges = BADGES.filter(b => !user.badges.includes(b.id));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">¡Bienvenido, {user.name}!</h1>
          <p className="text-gray-600">Continúa tu camino de aprendizaje · Sede: {user.sede}</p>
        </div>
        {/* Streak banner */}
        {user.streak > 1 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
            <Flame className="size-5 text-orange-500" />
            <span className="font-bold text-orange-700">{user.streak} días de racha</span>
          </div>
        )}
      </div>

      {/* ── Gamification Level Card ───────────────────────── */}
      <Card className={`mb-6 border-2 ${level.color}`}>
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Level badge */}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${level.bgColor}`}>
              <span className="text-3xl">{level.emoji}</span>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nivel</p>
                <p className={`text-xl font-bold ${level.textColor}`}>{level.name}</p>
              </div>
            </div>

            {/* Points + progress */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">{user.points} puntos</span>
                {nextLevel ? (
                  <span className="text-gray-500">
                    {nextLevel.emoji} {nextLevel.name} en {nextLevel.minPoints - user.points} pts
                  </span>
                ) : (
                  <span className={`font-semibold ${level.textColor}`}>¡Nivel máximo!</span>
                )}
              </div>
              <Progress value={levelProgress} className="h-3" />
              {nextLevel && (
                <p className="text-xs text-gray-400 mt-1">
                  {levelProgress}% hacia {nextLevel.name}
                </p>
              )}
            </div>

            {/* Streak */}
            <div className="text-center shrink-0">
              <div className="flex items-center gap-1 text-orange-600 font-bold text-2xl">
                <Flame className="size-6" />
                {user.streak}
              </div>
              <p className="text-xs text-gray-500">días seguidos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Stats Grid ────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cursos Completados</CardTitle>
            <BookOpen className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-gray-600">de {totalCourses} disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Certificados Obtenidos</CardTitle>
            <Award className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.certificates.length}</div>
            <p className="text-xs text-gray-600">certificaciones activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Progreso General</CardTitle>
            <TrendingUp className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* ── Badges / Insignias ───────────────────────────── */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="size-5 text-yellow-500" />
              Mis Insignias
            </CardTitle>
            <CardDescription>
              {earnedBadges.length} de {BADGES.length} insignias obtenidas
            </CardDescription>
          </div>
          <Link to="/ranking">
            <Button variant="outline" size="sm" className="gap-1">
              <Trophy className="size-4" /> Ver Ranking
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BADGES.map(badge => {
              const earned = user.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  title={badge.description}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all ${
                    earned
                      ? `${badge.bgColor} border-current ${badge.textColor} shadow-sm`
                      : 'bg-gray-50 border-gray-200 opacity-40 grayscale'
                  }`}
                >
                  <span className="text-3xl">{badge.emoji}</span>
                  <span className={`text-xs font-semibold leading-tight ${earned ? badge.textColor : 'text-gray-400'}`}>
                    {badge.name}
                  </span>
                  {!earned && (
                    <span className="absolute top-1 right-1 text-xs">🔒</span>
                  )}
                </div>
              );
            })}
          </div>

          {earnedBadges.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Últimas insignias obtenidas:</h4>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.slice(-3).map(b => (
                  <Badge key={b.id} className={`${b.bgColor} ${b.textColor} border-0`}>
                    {b.emoji} {b.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="size-12 text-white" />
                </div>
                <div className="p-4">
                  <Badge className="mb-2">{course.level}</Badge>
                  <h4 className="font-semibold mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  <p className="text-xs text-gray-400 mb-3">
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
