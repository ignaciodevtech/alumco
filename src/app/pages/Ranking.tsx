import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, SEDES, Sede } from '../context/AuthContext';
import { getStudents } from '../data/mockStudents';
import { courses } from '../data/courses';
import { getLevelForPoints, POINTS_CONFIG, getPointsForExamScore } from '../data/gamification';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trophy, Medal, Star, Flame, Crown } from 'lucide-react';

interface RankedStudent {
  id: string;
  name: string;
  sede: Sede;
  points: number;
  completedCourses: number;
  certificates: number;
  streak: number;
  badges: number;
}

// Assign a sede deterministically from student id
function sedeForId(id: string): Sede {
  const idx = parseInt(id.replace(/\D/g, '').slice(-1) || '0', 10) % SEDES.length;
  return SEDES[idx];
}

// Compute points from enrollment data (mirrors AuthContext logic)
function computePoints(studentId: string): number {
  const student = getStudents().find(s => s.id === studentId);
  if (!student) return 0;
  let pts = 0;
  for (const e of student.enrollments) {
    pts += e.completedModules.length * POINTS_CONFIG.MODULE_COMPLETE;
    if (e.examScore !== null && e.passed) {
      pts += getPointsForExamScore(e.examScore);
    }
  }
  return pts;
}

function buildRanking(): RankedStudent[] {
  return getStudents().map(s => {
    const pts = computePoints(s.id);
    const completed = s.enrollments.filter(e => e.passed).length;
    const certs = s.enrollments.filter(e => e.certificateIssuedAt).length;
    const badges: string[] = [];
    if (completed >= 1) badges.push('first_course');
    if (completed >= courses.length) badges.push('champion');
    if (s.enrollments.some(e => e.examScore === 100)) badges.push('perfect_score');

    return {
      id: s.id,
      name: s.name,
      sede: sedeForId(s.id),
      points: pts,
      completedCourses: completed,
      certificates: certs,
      streak: Math.floor(Math.random() * 10) + 1, // simulated streak
      badges: badges.length,
    };
  }).sort((a, b) => b.points - a.points);
}

function RankPosition({ pos }: { pos: number }) {
  if (pos === 1) return <Crown className="size-5 text-yellow-500" />;
  if (pos === 2) return <Medal className="size-5 text-gray-400" />;
  if (pos === 3) return <Medal className="size-5 text-amber-600" />;
  return <span className="text-sm font-bold text-gray-500 w-5 text-center">{pos}</span>;
}

export function Ranking() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedSede, setSelectedSede] = useState<Sede | 'all'>('all');
  const [ranking, setRanking] = useState<RankedStudent[]>([]);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setRanking(buildRanking());
  }, []);

  if (!user) return null;

  const globalRanking = ranking;
  const sedeRanking = selectedSede === 'all'
    ? ranking
    : ranking.filter(s => s.sede === selectedSede);

  // Find current user in ranking
  const myRank = globalRanking.findIndex(s => s.name.toLowerCase().includes(user.name.toLowerCase())) + 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="size-10 text-yellow-500" />
          <h1 className="text-3xl font-bold">Ranking de la Plataforma</h1>
        </div>
        <p className="text-gray-600">Los colaboradores más activos de ONG Alumco</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 0, 2].map((rankIdx, colIdx) => {
          const student = globalRanking[rankIdx];
          if (!student) return <div key={colIdx} />;
          const level = getLevelForPoints(student.points);
          const heights = ['h-24', 'h-32', 'h-20'];
          const ringColors = ['ring-gray-300', 'ring-yellow-400', 'ring-amber-500'];

          return (
            <div
              key={colIdx}
              className={`flex flex-col items-center gap-2 ${colIdx === 1 ? 'order-2' : colIdx === 0 ? 'order-1' : 'order-3'}`}
            >
              <div className={`size-14 rounded-full ${level.bgColor} flex items-center justify-center text-xl ring-4 ${ringColors[colIdx]}`}>
                {level.emoji}
              </div>
              <p className="font-semibold text-sm text-center leading-tight">{student.name.split(' ')[0]}</p>
              <p className="text-xs text-gray-500">{student.points} pts</p>
              <div className={`w-full ${heights[colIdx]} rounded-t-lg flex items-center justify-center font-bold text-white ${
                colIdx === 1 ? 'bg-yellow-400 text-yellow-900' : colIdx === 0 ? 'bg-gray-300 text-gray-700' : 'bg-amber-500 text-amber-900'
              }`}>
                {colIdx === 1 ? '🥇 1°' : colIdx === 0 ? '🥈 2°' : '🥉 3°'}
              </div>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="global">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="global">Ranking Global</TabsTrigger>
            <TabsTrigger value="sede">Por Sede</TabsTrigger>
          </TabsList>
        </div>

        {/* Global ranking */}
        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Tabla General</CardTitle>
              <CardDescription>Todos los colaboradores ordenados por puntos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {globalRanking.map((student, idx) => {
                  const pos = idx + 1;
                  const level = getLevelForPoints(student.points);
                  const isMe = student.name.toLowerCase().includes(user.name.toLowerCase());

                  return (
                    <div
                      key={student.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isMe ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="w-7 flex justify-center shrink-0">
                        <RankPosition pos={pos} />
                      </div>

                      <div className={`size-9 rounded-full ${level.bgColor} flex items-center justify-center text-lg shrink-0`}>
                        {level.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{student.name}</span>
                          {isMe && <Badge variant="secondary" className="text-xs">Tú</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{student.sede}</span>
                          <span className={`font-medium ${level.textColor}`}>{level.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm shrink-0">
                        <div className="text-center hidden sm:block">
                          <div className="font-bold text-green-600">{student.completedCourses}</div>
                          <div className="text-xs text-gray-400">cursos</div>
                        </div>
                        <div className="text-center hidden sm:block">
                          <div className="flex items-center gap-1 font-bold text-orange-500">
                            <Flame className="size-3.5" />{student.streak}
                          </div>
                          <div className="text-xs text-gray-400">racha</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-700">{student.points}</div>
                          <div className="text-xs text-gray-400">pts</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sede ranking */}
        <TabsContent value="sede">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle>Ranking por Sede</CardTitle>
                  <CardDescription>Filtra por sede para ver a tus compañeros</CardDescription>
                </div>
                <Select value={selectedSede} onValueChange={v => setSelectedSede(v as Sede | 'all')}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las sedes</SelectItem>
                    {SEDES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Per-sede summary cards */}
              {selectedSede === 'all' && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {SEDES.map(sede => {
                    const sedeStudents = ranking.filter(s => s.sede === sede);
                    const totalPts = sedeStudents.reduce((a, s) => a + s.points, 0);
                    const avgPts = sedeStudents.length > 0 ? Math.round(totalPts / sedeStudents.length) : 0;
                    return (
                      <div
                        key={sede}
                        className="border rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => setSelectedSede(sede)}
                      >
                        <p className="font-semibold text-sm mb-1">{sede}</p>
                        <p className="text-xs text-gray-500">{sedeStudents.length} colaboradores</p>
                        <p className="text-xs text-gray-500">Promedio: {avgPts} pts</p>
                        <div className="mt-2">
                          {sedeStudents.slice(0, 3).map(s => (
                            <span key={s.id} className="text-xs text-gray-600 block truncate">
                              {getLevelForPoints(s.points).emoji} {s.name.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-2">
                {sedeRanking.map((student, idx) => {
                  const pos = idx + 1;
                  const level = getLevelForPoints(student.points);
                  return (
                    <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent">
                      <div className="w-7 flex justify-center shrink-0">
                        <RankPosition pos={pos} />
                      </div>
                      <div className={`size-9 rounded-full ${level.bgColor} flex items-center justify-center text-lg shrink-0`}>
                        {level.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.sede} · {level.name}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm shrink-0">
                        <span className="hidden sm:flex items-center gap-1 text-orange-500">
                          <Flame className="size-3.5" />{student.streak}
                        </span>
                        <span className="font-bold text-blue-700">{student.points} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* How to earn points */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="size-4 text-yellow-500" /> ¿Cómo ganar puntos?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { action: 'Completar un módulo', pts: `+${POINTS_CONFIG.MODULE_COMPLETE}`, color: 'text-blue-600' },
              { action: 'Aprobar examen (70-79%)', pts: '+50', color: 'text-green-600' },
              { action: 'Aprobar examen (80-89%)', pts: '+75', color: 'text-green-600' },
              { action: 'Aprobar examen (90-99%)', pts: '+100', color: 'text-orange-600' },
              { action: 'Puntaje perfecto (100%)', pts: '+150', color: 'text-purple-600' },
              { action: 'Racha diaria activa', pts: 'Insignias', color: 'text-red-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0">
                <span className="text-gray-700">{item.action}</span>
                <span className={`font-bold ${item.color}`}>{item.pts}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
