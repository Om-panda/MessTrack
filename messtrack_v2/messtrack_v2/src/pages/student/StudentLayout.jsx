import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar.jsx'
import Topbar from '../../components/Topbar.jsx'

const TITLES = {
  '/student': 'My Dashboard',
  '/student/block': 'Block Meal',
  '/student/report': 'My Report',
}

export default function StudentLayout() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'Student Portal'
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar title={title} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
