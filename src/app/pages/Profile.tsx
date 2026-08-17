import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, Mail, Award, BookOpen, Calendar, ExternalLink, Trophy } from 'lucide-react';
import { courses } from '../data/courses';
import { getLevelForPoints, getNextLevel, getLevelProgress } from '../data/gamification';
import { RankBadge } from '../components/game/RankBadge';
import { XPBar } from '../components/game/XPBar';
import { StreakFlame } from '../components/game/StreakFlame';
import { NEON_STYLES } from '../components/game/gameStyles';

export function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const completedCourses = courses.filter((course) =>
    user.completedCourses.includes(course.id)
  );

  const totalScore = user.certificates.reduce((sum, cert) => sum + cert.score, 0);
  const averageScore = user.certificates.length > 0 
    ? Math.round(totalScore / user.certificates.length) 
    : 0;

  const isStudent = user.role === 'user';
  const level = getLevelForPoints(user.points);
  const nextLevel = getNextLevel(user.points);
  const levelProgress = getLevelProgress(user.points);
  const levelStyles = NEON_STYLES[level.neon];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6 flex-wrap">
              <div className="size-20 rounded-full bg-gradient-to-br from-primary to-neon-violet flex items-center justify-center text-white text-3xl font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <div className="flex items-center gap-4 text-gray-600 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4" />
                    {user.email}
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Administrador' : user.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                  </Badge>
                </div>
              </div>
              {isStudent && <RankBadge level={level} size="lg" showLabel />}
            </div>
          </CardContent>

          {isStudent && (
            <div data-game-panel data-game-grid className="px-6 py-5 border-t border-game-border">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-sm font-display font-semibold text-game-ink">
                  {user.points} puntos
                </span>
                {nextLevel ? (
                  <span className="text-xs text-game-ink-muted">
                    {levelProgress}% hacia <span className={levelStyles.text}>{nextLevel.name}</span> · faltan {nextLevel.minPoints - user.points} pts
                  </span>
                ) : (
                  <span className={`text-xs font-semibold ${levelStyles.text}`}>¡Rango máximo alcanzado!</span>
                )}
              </div>
              <XPBar value={levelProgress} neon={level.neon} height="sm" />
              <div className="mt-3">
                <StreakFlame streak={user.streak} size="sm" />
                <span className="text-xs text-game-ink-muted ml-1.5">días de racha activa</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cursos Completados</CardTitle>
            <BookOpen className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.completedCourses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Certificados</CardTitle>
            <Award className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.certificates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Promedio</CardTitle>
            <Trophy className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Miembro desde</CardTitle>
            <Calendar className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2026</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="certificates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="certificates">Mis Certificados</TabsTrigger>
          <TabsTrigger value="courses">Cursos Completados</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="mt-6">
          {user.certificates.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="size-16 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold text-lg mb-2">No tienes certificados aún</h3>
                <p className="text-gray-600 mb-4">
                  Completa un curso y aprueba el examen para obtener tu primer certificado
                </p>
                <Button asChild>
                  <Link to="/courses">Explorar Cursos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {user.certificates.map((certificate) => (
                <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Award className="size-10 text-yellow-500" />
                      <Badge variant="secondary">
                        Puntuación: {certificate.score}%
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{certificate.courseName}</CardTitle>
                    <CardDescription>
                      Completado el {new Date(certificate.completedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/certificate/${certificate.id}`}>
                        <ExternalLink className="size-4 mr-2" />
                        Ver Certificado
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          {completedCourses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="size-16 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold text-lg mb-2">No has completado cursos aún</h3>
                <p className="text-gray-600 mb-4">
                  Comienza tu aprendizaje hoy mismo
                </p>
                <Button asChild>
                  <Link to="/courses">Ver Cursos Disponibles</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedCourses.map((course) => {
                const certificate = user.certificates.find((c) => c.courseId === course.id);
                return (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge>{course.level}</Badge>
                            <Badge variant="default" className="bg-green-500">
                              Completado
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          {certificate && (
                            <p className="text-sm text-gray-500 mt-2">
                              Puntuación: {certificate.score}% • {' '}
                              {new Date(certificate.completedAt).toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/courses/${course.id}`}>
                              Revisar
                            </Link>
                          </Button>
                          {certificate && (
                            <Button size="sm" asChild>
                              <Link to={`/certificate/${certificate.id}`}>
                                Certificado
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
