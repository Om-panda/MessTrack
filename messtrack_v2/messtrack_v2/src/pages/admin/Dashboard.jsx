import { useState, useEffect } from 'react'
import { adminDashboard, getAllPrices, getCaterers } from '../../api/index.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', snacks: '🍪', dinner: '🌙' }

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [data, setData] = useState(null)
  const [prices, setPrices] = useState([])
  const [catererCount, setCatererCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAll = async () => {
    setLoading(true); setError('')
    try {
      const [dashRes, priceRes, catRes] = await Promise.all([
        adminDashboard({ month, year }),
        getAllPrices(),
        getCaterers(),
      ])
      setData(dashRes.data)
      setPrices(priceRes.data || [])
      setCatererCount(Array.isArray(catRes.data) ? catRes.data.length : 0)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [month, year])

  const QUICK_ACTIONS = [
    { icon: '➕', label: 'Add Student', desc: 'Register a new student', color: 'teal',   path: '/admin/add-student' },
    { icon: '🗑️', label: 'Delete Student', desc: 'Remove a student record', color: 'rose',  path: '/admin/delete-student' },
    { icon: '👨‍🍳', label: 'Add Caterer', desc: 'Register a new caterer', color: 'blue',  path: '/admin/add-caterer' },
    { icon: '💰', label: 'Set Pricing', desc: 'Update meal prices',       color: 'amber', path: '/admin/pricing' },
    { icon: '📄', label: 'Student Report', desc: 'View billing & attendance', color: 'emerald', path: '/admin/report' },
    { icon: '📋', label: 'Student List', desc: 'Browse all students',     color: 'blue',  path: '/admin/students' },
  ]

  const colorMap = {
    teal:    { bg: 'var(--teal-glow)',    color: 'var(--teal-400)',    border: 'rgba(0,201,184,0.25)'   },
    rose:    { bg: 'var(--rose-glow)',    color: 'var(--rose-400)',    border: 'rgba(244,63,94,0.25)'   },
    amber:   { bg: 'var(--amber-glow)',   color: 'var(--amber-400)',   border: 'rgba(245,158,11,0.25)'  },
    blue:    { bg: 'var(--blue-glow)',    color: 'var(--blue-400)',    border: 'rgba(59,130,246,0.25)'  },
    emerald: { bg: 'var(--emerald-glow)', color: 'var(--emerald-400)', border: 'rgba(16,185,129,0.25)' },
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>
            Good {now.getHours() < 12 ? 'Morning' : now.getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            <span style={{ color: 'var(--teal-400)' }}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="subtitle">
            Here's the mess overview for{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{MONTHS[month - 1]} {year}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select className="filter-select-mini" value={month} onChange={e => setMonth(+e.target.value)}>
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select className="filter-select-mini" value={year} onChange={e => setYear(+e.target.value)}>
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={fetchAll}>↻</button>
        </div>
      </div>

      {error && <div className="alert alert-error anim-in">⚠️ {error}</div>}

      {loading ? (
        <div className="loader-page"><div className="spinner" /><p className="loader-text">Loading dashboard…</p></div>
      ) : (
        <>
          {/* ── Stat Cards ── */}
          <div className="stats-grid anim-in anim-delay-1" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-card-icon icon-teal">🍽️</div>
              <div className="stat-body">
                <div className="stat-label">Total Meals</div>
                <div className="stat-value">{(data?.total_meals || 0).toLocaleString()}</div>
                <div className="stat-sub">{MONTHS[month - 1]} {year}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon icon-blue">👨‍🍳</div>
              <div className="stat-body">
                <div className="stat-label">Active Caterers</div>
                <div className="stat-value">{catererCount ?? '—'}</div>
                <div className="stat-sub">Across all hostels</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon icon-amber">💰</div>
              <div className="stat-body">
                <div className="stat-label">Prices Set</div>
                <div className="stat-value">{prices.length}</div>
                <div className="stat-sub">Active price entries</div>
              </div>
            </div>
          </div>

          {/* ── Two-column grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="anim-in anim-delay-2">

            {/* Current Meal Prices */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '1.1rem 1.5rem',
                borderBottom: '1px solid var(--border)',
                background: 'linear-gradient(135deg,rgba(0,201,184,0.08),rgba(0,201,184,0.02))',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <h3 style={{ color: 'var(--text-primary)' }}>💰 Current Meal Prices</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/pricing')}
                  style={{ fontSize: '0.75rem' }}>Manage →</button>
              </div>
              <div style={{ padding: '0.5rem 1.5rem' }}>
                {prices.length ? (
                  // Show latest price per meal type
                  (() => {
                    const latest = {}
                    prices.forEach(p => {
                      if (!latest[p.meal_type] || p.effective_from > latest[p.meal_type].effective_from) {
                        latest[p.meal_type] = p
                      }
                    })
                    return Object.values(latest).map(p => (
                      <div key={p.meal_type} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.875rem 0', borderBottom: '1px solid var(--border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>{MEAL_ICONS[p.meal_type] || '🍴'}</span>
                          <div>
                            <div style={{ fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                              {p.meal_type}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                              From {p.effective_from?.slice(0, 10)}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800,
                          color: 'var(--amber-400)'
                        }}>
                          ₹{p.price}
                        </div>
                      </div>
                    ))
                  })()
                ) : (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <div className="empty-icon">💰</div>
                    <div className="empty-desc">No prices configured yet</div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600 }}>
                ⚡ Quick Actions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {QUICK_ACTIONS.map(a => {
                  const c = colorMap[a.color]
                  return (
                    <button
                      key={a.path}
                      onClick={() => navigate(a.path)}
                      style={{
                        background: c.bg,
                        border: `1px solid ${c.border}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <span style={{ fontSize: '1.35rem' }}>{a.icon}</span>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: c.color, fontSize: '0.875rem' }}>
                        {a.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{a.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
