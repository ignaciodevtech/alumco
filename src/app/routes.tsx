import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { Exam } from "./pages/Exam";
import { Certificate } from "./pages/Certificate";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCourses } from "./pages/admin/AdminCourses";
import { AdminCourseStats } from "./pages/admin/AdminCourseStats";
import { AdminStudents } from "./pages/admin/AdminStudents";
import { AdminStudentProfile } from "./pages/admin/AdminStudentProfile";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { CreateCourse } from "./pages/teacher/CreateCourse";
import { CourseStudents } from "./pages/teacher/CourseStudents";
import { Ranking } from "./pages/Ranking";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "dashboard", Component: Dashboard },
      { path: "courses", Component: Courses },
      { path: "courses/:courseId", Component: CourseDetail },
      { path: "courses/:courseId/exam", Component: Exam },
      { path: "certificate/:certificateId", Component: Certificate },
      { path: "profile", Component: Profile },
      { path: "ranking", Component: Ranking },
      // Admin routes
      { path: "admin", Component: AdminDashboard },
      { path: "admin/courses", Component: AdminCourses },
      { path: "admin/courses/:courseId/stats", Component: AdminCourseStats },
      { path: "admin/students", Component: AdminStudents },
      { path: "admin/students/:studentId", Component: AdminStudentProfile },
      // Teacher routes
      { path: "teacher", Component: TeacherDashboard },
      { path: "teacher/courses/new", Component: CreateCourse },
      { path: "teacher/courses/:courseId/edit", Component: CreateCourse },
      { path: "teacher/courses/:courseId/students", Component: CourseStudents },
      { path: "*", Component: NotFound },
    ],
  },
]);
