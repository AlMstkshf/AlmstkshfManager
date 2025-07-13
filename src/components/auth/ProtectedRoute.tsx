import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

const ProtectedRoute: React.FC = () => {
  const { currentUser, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-light-bg">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    // User not authenticated
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
