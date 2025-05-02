import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';

interface GuestGuardProps {
  children: ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    // Redirect based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    if (user?.role === 'editor') {
      return <Navigate to="/editor/dashboard" />;
    }
    // Fallback
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}