export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  image: string;
  teacherId: string;
  teacherName: string;
  modules: Module[];
  exam: Exam;
}

export interface Module {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: string;
}

export interface Exam {
  id: string;
  passingScore: number;
  maxAttempts: number;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const courses: Course[] = [
  {
    id: '1',
    teacherId: 'teacher-1',
    teacherName: 'Prof. Carmen Silva',
    title: 'Fundamentos de Seguridad en el Trabajo',
    description: 'Aprende los principios básicos de seguridad laboral y prevención de riesgos en el entorno de trabajo.',
    duration: '4 horas',
    level: 'Principiante',
    image: 'workplace-safety',
    modules: [
      {
        id: '1-1',
        title: 'Introducción a la Seguridad Laboral',
        content: 'La seguridad laboral es fundamental para proteger a los trabajadores de accidentes y enfermedades ocupacionales. En este módulo aprenderás los conceptos básicos, normativas vigentes y la importancia de crear una cultura de seguridad en la organización.\n\nPrincipios clave:\n• Identificación de riesgos\n• Evaluación de peligros\n• Implementación de medidas preventivas\n• Capacitación continua del personal',
        duration: '60 min',
      },
      {
        id: '1-2',
        title: 'Equipos de Protección Personal (EPP)',
        content: 'Los Equipos de Protección Personal son elementos esenciales para la seguridad del trabajador. Aprenderás a identificar, usar y mantener correctamente cada tipo de EPP según el riesgo específico.\n\nTipos de EPP:\n• Protección de cabeza: cascos\n• Protección visual: gafas y caretas\n• Protección auditiva: tapones y orejeras\n• Protección respiratoria: mascarillas y respiradores\n• Protección de manos: guantes especializados\n• Protección de pies: calzado de seguridad',
        duration: '45 min',
      },
      {
        id: '1-3',
        title: 'Prevención de Accidentes',
        content: 'La prevención es la mejor estrategia para evitar accidentes laborales. Este módulo cubre técnicas de identificación de riesgos, análisis de causas y medidas preventivas.\n\nEstrategias de prevención:\n• Inspecciones regulares de seguridad\n• Mantenimiento preventivo de equipos\n• Señalización adecuada\n• Procedimientos de trabajo seguro\n• Reporte e investigación de incidentes',
        duration: '50 min',
      },
      {
        id: '1-4',
        title: 'Respuesta a Emergencias',
        content: 'Saber cómo actuar en situaciones de emergencia puede salvar vidas. Aprenderás protocolos de evacuación, primeros auxilios básicos y manejo de situaciones críticas.\n\nPlan de emergencias:\n• Rutas de evacuación\n• Puntos de encuentro\n• Brigadas de emergencia\n• Primeros auxilios básicos\n• Comunicación en crisis\n• Simulacros y entrenamiento',
        duration: '45 min',
      },
    ],
    exam: {
      id: 'exam-1',
      passingScore: 70,
      maxAttempts: 3,
      questions: [
        {
          id: 'q1',
          question: '¿Cuál es el primer paso en la prevención de riesgos laborales?',
          options: [
            'Comprar equipos de protección',
            'Identificar los riesgos presentes',
            'Contratar más personal',
            'Hacer un simulacro',
          ],
          correctAnswer: 1,
        },
        {
          id: 'q2',
          question: '¿Qué significa EPP?',
          options: [
            'Equipo Personal de Producción',
            'Equipo de Protección Personal',
            'Empresa de Prevención Profesional',
            'Evaluación de Peligros Potenciales',
          ],
          correctAnswer: 1,
        },
        {
          id: 'q3',
          question: '¿Cuál es el porcentaje mínimo para aprobar este curso?',
          options: ['50%', '60%', '70%', '80%'],
          correctAnswer: 2,
        },
        {
          id: 'q4',
          question: '¿Qué debe hacerse antes de usar un equipo de protección?',
          options: [
            'Guardarlo inmediatamente',
            'Verificar que esté en buen estado',
            'Compartirlo con otros trabajadores',
            'Pintarlo de un color visible',
          ],
          correctAnswer: 1,
        },
        {
          id: 'q5',
          question: 'En caso de emergencia, ¿cuál es la acción prioritaria?',
          options: [
            'Tomar fotografías',
            'Llamar a un familiar',
            'Garantizar la seguridad de las personas',
            'Recoger pertenencias personales',
          ],
          correctAnswer: 2,
        },
      ],
    },
  },
  {
    id: '2',
    teacherId: 'teacher-1',
    teacherName: 'Prof. Carmen Silva',
    title: 'Gestión de Proyectos Ágiles',
    description: 'Domina las metodologías ágiles como Scrum y Kanban para gestionar proyectos de manera eficiente.',
    duration: '6 horas',
    level: 'Intermedio',
    image: 'agile-management',
    modules: [
      {
        id: '2-1',
        title: 'Introducción a las Metodologías Ágiles',
        content: 'Las metodologías ágiles revolucionaron la forma de gestionar proyectos. Aprenderás los valores y principios del Manifiesto Ágil y cómo aplicarlos en tu organización.\n\nValores ágiles:\n• Individuos e interacciones sobre procesos y herramientas\n• Software funcionando sobre documentación extensiva\n• Colaboración con el cliente sobre negociación contractual\n• Respuesta ante el cambio sobre seguir un plan',
        duration: '60 min',
      },
      {
        id: '2-2',
        title: 'Framework Scrum',
        content: 'Scrum es el framework ágil más utilizado. Conocerás sus roles, eventos y artefactos para implementarlo efectivamente.\n\nComponentes de Scrum:\n• Roles: Product Owner, Scrum Master, Development Team\n• Eventos: Sprint, Daily Scrum, Sprint Review, Retrospective\n• Artefactos: Product Backlog, Sprint Backlog, Increment',
        duration: '90 min',
      },
      {
        id: '2-3',
        title: 'Metodología Kanban',
        content: 'Kanban te permite visualizar el flujo de trabajo y optimizar la eficiencia. Aprenderás a crear y gestionar tableros Kanban efectivos.\n\nPrincipios de Kanban:\n• Visualizar el trabajo\n• Limitar el trabajo en proceso\n• Gestionar el flujo\n• Hacer políticas explícitas\n• Implementar ciclos de feedback\n• Mejorar colaborativamente',
        duration: '75 min',
      },
      {
        id: '2-4',
        title: 'Métricas y Mejora Continua',
        content: 'Medir es fundamental para mejorar. Descubre las métricas ágiles más importantes y cómo usarlas para optimizar el rendimiento del equipo.\n\nMétricas clave:\n• Velocidad del equipo\n• Lead time y cycle time\n• Burndown charts\n• Cumulative flow diagrams\n• Retrospectivas efectivas',
        duration: '75 min',
      },
    ],
    exam: {
      id: 'exam-2',
      passingScore: 70,
      maxAttempts: 2,
      questions: [
        {
          id: 'q1',
          question: '¿Cuál es el evento de Scrum donde se planifica el trabajo del Sprint?',
          options: [
            'Daily Scrum',
            'Sprint Planning',
            'Sprint Review',
            'Retrospective',
          ],
          correctAnswer: 1,
        },
        {
          id: 'q2',
          question: '¿Qué significa WIP en Kanban?',
          options: [
            'Work In Progress',
            'Weekly Improvement Plan',
            'Workflow Integration Process',
            'Work Inspection Period',
          ],
          correctAnswer: 0,
        },
        {
          id: 'q3',
          question: '¿Quién es responsable de maximizar el valor del producto en Scrum?',
          options: [
            'Scrum Master',
            'Development Team',
            'Product Owner',
            'Stakeholders',
          ],
          correctAnswer: 2,
        },
        {
          id: 'q4',
          question: '¿Cuánto dura típicamente un Sprint en Scrum?',
          options: [
            '1 día',
            '1-4 semanas',
            '2 meses',
            'No tiene duración fija',
          ],
          correctAnswer: 1,
        },
        {
          id: 'q5',
          question: '¿Cuál es el objetivo principal de una Retrospectiva?',
          options: [
            'Revisar el producto',
            'Planificar el siguiente sprint',
            'Mejorar continuamente el proceso',
            'Asignar nuevas tareas',
          ],
          correctAnswer: 2,
        },
      ],
    },
  },
  {
    id: '3',
    teacherId: 'teacher-2',
    teacherName: 'Prof. Marcos Fuentes',
    title: 'Liderazgo y Gestión de Equipos',
    description: 'Desarrolla habilidades de liderazgo efectivo y aprende a gestionar equipos de alto rendimiento.',
    duration: '5 horas',
    level: 'Avanzado',
    image: 'leadership-team',
    modules: [
      {
        id: '3-1',
        title: 'Fundamentos del Liderazgo',
        content: 'El liderazgo va más allá de la autoridad. Descubre los diferentes estilos de liderazgo y cómo desarrollar tu propio enfoque auténtico.\n\nEstilos de liderazgo:\n• Liderazgo transformacional\n• Liderazgo situacional\n• Liderazgo servicial\n• Liderazgo democrático\n• Inteligencia emocional del líder',
        duration: '75 min',
      },
      {
        id: '3-2',
        title: 'Comunicación Efectiva',
        content: 'La comunicación es la herramienta más poderosa del líder. Aprende técnicas de comunicación asertiva, escucha activa y feedback constructivo.\n\nHabilidades de comunicación:\n• Escucha activa\n• Comunicación no verbal\n• Feedback constructivo\n• Presentaciones efectivas\n• Manejo de conversaciones difíciles',
        duration: '60 min',
      },
      {
        id: '3-3',
        title: 'Motivación y Desarrollo del Equipo',
        content: 'Un equipo motivado es un equipo productivo. Descubre estrategias para inspirar, desarrollar el talento y crear un ambiente de alto rendimiento.\n\nEstrategias de motivación:\n• Teorías de motivación\n• Reconocimiento y recompensas\n• Desarrollo profesional\n• Empoderamiento del equipo\n• Construcción de confianza',
        duration: '75 min',
      },
      {
        id: '3-4',
        title: 'Resolución de Conflictos',
        content: 'Los conflictos son inevitables, pero manejados correctamente pueden ser oportunidades de crecimiento. Aprende técnicas de mediación y resolución de conflictos.\n\nGestión de conflictos:\n• Identificación de conflictos\n• Técnicas de mediación\n• Negociación efectiva\n• Construcción de consensos\n• Prevención de conflictos futuros',
        duration: '70 min',
      },
    ],
    exam: {
      id: 'exam-3',
      passingScore: 70,
      maxAttempts: 3,
      questions: [
        {
          id: 'q1',
          question: '¿Qué es la inteligencia emocional en el liderazgo?',
          options: [
            'La capacidad de controlar las emociones de otros',
            'La capacidad de reconocer y gestionar emociones propias y ajenas',
            'La ausencia de emociones en la toma de decisiones',
            'La capacidad de ocultar las emociones',
          ],
          correctAnswer: 1,
        },
        {
          id: 'q2',
          question: '¿Cuál es una característica del liderazgo transformacional?',
          options: [
            'Enfocarse solo en resultados',
            'Inspirar y motivar al equipo hacia una visión compartida',
            'Mantener el status quo',
            'Evitar cambios en la organización',
          ],
          correctAnswer: 1,
        },
        {
          id: 'q3',
          question: '¿Qué es el feedback constructivo?',
          options: [
            'Crítica negativa del desempeño',
            'Elogio sin fundamento',
            'Retroalimentación específica y orientada a la mejora',
            'Ignorar los errores del equipo',
          ],
          correctAnswer: 2,
        },
        {
          id: 'q4',
          question: 'En la resolución de conflictos, ¿cuál es el primer paso?',
          options: [
            'Asignar culpables',
            'Ignorar el problema',
            'Escuchar todas las perspectivas',
            'Imponer una solución',
          ],
          correctAnswer: 2,
        },
        {
          id: 'q5',
          question: '¿Qué significa empoderar al equipo?',
          options: [
            'Hacer todo el trabajo por ellos',
            'Darles autoridad y recursos para tomar decisiones',
            'Supervisar constantemente cada acción',
            'Evitar delegar responsabilidades',
          ],
          correctAnswer: 1,
        },
      ],
    },
  },
];
