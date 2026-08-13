import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { userToken } = useAuth();

  if (!userToken) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;