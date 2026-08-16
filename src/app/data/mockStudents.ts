export interface StudentEnrollment {
  courseId: string;
  enrolledAt: string;
  completedModules: string[];
  examScore: number | null;
  examAttempts: number;
  passed: boolean;
  certificateIssuedAt: string | null;
  completedAt: string | null;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  enrollments: StudentEnrollment[];
  registeredAt: string;
}

// Helper: generate dates relative to today
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const mockStudents: Student[] = [
  {
    id: 's-01', name: 'María García', age: 28, email: 'maria.garcia@email.com', phone: '+56 9 1234 5678',
    registeredAt: daysAgo(60),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(55), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 85, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(30), completedAt: daysAgo(30) },
      { courseId: '2', enrolledAt: daysAgo(28), completedModules: ['2-1','2-2'], examScore: null, examAttempts: 0, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-02', name: 'Juan Pérez', age: 35, email: 'juan.perez@email.com', phone: '+56 9 2345 6789',
    registeredAt: daysAgo(45),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(44), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 75, examAttempts: 2, passed: true, certificateIssuedAt: daysAgo(20), completedAt: daysAgo(20) },
      { courseId: '3', enrolledAt: daysAgo(15), completedModules: ['3-1'], examScore: null, examAttempts: 0, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-03', name: 'Ana López', age: 22, email: 'ana.lopez@email.com', phone: '+56 9 3456 7890',
    registeredAt: daysAgo(90),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(89), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 90, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(60), completedAt: daysAgo(60) },
      { courseId: '2', enrolledAt: daysAgo(58), completedModules: ['2-1','2-2','2-3','2-4'], examScore: 88, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(40), completedAt: daysAgo(40) },
      { courseId: '3', enrolledAt: daysAgo(38), completedModules: ['3-1','3-2','3-3','3-4'], examScore: 82, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(10), completedAt: daysAgo(10) },
    ],
  },
  {
    id: 's-04', name: 'Carlos Ruiz', age: 41, email: 'carlos.ruiz@email.com', phone: '+56 9 4567 8901',
    registeredAt: daysAgo(30),
    enrollments: [
      { courseId: '3', enrolledAt: daysAgo(29), completedModules: ['3-1','3-2'], examScore: 65, examAttempts: 1, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-05', name: 'Laura Martínez', age: 26, email: 'laura.martinez@email.com', phone: '+56 9 5678 9012',
    registeredAt: daysAgo(75),
    enrollments: [
      { courseId: '2', enrolledAt: daysAgo(74), completedModules: ['2-1','2-2','2-3','2-4'], examScore: 95, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(45), completedAt: daysAgo(45) },
      { courseId: '1', enrolledAt: daysAgo(43), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 80, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(20), completedAt: daysAgo(20) },
    ],
  },
  {
    id: 's-06', name: 'Roberto Sánchez', age: 33, email: 'roberto.sanchez@email.com', phone: '+56 9 6789 0123',
    registeredAt: daysAgo(20),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(18), completedModules: ['1-1','1-2'], examScore: null, examAttempts: 0, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-07', name: 'Valentina Torres', age: 19, email: 'valentina.torres@email.com', phone: '+56 9 7890 1234',
    registeredAt: daysAgo(50),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(49), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 70, examAttempts: 2, passed: true, certificateIssuedAt: daysAgo(25), completedAt: daysAgo(25) },
      { courseId: '2', enrolledAt: daysAgo(24), completedModules: ['2-1','2-2','2-3'], examScore: null, examAttempts: 0, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-08', name: 'Diego Flores', age: 38, email: 'diego.flores@email.com', phone: '+56 9 8901 2345',
    registeredAt: daysAgo(10),
    enrollments: [
      { courseId: '2', enrolledAt: daysAgo(9), completedModules: [], examScore: null, examAttempts: 0, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-09', name: 'Camila Rojas', age: 24, email: 'camila.rojas@email.com', phone: '+56 9 9012 3456',
    registeredAt: daysAgo(65),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(64), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 78, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(35), completedAt: daysAgo(35) },
      { courseId: '3', enrolledAt: daysAgo(33), completedModules: ['3-1','3-2','3-3','3-4'], examScore: 74, examAttempts: 2, passed: true, certificateIssuedAt: daysAgo(5), completedAt: daysAgo(5) },
    ],
  },
  {
    id: 's-10', name: 'Felipe Morales', age: 31, email: 'felipe.morales@email.com', phone: '+56 9 0123 4567',
    registeredAt: daysAgo(40),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(39), completedModules: ['1-1','1-2','1-3'], examScore: 60, examAttempts: 2, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-11', name: 'Isabela Navarro', age: 27, email: 'isabela.navarro@email.com', phone: '+56 9 1357 2468',
    registeredAt: daysAgo(80),
    enrollments: [
      { courseId: '2', enrolledAt: daysAgo(79), completedModules: ['2-1','2-2','2-3','2-4'], examScore: 92, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(50), completedAt: daysAgo(50) },
      { courseId: '3', enrolledAt: daysAgo(48), completedModules: ['3-1','3-2','3-3','3-4'], examScore: 86, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(18), completedAt: daysAgo(18) },
    ],
  },
  {
    id: 's-12', name: 'Matías Vargas', age: 45, email: 'matias.vargas@email.com', phone: '+56 9 2468 1357',
    registeredAt: daysAgo(5),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(4), completedModules: ['1-1'], examScore: null, examAttempts: 0, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-13', name: 'Sofía Herrera', age: 21, email: 'sofia.herrera@email.com', phone: '+56 9 3579 1246',
    registeredAt: daysAgo(55),
    enrollments: [
      { courseId: '3', enrolledAt: daysAgo(54), completedModules: ['3-1','3-2','3-3','3-4'], examScore: 88, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(28), completedAt: daysAgo(28) },
      { courseId: '1', enrolledAt: daysAgo(26), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 76, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(3), completedAt: daysAgo(3) },
    ],
  },
  {
    id: 's-14', name: 'Andrés Mendoza', age: 36, email: 'andres.mendoza@email.com', phone: '+56 9 4680 2357',
    registeredAt: daysAgo(25),
    enrollments: [
      { courseId: '2', enrolledAt: daysAgo(24), completedModules: ['2-1','2-2','2-3','2-4'], examScore: 72, examAttempts: 2, passed: true, certificateIssuedAt: daysAgo(2), completedAt: daysAgo(2) },
    ],
  },
  {
    id: 's-15', name: 'Catalina Jiménez', age: 29, email: 'catalina.jimenez@email.com', phone: '+56 9 5791 3468',
    registeredAt: daysAgo(35),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(34), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 83, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(12), completedAt: daysAgo(12) },
      { courseId: '2', enrolledAt: daysAgo(10), completedModules: ['2-1'], examScore: null, examAttempts: 0, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-16', name: 'Nicolás Castro', age: 23, email: 'nicolas.castro@email.com', phone: '+56 9 6802 4579',
    registeredAt: daysAgo(15),
    enrollments: [],
  },
  {
    id: 's-17', name: 'Fernanda Ríos', age: 32, email: 'fernanda.rios@email.com', phone: '+56 9 7913 5680',
    registeredAt: daysAgo(70),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(69), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 91, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(42), completedAt: daysAgo(42) },
      { courseId: '2', enrolledAt: daysAgo(40), completedModules: ['2-1','2-2','2-3','2-4'], examScore: 79, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(22), completedAt: daysAgo(22) },
    ],
  },
  {
    id: 's-18', name: 'Sebastián Ortega', age: 40, email: 'sebastian.ortega@email.com', phone: '+56 9 8024 6791',
    registeredAt: daysAgo(8),
    enrollments: [
      { courseId: '3', enrolledAt: daysAgo(7), completedModules: ['3-1','3-2'], examScore: null, examAttempts: 0, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-19', name: 'Javiera Muñoz', age: 25, email: 'javiera.munoz@email.com', phone: '+56 9 9135 7802',
    registeredAt: daysAgo(48),
    enrollments: [
      { courseId: '2', enrolledAt: daysAgo(47), completedModules: ['2-1','2-2','2-3','2-4'], examScore: 68, examAttempts: 2, passed: false, certificateIssuedAt: null, completedAt: null },
      { courseId: '1', enrolledAt: daysAgo(15), completedModules: ['1-1','1-2'], examScore: null, examAttempts: 0, passed: false, certificateIssuedAt: null, completedAt: null },
    ],
  },
  {
    id: 's-20', name: 'Rodrigo Espinoza', age: 37, email: 'rodrigo.espinoza@email.com', phone: '+56 9 0246 8913',
    registeredAt: daysAgo(100),
    enrollments: [
      { courseId: '1', enrolledAt: daysAgo(99), completedModules: ['1-1','1-2','1-3','1-4'], examScore: 87, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(72), completedAt: daysAgo(72) },
      { courseId: '2', enrolledAt: daysAgo(70), completedModules: ['2-1','2-2','2-3','2-4'], examScore: 93, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(48), completedAt: daysAgo(48) },
      { courseId: '3', enrolledAt: daysAgo(46), completedModules: ['3-1','3-2','3-3','3-4'], examScore: 89, examAttempts: 1, passed: true, certificateIssuedAt: daysAgo(15), completedAt: daysAgo(15) },
    ],
  },
];

// Global mutable store so add/remove enrollment actions persist during the session
let _students: Student[] = mockStudents.map(s => ({ ...s, enrollments: [...s.enrollments] }));

export function getStudents(): Student[] {
  return _students;
}

export function getStudentById(id: string): Student | undefined {
  return _students.find(s => s.id === id);
}

export function enrollStudentInCourse(studentId: string, courseId: string): void {
  const student = _students.find(s => s.id === studentId);
  if (!student) return;
  if (student.enrollments.some(e => e.courseId === courseId)) return;
  student.enrollments.push({
    courseId,
    enrolledAt: new Date().toISOString(),
    completedModules: [],
    examScore: null,
    examAttempts: 0,
    passed: false,
    certificateIssuedAt: null,
    completedAt: null,
  });
}

export function removeStudentFromCourse(studentId: string, courseId: string): void {
  const student = _students.find(s => s.id === studentId);
  if (!student) return;
  student.enrollments = student.enrollments.filter(e => e.courseId !== courseId);
}

export function getStudentsForCourse(courseId: string): Student[] {
  return _students.filter(s => s.enrollments.some(e => e.courseId === courseId));
}

// Generate daily completion counts for the last N days for a given course
export function getDailyCompletions(courseId: string, days: number): Array<{ date: string; count: number }> {
  const result: Array<{ date: string; count: number }> = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const count = _students.filter(s =>
      s.enrollments.some(e =>
        e.courseId === courseId &&
        e.completedAt !== null &&
        e.completedAt.split('T')[0] === dateStr
      )
    ).length;

    result.push({ date: dateStr, count });
  }

  return result;
}
