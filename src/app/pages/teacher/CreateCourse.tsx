import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload, 
  Save,
  FileText,
  Video,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface Module {
  id: string;
  title: string;
  content: string;
  duration: string;
  files: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: 'document' | 'video' | 'link';
  url: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function CreateCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEditing = !!courseId;

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    level: 'Principiante',
    duration: '',
    status: 'draft',
  });

  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: '',
      content: '',
      duration: '',
      files: [],
    },
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  ]);

  const [passingScore, setPassingScore] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(3);

  const handleAddModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      content: '',
      duration: '',
      files: [],
    };
    setModules([...modules, newModule]);
  };

  const handleRemoveModule = (id: string) => {
    if (modules.length > 1) {
      setModules(modules.filter((m) => m.id !== id));
    }
  };

  const handleModuleChange = (id: string, field: keyof Module, value: string) => {
    setModules(
      modules.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      )
    );
  };

  const handleAddFile = (moduleId: string, type: FileAttachment['type']) => {
    const newFile: FileAttachment = {
      id: Date.now().toString(),
      name: `Nuevo ${type === 'document' ? 'documento' : type === 'video' ? 'video' : 'enlace'}`,
      type,
      url: '',
    };
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, files: [...m.files, newFile] } : m
      )
    );
  };

  const handleRemoveFile = (moduleId: string, fileId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, files: m.files.filter((f) => f.id !== fileId) }
          : m
      )
    );
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleQuestionChange = (id: string, field: string, value: string | number) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, i) => (i === optionIndex ? value : opt)) }
          : q
      )
    );
  };

  const handleSaveDraft = () => {
    toast.success('Curso guardado como borrador');
    navigate('/teacher');
  };

  const handlePublish = () => {
    toast.success('Curso publicado exitosamente');
    navigate('/teacher');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/teacher')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl mb-2">
            {isEditing ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </h1>
          <p className="text-gray-600">
            Completa la información del curso, módulos y examen
          </p>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="info">Información General</TabsTrigger>
            <TabsTrigger value="modules">Módulos y Contenido</TabsTrigger>
            <TabsTrigger value="exam">Examen</TabsTrigger>
          </TabsList>

          {/* Tab 1: Course Info */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Información del Curso</CardTitle>
                <CardDescription>
                  Datos básicos que verán los estudiantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título del Curso</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Fundamentos de Seguridad en el Trabajo"
                    value={courseData.title}
                    onChange={(e) =>
                      setCourseData({ ...courseData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Describe de qué trata el curso y qué aprenderán los estudiantes..."
                    value={courseData.description}
                    onChange={(e) =>
                      setCourseData({ ...courseData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Nivel</Label>
                    <Select
                      value={courseData.level}
                      onValueChange={(value) =>
                        setCourseData({ ...courseData, level: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Principiante">Principiante</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duración estimada</Label>
                    <Input
                      id="duration"
                      placeholder="Ej: 4 horas"
                      value={courseData.duration}
                      onChange={(e) =>
                        setCourseData({ ...courseData, duration: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Imagen del Curso (URL)</Label>
                  <Input
                    id="image"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    En producción, aquí se podría subir una imagen directamente
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Modules */}
          <TabsContent value="modules">
            <div className="space-y-6">
              {modules.map((module, index) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Módulo {index + 1}
                      </CardTitle>
                      {modules.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveModule(module.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Título del Módulo</Label>
                      <Input
                        placeholder="Ej: Introducción a la Seguridad Laboral"
                        value={module.title}
                        onChange={(e) =>
                          handleModuleChange(module.id, 'title', e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Contenido</Label>
                      <Textarea
                        rows={6}
                        placeholder="Escribe el contenido del módulo aquí..."
                        value={module.content}
                        onChange={(e) =>
                          handleModuleChange(module.id, 'content', e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Duración</Label>
                      <Input
                        placeholder="Ej: 60 min"
                        value={module.duration}
                        onChange={(e) =>
                          handleModuleChange(module.id, 'duration', e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Archivos y Recursos</Label>
                      <div className="space-y-2 mb-3">
                        {module.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                          >
                            {file.type === 'document' && (
                              <FileText className="h-4 w-4" />
                            )}
                            {file.type === 'video' && (
                              <Video className="h-4 w-4" />
                            )}
                            {file.type === 'link' && (
                              <LinkIcon className="h-4 w-4" />
                            )}
                            <span className="flex-1 text-sm">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(module.id, file.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddFile(module.id, 'document')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Documento
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddFile(module.id, 'video')}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Video
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddFile(module.id, 'link')}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Enlace
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        En producción, aquí se subirían archivos a Supabase Storage
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={handleAddModule} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Módulo
              </Button>
            </div>
          </TabsContent>

          {/* Tab 3: Exam */}
          <TabsContent value="exam">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Configuración del Examen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passingScore">
                      Puntuación Mínima para Aprobar (%)
                    </Label>
                    <Input
                      id="passingScore"
                      type="number"
                      min="0"
                      max="100"
                      value={passingScore}
                      onChange={(e) => setPassingScore(Number(e.target.value))}
                    />
                    <p className="text-xs text-gray-500 mt-1">El alumno debe superar este puntaje para aprobar.</p>
                  </div>
                  <div>
                    <Label htmlFor="maxAttempts">
                      Máximo de Intentos
                    </Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="1"
                      max="10"
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(Math.max(1, Number(e.target.value)))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Número máximo de veces que el alumno puede rendir el examen.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Pregunta {qIndex + 1}
                      </CardTitle>
                      {questions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Pregunta</Label>
                      <Textarea
                        rows={2}
                        placeholder="Escribe tu pregunta aquí..."
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            'question',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Opciones</Label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() =>
                                handleQuestionChange(
                                  question.id,
                                  'correctAnswer',
                                  oIndex
                                )
                              }
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Input
                                placeholder={`Opción ${oIndex + 1}`}
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    question.id,
                                    oIndex,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            {question.correctAnswer === oIndex && (
                              <Badge variant="default">Correcta</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Selecciona la opción correcta marcando el círculo
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={handleAddQuestion} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Pregunta
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pb-8">
          <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Guardar Borrador
          </Button>
          <Button onClick={handlePublish} className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            {isEditing ? 'Actualizar Curso' : 'Publicar Curso'}
          </Button>
        </div>
      </div>
    </div>
  );
}
