import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ProjectIdeasPage from './pages/ProjectIdeasPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import MyTasksPage from './pages/MyTasksPage';
import GuidelinesPage from './pages/GuidelinesPage';
import UserManagementPage from './pages/UserManagementPage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import SetPasswordPage from './pages/SetPasswordPage';
import RequestPasswordResetPage from './pages/RequestPasswordResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAppContext } from './contexts/AppContext';

const App: React.FC = () => {
  const { language } = useAppContext();

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/project-ideas" element={<ProjectIdeasPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Layout>
  );
};

export default App;
