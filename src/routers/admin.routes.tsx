import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "@/layouts/admin/Layout";

const Dashboard = lazy(() => import("@/pages/admin/dashboard/Dashboard"));
const ToolManagement = lazy(() => import("@/pages/admin/tool/Tools"));
const SubjectManagement = lazy(() => import("@/pages/admin/subject/Subjects"));
const SubjectCreate = lazy(() => import("@/pages/admin/subject/CreateSubject"));
const StudentManagement = lazy(() => import("@/pages/admin/student/Students"));
const MajorManagement = lazy(() => import("@/pages/admin/major/Majors"));
const CurriculumManagement = lazy(() => import("@/pages/admin/curriculum/Curriculums"));
const CurriculumCreate = lazy(() => import("@/pages/admin/curriculum/CreateCurriculum"));
const EditCurriculum = lazy(() => import("@/pages/admin/curriculum/EditCurriculum"));
const ProgramManagement = lazy(() => import("@/pages/admin/program/Programs"));
const ComboManagement = lazy(() => import("@/pages/admin/combo/Combos"));

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
        <Suspense>
          <Dashboard />
        </Suspense>
      }
    />
    <Route
      path="tool"
      element={
        <Suspense>
          <ToolManagement />
        </Suspense>
      }
    />
    <Route
      path="subject"
      element={
        <Suspense>
          <SubjectManagement />
        </Suspense>
      }
    />
    <Route
      path="subject/create"
      element={
        <Suspense>
          <SubjectCreate />
        </Suspense>
      }
    />
    <Route
      path="student"
      element={
        <Suspense>
          <StudentManagement />
        </Suspense>
      }
    />
    <Route
      path="major"
      element={
        <Suspense>
          <MajorManagement />
        </Suspense>
      }
    />
    <Route
      path="curriculum"
      element={
        <Suspense>
          <CurriculumManagement />
        </Suspense>
      }
    />
    <Route
      path="curriculum/create"
      element={
        <Suspense>
          <CurriculumCreate />
        </Suspense>
      }
    />
    <Route
      path="curriculum/details"
      element={
        <Suspense>
          <EditCurriculum />
        </Suspense>
      }
    />
    <Route
      path="program"
      element={
        <Suspense>
          <ProgramManagement />
        </Suspense>
      }
    />
    <Route
      path="combo"
      element={
        <Suspense>
          <ComboManagement />
        </Suspense>
      }
    />
  </Route>
);

export default AdminRoutes;
