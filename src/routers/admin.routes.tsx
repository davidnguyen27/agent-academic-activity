import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "@/layouts/admin/Layout";

const Dashboard = lazy(() => import("@/pages/admin/dashboard/Dashboard"));
const ToolManagement = lazy(() => import("@/pages/admin/tool/Tools"));
const SubjectManagement = lazy(() => import("@/pages/admin/subject/Subjects"));
const StudentManagement = lazy(() => import("@/pages/admin/student/Students"));
const MajorManagement = lazy(() => import("@/pages/admin/major/Majors"));
const CurriculumManagement = lazy(() => import("@/pages/admin/curriculum/Curriculums"));
const CurriculumCreate = lazy(() => import("@/pages/admin/curriculum/CreateCurriculum"));
const EditCurriculum = lazy(() => import("@/pages/admin/curriculum/EditCurriculum"));

const AdminRoutes = (
  <Route
    path="/admin"
    element={
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    }
  >
    <Route
      path="dashboard"
      element={
        <Suspense fallback={<div className="p-4 text-center">Loading Dashboard...</div>}>
          <Dashboard />
        </Suspense>
      }
    />
    <Route
      path="tool"
      element={
        <Suspense fallback={<div className="p-4 text-center">Loading Tools...</div>}>
          <ToolManagement />
        </Suspense>
      }
    />
    <Route
      path="subject"
      element={
        <Suspense fallback={<div className="p-4 text-center">Loading Subjects...</div>}>
          <SubjectManagement />
        </Suspense>
      }
    />
    <Route
      path="student"
      element={
        <Suspense fallback={<div className="p-4 text-center">Loading Students...</div>}>
          <StudentManagement />
        </Suspense>
      }
    />
    <Route
      path="major"
      element={
        <Suspense fallback={<div className="p-4 text-center">Loading Majors...</div>}>
          <MajorManagement />
        </Suspense>
      }
    />
    <Route
      path="curriculum"
      element={
        <Suspense fallback={<div className="p-4 text-center">Loading Curriculums...</div>}>
          <CurriculumManagement />
        </Suspense>
      }
    />
    <Route
      path="curriculum/create"
      element={
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <CurriculumCreate />
        </Suspense>
      }
    />
    <Route
      path="curriculum/details"
      element={
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <EditCurriculum />
        </Suspense>
      }
    />
  </Route>
);

export default AdminRoutes;
