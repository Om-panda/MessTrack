import { useState, useEffect, useMemo } from 'react'
import api from '../../api/index.js'

const MEAL_TYPES = ['breakfast','lunch','snacks','dinner']
const MEAL_ICONS = { breakfast:'🌅', lunch:'☀️', snacks:'🍪', dinner:'🌙' }

function MealDot({ taken }) {
  return (
    <span className={`meal-dot ${taken ? 'meal-dot-taken' : 'meal-dot-notTaken'}`}
      title={taken ? 'Taken today' : 'Not taken today'}>
      {taken ? '✓' : '✗'}
    </span>
  )
}

function CardStatus({ blocked }) {
  if (blocked) return <span className="card-status-blocked"><span className="dot dot-red" /> Blocked</span>
  return <span className="card-status-unblocked"><span className="dot dot-green" /> Active</span>
}

export default function CatererStudents() {
  const [students, setStudents] = useState([])
  const [hostelBlock, setHostelBlock] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const fetchStudents = async () => {
    setLoading(true); setError('')
    try {
      const res = await api.get('/caterer/students-dashboard')
      // New backend returns array directly from getCatererStudentsController
      const data = res.data
      if (Array.isArray(data)) {
        setStudents(data)
        setHostelBlock(data[0]?.hostel_block || '')
      } else {
        // fallback for old response shape
        setStudents(data.students || [])
        setHostelBlock(data.students?.[0]?.hostel_block || '')
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const filtered = useMemo(() => {
    let list = students
    if (statusFilter === 'Active') list = list.filter(s => !s.blocked)
    if (statusFilter === 'Blocked') list = list.filter(s => s.blocked)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s => s.name?.toLowerCase().includes(q) || s.reg_no?.toLowerCase().includes(q))
    }
    return list
  }, [students, statusFilter, search])

  const activeCount = students.filter(s => !s.blocked).length
  const blockedCount = students.filter(s => s.blocked).length

  return (
    <div>
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>My Hostel Students</h1>
          <p className="subtitle">
            Students in your assigned hostel
            {hostelBlock && <span className="badge badge-blue" style={{ marginLeft: '0.5rem' }}>{hostelBlock}</span>}
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchStudents}>↻ Refresh</button>
      </div>

      <div className="stats-grid anim-in anim-delay-1" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon icon-blue">👥</div>
          <div className="stat-body">
            <div className="stat-label">Total</div>
            <div className="stat-value">{students.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon icon-emerald">✅</div>
          <div className="stat-body">
            <div className="stat-label">Active</div>
            <div className="stat-value">{activeCount}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon icon-rose">🚫</div>
          <div className="stat-body">
            <div className="stat-label">Blocked</div>
            <div className="stat-value">{blockedCount}</div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-bar anim-in anim-delay-2">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input className="search-input-mini" placeholder="Search name or reg no…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['All', 'Active', 'Blocked'].map(s => (
          <button key={s} className={`tab-btn ${statusFilter === s ? 'active' : ''}`}
            style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}
            onClick={() => setStatusFilter(s)}>
            {s === 'All' ? '👥 All' : s === 'Active' ? '✅ Active' : '🚫 Blocked'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader-page"><div className="spinner" /><p className="loader-text">Loading students…</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <div className="empty-title">No students found</div>
          <div className="empty-desc">{students.length === 0 ? 'No students in your hostel yet' : 'Try adjusting your search or filter'}</div>
        </div>
      ) : (
        <div className="table-wrapper anim-in anim-delay-3">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Reg No</th>
                <th>Card Status</th>
                {MEAL_TYPES.map(m => (
                  <th key={m} style={{ textAlign: 'center' }}>{MEAL_ICONS[m]} {m[0].toUpperCase() + m.slice(1)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>{i + 1}</td>
                  <td className="td-name">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        background: s.blocked
                          ? 'linear-gradient(135deg,var(--rose-500),#c0392b)'
                          : 'linear-gradient(135deg,var(--blue-500),var(--teal-500))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.72rem', fontWeight: 700, color: 'white',
                        fontFamily: 'var(--font-display)',
                      }}>
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      {s.name}
                    </div>
                  </td>
                  <td className="td-mono">{s.reg_no}</td>
                  <td><CardStatus blocked={s.blocked} /></td>
                  {MEAL_TYPES.map(m => (
                    <td key={m} style={{ textAlign: 'center' }}>
                      <MealDot taken={s.meals?.[m] === true} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
