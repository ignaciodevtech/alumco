import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  GraduationCap, Award, BookOpen, Users, CheckCircle, Shield, BookOpenCheck,
  Zap, Flame, Trophy, ArrowRight, Target, Swords,
} from 'lucide-react';
import { LEVELS, BADGES } from '../data/gamification';
import { RankBadge } from '../components/game/RankBadge';
import { XPBar } from '../components/game/XPBar';
import { StreakFlame } from '../components/game/StreakFlame';
import { BadgeTile } from '../components/game/BadgeTile';
import { NEON_STYLES } from '../components/game/gameStyles';

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

const GAME_LOOP = [
  { icon: BookOpen, title: 'Completa módulos', copy: 'Cada módulo terminado suma XP a tu cuenta.', neon: 'lime' as const },
  { icon: Target, title: 'Aprueba exámenes', copy: 'Mientras mejor tu puntaje, más puntos ganas.', neon: 'cyan' as const },
  { icon: Flame, title: 'Mantén tu racha', copy: 'Entra seguido y desbloquea insignias por constancia.', neon: 'violet' as const },
  { icon: Swords, title: 'Compite en el ranking', copy: 'Sube de rango y compara tu avance con tu sede.', neon: 'magenta' as const },
];

const previewLevel = LEVELS[2]; // "Elite" — enough progress to look aspirational but not maxed out
const previewLevelStyles = NEON_STYLES[previewLevel.neon];
const previewBadges = BADGES.slice(0, 4);

export function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const roles = [
    {
      icon: Users,
      title: 'Estudiantes',
      neon: 'cyan' as const,
      description: 'Sube de rango completando cursos, gana insignias y compite en el ranking de tu sede.',
      points: ['Dashboard con tu progreso y racha', 'Insignias coleccionables', 'Certificados digitales verificables'],
    },
    {
      icon: BookOpenCheck,
      title: 'Profesores',
      neon: 'violet' as const,
      description: 'Crea cursos, diseña evaluaciones y sigue en tiempo real el avance de cada estudiante.',
      points: ['Editor de cursos y módulos', 'Exámenes con intentos configurables', 'Reportes de progreso por curso'],
    },
    {
      icon: Shield,
      title: 'Administradores',
      neon: 'gold' as const,
      description: 'Gestiona la plataforma completa: usuarios, sedes, cursos y métricas de participación.',
      points: ['Panel de administración global', 'Gestión de usuarios y sedes', 'Reportes y analíticas'],
    },
  ];

  return (
    <div>
      {/* ── Hero: "entrar al juego" ─────────────────────────── */}
      <section data-game-panel data-game-grid className="relative overflow-hidden py-24">
        {/* Twinkling starfield dots — purely decorative, ignored by reduced-motion */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="absolute size-1 rounded-full bg-white animate-twinkle"
              style={{
                top: `${(i * 37) % 100}%`,
                left: `${(i * 53) % 100}%`,
                animationDelay: `${(i % 6) * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center rounded-full bg-game-surface-2 p-4 mb-6 glow-cyan"
            >
              <GraduationCap className="size-10 text-neon-cyan" />
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-wide text-game-ink mb-6 text-balance">
              Convierte tu capacitación en <span className="text-neon-cyan text-glow-cyan">una partida que quieres ganar</span>
            </h1>
            <p className="text-lg text-game-ink-muted mb-10 max-w-2xl mx-auto text-pretty">
              Cursos certificados, exámenes y un sistema de rangos, XP e insignias que convierte cada módulo
              que completas en progreso real — para ti y para tu sede.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {isAuthenticated ? (
                <>
                  <Button size="lg" className="gap-2" onClick={() => navigate('/dashboard')}>
                    <Zap className="size-4" /> Ir a mi Dashboard
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-game-border text-game-ink hover:bg-game-surface-2 hover:text-game-ink"
                    onClick={() => navigate('/courses')}
                  >
                    Ver Cursos
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="gap-2" onClick={() => navigate('/register')}>
                    <Zap className="size-4" /> Empezar a jugar
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-game-border text-game-ink hover:bg-game-surface-2 hover:text-game-ink"
                    onClick={() => navigate('/login')}
                  >
                    Iniciar Sesión
                  </Button>
                </>
              )}
            </div>

            {/* Live HUD ticker — the stats, reframed as a game readout */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-game-border bg-game-surface-2/60 px-6 py-4 text-sm">
              <span className="flex items-center gap-2 text-game-ink">
                <Users className="size-4 text-neon-cyan" /> <strong className="font-display">500+</strong>
                <span className="text-game-ink-muted">jugadores activos</span>
              </span>
              <span className="flex items-center gap-2 text-game-ink">
                <BookOpen className="size-4 text-neon-lime" /> <strong className="font-display">50+</strong>
                <span className="text-game-ink-muted">cursos disponibles</span>
              </span>
              <span className="flex items-center gap-2 text-game-ink">
                <Trophy className="size-4 text-neon-gold" /> <strong className="font-display">95%</strong>
                <span className="text-game-ink-muted">tasa de satisfacción</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Game loop path ───────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Así se juega</h2>
            <p className="text-gray-600">Cuatro pasos, un ciclo que se repite mientras aprendes de verdad.</p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gray-200" aria-hidden="true" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {GAME_LOOP.map((step, i) => {
                const styles = NEON_STYLES[step.neon];
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className={`relative z-10 flex items-center justify-center size-16 rounded-full bg-game-bg ${styles.glow} mb-4`}>
                      <step.icon className={`size-7 ${styles.text}`} strokeWidth={2.25} />
                    </div>
                    <h3 className="font-semibold text-lg mb-1.5">{step.title}</h3>
                    <p className="text-sm text-gray-600 max-w-[220px]">{step.copy}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Live HUD preview ─────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl font-bold mb-4">Tu progreso, siempre a la vista</h2>
              <p className="text-gray-600 mb-6">
                Cada vez que entras a la plataforma ves exactamente dónde estás: tu rango, tu experiencia
                hacia el siguiente nivel, tu racha de días activos y las insignias que ya conseguiste.
              </p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 mt-0.5 text-primary shrink-0" />
                  5 rangos, desde Recluta hasta el místico rango máximo
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 mt-0.5 text-primary shrink-0" />
                  Insignias con rareza — de comunes a legendarias
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 mt-0.5 text-primary shrink-0" />
                  Celebraciones al subir de rango, con confeti incluido
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              data-game-panel
              data-game-grid
              className="rounded-2xl p-6 sm:p-7"
            >
              <div className="flex items-center gap-4 mb-5">
                <RankBadge level={previewLevel} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-display uppercase tracking-[0.25em] text-game-ink-muted">Rango actual</p>
                  <p className={`font-display text-xl font-bold uppercase tracking-wide ${previewLevelStyles.textGlow}`}>
                    {previewLevel.name}
                  </p>
                </div>
                <StreakFlame streak={6} size="md" />
              </div>
              <XPBar value={68} neon={previewLevel.neon} />
              <p className="text-xs text-game-ink-muted mt-1.5 mb-5">68% hacia el siguiente rango</p>

              <div className="grid grid-cols-4 gap-2">
                {previewBadges.map((badge, i) => (
                  <BadgeTile key={badge.id} badge={badge} earned={i < 3} index={i} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ranking teaser ───────────────────────────────────── */}
      <section data-game-panel data-game-grid className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Trophy className="size-10 text-neon-gold text-glow-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-game-ink mb-3">
            Compite por el primer lugar
          </h2>
          <p className="text-game-ink-muted mb-8 max-w-xl mx-auto">
            Cada sede tiene su propio ranking. Cada curso, examen y racha te acerca a la cima.
          </p>
          <div className="flex justify-center gap-6 sm:gap-10 mb-8">
            {[LEVELS[1], LEVELS[3], LEVELS[0]].map((lvl, i) => (
              <div key={lvl.name} className={`flex flex-col items-center gap-2 ${i === 1 ? '-translate-y-3' : ''}`}>
                <RankBadge level={lvl} size={i === 1 ? 'lg' : 'md'} />
                <span className="text-xs font-display font-semibold text-game-ink-muted">{i === 0 ? '2°' : i === 1 ? '1°' : '3°'}</span>
              </div>
            ))}
          </div>
          <Button size="lg" className="gap-2" onClick={() => navigate(isAuthenticated ? '/ranking' : '/register')}>
            {isAuthenticated ? 'Ver ranking completo' : 'Regístrate y compite'} <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* ── Roles section ────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Plataforma para todos</h2>
            <p className="text-gray-600">Herramientas especializadas para cada tipo de usuario.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roles.map((role, i) => {
              const styles = NEON_STYLES[role.neon];
              return (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <Card className="h-full border-2 hover:border-primary/40 transition-colors">
                    <CardContent className="pt-6">
                      <div className={`inline-flex items-center justify-center size-12 rounded-xl bg-game-bg mb-4 ${styles.glow}`}>
                        <role.icon className={`size-6 ${styles.text}`} />
                      </div>
                      <h3 className="font-semibold text-xl mb-3">{role.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{role.description}</p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {role.points.map(point => (
                          <li key={point} className="flex items-start gap-2">
                            <CheckCircle className="size-4 mt-0.5 text-green-500 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {!isAuthenticated && (
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Prueba la plataforma con estas credenciales:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-gray-50 border px-4 py-2 rounded-lg">
                  <span className="font-semibold">Estudiante:</span> cualquier@email.com
                </div>
                <div className="bg-gray-50 border px-4 py-2 rounded-lg">
                  <span className="font-semibold">Profesor:</span> teacher@example.com / teacher123
                </div>
                <div className="bg-gray-50 border px-4 py-2 rounded-lg">
                  <span className="font-semibold">Admin:</span> admin@example.com / admin123
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section data-game-panel data-game-grid className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Award className="size-14 mx-auto mb-6 text-neon-cyan text-glow-cyan" />
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-game-ink mb-4">
              Tu primer rango te está esperando
            </h2>
            <p className="text-game-ink-muted mb-8">
              Únete a los colaboradores de ONG Alumco que ya están subiendo de nivel mientras avanzan en su carrera.
            </p>
            {!isAuthenticated && (
              <Button size="lg" className="gap-2" onClick={() => navigate('/register')}>
                <Zap className="size-4" /> Registrarse Gratis
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
