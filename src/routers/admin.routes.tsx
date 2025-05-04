import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "@/layouts/admin/Layout";

const Dashboard = lazy(() => import("@/pages/admin/dashboard/Dashboard"));

const ToolManagement = lazy(() => import("@/pages/admin/tool/Tools"));

const SubjectManagement = lazy(() => import("@/pages/admin/subject/Subjects"));
const SubjectCreate = lazy(() => import("@/pages/admin/subject/CreateSubject"));
const SubjectEdit = lazy(() => import("@/pages/admin/subject/EditSubject"));
const CLOManagement = lazy(() => import("@/pages/admin/clo/CLOs"));
const PrerequisiteManagement = lazy(() => import("@/pages/admin/prerequisite/Prerequisites"));

const StudentManagement = lazy(() => import("@/pages/admin/student/Students"));

const MajorManagement = lazy(() => import("@/pages/admin/major/Majors"));

const CurriculumOverview = lazy(() => import("@/pages/admin/curriculum/CurriculumOverview"));
const CurriculumManagement = lazy(() => import("@/pages/admin/curriculum/Curriculums"));
const CurriculumCreate = lazy(() => import("@/pages/admin/curriculum/CreateCurriculum"));
const EditCurriculum = lazy(() => import("@/pages/admin/curriculum/EditCurriculum"));

const ProgramManagement = lazy(() => import("@/pages/admin/program/Programs"));
const POManagement = lazy(() => import("@/pages/admin/po/POs"));

const ComboManagement = lazy(() => import("@/pages/admin/combo/Combos"));

const MaterialManagement = lazy(() => import("@/pages/admin/material/Materials"));
const MaterialCreate = lazy(() => import("@/pages/admin/material/CreateMaterial"));
const MaterialEdit = lazy(() => import("@/pages/admin/material/EditMaterial"));

const AssessmentManagement = lazy(() => import("@/pages/admin/assessment/Assessments"));
const AssessmentCreate = lazy(() => import("@/pages/admin/assessment/CreateAssessment"));
const AssessmentEdit = lazy(() => import("@/pages/admin/assessment/EditAssessment"));

const AdminRoutes = (
  <Route
    path="/admin"
    element={
      <PrivateRoute allowedRoles={["Admin"]}>
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
      path="subject/clo-list"
      element={
        <Suspense>
          <CLOManagement />
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
      path="subject/details"
      element={
        <Suspense>
          <SubjectEdit />
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
      path="curriculum/major"
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
      path="curriculum/overview"
      element={
        <Suspense>
          <CurriculumOverview />
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
      path="program/combo-list"
      element={
        <Suspense>
          <ComboManagement />
        </Suspense>
      }
    />
    <Route
      path="program/po-list"
      element={
        <Suspense>
          <POManagement />
        </Suspense>
      }
    />
    <Route
      path="material"
      element={
        <Suspense>
          <MaterialManagement />
        </Suspense>
      }
    />
    <Route
      path="material/create"
      element={
        <Suspense>
          <MaterialCreate />
        </Suspense>
      }
    />
    <Route
      path="material/details"
      element={
        <Suspense>
          <MaterialEdit />
        </Suspense>
      }
    />
    <Route
      path="subject/clo-list/assessment"
      element={
        <Suspense>
          <AssessmentManagement />
        </Suspense>
      }
    />
    <Route
      path="subject/clo-list/assessment/create"
      element={
        <Suspense>
          <AssessmentCreate />
        </Suspense>
      }
    />
    <Route
      path="subject/clo-list/assessment/details"
      element={
        <Suspense>
          <AssessmentEdit />
        </Suspense>
      }
    />
    <Route
      path="subject/prerequisite"
      element={
        <Suspense>
          <PrerequisiteManagement />
        </Suspense>
      }
    />
  </Route>
);

export default AdminRoutes;
