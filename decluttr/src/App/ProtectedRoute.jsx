import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

export default function ProtectedRoute() {
  const { user } = useAuth();
  
  // For now, allow access without authentication
  // return user ? <Outlet /> : <Navigate to="/login" />;
  return <Outlet />;
}