import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { getStudents, Student } from '../../data/mockStudents';
import { courses } from '../../data/courses';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ArrowLeft, Search, Users, Award, BookOpen, ChevronRight } from 'lucide-react';

export function AdminStudents() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') navigate('/login');
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  if (!user || user.role !== 'admin') return null;

  const filtered = students.filter(student => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.phone.includes(query);

    const matchesCourse =
      courseFilter === 'all' ||
      student.enrollments.some(e => e.courseId === courseFilter);

    const matchesStatus = (() => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'none') return student.enrollments.length === 0;
      if (statusFilter === 'active') return student.enrollments.some(e => !e.passed && e.completedModules.length > 0);
      if (statusFilter === 'completed') return student.enrollments.some(e => e.passed);
      if (statusFilter === 'certified') return student.enrollments.some(e => e.certificateIssuedAt);
      return true;
    })();

    return matchesSearch && matchesCourse && matchesStatus;
  });

  function getStudentStatus(student: Student) {
    if (student.enrollments.length === 0) return { label: 'Sin inscripciones', color: 'bg-gray-100 text-gray-600' };
    const hasCert = student.enrollments.some(e => e.certificateIssuedAt);
    const hasPassed = student.enrollments.some(e => e.passed);
    const hasActive = student.enrollments.some(e => e.completedModules.length > 0 && !e.passed);
    if (hasCert) return { label: 'Certificado', color: 'bg-yellow-100 text-yellow-700' };
    if (hasPassed) return { label: 'Aprobado', color: 'bg-green-100 text-green-700' };
    if (hasActive) return { label: 'En progreso', color: 'bg-blue-100 text-blue-700' };
    return { label: 'Inactivo', color: 'bg-gray-100 text-gray-600' };
  }

  const totalStudents = students.length;
  const withCerts = students.filter(s => s.enrollments.some(e => e.certificateIssuedAt)).length;
  const active = students.filter(s => s.enrollments.some(e => e.completedModules.length > 0)).length;
  const noEnrollments = students.filter(s => s.enrollments.length === 0).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="size-4" /> Panel Admin
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Gestión de Alumnos</h1>
          <p className="text-gray-600">Busca alumnos, revisa su perfil y gestiona sus inscripciones</p>
        </div>
      </div>

      {/* Summary KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <CardHeader className="pb-1 pt-4"><CardTitle className="text-xs text-gray-500 uppercase">Total alumnos</CardTitle></CardHeader>
          <CardContent className="pb-4"><div className="text-3xl font-bold text-blue-600">{totalStudents}</div></CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1 pt-4"><CardTitle className="text-xs text-gray-500 uppercase">Activos</CardTitle></CardHeader>
          <CardContent className="pb-4"><div className="text-3xl font-bold text-green-600">{active}</div></CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1 pt-4"><CardTitle className="text-xs text-gray-500 uppercase">Certificados</CardTitle></CardHeader>
          <CardContent className="pb-4"><div className="text-3xl font-bold text-yellow-600">{withCerts}</div></CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1 pt-4"><CardTitle className="text-xs text-gray-500 uppercase">Sin inscripción</CardTitle></CardHeader>
          <CardContent className="pb-4"><div className="text-3xl font-bold text-gray-400">{noEnrollments}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filtrar por curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los cursos</SelectItem>
            {courses.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">En progreso</SelectItem>
            <SelectItem value="completed">Aprobado</SelectItem>
            <SelectItem value="certified">Con certificado</SelectItem>
            <SelectItem value="none">Sin inscripciones</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-3">
        Mostrando {filtered.length} de {students.length} alumnos
      </p>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cursos inscritos</TableHead>
                <TableHead>Certificados</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                    <Users className="size-8 mx-auto mb-2" />
                    <p>No se encontraron alumnos con los filtros aplicados</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(student => {
                  const status = getStudentStatus(student);
                  const certs = student.enrollments.filter(e => e.certificateIssuedAt).length;
                  return (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                            {student.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.age} años</TableCell>
                      <TableCell className="text-gray-500 text-sm">{student.email}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <BookOpen className="size-3.5 text-gray-400" />
                          {student.enrollments.length}
                          {student.enrollments.length > 0 && (
                            <span className="text-gray-400 text-xs ml-1">
                              ({student.enrollments.map(e => courses.find(c => c.id === e.courseId)?.title?.split(' ')[0]).filter(Boolean).join(', ')})
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <Award className="size-3.5 text-yellow-500" />
                          {certs}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${status.color} border-0`}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/students/${student.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            Ver perfil <ChevronRight className="size-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
