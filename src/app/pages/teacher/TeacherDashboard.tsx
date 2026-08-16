import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Plus, 
  Edit, 
  Trash2,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Mock data - en producción vendría de Supabase
const mockTeacherCourses = [
  {
    id: 't-1',
    title: 'Fundamentos de Seguridad en el Trabajo',
    description: 'Aprende los principios básicos de seguridad laboral',
    status: 'published',
    enrolledStudents: 45,
    completedStudents: 32,
    modules: 4,
    createdAt: '2024-01-15',
    lastUpdated: '2024-03-20',
  },
  {
    id: 't-2',
    title: 'Gestión de Proyectos Ágiles',
    description: 'Domina las metodologías ágiles como Scrum y Kanban',
    status: 'published',
    enrolledStudents: 28,
    completedStudents: 18,
    modules: 4,
    createdAt: '2024-02-10',
    lastUpdated: '2024-03-15',
  },
  {
    id: 't-3',
    title: 'Excel Avanzado para Análisis de Datos',
    description: 'Curso en preparación sobre análisis de datos',
    status: 'draft',
    enrolledStudents: 0,
    completedStudents: 0,
    modules: 2,
    createdAt: '2024-03-25',
    lastUpdated: '2024-03-27',
  },
];

const mockRecentActivity = [
  {
    id: 1,
    type: 'enrollment',
    message: 'María García se inscribió en "Fundamentos de Seguridad en el Trabajo"',
    time: 'Hace 2 horas',
  },
  {
    id: 2,
    type: 'completion',
    message: 'Juan Pérez completó "Gestión de Proyectos Ágiles" con 85%',
    time: 'Hace 5 horas',
  },
  {
    id: 3,
    type: 'question',
    message: 'Nueva pregunta en el foro de "Fundamentos de Seguridad"',
    time: 'Hace 1 día',
  },
];

export function TeacherDashboard() {
  const { user } = useAuth();
  const [courses] = useState(mockTeacherCourses);

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === 'published').length,
    totalStudents: courses.reduce((acc, c) => acc + c.enrolledStudents, 0),
    avgCompletion: Math.round(
      (courses.reduce((acc, c) => acc + (c.enrolledStudents > 0 ? (c.completedStudents / c.enrolledStudents) * 100 : 0), 0) / courses.length)
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Panel de Profesor</h1>
          <p className="text-gray-600">Bienvenido, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total de Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.totalCourses}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.publishedCourses} publicados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total de Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.totalStudents}</div>
              <p className="text-xs text-gray-500 mt-1">
                En todos los cursos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Tasa de Finalización</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.avgCompletion}%</div>
              <p className="text-xs text-gray-500 mt-1">
                Promedio de cursos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Módulos Creados</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {courses.reduce((acc, c) => acc + c.modules, 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                En {stats.totalCourses} cursos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="published">Publicados</TabsTrigger>
                  <TabsTrigger value="draft">Borradores</TabsTrigger>
                </TabsList>
                <Link to="/teacher/courses/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Curso
                  </Button>
                </Link>
              </div>

              <TabsContent value="all" className="space-y-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </TabsContent>

              <TabsContent value="published" className="space-y-4">
                {courses
                  .filter((c) => c.status === 'published')
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </TabsContent>

              <TabsContent value="draft" className="space-y-4">
                {courses
                  .filter((c) => c.status === 'draft')
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas actualizaciones en tus cursos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="mt-1">
                      {activity.type === 'enrollment' && (
                        <Users className="h-4 w-4 text-blue-500" />
                      )}
                      {activity.type === 'completion' && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      {activity.type === 'question' && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/teacher/courses/new" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Curso
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Reportes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Estudiantes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: typeof mockTeacherCourses[0] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <Badge
                variant={course.status === 'published' ? 'default' : 'secondary'}
              >
                {course.status === 'published' ? 'Publicado' : 'Borrador'}
              </Badge>
            </div>
            <CardDescription>{course.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm">{course.enrolledStudents}</p>
              <p className="text-xs text-gray-500">Estudiantes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm">{course.completedStudents}</p>
              <p className="text-xs text-gray-500">Completados</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm">{course.modules}</p>
              <p className="text-xs text-gray-500">Módulos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-xs">{course.lastUpdated}</p>
              <p className="text-xs text-gray-500">Actualizado</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={`/teacher/courses/${course.id}/edit`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Link to={`/teacher/courses/${course.id}/students`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Estudiantes
            </Button>
          </Link>
          <Button variant="outline" size="icon">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
