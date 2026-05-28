import { useAuth } from '../context/AuthContext.jsx'

export default function Topbar({ title }) {
  const { user } = useAuth()
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">
        <div className="topbar-user">
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-reg">{user?.reg_no}</div>
          </div>
          <div className="user-avatar">{initials}</div>
        </div>
      </div>
    </header>
  )
}
