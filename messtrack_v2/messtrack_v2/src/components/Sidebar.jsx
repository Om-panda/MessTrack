import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const MENUS = {
  admin: [
    { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { label: 'Students', section: true },
    { path: '/admin/students', label: 'Student List', icon: '📋' },
    { path: '/admin/add-student', label: 'Add Student', icon: '➕' },
    { path: '/admin/delete-student', label: 'Delete Student', icon: '🗑️' },
    { label: 'Caterers', section: true },
    { path: '/admin/caterers', label: 'Caterer List', icon: '👨‍🍳' },
    { path: '/admin/add-caterer', label: 'Add Caterer', icon: '➕' },
    { path: '/admin/delete-caterer', label: 'Delete Caterer', icon: '🗑️' },
    { label: 'Management', section: true },
    { path: '/admin/pricing', label: 'Set Pricing', icon: '💰' },
    { path: '/admin/report', label: 'Student Report', icon: '📄' },
  ],
  student: [
    { path: '/student', label: 'Dashboard', icon: '🏠', exact: true },
    { path: '/student/block', label: 'Block Meal', icon: '🚫' },
    { path: '/student/report', label: 'My Report', icon: '📊' },
  ],
  caterer: [
    { path: '/caterer', label: 'Dashboard', icon: '🏠', exact: true },
    { path: '/caterer/students', label: 'My Hostel Students', icon: '👥' },
    { path: '/caterer/report', label: 'Monthly Report', icon: '📊' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const role = user?.role || 'student'
  const menu = MENUS[role] || []

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  }

  const roleColor = { admin: 'var(--teal-400)', student: 'var(--amber-400)', caterer: 'var(--blue-400)' }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="brand-icon">🍽️</div>
          <span className="brand-name">Mess<span>Track</span></span>
        </div>
        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
          <div className="user-avatar" style={{ width: 30, height: 30, fontSize: '0.72rem', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
              {user?.reg_no}
            </div>
          </div>
        </div>
        <span className={`role-chip ${role}`} style={{ marginTop: '0.6rem', display: 'inline-flex' }}>
          {role === 'admin' ? '🛡️' : role === 'student' ? '🎓' : '👨‍🍳'} {role}
        </span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {menu.map((item, i) => {
          if (item.section) return (
            <div className="nav-section-label" key={i}>{item.label}</div>
          )
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item) ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={logout}>
          <span>⏻</span> Sign Out
        </button>
      </div>
    </aside>
  )
}
