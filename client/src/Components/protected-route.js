import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = ({
  isAuthenticated,
  isAdmin,
  isAdminRoute,
  children,
  redirect = "/",
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate(redirect);

    if (isAdminRoute && !isAdmin) navigate(redirect);
  }, []);

  if (children) return children;

  return <Outlet />;
};

export default ProtectedRoute;
