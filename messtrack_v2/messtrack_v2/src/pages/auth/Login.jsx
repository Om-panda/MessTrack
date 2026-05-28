import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/index.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginPage() {
  const [form, setForm] = useState({ reg_no: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(form)
      const { token, user } = res.data
      loginUser(token, user)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'student') navigate('/student')
      else if (user.role === 'caterer') navigate('/caterer')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: '🏠', text: '12 Hostel Blocks managed' },
    { icon: '📊', text: 'Real-time meal tracking' },
    { icon: '🛡️', text: 'Role-based access control' },
    { icon: '💰', text: 'Automated billing & reports' },
  ]

  return (
    <div className="login-page">
      <div className="login-card anim-in">
        {/* Left */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-tag">🍽️ Smart Mess System</div>
            <h1>Mess<span className="accent">Track</span><br />Portal</h1>
            <p>Manage hostel mess operations efficiently — from meal tracking to billing across all 12 hostel blocks.</p>
            <div className="login-features">
              {features.map(f => (
                <div className="login-feature" key={f.text}>
                  <div className="feature-dot">{f.icon}</div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="login-right">
          <h2>Welcome back</h2>
          <p className="sub">Sign in with your registration number</p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Registration / Employee ID</label>
              <div className="input-with-icon">
                <span className="input-icon">🪪</span>
                <input
                  className="form-input"
                  type="text"
                  name="reg_no"
                  placeholder="e.g. 2021BCS001"
                  value={form.reg_no}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? <><span className="spinner spinner-sm" style={{borderTopColor:'#000'}} /> Signing in…</> : 'Sign In →'}
            </button>
          </form>

          <div className="divider" />
          <p className="text-xs text-muted text-center">
            Use your institutional credentials to log in. <br/>
            Contact admin if you cannot access your account.
          </p>
        </div>
      </div>
    </div>
  )
}
