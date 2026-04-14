import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore, useThemeStore } from './stores'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy loaded pages
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'))
const Analyzer = lazy(() => import('./pages/Analyzer'))
const AnalysisResult = lazy(() => import('./pages/AnalysisResult'))
const Templates = lazy(() => import('./pages/Templates'))
const Profile = lazy(() => import('./pages/Profile'))
const SharedResume = lazy(() => import('./pages/SharedResume'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

// Admin route wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

// App layout with sidebar for authenticated pages
const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return (
    <div className="layout-sidebar">
      {isAuthenticated && <Sidebar />}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const { initTheme } = useThemeStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    initTheme()
  }, [])

  return (
    <Suspense fallback={<LoadingSpinner fullscreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/r/:token" element={<SharedResume />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/builder/:id?" element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        } />
        <Route path="/analyzer" element={
          <ProtectedRoute>
            <AppLayout><Analyzer /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/analyzer/:id" element={
          <ProtectedRoute>
            <AppLayout><AnalysisResult /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute>
            <AppLayout><Templates /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout><Profile /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AppLayout><AdminPanel /></AppLayout>
          </AdminRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
