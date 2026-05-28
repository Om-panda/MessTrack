import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

// Pages
import LoginPage from './pages/auth/Login.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminStudents from './pages/admin/Students.jsx'
import AdminCaterers from './pages/admin/Caterers.jsx'
import AddStudent from './pages/admin/AddStudent.jsx'
import DeleteStudent from './pages/admin/DeleteStudent.jsx'
import AddCaterer from './pages/admin/AddCaterer.jsx'
import DeleteCaterer from './pages/admin/DeleteCaterer.jsx'
import SetPricing from './pages/admin/Pricing.jsx'
import StudentReport from './pages/admin/StudentReport.jsx'
import StudentLayout from './pages/student/StudentLayout.jsx'
import StudentDashboard from './pages/student/Dashboard.jsx'
import BlockMeal from './pages/student/BlockMeal.jsx'
import StudentMyReport from './pages/student/MyReport.jsx'
import CatererLayout from './pages/caterer/CatererLayout.jsx'
import CatererDashboard from './pages/caterer/Dashboard.jsx'
import CatererStudents from './pages/caterer/Students.jsx'
import CatererReport from './pages/caterer/MonthlyReport.jsx'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loader-full"><div className="spinner" /></div>
  if (!user) return <Navigate to="/" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function RoleRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loader-full"><div className="spinner" /></div>
  if (!user) return <LoginPage />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  if (user.role === 'student') return <Navigate to="/student" replace />
  if (user.role === 'caterer') return <Navigate to="/caterer" replace />
  return <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="caterers" element={<AdminCaterers />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="delete-student" element={<DeleteStudent />} />
            <Route path="add-caterer" element={<AddCaterer />} />
            <Route path="delete-caterer" element={<DeleteCaterer />} />
            <Route path="pricing" element={<SetPricing />} />
            <Route path="report" element={<StudentReport />} />
          </Route>

          {/* Student */}
          <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="block" element={<BlockMeal />} />
            <Route path="report" element={<StudentMyReport />} />
          </Route>

          {/* Caterer */}
          <Route path="/caterer" element={<ProtectedRoute roles={['caterer']}><CatererLayout /></ProtectedRoute>}>
            <Route index element={<CatererDashboard />} />
            <Route path="students" element={<CatererStudents />} />
            <Route path="report" element={<CatererReport />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
