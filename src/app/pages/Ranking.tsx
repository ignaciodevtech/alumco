import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth, SEDES, Sede } from '../context/AuthContext';
import { getStudents } from '../data/mockStudents';
import { courses } from '../data/courses';
import { getLevelForPoints, POINTS_CONFIG, getPointsForExamScore } from '../data/gamification';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trophy, Medal, Star } from 'lucide-react';
import { RankBadge } from '../components/game/RankBadge';
import { StreakFlame } from '../components/game/StreakFlame';

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
  if (pos === 1) return <Trophy className="size-5 text-amber-500" />;
  if (pos === 2) return <Medal className="size-5 text-slate-400" />;
  if (pos === 3) return <Medal className="size-5 text-amber-700" />;
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
    <div>
      {/* ── Arcade leaderboard hero ────────────────────────── */}
      <div data-game-panel data-game-grid className="py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Trophy className="size-9 text-neon-gold text-glow-gold" />
              <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-game-ink">
                Ranking de la Plataforma
              </h1>
            </div>
            <p className="text-game-ink-muted">Los colaboradores más activos de ONG Alumco compiten por el primer lugar</p>
          </div>

          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto">
            {[1, 0, 2].map((rankIdx, colIdx) => {
              const student = globalRanking[rankIdx];
              if (!student) return <div key={colIdx} />;
              const level = getLevelForPoints(student.points);
              const heights = ['h-20', 'h-28', 'h-16'];
              const podiumStyle = [
                { glow: 'glow-cyan', bar: 'bg-game-surface-2 border-t-2 border-neon-cyan', text: 'text-neon-cyan' },
                { glow: 'glow-gold', bar: 'bg-game-surface-2 border-t-2 border-neon-gold', text: 'text-neon-gold' },
                { glow: 'glow-amber', bar: 'bg-game-surface-2 border-t-2 border-neon-amber', text: 'text-neon-amber' },
              ][colIdx];

              return (
                <motion.div
                  key={colIdx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: colIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col items-center gap-2 ${colIdx === 1 ? 'order-2' : colIdx === 0 ? 'order-1' : 'order-3'}`}
                >
                  <div className={`rounded-full bg-game-surface-2 p-1 ${podiumStyle.glow}`}>
                    <RankBadge level={level} size={colIdx === 1 ? 'lg' : 'md'} />
                  </div>
                  <p className="font-display font-semibold text-sm text-center leading-tight text-game-ink">
                    {student.name.split(' ')[0]}
                  </p>
                  <p className={`text-xs font-bold ${podiumStyle.text}`}>{student.points} pts</p>
                  <div className={`w-full ${heights[colIdx]} rounded-t-lg flex items-start justify-center pt-2 font-display font-bold ${podiumStyle.bar} ${podiumStyle.text}`}>
                    {colIdx === 1 ? '1°' : colIdx === 0 ? '2°' : '3°'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                        isMe ? 'bg-primary/5 border-2 border-primary/30' : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="w-7 flex justify-center shrink-0">
                        <RankPosition pos={pos} />
                      </div>

                      <RankBadge level={level} size="sm" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{student.name}</span>
                          {isMe && <Badge variant="secondary" className="text-xs">Tú</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{student.sede}</span>
                          <span className="font-medium text-primary">{level.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm shrink-0">
                        <div className="text-center hidden sm:block">
                          <div className="font-bold text-primary">{student.completedCourses}</div>
                          <div className="text-xs text-gray-400">cursos</div>
                        </div>
                        <div className="text-center hidden sm:block">
                          <StreakFlame streak={student.streak} size="sm" tone="light" />
                          <div className="text-xs text-gray-400">racha</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-fuchsia-700">{student.points}</div>
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
                        <div className="mt-2 space-y-1">
                          {sedeStudents.slice(0, 3).map(s => (
                            <span key={s.id} className="flex items-center gap-1.5 text-xs text-gray-600 truncate">
                              <RankBadge level={getLevelForPoints(s.points)} size="xs" />
                              {s.name.split(' ')[0]}
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
                      <RankBadge level={level} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.sede} · {level.name}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm shrink-0">
                        <span className="hidden sm:flex">
                          <StreakFlame streak={student.streak} size="sm" tone="light" />
                        </span>
                        <span className="font-bold text-fuchsia-700">{student.points} pts</span>
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
    </div>
  );
}
