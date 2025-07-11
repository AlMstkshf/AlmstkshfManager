import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const ProtectedRoute: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    // User not authenticated
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;