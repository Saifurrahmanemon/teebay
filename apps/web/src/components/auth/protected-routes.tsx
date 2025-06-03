import { useAuth } from '@/context/auth-context';
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children?: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
