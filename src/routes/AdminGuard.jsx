import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const isAdminLoggedIn = Boolean(localStorage.getItem("admin_logged_in")); 

  if (!isAdminLoggedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
}
