import { Outlet, Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useAccessibility, FontSize } from '../context/AccessibilityContext';
import { Button } from './ui/button';
import {
  GraduationCap, LogOut, User, Home, BookOpen, LayoutDashboard,
  Trophy, Eye, EyeOff, Type,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const FONT_SIZES: { value: FontSize; label: string }[] = [
  { value: 'normal', label: 'A' },
  { value: 'large', label: 'A+' },
  { value: 'xlarge', label: 'A++' },
];

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { highContrast, fontSize, toggleHighContrast, setFontSize } = useAccessibility();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Accessibility Bar ─────────────────────────────────── */}
      <div className="bg-gray-900 text-white text-sm py-1.5 px-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <span className="text-gray-400 text-xs hidden sm:inline">
            Herramientas de accesibilidad
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {/* Font size buttons */}
            <span className="text-gray-400 text-xs mr-1 flex items-center gap-1">
              <Type className="size-3" /> Texto:
            </span>
            {FONT_SIZES.map(fs => (
              <button
                key={fs.value}
                onClick={() => setFontSize(fs.value)}
                title={`Tamaño de texto: ${fs.label}`}
                className={`px-2 py-0.5 rounded text-xs font-bold border transition-colors ${
                  fontSize === fs.value
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'
                }`}
              >
                {fs.label}
              </button>
            ))}

            {/* Divider */}
            <span className="text-gray-600 mx-1">|</span>

            {/* High contrast toggle */}
            <button
              onClick={toggleHighContrast}
              title={highContrast ? 'Desactivar alto contraste' : 'Activar alto contraste'}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border transition-colors ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'
              }`}
            >
              {highContrast ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
              {highContrast ? 'Alto contraste: ON' : 'Alto contraste'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Header ───────────────────────────────────────── */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="size-8 text-blue-600" />
            <span className="font-bold text-xl">CapacitaciónPro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'teacher' ? '/teacher' : user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
                <Link to="/courses" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <BookOpen className="size-4" />
                  Cursos
                </Link>
                {user?.role === 'user' && (
                  <Link to="/ranking" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <Trophy className="size-4" />
                    Ranking
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <User className="size-4" />
                  Mi Perfil
                </Link>
              </>
            ) : (
              <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Home className="size-4" />
                Inicio
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="size-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="size-4 mr-2" />
                    Mi Perfil
                  </DropdownMenuItem>
                  {user?.role === 'user' && (
                    <DropdownMenuItem onClick={() => navigate('/ranking')}>
                      <Trophy className="size-4 mr-2" />
                      Ranking
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <LayoutDashboard className="size-4 mr-2" />
                      Panel Admin
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'teacher' && (
                    <DropdownMenuItem onClick={() => navigate('/teacher')}>
                      <LayoutDashboard className="size-4 mr-2" />
                      Panel Profesor
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Iniciar Sesión
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 CapacitaciónPro — ONG Alumco. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">Plataforma de capacitación y certificación profesional</p>
        </div>
      </footer>
    </div>
  );
}
