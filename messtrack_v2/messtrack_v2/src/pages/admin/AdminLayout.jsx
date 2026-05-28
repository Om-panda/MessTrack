import { Outlet, useLocation } from 'react-router-dom'

import Sidebar from '../../components/Sidebar.jsx'

import Topbar from '../../components/Topbar.jsx'

const TITLES = {

  '/admin': 'Dashboard Overview',

  '/admin/students': 'Student List',

  '/admin/caterers': 'Caterer List',

  '/admin/add-student': 'Add New Student',

  '/admin/delete-student': 'Delete Student',

  '/admin/add-caterer': 'Add New Caterer',

  '/admin/delete-caterer': 'Delete Caterer',

  '/admin/pricing': 'Meal Pricing',

  '/admin/report': 'Student Report',

  '/admin/read-rfid': 'RFID Registration'
}

export default function AdminLayout() {

  const { pathname } = useLocation()

  const title = TITLES[pathname] || 'Admin Panel'

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