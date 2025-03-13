import { Navigate } from 'react-router';
import { useAuth } from '../../modules/moneybird';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, administration } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/setup/login" replace />;
  }

  if (administration === null) {
    return <Navigate to="/setup/administration" replace />;
  }

  return children;
};
