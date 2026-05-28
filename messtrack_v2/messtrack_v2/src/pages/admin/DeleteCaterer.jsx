import { useState, useEffect } from 'react'
import { getCaterers, deleteCaterer } from '../../api/index.js'

export default function DeleteCaterer() {
  const [caterers, setCaterers] = useState([])
  const [loading, setLoading] = useState(true)
  const [regNo, setRegNo] = useState('')
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const fetchCaterers = async () => {
    setLoading(true)
    try {
      const res = await getCaterers()
      setCaterers(res.data || [])
    } catch {  }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCaterers() }, [])

  const handleSelectFromList = (c) => {
    setSelected(c)
    setRegNo(c.reg_no || '')
    setShowConfirm(false)
    setError('')
    setSuccess('')
  }

  const handleManualSearch = e => {
    e.preventDefault()
const input = regNo.toLowerCase().trim()
const found = caterers.find(c => c.reg_no?.toLowerCase() === input || String(c.id) === input )
    if (found) {
      setSelected(found)
      setShowConfirm(false)
      setError('')
    } else {
      setError('Caterer not found with that ID')
      setSelected(null)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    setDeleting(true); setError('')
    try {
      await deleteCaterer({ reg_no: selected.reg_no })
      setSuccess(`Caterer "${selected.name}" deleted successfully.`)
      setSelected(null); setRegNo(''); setShowConfirm(false)
      fetchCaterers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete caterer')
    } finally {
      setDeleting(false)
    }
  }

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
          <h1>Delete Caterer</h1>
          <p className="subtitle">Select a caterer from the list or search by Employee ID</p>
        </div>
      </div>

      {success && <div className="alert alert-success anim-in">✅ {success}</div>}
      {error   && <div className="alert alert-error anim-in">⚠️ {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 900 }} className="anim-in anim-delay-1">

        {}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg,rgba(244,63,94,0.08),rgba(244,63,94,0.02))',
          }}>
            <h3>Registered Caterers</h3>
            <p className="text-sm text-muted" style={{ marginTop: '0.2rem' }}>Click to select for deletion</p>
          </div>

          {loading ? (
            <div className="loader-page" style={{ minHeight: 180 }}><div className="spinner" /></div>
          ) : caterers.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-icon">👨‍🍳</div>
              <div className="empty-desc">No caterers registered yet</div>
            </div>
          ) : (
            <div style={{ padding: '0.5rem' }}>
              {caterers.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectFromList(c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    width: '100%', padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: selected?.id === c.id
                      ? '1.5px solid rgba(244,63,94,0.45)'
                      : '1.5px solid transparent',
                    background: selected?.id === c.id ? 'rgba(244,63,94,0.08)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                    marginBottom: '0.15rem',
                  }}
                  onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'var(--surface-2)' }}
                  onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: CATERER_COLORS[i % CATERER_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.875rem', fontWeight: 700, color: 'white',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {c.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Reg No: {c.reg_no}</div>
                  </div>
                  {selected?.id === c.id && (
                    <span style={{ color: 'var(--rose-400)', fontSize: '0.72rem', fontWeight: 700 }}>Selected</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Confirm panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Manual search */}
          <div className="card">
            <h3 style={{ marginBottom: '0.875rem' }}>🔍 Or Search by Employee ID</h3>
            <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '0.65rem' }}>
              <div className="input-with-icon" style={{ flex: 1 }}>
                <span className="input-icon">🪪</span>
                <input
                  className="form-input"
                  placeholder="e.g. CAT001"
                  value={regNo}
                  onChange={e => { setRegNo(e.target.value); setSelected(null) }}
                />
              </div>
              <button type="submit" className="btn btn-ghost">Search</button>
            </form>
          </div>

          {/* Selected caterer card */}
          {selected && (
            <div className="card" style={{ border: '1px solid rgba(244,63,94,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,var(--rose-500),#c0392b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'white',
                }}>
                  {selected.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selected.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Caterer · ID #{selected.id}
                    {selected.hostel_block && <span style={{ marginLeft: '0.5rem' }} className="badge badge-blue">{selected.hostel_block}</span>}
                  </div>
                </div>
              </div>

              {!showConfirm ? (
                <button className="btn btn-danger btn-full" onClick={() => setShowConfirm(true)}>
                  🗑️ Delete This Caterer
                </button>
              ) : (
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--rose-400)', marginBottom: '0.3rem' }}>⚠️ Confirm Deletion</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    This will permanently remove <strong style={{ color: 'var(--text-primary)' }}>{selected.name}</strong> from the system.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                      {deleting ? <><span className="spinner spinner-sm" /> Deleting…</> : '🗑️ Confirm Delete'}
                    </button>
                    <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!selected && !loading && caterers.length > 0 && (
            <div className="card" style={{ border: '1px solid var(--border)', textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👈</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Select a Caterer
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Click a caterer from the list on the left to select them for deletion
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
