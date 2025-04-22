import { Route } from "react-router-dom";
import { lazy } from "react";

const Authentication = lazy(() => import("@/pages/admin/Authenticate"));
const SignIn = lazy(() => import("@/pages/index"));

const PublicRoutes = (
  <>
    <Route path="/" element={<SignIn />} />
    <Route path="/authentication" element={<Authentication />} />
  </>
);

export default PublicRoutes;
