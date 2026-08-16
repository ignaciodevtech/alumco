import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { courses } from '../../data/courses';
import {
  getStudents,
  getStudentsForCourse,
  enrollStudentInCourse,
  removeStudentFromCourse,
  Student,
} from '../../data/mockStudents';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  BookOpen, Users, UserPlus, UserMinus, BarChart2, ChevronDown, ChevronUp, ArrowLeft, Search, Award
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminCourses() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [courseStudents, setCourseStudents] = useState<Record<string, Student[]>>({});
  const [addStudentDialogCourse, setAddStudentDialogCourse] = useState<string | null>(null);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') navigate('/login');
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const data: Record<string, Student[]> = {};
    courses.forEach(c => { data[c.id] = getStudentsForCourse(c.id); });
    setCourseStudents(data);
  }, []);

  if (!user || user.role !== 'admin') return null;

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function refreshStudents() {
    const data: Record<string, Student[]> = {};
    courses.forEach(c => { data[c.id] = getStudentsForCourse(c.id); });
    setCourseStudents(data);
  }

  function handleToggleExpand(courseId: string) {
    setExpandedCourse(prev => (prev === courseId ? null : courseId));
  }

  function handleRemoveStudent(studentId: string, courseId: string, studentName: string) {
    removeStudentFromCourse(studentId, courseId);
    refreshStudents();
    toast.success(`${studentName} eliminado del curso`);
  }

  function handleAddStudent(courseId: string) {
    if (!selectedStudentToAdd) return;
    const students = getStudents();
    const student = students.find(s => s.id === selectedStudentToAdd);
    if (!student) return;
    enrollStudentInCourse(selectedStudentToAdd, courseId);
    refreshStudents();
    setAddStudentDialogCourse(null);
    setSelectedStudentToAdd('');
    toast.success(`${student.name} inscrito en el curso`);
  }

  function getAvailableStudentsForCourse(courseId: string): Student[] {
    const enrolled = courseStudents[courseId]?.map(s => s.id) ?? [];
    return getStudents().filter(s => !enrolled.includes(s.id));
  }

  function getCompletionCount(students: Student[], courseId: string): number {
    return students.filter(s => s.enrollments.some(e => e.courseId === courseId && e.passed)).length;
  }

  function getCertCount(students: Student[], courseId: string): number {
    return students.filter(s => s.enrollments.some(e => e.courseId === courseId && e.certificateIssuedAt)).length;
  }

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
          <h1 className="text-3xl font-bold mb-1">Gestión de Cursos</h1>
          <p className="text-gray-600">Visualiza todos los cursos, sus profesores y alumnos inscritos</p>
        </div>
        <Badge variant="secondary" className="text-base px-4 py-1.5">
          <BookOpen className="size-4 mr-2" /> {courses.length} cursos
        </Badge>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre de curso o profesor..."
          className="pl-10"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Course cards */}
      <div className="space-y-4">
        {filteredCourses.map(course => {
          const students = courseStudents[course.id] ?? [];
          const completed = getCompletionCount(students, course.id);
          const certs = getCertCount(students, course.id);
          const isExpanded = expandedCourse === course.id;

          return (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{course.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="size-4 text-blue-500" />
                        <span className="font-medium text-blue-600">{course.teacherName}</span>
                      </span>
                      <span>·</span>
                      <span>{course.duration}</span>
                      <span>·</span>
                      <span>{course.modules.length} módulos</span>
                    </div>
                  </div>

                  {/* Summary stats */}
                  <div className="flex items-center gap-6 text-sm shrink-0">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{students.length}</div>
                      <div className="text-gray-500">Inscritos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{completed}</div>
                      <div className="text-gray-500">Completaron</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-600">{certs}</div>
                      <div className="text-gray-500">Certificados</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/admin/courses/${course.id}/stats`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <BarChart2 className="size-4" /> Estadísticas
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleExpand(course.id)}
                      className="gap-1"
                    >
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      {isExpanded ? 'Ocultar' : 'Ver alumnos'}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm text-gray-700">
                        Alumnos inscritos ({students.length})
                      </h3>
                      <Dialog
                        open={addStudentDialogCourse === course.id}
                        onOpenChange={open => {
                          setAddStudentDialogCourse(open ? course.id : null);
                          if (!open) setSelectedStudentToAdd('');
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-1">
                            <UserPlus className="size-4" /> Agregar alumno
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Agregar alumno al curso</DialogTitle>
                            <DialogDescription>
                              Selecciona un alumno para inscribirlo en "{course.title}"
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-2">
                            <Select
                              value={selectedStudentToAdd}
                              onValueChange={setSelectedStudentToAdd}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un alumno..." />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableStudentsForCourse(course.id).map(s => (
                                  <SelectItem key={s.id} value={s.id}>
                                    {s.name} — {s.age} años — {s.email}
                                  </SelectItem>
                                ))}
                                {getAvailableStudentsForCourse(course.id).length === 0 && (
                                  <SelectItem value="none" disabled>
                                    Todos los alumnos ya están inscritos
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setAddStudentDialogCourse(null)}>
                                Cancelar
                              </Button>
                              <Button
                                onClick={() => handleAddStudent(course.id)}
                                disabled={!selectedStudentToAdd || selectedStudentToAdd === 'none'}
                              >
                                Inscribir
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {students.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Users className="size-8 mx-auto mb-2" />
                        <p className="text-sm">No hay alumnos inscritos en este curso</p>
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Alumno</TableHead>
                              <TableHead>Edad</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Módulos completados</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Certificado</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students.map(student => {
                              const enrollment = student.enrollments.find(e => e.courseId === course.id);
                              if (!enrollment) return null;
                              const modulesPct = Math.round((enrollment.completedModules.length / course.modules.length) * 100);
                              return (
                                <TableRow key={student.id}>
                                  <TableCell>
                                    <Link to={`/admin/students/${student.id}`} className="font-medium text-blue-600 hover:underline">
                                      {student.name}
                                    </Link>
                                  </TableCell>
                                  <TableCell>{student.age} años</TableCell>
                                  <TableCell className="text-gray-500 text-sm">{student.email}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${modulesPct}%` }} />
                                      </div>
                                      <span className="text-xs text-gray-600">
                                        {enrollment.completedModules.length}/{course.modules.length}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {enrollment.passed ? (
                                      <Badge className="bg-green-100 text-green-700 border-green-200">Aprobado {enrollment.examScore}%</Badge>
                                    ) : enrollment.examScore !== null ? (
                                      <Badge variant="destructive">Reprobado {enrollment.examScore}%</Badge>
                                    ) : enrollment.completedModules.length > 0 ? (
                                      <Badge variant="secondary">En progreso</Badge>
                                    ) : (
                                      <Badge variant="outline">Sin comenzar</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {enrollment.certificateIssuedAt ? (
                                      <span className="flex items-center gap-1 text-yellow-600 text-sm">
                                        <Award className="size-3.5" /> Emitido
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 text-sm">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleRemoveStudent(student.id, course.id, student.name)}
                                    >
                                      <UserMinus className="size-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
