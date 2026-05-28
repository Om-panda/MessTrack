import { useState, useEffect } from 'react'
import { studentSelfReport } from '../../api/index.js'
import { useAuth } from '../../context/AuthContext.jsx'

const MEAL_ICONS = { breakfast:'🌅', lunch:'☀️', snacks:'🍪', dinner:'🌙' }
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function StudentMyReport() {
  const { user } = useAuth()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReport = async () => {
    setLoading(true); setError(''); setReport(null)
    try {
      const res = await studentSelfReport({ month, year })
      setReport(res.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReport() }, [month, year])

  const totalMeals = report?.consumed_meals?.reduce((acc,m) => acc+(m.count||0), 0) || 0

  return (
    <div>
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>My Meal Report</h1>
          <p className="subtitle">Your meal consumption and block history by month</p>
        </div>
        <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
          <select className="filter-select-mini" value={month} onChange={e => setMonth(+e.target.value)}>
            {MONTHS.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <select className="filter-select-mini" value={year} onChange={e => setYear(+e.target.value)}>
            {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error anim-in">⚠️ {error}</div>}

      {loading ? (
        <div className="loader-page"><div className="spinner" /><p className="loader-text">Loading report…</p></div>
      ) : report ? (
        <div className="anim-in" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', maxWidth:860}}>
          {/* Meal Consumption */}
          <div>
            <div className="report-card">
              <div className="report-header">
                <div style={{fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.25rem'}}>
                  🍽️ Meals Consumed
                </div>
                <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>{MONTHS[month-1]} {year}</div>
              </div>

              <div className="report-meals">
                {report.consumed_meals?.length ? report.consumed_meals.map(m => (
                  <div className="meal-row" key={m.meal_type}>
                    <div className="meal-name">
                      <span style={{fontSize:'1.2rem'}}>{MEAL_ICONS[m.meal_type] || '🍴'}</span>
                      <span style={{textTransform:'capitalize'}}>{m.meal_type}</span>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="meal-count">{m.count}</div>
                      <div className="meal-sub">meals</div>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state" style={{padding:'2rem'}}>
                    <div className="empty-icon">🍽️</div>
                    <div className="empty-desc">No meals recorded this month</div>
                  </div>
                )}
              </div>

              <div className="report-total">
                <div className="total-label">Total Meals</div>
                <div className="total-val" style={{fontSize:'1.4rem'}}>{totalMeals}</div>
              </div>
            </div>
          </div>

          {/* Blocked Meals */}
          <div>
            <div className="report-card">
              <div className="report-header" style={{background:'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(244,63,94,0.04))'}}>
                <div style={{fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.25rem'}}>
                  🚫 Blocked Periods
                </div>
                <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Meals skipped in {MONTHS[month-1]} {year}</div>
              </div>

              <div className="report-meals">
                {report.blocked_meals?.length ? report.blocked_meals.map((b, i) => (
                  <div key={i} style={{
                    padding:'0.875rem 0', borderBottom:'1px solid rgba(244,63,94,0.08)',
                    display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'0.5rem'
                  }}>
                    <div>
                      <div style={{
                        display:'flex', alignItems:'center', gap:'0.4rem', flexWrap:'wrap',
                        marginBottom:'0.3rem'
                      }}>
                        <span style={{textTransform:'capitalize', fontWeight:600, color:'var(--text-primary)', fontSize:'0.875rem'}}>
                          {MEAL_ICONS[b.meal_type]} {b.meal_type}
                        </span>
                      </div>
                      <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>
                        {b.start_date?.slice(0,10)} → {b.end_date?.slice(0,10)}
                      </div>
                    </div>
                    <span className="badge badge-rose">Blocked</span>
                  </div>
                )) : (
                  <div className="empty-state" style={{padding:'2rem'}}>
                    <div className="empty-icon">✅</div>
                    <div className="empty-desc">No meals blocked this month</div>
                  </div>
                )}
              </div>

              <div className="report-total" style={{background:'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(244,63,94,0.03))'}}>
                <div className="total-label">Total Blocks</div>
                <div className="total-val" style={{fontSize:'1.4rem', color:'var(--rose-400)'}}>{report.blocked_meals?.length || 0}</div>
              </div>
            </div>

            {/* Student info card */}
            <div className="card" style={{marginTop:'1rem'}}>
              <div style={{fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-dim)', marginBottom:'0.875rem'}}>Your Profile</div>
              <div style={{display:'flex', flexDirection:'column', gap:'0.6rem'}}>
                {[
                  { k:'Name', v: user?.name },
                  { k:'Reg No', v: user?.reg_no },
                  { k:'Role', v: user?.role },
                ].map(row => (
                  <div key={row.k} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:'0.78rem', color:'var(--text-dim)'}}>{row.k}</span>
                    <span style={{fontSize:'0.875rem', fontWeight:600, color:'var(--text-primary)'}}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
