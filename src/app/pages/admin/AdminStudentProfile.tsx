import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import {
  getStudentById,
  enrollStudentInCourse,
  removeStudentFromCourse,
  Student,
} from '../../data/mockStudents';
import { courses } from '../../data/courses';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  ArrowLeft, Award, BookOpen, CheckCircle, XCircle, Clock, UserPlus, UserMinus, Mail, Phone, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminStudentProfile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | undefined>();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCourseToAdd, setSelectedCourseToAdd] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') navigate('/login');
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (studentId) setStudent(getStudentById(studentId));
  }, [studentId]);

  if (!user || user.role !== 'admin') return null;

  if (!student) return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-gray-500">Alumno no encontrado.</p>
      <Link to="/admin/students"><Button className="mt-4">Volver</Button></Link>
    </div>
  );

  function refresh() {
    if (studentId) setStudent({ ...getStudentById(studentId)! });
  }

  function handleEnroll() {
    if (!selectedCourseToAdd) return;
    enrollStudentInCourse(student!.id, selectedCourseToAdd);
    refresh();
    setAddDialogOpen(false);
    setSelectedCourseToAdd('');
    const courseName = courses.find(c => c.id === selectedCourseToAdd)?.title ?? 'el curso';
    toast.success(`Inscrito en "${courseName}"`);
  }

  function handleRemove(courseId: string) {
    removeStudentFromCourse(student!.id, courseId);
    refresh();
    const courseName = courses.find(c => c.id === courseId)?.title ?? 'el curso';
    toast.success(`Eliminado de "${courseName}"`);
  }

  const enrolledCourseIds = student.enrollments.map(e => e.courseId);
  const availableCourses = courses.filter(c => !enrolledCourseIds.includes(c.id));
  const totalCerts = student.enrollments.filter(e => e.certificateIssuedAt).length;
  const totalPassed = student.enrollments.filter(e => e.passed).length;

  function formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const initials = student.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/admin/students">
          <Button variant="ghost" size="sm" className="gap-1 mb-4">
            <ArrowLeft className="size-4" /> Volver a Alumnos
          </Button>
        </Link>

        {/* Profile card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="size-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                {initials}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{student.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-gray-400" />
                    {student.age} años
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-4 text-gray-400" />
                    {student.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-4 text-gray-400" />
                    {student.phone}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400">
                    Registrado el {formatDate(student.registeredAt)}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 text-center shrink-0">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{student.enrollments.length}</div>
                  <div className="text-xs text-gray-500">Cursos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{totalPassed}</div>
                  <div className="text-xs text-gray-500">Aprobados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{totalCerts}</div>
                  <div className="text-xs text-gray-500">Certificados</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cursos inscritos ({student.enrollments.length})</CardTitle>
              <CardDescription>Historial de inscripciones y progreso del alumno</CardDescription>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={open => { setAddDialogOpen(open); if (!open) setSelectedCourseToAdd(''); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <UserPlus className="size-4" /> Inscribir en curso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Inscribir al alumno</DialogTitle>
                  <DialogDescription>Selecciona el curso en el que deseas inscribir a {student.name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <Select value={selectedCourseToAdd} onValueChange={setSelectedCourseToAdd}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar curso..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourses.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title} — {c.level}
                        </SelectItem>
                      ))}
                      {availableCourses.length === 0 && (
                        <SelectItem value="none" disabled>El alumno ya está inscrito en todos los cursos</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleEnroll} disabled={!selectedCourseToAdd || selectedCourseToAdd === 'none'}>
                      Inscribir
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {student.enrollments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <BookOpen className="size-10 mx-auto mb-3" />
              <p className="text-sm">El alumno no está inscrito en ningún curso todavía.</p>
              <p className="text-xs mt-1">Usa el botón "Inscribir en curso" para agregar cursos.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {student.enrollments.map(enrollment => {
                const course = courses.find(c => c.id === enrollment.courseId);
                if (!course) return null;

                const modulesPct = Math.round((enrollment.completedModules.length / course.modules.length) * 100);

                const statusInfo = (() => {
                  if (enrollment.passed) return { icon: <CheckCircle className="size-4 text-green-600" />, label: 'Aprobado', color: 'text-green-600' };
                  if (enrollment.examScore !== null && !enrollment.passed) return { icon: <XCircle className="size-4 text-red-500" />, label: 'Reprobado', color: 'text-red-500' };
                  if (enrollment.completedModules.length > 0) return { icon: <Clock className="size-4 text-orange-500" />, label: 'En progreso', color: 'text-orange-500' };
                  return { icon: <Clock className="size-4 text-gray-400" />, label: 'Sin comenzar', color: 'text-gray-400' };
                })();

                return (
                  <div key={enrollment.courseId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium">{course.title}</h3>
                          <Badge variant="outline" className="text-xs">{course.level}</Badge>
                          {enrollment.certificateIssuedAt && (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs gap-1">
                              <Award className="size-3" /> Certificado
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Inscrito el {formatDate(enrollment.enrolledAt)} · Prof. {course.teacherName}
                        </p>

                        {/* Progress bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progreso de módulos</span>
                            <span>{enrollment.completedModules.length}/{course.modules.length} ({modulesPct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${modulesPct}%` }} />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2">
                          <span className={`flex items-center gap-1 ${statusInfo.color}`}>
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                          {enrollment.examScore !== null && (
                            <span>Puntaje examen: <strong>{enrollment.examScore}%</strong></span>
                          )}
                          {enrollment.examAttempts > 0 && (
                            <span>Intentos: <strong>{enrollment.examAttempts}/{course.exam.maxAttempts}</strong></span>
                          )}
                          {enrollment.completedAt && (
                            <span>Completado: {formatDate(enrollment.completedAt)}</span>
                          )}
                          {enrollment.certificateIssuedAt && (
                            <span className="text-yellow-600">Certificado: {formatDate(enrollment.certificateIssuedAt)}</span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        onClick={() => handleRemove(enrollment.courseId)}
                      >
                        <UserMinus className="size-4 mr-1" /> Eliminar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
