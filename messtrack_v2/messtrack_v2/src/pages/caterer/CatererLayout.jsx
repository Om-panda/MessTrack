import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar.jsx'
import Topbar from '../../components/Topbar.jsx'

const TITLES = {
  '/caterer': 'Caterer Dashboard',
  '/caterer/students': 'My Hostel Students',
  '/caterer/report': 'Monthly Report',
}

export default function CatererLayout() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'Caterer Portal'
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
