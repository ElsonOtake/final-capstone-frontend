/* eslint linebreak-style: ["error", "windows"] */
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getValidAuthSession } from '../utils/auth';

const useAuth = () => {
  const session = getValidAuthSession('current_user');
  return Boolean(session && session.token);
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
