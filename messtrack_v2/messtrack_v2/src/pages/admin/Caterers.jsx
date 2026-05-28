import { useState, useEffect, useMemo } from 'react'
import { getCaterers } from '../../api/index.js'
import { useNavigate } from 'react-router-dom'

export default function AdminCaterers() {

  const [caterers, setCaterers] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const [search, setSearch] = useState('')

  const navigate = useNavigate()

  const fetchCaterers = async () => {

    setLoading(true)

    setError('')

    try {

      const res = await getCaterers()

      setCaterers(res.data || [])

    } catch (e) {

      setError(
        e.response?.data?.message ||
        'Failed to load caterers'
      )

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    fetchCaterers()

  }, [])

  const filtered = useMemo(() => {

    if (!search.trim()) {

      return caterers
    }

    const q = search.toLowerCase()

    return caterers.filter(c =>

      c.name?.toLowerCase().includes(q) ||

      c.reg_no?.toLowerCase().includes(q)
    )

  }, [caterers, search])

  const CATERER_COLORS = [

    'linear-gradient(135deg,var(--teal-500),var(--blue-500))',

    'linear-gradient(135deg,var(--blue-500),#7c3aed)',

    'linear-gradient(135deg,var(--amber-500),var(--rose-500))',

    'linear-gradient(135deg,var(--emerald-500),var(--teal-500))',
  ]

  return (

    <div>

      <div className="page-header anim-in">

        <div className="page-header-left">

          <h1>Caterer List</h1>

          <p className="subtitle">

            All registered caterers and their hostel assignments

          </p>

        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.5rem'
          }}
        >

          <button
            className="btn btn-ghost btn-sm"
            onClick={fetchCaterers}
          >
            ↻ Refresh
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              navigate('/admin/add-caterer')
            }
          >
            ➕ Add Caterer
          </button>

        </div>
      </div>

      <div
        className="stats-grid anim-in anim-delay-1"
        style={{
          gridTemplateColumns:
          'repeat(2,1fr)',

          marginBottom: '1.5rem'
        }}
      >

        <div className="stat-card">

          <div className="stat-card-icon icon-blue">
            👨‍🍳
          </div>

          <div className="stat-body">

            <div className="stat-label">
              Total Caterers
            </div>

            <div className="stat-value">
              {filtered.length}
            </div>

            <div className="stat-sub">
              Registered accounts
            </div>

          </div>
        </div>

        <div className="stat-card">

          <div className="stat-card-icon icon-teal">
            🏠
          </div>

          <div className="stat-body">

            <div className="stat-label">
              Hostels Covered
            </div>

            <div className="stat-value">

              {
                new Set(
                  caterers.map(
                    c => c.hostel_block
                  )
                ).size
              }

            </div>

            <div className="stat-sub">
              Unique hostel blocks
            </div>

          </div>
        </div>
      </div>

      {error && (

        <div className="alert alert-error">

          {error}

        </div>
      )}

      <div className="filter-bar anim-in anim-delay-2">

        <div className="search-wrapper">

          <span className="search-icon">

            🔍

          </span>

          <input

            className="search-input-mini"

            placeholder="Search caterer name or Reg No…"

            value={search}

            onChange={e =>
              setSearch(e.target.value)
            }
          />
        </div>

        <button

          className="btn btn-danger btn-sm"

          onClick={() =>
            navigate('/admin/delete-caterer')
          }
        >
          🗑️ Delete Caterer
        </button>
      </div>

      {loading ? (

        <div className="loader-page">

          <div className="spinner" />

          <p className="loader-text">

            Loading caterers…

          </p>

        </div>

      ) : filtered.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">

            👨‍🍳

          </div>

          <div className="empty-title">

            No caterers found

          </div>

          <div className="empty-desc">

            {caterers.length === 0

              ? 'No caterer accounts registered yet. Click "Add Caterer" to get started.'

              : 'No caterers match your search.'}

          </div>

          {caterers.length === 0 && (

            <button

              className="btn btn-primary"

              style={{
                marginTop: '1rem'
              }}

              onClick={() =>
                navigate('/admin/add-caterer')
              }
            >
              ➕ Add First Caterer
            </button>
          )}
        </div>

      ) : (

        <div className="table-wrapper anim-in anim-delay-3">

          <table>

            <thead>

              <tr>

                <th>#</th>

                <th>Caterer Name</th>

                <th>Reg No</th>

                <th>Hostel</th>

                <th>Status</th>

              </tr>
            </thead>

            <tbody>

              {filtered.map((c, i) => (

                <tr key={c.id}>

                  <td
                    style={{
                      color: 'var(--text-dim)',
                      fontSize: '0.78rem'
                    }}
                  >
                    {i + 1}
                  </td>

                  <td className="td-name">

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >

                      <div
                        style={{

                          width: 34,

                          height: 34,

                          borderRadius: '50%',

                          flexShrink: 0,

                          background:
                            CATERER_COLORS[
                              i %
                              CATERER_COLORS.length
                            ],

                          display: 'flex',

                          alignItems: 'center',

                          justifyContent: 'center',

                          fontSize: '0.82rem',

                          fontWeight: 700,

                          color: 'white',

                          fontFamily:
                            'var(--font-display)',

                          boxShadow:
                            '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >

                        {c.name
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>

                      <div>

                        <div
                          style={{

                            fontWeight: 600,

                            color:
                              'var(--text-primary)',

                            fontSize: '0.9rem'
                          }}
                        >
                          {c.name}
                        </div>

                        <div
                          style={{

                            fontSize: '0.7rem',

                            color:
                              'var(--text-dim)'
                          }}
                        >
                          Caterer
                        </div>

                      </div>
                    </div>
                  </td>

                  <td className="td-mono">

                    {c.reg_no}

                  </td>

                  <td>

                    <span className="badge badge-blue">

                      {c.hostel_block}

                    </span>

                  </td>

                  <td>

                    <span className="card-status-unblocked">

                      <span className="dot dot-green" />

                      Active

                    </span>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}