import { useState } from 'react'
import { addCaterer } from '../../api/index.js'

const HOSTELS = ['BH-1','BH-2','BH-3','BH-4','BH-5','BH-6','BH-7','BH-8','BH-9','BH-10','BH-11','BH-12']
const EMPTY = { name: '', reg_no: '', password: '', hostel_block: '' }

export default function AddCaterer() {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setSuccess(''); setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setSuccess(''); setError('')
    try {
      await addCaterer(form)
      setSuccess(`Caterer "${form.name}" assigned to ${form.hostel_block} successfully!`)
      setForm(EMPTY)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add caterer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>Add New Caterer</h1>
          <p className="subtitle">Register a caterer and assign them to a hostel block</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 900 }} className="anim-in anim-delay-1">
        {/* Form */}
        <div>
          {success && <div className="alert alert-success">✅ {success}</div>}
          {error   && <div className="alert alert-error">⚠️ {error}</div>}

          <div className="card card-glow">
            <div style={{ marginBottom: '1.75rem' }}>
              <h3>👨‍🍳 Caterer Details</h3>
              <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                All fields are required. Each caterer manages one hostel block.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input className="form-input" name="name" placeholder="e.g. Ramesh Kumar"
                    value={form.name} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Employee / Login ID</label>
                <div className="input-with-icon">
                  <span className="input-icon">🪪</span>
                  <input className="form-input" name="reg_no" placeholder="e.g. CAT001"
                    value={form.reg_no} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input className="form-input" type="password" name="password"
                    placeholder="Set a secure password"
                    value={form.password} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Hostel Block</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.4rem' }}>
                  {HOSTELS.map(h => (
                    <button
                      key={h} type="button"
                      onClick={() => setForm(f => ({ ...f, hostel_block: h }))}
                      style={{
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: form.hostel_block === h
                          ? '1.5px solid var(--blue-500)'
                          : '1.5px solid var(--border)',
                        background: form.hostel_block === h
                          ? 'rgba(59,130,246,0.15)'
                          : 'transparent',
                        color: form.hostel_block === h ? 'var(--blue-400)' : 'var(--text-muted)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                {!form.hostel_block && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                    Select the hostel block this caterer will manage
                  </div>
                )}
              </div>

              {/* Preview */}
              {form.name && form.hostel_block && (
                <div style={{
                  padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    Preview
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'linear-gradient(135deg,var(--blue-500),var(--teal-500))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: 800, color: 'white', flexShrink: 0,
                      fontFamily: 'var(--font-display)',
                    }}>
                      {form.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{form.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ID: <span style={{ color: 'var(--teal-400)' }}>{form.reg_no || '—'}</span>
                        {' · '}
                        <span className="badge badge-blue" style={{ marginLeft: 0 }}>{form.hostel_block}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full"
                disabled={loading || !form.hostel_block}>
                {loading
                  ? <><span className="spinner spinner-sm" style={{ borderTopColor: '#000' }} /> Adding Caterer…</>
                  : '➕ Add Caterer'}
              </button>
            </form>
          </div>
        </div>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--blue-400)' }}>ℹ️ About Caterers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { icon: '🏠', title: 'Hostel Assignment', desc: 'Each caterer is assigned to one hostel block and can only see students from that block.' },
                { icon: '📊', title: 'Dashboard Access', desc: 'Caterers can view today\'s meal counts and generate monthly reports for their hostel.' },
                { icon: '👥', title: 'Student Visibility', desc: 'Caterers see the student list for their assigned hostel with live meal status.' },
                { icon: '🔑', title: 'Login', desc: 'Caterers log in using their Employee ID and password set here.' },
              ].map(info => (
                <div key={info.title} style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{info.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '0.15rem' }}>{info.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{info.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '0.75rem' }}>🏠 Hostel Blocks</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.4rem' }}>
              {HOSTELS.map(h => (
                <div key={h} style={{
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(0,201,184,0.06)',
                  border: '1px solid rgba(0,201,184,0.15)',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--teal-400)',
                }}>
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
