

import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import MyTasksPage from '@/pages/MyTasksPage';
import ProjectIdeasPage from '@/pages/ProjectIdeasPage';
import UserManagementPage from '@/pages/UserManagementPage';
import LoginPage from '@/pages/LoginPage';
import RegistrationPage from '@/pages/RegistrationPage';
import UserProfilePage from '@/pages/UserProfilePage';
import GuidelinesPage from '@/pages/GuidelinesPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAppContext } from '@/contexts/AppContext';
import TourModal from '@/components/tour/TourModal';
import SetPasswordPage from '@/pages/SetPasswordPage'; // For invite flow
import RequestPasswordResetPage from '@/pages/RequestPasswordResetPage'; // New for password reset
import ResetPasswordPage from '@/pages/ResetPasswordPage'; // New for password reset

const App: React.FC = () => {
  const { 
    currentUser, 
    loading,
    isTourOpen, 
    tourSteps, 
    currentTourStepIndex, 
    nextTourStep, 
    prevTourStep, 
    finishTour 
  } = useAppContext();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-light-bg">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <RegistrationPage />} />
        <Route path="/set-password" element={currentUser ? <Navigate to="/" replace /> : <SetPasswordPage />} />
        <Route path="/request-password-reset" element={currentUser ? <Navigate to="/" replace /> : <RequestPasswordResetPage />} />
        <Route path="/reset-password" element={currentUser ? <Navigate to="/" replace /> : <ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout><Outlet /></Layout>}>
            <Route index element={<DashboardPage />} />
            <Route path="project/:projectId" element={<ProjectDetailPage />} />
            <Route path="my-tasks" element={<MyTasksPage />} />
            <Route path="project-ideas" element={<ProjectIdeasPage />} />
            <Route path="user-management" element={<UserManagementPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="guidelines" element={<GuidelinesPage />} />
          </Route>
        </Route>
      </Routes>
      
      {currentUser && isTourOpen && tourSteps.length > 0 && (
        <TourModal
          isOpen={isTourOpen}
          onClose={finishTour}
          step={tourSteps[currentTourStepIndex]}
          onNext={nextTourStep}
          onPrev={prevTourStep}
          isLastStep={currentTourStepIndex === tourSteps.length - 1}
          isFirstStep={currentTourStepIndex === 0}
          currentStepIndex={currentTourStepIndex}
          totalSteps={tourSteps.length}
        />
      )}
    </>
  );
};

export default App;