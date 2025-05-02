import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import UserLayout from "@/layouts/user/Layout";
import PrivateRoute from "./PrivateRoute";

const ChatPage = lazy(() => import("@/pages/user/Chat"));

const UserRoutes = (
  <Route
    path="/user"
    element={
      <PrivateRoute allowedRoles={["Student"]}>
        <UserLayout />
      </PrivateRoute>
    }
  >
    <Route
      path="chat"
      element={
        <Suspense>
          <ChatPage />
        </Suspense>
      }
    />
    <Route
      path="chat/:id"
      element={
        <Suspense>
          <ChatPage />
        </Suspense>
      }
    />
  </Route>
);

export default UserRoutes;
