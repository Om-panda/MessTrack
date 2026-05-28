import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { getStudentsList } from '../../api/index.js'

const HOSTELS = ['BH-1','BH-2','BH-3','BH-4','BH-5','BH-6','BH-7','BH-8','BH-9','BH-10','BH-11','BH-12']

const MEAL_TYPES = ['breakfast','lunch','snacks','dinner']

const MEAL_ICONS = {
  breakfast: '🌅',
  lunch: '☀️',
  snacks: '🍪',
  dinner: '🌙'
}

function getMealStatus(mealType, taken) {

  const now = new Date()

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes()

  const mealEndTimes = {

    breakfast: 9 * 60 + 15,

    lunch: 14 * 60 + 30,

    snacks: 19 * 60,

    dinner: 22 * 60
  }

  if (taken === true) {

    return {
      symbol: '✓',
      color: '#10b981',
      title: 'Meal Taken'
    }
  }

  if (currentMinutes > mealEndTimes[mealType]) {

    return {
      symbol: '✗',
      color: '#ef4444',
      title: 'Meal Missed'
    }
  }

  return {
    symbol: '-',
    color: '#f59e0b',
    title: 'Session Running'
  }
}

function MealDot({ mealType, taken }) {

  const status =
    getMealStatus(mealType, taken)

  return (
    <span
      title={status.title}
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '0.8rem',
        background: `${status.color}20`,
        color: status.color,
        border: `1px solid ${status.color}55`
      }}
    >
      {status.symbol}
    </span>
  )
}

function CardStatus({ blocked }) {

  if (blocked) {

    return (
      <span className="card-status-blocked">
        <span className="dot dot-red" />
        Blocked
      </span>
    )
  }

  return (
    <span className="card-status-unblocked">
      <span className="dot dot-green" />
      Active
    </span>
  )
}

export default function AdminStudents() {

  const [selectedHostel, setSelectedHostel] =
    useState(HOSTELS[0])

  const [students, setStudents] =
    useState([])

  const [stats, setStats] =
    useState({ active: 0, blocked: 0 })

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('All')

  const [selectedStudents, setSelectedStudents] =
    useState([])

  const [sending, setSending] =
    useState(false)

  const fetchStudents = async (hostel) => {

    setLoading(true)

    setError('')

    setStudents([])

    setStats({
      active: 0,
      blocked: 0
    })

    try {

      const res =
        await getStudentsList({ hostel })

      setStudents(
        res.data.students || []
      )

      setStats(
        res.data.stats || {
          active: 0,
          blocked: 0
        }
      )

    } catch (e) {

      setError(
        e.response?.data?.message ||
        'Failed to load students'
      )

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    fetchStudents(selectedHostel)

  }, [selectedHostel])

  const filtered = useMemo(() => {

    let list = students

    if (statusFilter === 'Active') {

      list =
        list.filter(s => !s.blocked)
    }

    if (statusFilter === 'Blocked') {

      list =
        list.filter(s => s.blocked)
    }

    if (search.trim()) {

      const q =
        search.toLowerCase()

      list = list.filter(
        s =>
          s.name?.toLowerCase().includes(q) ||
          s.reg_no?.toLowerCase().includes(q)
      )
    }

    return list

  }, [students, statusFilter, search])

  const toggleStudent = (reg_no) => {

    setSelectedStudents(prev => {

      if (prev.includes(reg_no)) {

        return prev.filter(
          r => r !== reg_no
        )
      }

      return [...prev, reg_no]
    })
  }

  const sendToESP32 = async () => {

    if (selectedStudents.length === 0) {

      alert('Select students first')

      return
    }

    try {

      setSending(true)

      await axios.post(
        'http://localhost:3000/api/device/push-selected-students',
        {
          hostel_block: selectedHostel,
          students: selectedStudents
        }
      )

      alert('Students sent to ESP32')

      setSelectedStudents([])

    } catch (error) {

      console.error(error)

      alert(
        error.response?.data?.message ||
        'Failed to send students'
      )

    } finally {

      setSending(false)
    }
  }

  return (
    <div>

      <div className="page-header anim-in">

        <div className="page-header-left">

          <h1>Student List</h1>

          <p className="subtitle">
            Today's meal attendance and card status per hostel block
          </p>

        </div>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>

          <button
            className="btn btn-primary btn-sm"
            onClick={sendToESP32}
            disabled={sending}
          >
            {sending
              ? 'Sending...'
              : `📡 Send (${selectedStudents.length})`}
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() =>
              fetchStudents(selectedHostel)
            }
          >
            ↻ Refresh
          </button>

        </div>
      </div>

      <div
        className="anim-in anim-delay-1"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          marginBottom: '1.5rem',
          padding: '0.75rem',
          background: 'rgba(13,32,64,0.5)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >

        {HOSTELS.map(h => (

          <button
            key={h}
            onClick={() => {

              setSelectedHostel(h)

              setSearch('')

              setStatusFilter('All')
            }}

            style={{

              padding: '0.45rem 0.875rem',

              borderRadius: 'var(--radius-full)',

              border:
                selectedHostel === h
                  ? '1.5px solid var(--teal-500)'
                  : '1.5px solid var(--border)',

              background:
                selectedHostel === h
                  ? 'linear-gradient(135deg,rgba(0,201,184,0.2),rgba(0,201,184,0.08))'
                  : 'transparent',

              color:
                selectedHostel === h
                  ? 'var(--teal-400)'
                  : 'var(--text-muted)',

              fontFamily: 'var(--font-display)',

              fontSize: '0.8rem',

              fontWeight: 700,

              cursor: 'pointer',

              transition: 'all 0.18s',

              letterSpacing: '0.02em',
            }}
          >
            {h}
          </button>
        ))}
      </div>

      <div
        className="stats-grid anim-in anim-delay-2"
        style={{
          gridTemplateColumns: 'repeat(3,1fr)',
          marginBottom: '1.25rem'
        }}
      >

        <div className="stat-card">

          <div className="stat-card-icon icon-blue">
            👥
          </div>

          <div className="stat-body">

            <div className="stat-label">
              Total in {selectedHostel}
            </div>

            <div className="stat-value">
              {students.length}
            </div>

          </div>
        </div>

        <div className="stat-card">

          <div className="stat-card-icon icon-emerald">
            ✅
          </div>

          <div className="stat-body">

            <div className="stat-label">
              Active Cards
            </div>

            <div className="stat-value">
              {stats.active}
            </div>

          </div>
        </div>

        <div className="stat-card">

          <div className="stat-card-icon icon-rose">
            🚫
          </div>

          <div className="stat-body">

            <div className="stat-label">
              Blocked Cards
            </div>

            <div className="stat-value">
              {stats.blocked}
            </div>

          </div>
        </div>
      </div>

      {error &&
        <div className="alert alert-error">
          {error}
        </div>
      }

      <div className="filter-bar anim-in anim-delay-2">

        <div className="search-wrapper">

          <span className="search-icon">
            🔍
          </span>

          <input
            className="search-input-mini"
            placeholder="Search name or reg no…"
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
          />

        </div>

        {['All', 'Active', 'Blocked'].map(s => (

          <button
            key={s}
            className={`tab-btn ${statusFilter === s ? 'active' : ''}`}

            style={{
              padding: '0.4rem 0.875rem',
              fontSize: '0.8rem'
            }}

            onClick={() =>
              setStatusFilter(s)
            }
          >

            {s === 'All'
              ? '👥 All'
              : s === 'Active'
                ? '✅ Active'
                : '🚫 Blocked'}

          </button>
        ))}
      </div>

      {loading ? (

        <div className="loader-page">

          <div className="spinner" />

          <p className="loader-text">
            Loading students…
          </p>

        </div>

      ) : filtered.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">
            👥
          </div>

          <div className="empty-title">
            No students found
          </div>

          <div className="empty-desc">

            {students.length === 0

              ? `No students registered in ${selectedHostel} yet`

              : 'Try adjusting your search or filter'}

          </div>
        </div>

      ) : (

        <div className="table-wrapper anim-in anim-delay-3">

          <table>

            <thead>

              <tr>

                <th>✓</th>

                <th>#</th>

                <th>Student Name</th>

                <th>Reg No</th>

                <th>Hostel</th>

                <th>Card Status</th>

                {MEAL_TYPES.map(m => (

                  <th
                    key={m}
                    style={{
                      textAlign: 'center'
                    }}
                  >
                    {MEAL_ICONS[m]}
                    {' '}
                    {m[0].toUpperCase() + m.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              {filtered.map((s, i) => (

                <tr key={s.id}>

                  <td
                    style={{
                      textAlign: 'center'
                    }}
                  >

                    <input
                      type="checkbox"

                      checked={
                        selectedStudents.includes(
                          s.reg_no
                        )
                      }

                      onChange={() =>
                        toggleStudent(s.reg_no)
                      }

                      style={{
                        width: 16,
                        height: 16,
                        cursor: 'pointer'
                      }}
                    />

                  </td>

                  <td
                    style={{
                      color: 'var(--text-dim)',
                      fontSize: '0.78rem'
                    }}
                  >
                    {i + 1}
                  </td>

                  <td className="td-name">

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}>

                      <div style={{

                        width: 28,

                        height: 28,

                        borderRadius: '50%',

                        flexShrink: 0,

                        background:
                          s.blocked
                            ? 'linear-gradient(135deg,var(--rose-500),#c0392b)'
                            : 'linear-gradient(135deg,var(--teal-500),var(--blue-500))',

                        display: 'flex',

                        alignItems: 'center',

                        justifyContent: 'center',

                        fontSize: '0.7rem',

                        fontWeight: 700,

                        color: 'white',
                      }}>

                        {s.name?.charAt(0).toUpperCase()}

                      </div>

                      {s.name}

                    </div>
                  </td>

                  <td className="td-mono">
                    {s.reg_no}
                  </td>

                  <td>

                    <span className="badge badge-blue">
                      {s.hostel_block}
                    </span>

                  </td>

                  <td>
                    <CardStatus blocked={s.blocked} />
                  </td>

                  {MEAL_TYPES.map(m => (

                    <td
                      key={m}
                      style={{
                        textAlign: 'center'
                      }}
                    >

                      <MealDot
                        mealType={m}
                        taken={s.meals?.[m] === true}
                      />

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