import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useState } from 'react';
import {
  Users, BookOpen, Award, TrendingUp, Activity, UserCheck,
  BarChart2, ChevronRight, UserPlus, Search, Mail, CheckCircle, Clock, Send,
} from 'lucide-react';
import { courses } from '../../data/courses';
import { getStudents } from '../../data/mockStudents';

interface PendingAccount {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  sede: string;
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'pending';
}

const MOCK_PENDING_ACCOUNTS: PendingAccount[] = [
  { id: 'pa-1', name: 'Roberto Fernández', email: 'roberto.f@alumco.cl', registeredAt: '2026-07-08', sede: 'Las Condes' },
  { id: 'pa-2', name: 'Valentina Morales', email: 'v.morales@alumco.cl', registeredAt: '2026-07-08', sede: 'Maipú' },
  { id: 'pa-3', name: 'Ignacio Vargas', email: 'i.vargas@alumco.cl', registeredAt: '2026-07-07', sede: 'Providencia' },
];

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>(MOCK_PENDING_ACCOUNTS);
  const [emailLog, setEmailLog] = useState<EmailLog[]>([
    { id: 'e-1', to: 'carlos.s@alumco.cl', subject: 'Cuenta aprobada — CapacitaciónPro', sentAt: '2026-07-07 14:32', status: 'sent' },
    { id: 'e-2', to: 'patricia.l@alumco.cl', subject: 'Cuenta aprobada — CapacitaciónPro', sentAt: '2026-07-06 09:15', status: 'sent' },
  ]);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role !== 'admin') navigate('/dashboard');
  }, [isAuthenticated, user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const students = getStudents();

  // Global stats
  const totalStudents = students.length;
  const totalEnrollments = students.reduce((acc, s) => acc + s.enrollments.length, 0);
  const totalCerts = students.reduce((acc, s) => acc + s.enrollments.filter(e => e.certificateIssuedAt).length, 0);
  const totalPassed = students.reduce((acc, s) => acc + s.enrollments.filter(e => e.passed).length, 0);
  const completionRate = totalEnrollments > 0 ? Math.round((totalPassed / totalEnrollments) * 100) : 0;
  const certRate = totalPassed > 0 ? Math.round((totalCerts / totalPassed) * 100) : 0;

  // Recent activity (last completions)
  const recentActivity: Array<{ studentName: string; action: string; course: string; daysAgo: number }> = [
    { studentName: 'María García', action: 'Obtuvo certificado', course: 'Fundamentos de Seguridad en el Trabajo', daysAgo: 0 },
    { studentName: 'Rodrigo Espinoza', action: 'Completó curso', course: 'Liderazgo y Gestión de Equipos', daysAgo: 0 },
    { studentName: 'Sofía Herrera', action: 'Obtuvo certificado', course: 'Fundamentos de Seguridad en el Trabajo', daysAgo: 1 },
    { studentName: 'Andrés Mendoza', action: 'Completó curso', course: 'Gestión de Proyectos Ágiles', daysAgo: 1 },
    { studentName: 'Camila Rojas', action: 'Completó examen', course: 'Liderazgo y Gestión de Equipos', daysAgo: 2 },
    { studentName: 'Nicolás Castro', action: 'Se registró', course: '—', daysAgo: 2 },
  ];

  const approveAccount = (account: PendingAccount) => {
    setPendingAccounts(prev => prev.filter(a => a.id !== account.id));
    const newEmail: EmailLog = {
      id: `e-${Date.now()}`,
      to: account.email,
      subject: 'Cuenta aprobada — CapacitaciónPro',
      sentAt: new Date().toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'sent',
    };
    setEmailLog(prev => [newEmail, ...prev]);
  };

  // Top courses with enrollment counts
  const courseStats = courses.map(c => {
    const enrolled = students.filter(s => s.enrollments.some(e => e.courseId === c.id)).length;
    const completed = students.filter(s => s.enrollments.some(e => e.courseId === c.id && e.passed)).length;
    const certs = students.filter(s => s.enrollments.some(e => e.courseId === c.id && e.certificateIssuedAt)).length;
    return { ...c, enrolled, completed, certs, rate: enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0 };
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Panel de Administración</h1>
        <p className="text-gray-600">Bienvenido, {user.name} — Vista general de la plataforma ONG Alumco</p>
      </div>

      {/* Quick access cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <Link to="/admin/courses" className="group">
          <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500 h-full">
            <CardContent className="flex items-center gap-4 pt-5 pb-5">
              <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Gestión de Cursos</p>
                <p className="text-sm text-gray-500">Ver cursos, alumnos y estadísticas</p>
              </div>
              <ChevronRight className="size-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/students" className="group">
          <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500 h-full">
            <CardContent className="flex items-center gap-4 pt-5 pb-5">
              <div className="size-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="size-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Gestión de Alumnos</p>
                <p className="text-sm text-gray-500">Buscar alumnos e inscribirlos</p>
              </div>
              <ChevronRight className="size-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Card className="border-l-4 border-l-yellow-400 opacity-60 cursor-not-allowed">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <div className="size-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Award className="size-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Certificados</p>
              <p className="text-sm text-gray-500">Gestión de certificaciones</p>
            </div>
            <Badge variant="secondary" className="text-xs">Próximo</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide">Alumnos</CardTitle>
            <Users className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-gray-500">Registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide">Inscripciones</CardTitle>
            <UserCheck className="size-4 text-green-600" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-gray-500">Totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide">Cursos</CardTitle>
            <BookOpen className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-gray-500">Disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide">Certificados</CardTitle>
            <Award className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{totalCerts}</div>
            <p className="text-xs text-gray-500">{certRate}% vs completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide">Completados</CardTitle>
            <TrendingUp className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-gray-500">Tasa global</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide">Actividad</CardTitle>
            <Activity className="size-4 text-red-600" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">Alta</div>
            <p className="text-xs text-gray-500">Última hora</p>
          </CardContent>
        </Card>
      </div>

      {/* Main content: 2 column grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Course overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cursos</CardTitle>
              <CardDescription>Resumen de inscripciones y completaciones</CardDescription>
            </div>
            <Link to="/admin/courses">
              <Button variant="outline" size="sm" className="gap-1">
                <BarChart2 className="size-4" /> Ver detalle
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseStats.map(c => (
                <div key={c.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{c.title}</span>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">{c.rate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.rate}%` }} />
                    </div>
                    <div className="flex text-xs text-gray-400 mt-1 gap-3">
                      <span>{c.enrolled} inscritos</span>
                      <span>{c.completed} completaron</span>
                      <span>{c.certs} certificados</span>
                    </div>
                  </div>
                  <Link to={`/admin/courses/${c.id}/stats`}>
                    <Button variant="ghost" size="sm"><BarChart2 className="size-3.5" /></Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones en la plataforma</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((a, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="size-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                    {a.studentName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{a.studentName}</span>{' '}
                      <span className="text-gray-600">{a.action}</span>
                      {a.course !== '—' && (
                        <span className="text-gray-500"> en "{a.course}"</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {a.daysAgo === 0 ? 'Hoy' : a.daysAgo === 1 ? 'Ayer' : `Hace ${a.daysAgo} días`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Notifications Panel */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Pending accounts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-4 text-orange-500" />
                  Cuentas Pendientes
                </CardTitle>
                <CardDescription>Aprueba cuentas para enviar notificación automática</CardDescription>
              </div>
              {pendingAccounts.length > 0 && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  {pendingAccounts.length} pendientes
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {pendingAccounts.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle className="size-10 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No hay cuentas pendientes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAccounts.map(account => (
                  <div key={account.id} className="flex items-center gap-3 p-3 border rounded-xl bg-orange-50 border-orange-100">
                    <div className="size-9 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center text-xs font-bold shrink-0">
                      {account.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{account.name}</p>
                      <p className="text-xs text-gray-500 truncate">{account.email} · {account.sede}</p>
                      <p className="text-xs text-gray-400">{account.registeredAt}</p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1 bg-green-600 hover:bg-green-700 text-white shrink-0"
                      onClick={() => approveAccount(account)}
                    >
                      <Send className="size-3.5" />
                      Aprobar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-4 text-blue-500" />
              Notificaciones Enviadas
            </CardTitle>
            <CardDescription>Historial de correos automáticos de aprobación</CardDescription>
          </CardHeader>
          <CardContent>
            {emailLog.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Sin correos enviados aún</p>
            ) : (
              <div className="space-y-2">
                {emailLog.slice(0, 6).map(email => (
                  <div key={email.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <div className="size-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="size-3.5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{email.subject}</p>
                      <p className="text-xs text-gray-500 truncate">Para: {email.to}</p>
                      <p className="text-xs text-gray-400">{email.sentAt}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="size-3 mr-1" />
                      Enviado
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student overview table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Alumnos Recientes</CardTitle>
            <CardDescription>Últimos alumnos registrados en la plataforma</CardDescription>
          </div>
          <Link to="/admin/students">
            <Button variant="outline" size="sm" className="gap-1">
              <Search className="size-4" /> Ver todos
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Cursos inscritos</TableHead>
                <TableHead>Certificados</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.slice(0, 6).map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.age} años</TableCell>
                  <TableCell>{s.enrollments.length}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Award className="size-3.5" />
                      {s.enrollments.filter(e => e.certificateIssuedAt).length}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/students/${s.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Ver perfil <ChevronRight className="size-3.5" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
