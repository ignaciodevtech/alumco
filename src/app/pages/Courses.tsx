import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BookOpen, Clock, CheckCircle, Search } from 'lucide-react';
import { courses } from '../data/courses';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const courseImages: Record<string, string> = {
  'workplace-safety': 'https://images.unsplash.com/photo-1768158988512-ad31657fe5b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JrcGxhY2UlMjBzYWZldHklMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQwMzMxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'agile-management': 'https://images.unsplash.com/photo-1758876202468-5ffe0ee61f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ2lsZSUyMHByb2plY3QlMjBtYW5hZ2VtZW50JTIwdGVhbXxlbnwxfHx8fDE3NzQwMzMxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'leadership-team': 'https://images.unsplash.com/photo-1751700835846-e999696a6bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxlYWRlcnNoaXAlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0MDMzMTcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};

export function Courses() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const isCompleted = (courseId: string) => {
  return user?.completedCourses.includes(courseId) || false;
};

const isInProgress = (courseId: string) => {
  if (!user) return false;
  const saved = localStorage.getItem(`progress_${user.id}_${courseId}`);
  if (!saved) return false;
  const completed = JSON.parse(saved) as string[];
  return completed.length > 0 && !user.completedCourses.includes(courseId);
};

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catálogo de Cursos</h1>
        <p className="text-gray-600">Explora nuestros cursos de capacitación profesional</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="Principiante">Principiante</SelectItem>
                <SelectItem value="Intermedio">Intermedio</SelectItem>
                <SelectItem value="Avanzado">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden">
              <ImageWithFallback
                src={courseImages[course.image] || ''}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              {isCompleted(course.id) && (
                <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                  <CheckCircle className="size-5" />
                </div>
              )}
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={
                  course.level === 'Principiante' ? 'default' :
                  course.level === 'Intermedio' ? 'secondary' : 'outline'
                }>
                  {course.level}
                </Badge>
                {isCompleted(course.id) && (
                  <Badge variant="default" className="bg-green-500">
                    Completado
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="size-4" />
                  {course.modules.length} módulos
                </div>
              </div>

              <Button asChild className="w-full">
                <Link to={`/courses/${course.id}`}>
                  {isCompleted(course.id) ? 'Revisar Curso' : 
                  isInProgress(course.id) ? 'Continuar Curso' : 'Comenzar Curso'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="size-16 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold text-lg mb-2">No se encontraron cursos</h3>
          <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}
