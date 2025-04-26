import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import UserLayout from "@/layouts/user/userLayout";

const UserHome = lazy(() => import("@/pages/user/home/userHome"));
const ListCurriculum = lazy(() => import("@/pages/user/curriculum/ListCurriculum"));
const DetailCurriculum = lazy(() => import("@/pages/user/curriculum/DetailCurriculum"));
const ListSubject = lazy(() => import("@/pages/user/subject/ListSubject"));
const DetailSubject = lazy(() => import("@/pages/user/subject/DetailSubject"));

const UserRoutes = (
  <Route
    path="/user"
    element={
      // <PrivateRoute>
      <UserLayout />
      // </PrivateRoute>
    }
  >
    <Route
      index
      element={
        <Suspense>
          <UserHome />
        </Suspense>
      }
    />
    <Route
      path="curriculum"
      element={
        <Suspense>
          <ListCurriculum />
        </Suspense>
      }
    />
    <Route
      path="curriculum/:id"
      element={
        <Suspense>
          <DetailCurriculum />
        </Suspense>
      }
    />
    <Route 
      path="subjects"
      element={
        <Suspense>
          <ListSubject />
        </Suspense>
      }
    />
    <Route
      path="subjects/:id"
      element={
        <Suspense>
          <DetailSubject />
        </Suspense>
      }
    />
  </Route>
);

export default UserRoutes;
