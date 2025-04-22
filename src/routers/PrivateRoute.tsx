import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    const isLoggedIn = !!token;
    const isAllowed = allowedRoles ? allowedRoles.includes(role || "") : true;

    if (!isLoggedIn || !isAllowed) {
      navigate("/authentication", { replace: true });
    }
  }, [navigate, allowedRoles]);

  return <>{children}</>;
}
