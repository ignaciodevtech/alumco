import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, BookOpen, Clock, CheckCircle, Award, PlayCircle } from 'lucide-react';
import { courses } from '../data/courses';
import { POINTS_CONFIG } from '../data/gamification';
import { showXPToast } from '../components/game/xpToast';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isAuthenticated, awardModulePoints, recordDailyActivity } = useAuth();
  const navigate = useNavigate();
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    const saved = localStorage.getItem(`progress_${courseId}`);
    return saved ? JSON.parse(saved) : [];
});
  const course = courses.find((c) => c.id === courseId);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    recordDailyActivity();
  }, [isAuthenticated, navigate]);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
        <Button onClick={() => navigate('/courses')}>Volver a Cursos</Button>
      </div>
    );
  }

  const isCompleted = user?.completedCourses.includes(course.id) || false;
  const progressPercentage = (completedModules.length / course.modules.length) * 100;

  const toggleModuleComplete = (moduleId: string) => {
  const wasCompleted = completedModules.includes(moduleId);
  const updated = wasCompleted
    ? completedModules.filter(id => id !== moduleId)
    : [...completedModules, moduleId];
  
  setCompletedModules(updated);
  localStorage.setItem(`progress_${courseId}`, JSON.stringify(updated));
  
  if (!wasCompleted && courseId) {
    awardModulePoints(moduleId, courseId);
    showXPToast(POINTS_CONFIG.MODULE_COMPLETE, 'Módulo completado');
  }
};

  const canTakeExam = completedModules.length === course.modules.length || isCompleted;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/courses')} className="mb-6">
        <ArrowLeft className="size-4 mr-2" />
        Volver a Cursos
      </Button>

      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{course.level}</Badge>
              {isCompleted && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="size-3 mr-1" />
                  Completado
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="size-4" />
            <span>{course.modules.length} módulos</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="size-4" />
            <span>Certificación incluida</span>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      {!isCompleted && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tu Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Módulos completados: {completedModules.length} / {course.modules.length}</span>
                <span className="font-semibold">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-6">
              {course.modules.map((module, index) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Módulo {index + 1}</Badge>
                          <span className="text-sm text-gray-600">{module.duration}</span>
                        </div>
                        <CardTitle className="text-xl">{module.title}</CardTitle>
                      </div>
                      {completedModules.includes(module.id) && (
                        <CheckCircle className="size-6 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 whitespace-pre-line mb-4">
                      {module.content}
                    </p>
                    <Button
                      onClick={() => toggleModuleComplete(module.id)}
                      variant={completedModules.includes(module.id) ? 'outline' : 'default'}
                      className="w-full"
                    >
                      {completedModules.includes(module.id) ? (
                        <>
                          <CheckCircle className="size-4 mr-2" />
                          Marcar como no completado
                        </>
                      ) : (
                        <>
                          <PlayCircle className="size-4 mr-2" />
                          Marcar como completado
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="info" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre este curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Descripción</h4>
                    <p className="text-gray-600">{course.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Nivel</h4>
                    <Badge>{course.level}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Duración estimada</h4>
                    <p className="text-gray-600">{course.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Evaluación</h4>
                    <p className="text-gray-600">
                      Examen final con {course.exam.questions.length} preguntas
                    </p>
                    <p className="text-gray-600">
                      Puntuación mínima para aprobar: {course.exam.passingScore}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Exam Card */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluación Final</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCompleted ? (
                <div className="text-center py-4">
                  <CheckCircle className="size-12 mx-auto mb-2 text-green-500" />
                  <p className="font-semibold mb-1">¡Curso Completado!</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Ya has aprobado este curso
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profile">Ver Certificado</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 text-sm">
                    <p><strong>{course.exam.questions.length}</strong> preguntas</p>
                    <p>Puntuación mínima: <strong>{course.exam.passingScore}%</strong></p>
                    <p>Tiempo: <strong>Sin límite</strong></p>
                  </div>
                  
                  {!canTakeExam && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                      <p className="text-yellow-800">
                        Completa todos los módulos para desbloquear el examen
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    disabled={!canTakeExam}
                    asChild={canTakeExam}
                  >
                    {canTakeExam ? (
                      <Link to={`/courses/${course.id}/exam`}>
                        Realizar Examen
                      </Link>
                    ) : (
                      <>Realizar Examen</>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Estudiantes:</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tasa de aprobación:</span>
                <span className="font-semibold">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Certificados emitidos:</span>
                <span className="font-semibold">1,073</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
