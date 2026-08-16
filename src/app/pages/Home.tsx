import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { GraduationCap, Award, BookOpen, Users, CheckCircle, TrendingUp, Shield, BookOpenCheck } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Cursos de Calidad',
      description: 'Contenido educativo desarrollado por expertos en cada área',
    },
    {
      icon: Award,
      title: 'Certificación Oficial',
      description: 'Obtén certificados verificables al completar los cursos',
    },
    {
      icon: CheckCircle,
      title: 'Evaluación Continua',
      description: 'Pruebas diseñadas para validar tu conocimiento',
    },
    {
      icon: TrendingUp,
      title: 'Seguimiento de Progreso',
      description: 'Visualiza tu avance y logros en tu perfil personal',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <GraduationCap className="size-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">
              Desarrolla tus Habilidades Profesionales
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Plataforma integral de capacitación con cursos certificados que impulsan tu carrera profesional
            </p>
            <div className="flex gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button size="lg" variant="secondary" onClick={() => navigate('/courses')}>
                    Ver Cursos
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" onClick={() => navigate('/dashboard')}>
                    Mi Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
                    Comenzar Ahora
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" onClick={() => navigate('/login')}>
                    Iniciar Sesión
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir CapacitaciónPro?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <feature.icon className="size-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Estudiantes Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cursos Disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Tasa de Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1762330917056-e69b34329ddf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzQwMTkyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Aprendizaje en línea"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Plataforma para Todos</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Nuestra plataforma ofrece herramientas especializadas para cada tipo de usuario
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardContent className="pt-6">
                <Users className="size-12 mb-4 text-blue-600" />
                <h3 className="font-semibold text-xl mb-3">Estudiantes</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Accede a cursos de calidad, realiza evaluaciones y obtén certificados verificables.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Dashboard personalizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Seguimiento de progreso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Certificados digitales</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-colors">
              <CardContent className="pt-6">
                <BookOpenCheck className="size-12 mb-4 text-purple-600" />
                <h3 className="font-semibold text-xl mb-3">Profesores</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Crea cursos, sube contenido, diseña pruebas y monitorea el progreso de tus estudiantes.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Crear y editar cursos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Subir archivos y videos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Gestión de estudiantes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500 transition-colors">
              <CardContent className="pt-6">
                <Shield className="size-12 mb-4 text-orange-600" />
                <h3 className="font-semibold text-xl mb-3">Administradores</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Gestiona la plataforma completa, usuarios, cursos y obtén reportes detallados.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Panel de administración</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Gestión de usuarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Reportes y analíticas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {!isAuthenticated && (
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Prueba la plataforma con estas credenciales:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="font-semibold">Estudiante:</span> cualquier@email.com
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg">
                  <span className="font-semibold">Profesor:</span> teacher@example.com / teacher123
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-lg">
                  <span className="font-semibold">Admin:</span> admin@example.com / admin123
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Users className="size-16 mx-auto mb-6 text-blue-600" />
            <h2 className="text-3xl font-bold mb-4">Comienza tu Aprendizaje Hoy</h2>
            <p className="text-gray-600 mb-8">
              Únete a miles de profesionales que ya están mejorando sus habilidades y avanzando en sus carreras
            </p>
            {!isAuthenticated && (
              <Button size="lg" onClick={() => navigate('/register')}>
                Registrarse Gratis
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}