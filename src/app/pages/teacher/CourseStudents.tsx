import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  ArrowLeft,
  Search,
  Download,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
} from 'lucide-react';

// Mock data
const mockCourse = {
  id: 't-1',
  title: 'Fundamentos de Seguridad en el Trabajo',
  totalModules: 4,
};

const mockStudents = [
  {
    id: '1',
    name: 'María García',
    email: 'maria.garcia@example.com',
    enrolledAt: '2024-01-20',
    status: 'completed',
    progress: 100,
    completedModules: 4,
    examScore: 85,
    lastActivity: '2024-03-15',
    certificateId: 'cert-1',
  },
  {
    id: '2',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    enrolledAt: '2024-01-22',
    status: 'completed',
    progress: 100,
    completedModules: 4,
    examScore: 92,
    lastActivity: '2024-03-18',
    certificateId: 'cert-2',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    enrolledAt: '2024-02-01',
    status: 'in_progress',
    progress: 75,
    completedModules: 3,
    examScore: null,
    lastActivity: '2024-03-25',
    certificateId: null,
  },
  {
    id: '4',
    name: 'Carlos López',
    email: 'carlos.lopez@example.com',
    enrolledAt: '2024-02-05',
    status: 'in_progress',
    progress: 50,
    completedModules: 2,
    examScore: null,
    lastActivity: '2024-03-20',
    certificateId: null,
  },
  {
    id: '5',
    name: 'Laura Rodríguez',
    email: 'laura.rodriguez@example.com',
    enrolledAt: '2024-02-10',
    status: 'not_started',
    progress: 0,
    completedModules: 0,
    examScore: null,
    lastActivity: '2024-02-10',
    certificateId: null,
  },
  {
    id: '6',
    name: 'Pedro Sánchez',
    email: 'pedro.sanchez@example.com',
    enrolledAt: '2024-02-15',
    status: 'completed',
    progress: 100,
    completedModules: 4,
    examScore: 78,
    lastActivity: '2024-03-22',
    certificateId: 'cert-3',
  },
  {
    id: '7',
    name: 'Isabel Torres',
    email: 'isabel.torres@example.com',
    enrolledAt: '2024-02-18',
    status: 'failed',
    progress: 100,
    completedModules: 4,
    examScore: 65,
    lastActivity: '2024-03-23',
    certificateId: null,
  },
  {
    id: '8',
    name: 'Miguel Ángel Ruiz',
    email: 'miguel.ruiz@example.com',
    enrolledAt: '2024-02-20',
    status: 'in_progress',
    progress: 25,
    completedModules: 1,
    examScore: null,
    lastActivity: '2024-03-10',
    certificateId: null,
  },
];

export function CourseStudents() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [students] = useState(mockStudents);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: students.length,
    completed: students.filter((s) => s.status === 'completed').length,
    inProgress: students.filter((s) => s.status === 'in_progress').length,
    notStarted: students.filter((s) => s.status === 'not_started').length,
    failed: students.filter((s) => s.status === 'failed').length,
    avgScore: Math.round(
      students
        .filter((s) => s.examScore !== null)
        .reduce((acc, s) => acc + (s.examScore || 0), 0) /
        students.filter((s) => s.examScore !== null).length
    ),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completado</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En Progreso</Badge>;
      case 'not_started':
        return <Badge variant="outline">No Iniciado</Badge>;
      case 'failed':
        return <Badge variant="destructive">No Aprobado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/teacher')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl mb-2">Estudiantes del Curso</h1>
          <p className="text-gray-600">{mockCourse.title}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Completados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                En Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                No Iniciados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.notStarted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.avgScore}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Lista de Estudiantes</CardTitle>
                <CardDescription>
                  Gestiona y monitorea el progreso de tus estudiantes
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">
                  Todos ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completados ({stats.completed})
                </TabsTrigger>
                <TabsTrigger value="in_progress">
                  En Progreso ({stats.inProgress})
                </TabsTrigger>
                <TabsTrigger value="not_started">
                  No Iniciados ({stats.notStarted})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <StudentTable students={filteredStudents} getStatusBadge={getStatusBadge} />
              </TabsContent>

              <TabsContent value="completed">
                <StudentTable
                  students={filteredStudents.filter((s) => s.status === 'completed')}
                  getStatusBadge={getStatusBadge}
                />
              </TabsContent>

              <TabsContent value="in_progress">
                <StudentTable
                  students={filteredStudents.filter((s) => s.status === 'in_progress')}
                  getStatusBadge={getStatusBadge}
                />
              </TabsContent>

              <TabsContent value="not_started">
                <StudentTable
                  students={filteredStudents.filter((s) => s.status === 'not_started')}
                  getStatusBadge={getStatusBadge}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StudentTable({
  students,
  getStatusBadge,
}: {
  students: typeof mockStudents;
  getStatusBadge: (status: string) => JSX.Element;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estudiante</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Progreso</TableHead>
            <TableHead>Módulos</TableHead>
            <TableHead>Calificación</TableHead>
            <TableHead>Inscrito</TableHead>
            <TableHead>Última Actividad</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No se encontraron estudiantes
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div>
                    <p>{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(student.status)}</TableCell>
                <TableCell>
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <Progress value={student.progress} className="flex-1" />
                      <span className="text-sm text-gray-600 min-w-[45px]">
                        {student.progress}%
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {student.completedModules}/{mockCourse.totalModules}
                </TableCell>
                <TableCell>
                  {student.examScore !== null ? (
                    <div className="flex items-center gap-2">
                      <span className={student.examScore >= 70 ? 'text-green-600' : 'text-red-600'}>
                        {student.examScore}%
                      </span>
                      {student.certificateId && (
                        <Award className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{student.enrolledAt}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{student.lastActivity}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-3 w-3" />
                    </Button>
                    {student.certificateId && (
                      <Button variant="outline" size="sm">
                        <Award className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
