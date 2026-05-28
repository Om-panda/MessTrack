import { useState, useEffect } from 'react'
import { catererMonthlyReport, catererTodayMeals } from '../../api/index.js'

const MEAL_ICONS = { breakfast:'🌅', lunch:'☀️', snacks:'🍪', dinner:'🌙' }
const MEAL_COLORS = { breakfast:'icon-amber', lunch:'icon-teal', snacks:'icon-blue', dinner:'icon-rose' }
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function CatererReport() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [report, setReport] = useState(null)
  const [todayData, setTodayData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReport = async () => {
    setLoading(true); setError(''); setReport(null)
    try {
      const [monthRes, todayRes] = await Promise.all([
        catererMonthlyReport({ month, year }),
        catererTodayMeals()
      ])
      setReport(monthRes.data)
      setTodayData(todayRes.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReport() }, [month, year])

  const totalMeals = report?.meals?.reduce((a,m) => a+(m.count||0), 0) || 0

  return (
    <div>
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>Monthly Report</h1>
          <p className="subtitle">Meal counts and revenue for your hostel block</p>
        </div>
        <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
          <select className="filter-select-mini" value={month} onChange={e => setMonth(+e.target.value)}>
            {MONTHS.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <select className="filter-select-mini" value={year} onChange={e => setYear(+e.target.value)}>
            {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={fetchReport}>↻</button>
        </div>
      </div>

      {error && <div className="alert alert-error anim-in">⚠️ {error}</div>}

      {loading ? (
        <div className="loader-page"><div className="spinner" /><p className="loader-text">Loading report…</p></div>
      ) : (
        <div className="anim-in">
          {/* Summary stats */}
          <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)', marginBottom:'1.5rem'}}>
            <div className="stat-card">
              <div className="stat-card-icon icon-teal">🍽️</div>
              <div className="stat-body">
                <div className="stat-label">Total Meals</div>
                <div className="stat-value">{totalMeals.toLocaleString()}</div>
                <div className="stat-sub">{MONTHS[month-1]} {year}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon icon-emerald">💰</div>
              <div className="stat-body">
                <div className="stat-label">Total Payment</div>
                <div className="stat-value">₹{(report?.total_payment || 0).toLocaleString()}</div>
                <div className="stat-sub">Receivable</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon icon-amber">📅</div>
              <div className="stat-body">
                <div className="stat-label">Today</div>
                <div className="stat-value" style={{fontSize:'1rem', marginTop:'0.2rem'}}>
                  {todayData?.meals?.reduce((a,m) => a+(m.count||0), 0) || 0}
                </div>
                <div className="stat-sub">Meals served today</div>
              </div>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem'}}>
            {/* Monthly breakdown */}
            {report?.meals?.length > 0 && (
              <div className="report-card">
                <div className="report-header">
                  <div style={{fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--text-primary)'}}>
                    📊 {MONTHS[month-1]} {year} Breakdown
                  </div>
                </div>
                <div className="report-meals">
                  {report.meals.map(m => (
                    <div className="meal-row" key={m.meal_type}>
                      <div className="meal-name">
                        <div className={`stat-card-icon ${MEAL_COLORS[m.meal_type] || 'icon-teal'}`} style={{width:36,height:36,fontSize:'0.95rem'}}>
                          {MEAL_ICONS[m.meal_type] || '🍴'}
                        </div>
                        <div>
                          <div style={{textTransform:'capitalize', fontWeight:600}}>{m.meal_type}</div>
                          <div className="meal-sub">₹{m.price} per meal</div>
                        </div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div className="meal-count">{m.count}</div>
                        <div className="meal-sub" style={{color:'var(--teal-400)'}}>₹{m.subtotal?.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="report-total">
                  <div>
                    <div className="total-label">Total Payment</div>
                    <div style={{fontSize:'0.78rem', color:'var(--text-dim)', marginTop:'0.15rem'}}>{totalMeals} total meals</div>
                  </div>
                  <div className="total-val">₹{report.total_payment?.toLocaleString() || 0}</div>
                </div>
              </div>
            )}

            {/* Today's count */}
            <div className="card">
              <h3 style={{marginBottom:'1rem'}}>⚡ Today's Count</h3>
              <div style={{color:'var(--text-dim)', fontSize:'0.78rem', marginBottom:'1rem'}}>
                {todayData?.date || new Date().toISOString().split('T')[0]}
              </div>
              {todayData?.meals?.length ? todayData.meals.map(m => (
                <div key={m.meal_type} style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'0.75rem 0', borderBottom:'1px solid var(--border)'
                }}>
                  <div style={{display:'flex', alignItems:'center', gap:'0.6rem'}}>
                    <span style={{fontSize:'1.15rem'}}>{MEAL_ICONS[m.meal_type] || '🍴'}</span>
                    <span style={{textTransform:'capitalize', color:'var(--text-secondary)', fontWeight:500}}>{m.meal_type}</span>
                  </div>
                  <div style={{
                    fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:800,
                    color:'var(--teal-400)'
                  }}>{m.count}</div>
                </div>
              )) : (
                <div className="empty-state" style={{padding:'1.5rem'}}>
                  <div className="empty-icon">🍽️</div>
                  <div className="empty-desc">No meals served today yet</div>
                </div>
              )}
            </div>

            {/* No data state for monthly */}
            {(!report?.meals || report.meals.length === 0) && (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <div className="empty-title">No data for {MONTHS[month-1]} {year}</div>
                <div className="empty-desc">No meals were recorded for this period</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
