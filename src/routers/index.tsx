import { Routes } from "react-router-dom";
import PublicRoutes from "./public.routes";
import AdminRoutes from "./admin.routes";

export default function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes}
      {AdminRoutes}
    </Routes>
  );
}
