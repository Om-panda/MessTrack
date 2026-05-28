import { useState, useEffect } from 'react'
import { studentSelfReport } from '../../api/index.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const MEAL_ICONS = { breakfast:'🌅', lunch:'☀️', snacks:'🍪', dinner:'🌙' }
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const now = new Date()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await studentSelfReport({ month: now.getMonth() + 1, year: now.getFullYear() })
        setReport(res.data)
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    fetchReport()
  }, [])

  const totalMeals = report?.consumed_meals?.reduce((acc, m) => acc + (m.count || 0), 0) || 0
  const activeBlocks = report?.blocked_meals?.length || 0

  return (
    <div>
      {/* Welcome Card */}
      <div className="anim-in" style={{
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg,rgba(0,201,184,0.12),rgba(59,130,246,0.08))',
        border: '1px solid rgba(0,201,184,0.2)',
        marginBottom: '2rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(0,201,184,0.08),transparent 70%)',
          top: -100, right: -80, pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 58, height: 58, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,var(--teal-500),var(--blue-500))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'white',
            boxShadow: '0 4px 16px rgba(0,201,184,0.4)',
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Hi, {user?.name?.split(' ')[0]}! 👋
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.4rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-teal">{user?.reg_no}</span>
              {user?.hostel_block && <span className="badge badge-blue">{user.hostel_block}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Current Month
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {MONTHS[now.getMonth()]} {now.getFullYear()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()]},{' '}
              {now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid anim-in anim-delay-1" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon icon-teal">🍽️</div>
          <div className="stat-body">
            <div className="stat-label">Meals This Month</div>
            <div className="stat-value">{loading ? '…' : totalMeals}</div>
            <div className="stat-sub">Total consumed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon icon-rose">🚫</div>
          <div className="stat-body">
            <div className="stat-label">Active Blocks</div>
            <div className="stat-value">{loading ? '…' : activeBlocks}</div>
            <div className="stat-sub">Blocked periods</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon icon-blue">🏠</div>
          <div className="stat-body">
            <div className="stat-label">Hostel Block</div>
            <div className="stat-value" style={{ fontSize: '1.2rem', marginTop: '0.1rem' }}>
              {user?.hostel_block || '—'}
            </div>
            <div className="stat-sub">Your assigned block</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }} className="anim-in anim-delay-2">
        ⚡ Quick Actions
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem', maxWidth: 560 }} className="anim-in anim-delay-2">
        <button
          onClick={() => navigate('/student/block')}
          style={{
            background: 'rgba(244,63,94,0.08)',
            border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            textAlign: 'left', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.2)' }}>
          <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>🚫</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--rose-400)', marginBottom: '0.3rem' }}>Block Meal</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Skip upcoming meals in advance</div>
        </button>

        <button
          onClick={() => navigate('/student/report')}
          style={{
            background: 'rgba(0,201,184,0.08)',
            border: '1px solid rgba(0,201,184,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            textAlign: 'left', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(0,201,184,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,201,184,0.2)' }}>
          <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>📊</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--teal-400)', marginBottom: '0.3rem' }}>My Report</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>View history & blocked periods</div>
        </button>
      </div>

      {/* This month breakdown */}
      {!loading && report?.consumed_meals?.length > 0 && (
        <div className="card anim-in anim-delay-3" style={{ maxWidth: 560, marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.1rem' }}>📋 {MONTHS[now.getMonth()]} Meal Summary</h3>
          {report.consumed_meals.map(m => (
            <div key={m.meal_type} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.7rem 0', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.15rem' }}>{MEAL_ICONS[m.meal_type] || '🍴'}</span>
                <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem' }}>
                  {m.meal_type}
                </span>
              </div>
              <div style={{
                background: 'rgba(0,201,184,0.12)', border: '1px solid rgba(0,201,184,0.25)',
                borderRadius: 'var(--radius-full)', padding: '0.2rem 0.75rem',
                fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--teal-400)', fontSize: '0.9rem',
              }}>
                {m.count}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
