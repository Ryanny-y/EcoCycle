import useAuth from "@/contexts/AuthContext";
import type { Role } from "@/contexts/types/AuthContextTypes";
import { Navigate, Outlet, useLocation } from "react-router";

interface RoleProtectedProps {
  allowedRoles?: Role[];
}

const Protected = ({ allowedRoles } : RoleProtectedProps ) => {
  const { authResponse, loading } = useAuth();
  const location = useLocation();

  if(loading) return null;

  if (!authResponse) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }  

  if (!allowedRoles) {
    return <Outlet />;
  }

  if (!allowedRoles.includes(authResponse.data.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default Protected