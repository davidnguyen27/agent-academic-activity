import { Routes } from "react-router-dom";
import PublicRoutes from "./public.routes";
import AdminRoutes from "./admin.routes";
import UserRoutes from "./user.routes";

export default function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes}
      {UserRoutes}
      {AdminRoutes}
    </Routes>
  );
}
