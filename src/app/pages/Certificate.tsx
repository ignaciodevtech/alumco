import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Award, Download, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function Certificate() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);

  const certificate = user?.certificates.find((c) => c.id === certificateId);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!certificate || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Certificado no encontrado</h1>
        <Button onClick={() => navigate('/profile')}>Volver al Perfil</Button>
      </div>
    );
  }

  const handleDownload = () => {
    toast.info('La función de descarga estará disponible próximamente');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Enlace copiado al portapapeles');
  };

  const completedDate = new Date(certificate.completedAt);
  const formattedDate = completedDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-6">
        <ArrowLeft className="size-4 mr-2" />
        Volver al Perfil
      </Button>

      {/* Actions */}
      <div className="flex justify-end gap-4 mb-6">
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="size-4 mr-2" />
          Compartir
        </Button>
        <Button onClick={handleDownload}>
          <Download className="size-4 mr-2" />
          Descargar PDF
        </Button>
      </div>

      {/* Certificate */}
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <div 
          ref={certificateRef}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-12 md:p-16"
        >
          {/* Decorative Border */}
          <div className="border-8 border-double border-blue-600 p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <Award className="size-20 mx-auto mb-4 text-yellow-500" />
              <h1 className="text-4xl md:text-5xl font-serif mb-2">
                Certificado de Finalización
              </h1>
              <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
            </div>

            {/* Content */}
            <div className="text-center space-y-6 mb-8">
              <p className="text-lg text-gray-700">
                Se otorga el presente certificado a
              </p>
              
              <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                {user.name}
              </h2>

              <p className="text-lg text-gray-700">
                Por haber completado satisfactoriamente el curso
              </p>

              <h3 className="text-2xl md:text-3xl font-semibold text-gray-800">
                {certificate.courseName}
              </h3>

              <div className="flex justify-center gap-8 text-center mt-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha de Finalización</p>
                  <p className="font-semibold">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Puntuación Obtenida</p>
                  <p className="font-semibold">{certificate.score}%</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t-2 border-gray-300">
              <div className="text-center">
                <div className="mb-2 pt-2 border-t-2 border-gray-400 inline-block px-8">
                  <p className="font-semibold">Director de Capacitación</p>
                  <p className="text-sm text-gray-600">CapacitaciónPro</p>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 pt-2 border-t-2 border-gray-400 inline-block px-8">
                  <p className="font-semibold">ID del Certificado</p>
                  <p className="text-sm text-gray-600 font-mono">{certificate.id}</p>
                </div>
              </div>
            </div>

            {/* Logo/Brand */}
            <div className="text-center mt-8">
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Award className="size-6" />
                <span className="font-bold text-xl">CapacitaciónPro</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">www.capacitacionpro.com</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Info */}
      <div className="max-w-4xl mx-auto mt-8 text-center text-sm text-gray-600">
        <p>Este certificado puede ser verificado usando el ID: {certificate.id}</p>
        <p className="mt-2">
          Para verificar la autenticidad de este certificado, visite nuestra plataforma
        </p>
      </div>
    </div>
  );
}
