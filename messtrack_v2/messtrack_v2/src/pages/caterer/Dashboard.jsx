import { useState, useEffect } from 'react'
import { catererTodayMeals, catererStudentsDashboard } from '../../api/index.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const MEAL_ICONS = { breakfast:'🌅', lunch:'☀️', snacks:'🍪', dinner:'🌙' }

export default function CatererDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [todayMeals, setTodayMeals] = useState(null)
  const [students, setStudents] = useState([])
  const [hostelBlock, setHostelBlock] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [todayRes, studentsRes] = await Promise.all([
          catererTodayMeals(),
          catererStudentsDashboard(),
        ])
        setTodayMeals(todayRes.data)
        const studData = Array.isArray(studentsRes.data)
          ? studentsRes.data
          : (studentsRes.data?.students || [])
        setStudents(studData)
        setHostelBlock(studData[0]?.hostel_block || '')
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const now = new Date()
  const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()]
  const totalToday = todayMeals?.meals?.reduce((a, m) => a + (m.count || 0), 0) || 0
  const activeStudents = students.filter(s => !s.blocked).length
  const blockedStudents = students.filter(s => s.blocked).length

  return (
    <div>
      {/* Welcome banner */}
      <div className="anim-in" style={{
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(0,201,184,0.08))',
        border: '1px solid rgba(59,130,246,0.2)',
        marginBottom: '2rem',
        display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(0,201,184,0.07),transparent 70%)',
          top: -80, right: -60, pointerEvents: 'none',
        }} />
        <div style={{
          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,var(--blue-500),var(--teal-500))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
        }}>👨‍🍳</div>
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Good {now.getHours() < 12 ? 'Morning' : now.getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            {user?.name?.split(' ')[0]}! 👋
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>{dayName}, {now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            {hostelBlock && <span className="badge badge-blue">{hostelBlock}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Today's Total
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--teal-400)', lineHeight: 1 }}>
            {totalToday}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>meals served</div>
        </div>
      </div>

      {loading ? (
        <div className="loader-page"><div className="spinner" /><p className="loader-text">Loading dashboard…</p></div>
      ) : (
        <>
          {/* Stats */}
          <div className="stats-grid anim-in anim-delay-1" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-card-icon icon-teal">🍽️</div>
              <div className="stat-body">
                <div className="stat-label">Today's Meals</div>
                <div className="stat-value">{totalToday}</div>
                <div className="stat-sub">All types</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon icon-blue">👥</div>
              <div className="stat-body">
                <div className="stat-label">Total Students</div>
                <div className="stat-value">{students.length}</div>
                <div className="stat-sub">In {hostelBlock || 'hostel'}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon icon-emerald">✅</div>
              <div className="stat-body">
                <div className="stat-label">Active Cards</div>
                <div className="stat-value">{activeStudents}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon icon-rose">🚫</div>
              <div className="stat-body">
                <div className="stat-label">Blocked Cards</div>
                <div className="stat-value">{blockedStudents}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="anim-in anim-delay-2">
            {/* Today's meal breakdown */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)',
                background: 'linear-gradient(135deg,rgba(0,201,184,0.08),rgba(0,201,184,0.02))',
              }}>
                <h3>⚡ Today's Meal Count</h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  {todayMeals?.date || now.toISOString().split('T')[0]}
                </div>
              </div>
              <div style={{ padding: '0.5rem 1.25rem' }}>
                {todayMeals?.meals?.length ? todayMeals.meals.map(m => (
                  <div key={m.meal_type} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.875rem 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{MEAL_ICONS[m.meal_type] || '🍴'}</span>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>
                        {m.meal_type}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800,
                      color: 'var(--teal-400)',
                    }}>{m.count}</div>
                  </div>
                )) : (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <div className="empty-icon">🍽️</div>
                    <div className="empty-desc">No meals served yet today</div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <button className="card" style={{
                flex: 1, textAlign: 'left', cursor: 'pointer',
                border: '1px solid rgba(59,130,246,0.2)',
                transition: 'all 0.2s',
              }}
                onClick={() => navigate('/caterer/students')}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>👥</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  My Hostel Students
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  View all students in {hostelBlock || 'your hostel'} with card and meal status
                </div>
                <div style={{ color: 'var(--teal-400)', fontSize: '0.8rem', fontWeight: 600 }}>View Students →</div>
              </button>

              <button className="card" style={{
                flex: 1, textAlign: 'left', cursor: 'pointer',
                border: '1px solid rgba(0,201,184,0.2)',
                transition: 'all 0.2s',
              }}
                onClick={() => navigate('/caterer/report')}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>📊</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Monthly Report
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  View meal counts and billing report for any month
                </div>
                <div style={{ color: 'var(--teal-400)', fontSize: '0.8rem', fontWeight: 600 }}>View Report →</div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
