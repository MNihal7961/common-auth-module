import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './store';
import { loadAuth, setupAuthRefresh, clearAuth } from './store/authSlice';

// Route only for authenticated users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const location = useLocation();
  if (!accessToken) return <Navigate to="/signin" state={{ from: location }} replace />;
  return <>{children}</>;
};

// Route only for unauthenticated users
const UnauthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const location = useLocation();
  if (accessToken) return <Navigate to="/" state={{ from: location }} replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const expiresAt = useSelector((state: RootState) => state.auth.expiresAt);

  useEffect(() => {
    dispatch(loadAuth());
  }, [dispatch]);

  useEffect(() => {
    setupAuthRefresh(dispatch, expiresAt);
    if (expiresAt && expiresAt < Date.now()) {
      dispatch(clearAuth());
    }
  }, [dispatch, expiresAt]);

  return (
    <Routes>
      {/* Unauthenticated users only */}
      <Route path="/signin" element={<UnauthRoute><SignIn /></UnauthRoute>} />
      <Route path="/signup" element={<UnauthRoute><SignUp /></UnauthRoute>} />
      {/* Authenticated users only */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      {/* Catch-all: redirect to home or sign-in based on auth */}
      <Route path="*" element={
        useSelector((state: RootState) => state.auth.accessToken)
          ? <Navigate to="/" replace />
          : <Navigate to="/signin" replace />
      } />
    </Routes>
  );
};

export default App;
