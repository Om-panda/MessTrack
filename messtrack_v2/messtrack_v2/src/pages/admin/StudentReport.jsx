import { useState } from 'react'
import { adminStudentReport } from '../../api/index.js'

const MEAL_ICONS = { breakfast:'🌅', lunch:'☀️', snacks:'🍪', dinner:'🌙' }
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function StudentReport() {
  const now = new Date()
  const [regNo, setRegNo] = useState('')
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async e => {
    e.preventDefault()
    setLoading(true); setError(''); setReport(null)
    try {
      const res = await adminStudentReport({ reg_no: regNo.trim(), month, year })
      setReport(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch report')
    } finally {
      setLoading(false)
    }
  }

  const totalMeals = report?.meals?.reduce((acc, m) => acc + (m.count || 0), 0) || 0

  return (
    <div>
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>Student Report</h1>
          <p className="subtitle">Detailed meal usage and billing for any student</p>
        </div>
      </div>

      {/* Search */}
      <div className="card anim-in anim-delay-1" style={{ marginBottom: '1.5rem', maxWidth: 680 }}>
        <h3 style={{ marginBottom: '1rem' }}>🔍 Generate Report</h3>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Registration Number</label>
              <div className="input-with-icon">
                <span className="input-icon">🪪</span>
                <input className="form-input" placeholder="e.g. 2021BCS001"
                  value={regNo} onChange={e => setRegNo(e.target.value)} required />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Month</label>
              <select className="form-select" value={month} onChange={e => setMonth(+e.target.value)}>
                {SHORT_MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Year</label>
              <select className="form-select" value={year} onChange={e => setYear(+e.target.value)}>
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: 42 }}>
              {loading ? <span className="spinner spinner-sm" style={{ borderTopColor: '#000' }} /> : '📄 Generate'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-error anim-in">⚠️ {error}</div>}

      {report && (
        <div className="anim-in" style={{ maxWidth: 680 }}>
          <div className="report-card">
            {/* Header */}
            <div className="report-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,var(--teal-500),var(--blue-500))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'white',
                }}>
                  {report.student?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.25rem',
                    fontWeight: 800, color: 'var(--text-primary)'
                  }}>
                    {report.student?.name}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-teal">{report.student?.reg_no}</span>
                    <span className="badge badge-blue">{report.student?.hostel_block}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID #{report.student?.id}</span>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Period</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {MONTHS[report.month - 1]} {report.year}
                  </div>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="report-student-info">
              {[
                { k: 'Student Name', v: report.student?.name },
                { k: 'Student ID', v: `#${report.student?.id}` },
                { k: 'Reg No', v: report.student?.reg_no },
                { k: 'Hostel Block', v: report.student?.hostel_block },
                { k: 'Total Meals', v: totalMeals },
                { k: 'Period', v: `${MONTHS[report.month - 1]} ${report.year}` },
              ].map(item => (
                <div className="info-item" key={item.k}>
                  <div className="info-key">{item.k}</div>
                  <div className="info-val">{item.v}</div>
                </div>
              ))}
            </div>

            {/* Meal rows */}
            <div className="report-meals">
              <div style={{
                fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: '0.875rem'
              }}>
                Meal Breakdown
              </div>
              {report.meals?.length ? report.meals.map(m => (
                <div className="meal-row" key={m.meal_type}>
                  <div className="meal-name">
                    <span style={{ fontSize: '1.25rem' }}>{MEAL_ICONS[m.meal_type] || '🍴'}</span>
                    <div>
                      <div style={{ textTransform: 'capitalize', fontWeight: 600 }}>{m.meal_type}</div>
                      <div className="meal-sub">₹{m.price} per meal</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="meal-count">{m.count} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>meals</span></div>
                    <div className="meal-sub" style={{ color: 'var(--teal-400)' }}>₹{m.subtotal?.toLocaleString()}</div>
                  </div>
                </div>
              )) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-icon">🍽️</div>
                  <div className="empty-desc">No meals recorded for this period</div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="report-total">
              <div>
                <div className="total-label">Total Amount Due</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  {MONTHS[report.month - 1]} {report.year} · {totalMeals} total meals
                </div>
              </div>
              <div className="total-val">₹{report.total_amount?.toLocaleString() || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
