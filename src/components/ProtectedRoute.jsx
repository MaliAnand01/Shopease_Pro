import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse opacity-20">Verifying Identity...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    console.warn("RESTRICTED: Non-admin attempted to access secure route.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
