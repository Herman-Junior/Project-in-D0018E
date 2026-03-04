import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  
  try {
    // new - manual JWT decode without library
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.is_admin) return <Navigate to="/" />;
  } catch {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;