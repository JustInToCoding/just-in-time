import { Navigate } from 'react-router';
import { useMoneybird } from '../../modules/moneybird';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useMoneybird();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
