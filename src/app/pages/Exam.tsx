import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';
import { courses } from '../data/courses';
import { getPointsForExamScore } from '../data/gamification';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

function getAttemptKey(userId: string, courseId: string) {
  return `exam_attempts_${userId}_${courseId}`;
}

function getAttemptCount(userId: string, courseId: string): number {
  const key = getAttemptKey(userId, courseId);
  return parseInt(localStorage.getItem(key) ?? '0', 10);
}

function incrementAttemptCount(userId: string, courseId: string): number {
  const key = getAttemptKey(userId, courseId);
  const next = getAttemptCount(userId, courseId) + 1;
  localStorage.setItem(key, String(next));
  return next;
}

export function Exam() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isAuthenticated, updateUserProgress } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  const course = courses.find((c) => c.id === courseId);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!course) {
      navigate('/courses');
      return;
    }

    // Check if already completed
    if (user?.completedCourses.includes(course.id)) {
      toast.info('Ya has completado este curso');
      navigate(`/courses/${courseId}`);
      return;
    }

    // Load attempt count
    if (user) {
      const count = getAttemptCount(user.id, course.id);
      setAttemptsUsed(count);
    }
  }, [isAuthenticated, course, courseId, navigate, user]);

  if (!course) return null;

  const maxAttempts = course.exam.maxAttempts;
  const attemptsExhausted = attemptsUsed >= maxAttempts;

  // Show blocked screen if max attempts exceeded
  if (attemptsExhausted && !showResults) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="size-20 text-red-400" />
            </div>
            <CardTitle className="text-2xl">Intentos agotados</CardTitle>
            <CardDescription>
              Has utilizado los {maxAttempts} intentos permitidos para este examen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-600 text-sm">
              Si necesitas más intentos, comunícate con tu profesor o administrador de la plataforma.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate(`/courses/${courseId}`)}>
                Volver al Curso
              </Button>
              <Button onClick={() => navigate('/courses')}>
                Explorar Cursos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions = course.exam.questions;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Increment attempt count
    const newCount = user ? incrementAttemptCount(user.id, course.id) : attemptsUsed + 1;
    setAttemptsUsed(newCount);

    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    // Check if passed
    if (finalScore >= course.exam.passingScore) {
      const isFirstAttempt = newCount === 1;
      updateUserProgress(course.id, finalScore, course.title, courses.length, isFirstAttempt);
      const pts = getPointsForExamScore(finalScore);
      toast.success(`¡Aprobado! +${pts} puntos`, { duration: 3500 });

      // Trigger confetti
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      const remaining = maxAttempts - newCount;
      if (remaining > 0) {
        toast.error(`No alcanzaste la puntuación mínima. Te quedan ${remaining} intento${remaining !== 1 ? 's' : ''}.`);
      } else {
        toast.error('No alcanzaste la puntuación mínima y has agotado todos los intentos.');
      }
    }
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const currentQ = questions[currentQuestion];

  if (showResults) {
    const passed = score >= course.exam.passingScore;
    const correctAnswers = Math.round((score / 100) * questions.length);

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {passed ? (
                <Award className="size-20 text-yellow-500" />
              ) : (
                <XCircle className="size-20 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed ? '¡Felicitaciones!' : 'Resultado del Examen'}
            </CardTitle>
            <CardDescription>
              {passed
                ? 'Has aprobado el curso exitosamente'
                : 'No has alcanzado la puntuación mínima'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{score}%</div>
              <p className="text-gray-600">
                {correctAnswers} de {questions.length} respuestas correctas
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Puntuación mínima requerida:</span>
                <span className="font-semibold">{course.exam.passingScore}%</span>
              </div>
              <Progress
                value={score}
                className={score >= course.exam.passingScore ? '' : '[&>div]:bg-red-500'}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Intentos utilizados:</span>
                <span className="font-semibold">{attemptsUsed} de {maxAttempts}</span>
              </div>
            </div>

            <div className="flex gap-4">
              {passed ? (
                <>
                  <Button className="flex-1" onClick={() => navigate('/profile')}>
                    Ver Certificado
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => navigate('/courses')}>
                    Explorar Cursos
                  </Button>
                </>
              ) : (
                <>
                  <Button className="flex-1" onClick={() => window.location.reload()}>
                    Intentar de Nuevo
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/courses/${courseId}`)}>
                    Revisar Contenido
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(`/courses/${courseId}`)}>
          <ArrowLeft className="size-4 mr-2" />
          Volver al Curso
        </Button>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pregunta {currentQuestion + 1}</CardTitle>
          <CardDescription className="text-base">{currentQ.question}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQ.id]?.toString()}
            onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="size-4 mr-2" />
          Anterior
        </Button>

        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="gap-2"
          >
            <CheckCircle className="size-4" />
            Enviar Examen
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Siguiente
            <ArrowRight className="size-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Warning if not all answered */}
      {currentQuestion === questions.length - 1 && !allAnswered && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          Por favor responde todas las preguntas antes de enviar el examen
        </div>
      )}
    </div>
  );
}
