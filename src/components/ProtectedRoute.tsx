import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { decodeJWT } from "../utils/jwtUtlis";


// Protected route (only logged-in users)
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;

  const decoded = decodeJWT(token);
  if (!decoded) return <Navigate to="/login" replace />;

  return children;
};

// Admin route (only admins allowed)
export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;

  const decoded = decodeJWT(token);
  if (!decoded) return <Navigate to="/login" replace />;

  if (!decoded.isAdmin) {
    return <Navigate to="/" replace />; // redirect non-admins
  }

  return children;
};

// Auth-only (login/signup etc. if NOT logged in)
export const AuthOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("accessToken");
  const decoded = token ? decodeJWT(token) : null;

  if (decoded) {
    return <Navigate to="/" replace />; // already logged in → redirect
  }

  return children;
};
