import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function RequireAdmin({ children }) {
  const { token, loading } = useAdminAuth();

  if (loading) return <div className="admin-loading">Loading…</div>;
  if (!token) return <Navigate to="/admin/login" replace />;

  return children;
}
