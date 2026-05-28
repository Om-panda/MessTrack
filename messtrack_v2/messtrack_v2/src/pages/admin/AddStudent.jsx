import { useState } from 'react'
import { addStudent } from '../../api/index.js'

const HOSTELS = ['BH-1','BH-2','BH-3','BH-4','BH-5','BH-6','BH-7','BH-8','BH-9','BH-10','BH-11','BH-12']
const EMPTY = { name: '', reg_no: '', password: '', hostel_block: '', rfid_uid: '' }

export default function AddStudent() {
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
      await addStudent(form)
      setSuccess(`Student "${form.name}" (${form.reg_no}) added to ${form.hostel_block} successfully!`)
      setForm(EMPTY)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>Add New Student</h1>
          <p className="subtitle">Register a student with hostel block and RFID card details</p>
        </div>
      </div>

      <div style={{ maxWidth: 660 }} className="anim-in anim-delay-1">
        {success && <div className="alert alert-success">✅ {success}</div>}
        {error   && <div className="alert alert-error">⚠️ {error}</div>}

        <div className="card card-glow">
          <div style={{ marginBottom: '1.75rem' }}>
            <h3>Student Information</h3>
            <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>All fields are required</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input className="form-input" name="name" placeholder="e.g. Rohit Sharma"
                    value={form.name} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <div className="input-with-icon">
                  <span className="input-icon">🪪</span>
                  <input className="form-input" name="reg_no" placeholder="e.g. 2021BCS001"
                    value={form.reg_no} onChange={handleChange} required />
                </div>
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

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Hostel Block</label>
                <select className="form-select" name="hostel_block"
                  value={form.hostel_block} onChange={handleChange} required>
                  <option value="">— Select Hostel —</option>
                  {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">RFID UID</label>
                <div className="input-with-icon">
                  <span className="input-icon">📡</span>
                  <input className="form-input" name="rfid_uid" placeholder="e.g. A3F92BC1"
                    value={form.rfid_uid} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            {(form.name || form.hostel_block) && (
              <div style={{
                padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)',
                background: 'rgba(0,201,184,0.06)', border: '1px solid rgba(0,201,184,0.2)',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  Preview
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {form.name && <div><span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Name: </span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{form.name}</span></div>}
                  {form.reg_no && <div><span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Reg: </span>
                    <span style={{ color: 'var(--teal-400)', fontWeight: 600 }}>{form.reg_no}</span></div>}
                  {form.hostel_block && <div><span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Hostel: </span>
                    <span style={{ color: 'var(--amber-400)', fontWeight: 600 }}>{form.hostel_block}</span></div>}
                  {form.rfid_uid && <div><span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>RFID: </span>
                    <span style={{ color: 'var(--blue-400)', fontWeight: 600 }}>{form.rfid_uid}</span></div>}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading
                ? <><span className="spinner spinner-sm" style={{ borderTopColor: '#000' }} /> Adding Student…</>
                : '➕ Add Student'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
