import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import UserLayout from "@/layouts/user/userLayout";

const UserHome = lazy(() => import("@/pages/user/home/userHome"));
const ListCurriculum = lazy(() => import("@/pages/user/curriculum/ListCurriculum"));

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
    </Route>
);

export default UserRoutes;