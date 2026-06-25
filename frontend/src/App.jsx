import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import CreatePlan from './pages/CreatePlan';
import Users from './pages/Users';
import CreateUser from './pages/CreateUser';
import Subscriptions from './pages/Subscriptions';
import CreateSubscription from './pages/CreateSubscription';
import Billing from './pages/Billing';

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout><Plans /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans/create"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout><CreatePlan /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout><Users /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout><CreateUser /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout><Subscriptions /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions/create"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout><CreateSubscription /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout><Billing /></Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
