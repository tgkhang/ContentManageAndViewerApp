import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';

interface GuestGuardProps {
  children: ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [checked, setChecked] = useState(false);
  
  // Use this effect to prevent render loops
  useEffect(() => {
    if (isInitialized) {
      setChecked(true);
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // Only redirect after initialization is complete
  if (checked && isAuthenticated) {
    // Redirect based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === 'editor') {
      return <Navigate to="/editor" replace />;
    }
    // Fallback
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}