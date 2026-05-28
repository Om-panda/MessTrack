import { useState } from 'react'
import { searchStudent, deleteStudent } from '../../api/index.js'

export default function DeleteStudent() {
  const [regNo, setRegNo] = useState('')
  const [student, setStudent] = useState(null)
  const [searching, setSearching] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchErr, setSearchErr] = useState('')
  const [deleteSuccess, setDeleteSuccess] = useState('')
  const [deleteErr, setDeleteErr] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSearch = async e => {
    e.preventDefault()
    setSearching(true); setSearchErr(''); setStudent(null)
    setDeleteSuccess(''); setDeleteErr(''); setShowConfirm(false)
    try {
      const res = await searchStudent({ reg_no: regNo.trim() })
      setStudent(res.data.student)
    } catch (err) {
      setSearchErr(err.response?.data?.message || 'Student not found')
    } finally {
      setSearching(false)
    }
  }

  const handleDelete = async () => {
    if (!student) return
    setDeleting(true); setDeleteErr('')
    try {
      // Backend now uses reg_no for deletion
      await deleteStudent({ reg_no: student.reg_no })
      setDeleteSuccess(`Student "${student.name}" (${student.reg_no}) deleted successfully.`)
      setStudent(null); setRegNo(''); setShowConfirm(false)
    } catch (err) {
      setDeleteErr(err.response?.data?.message || 'Failed to delete student')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>Delete Student</h1>
          <p className="subtitle">Search by registration number, then confirm permanent deletion</p>
        </div>
      </div>

      <div style={{ maxWidth: 600 }} className="anim-in anim-delay-1">
        {deleteSuccess && <div className="alert alert-success">✅ {deleteSuccess}</div>}

        {/* Search */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>🔍 Find Student</h3>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="input-with-icon" style={{ flex: 1 }}>
              <span className="input-icon">🪪</span>
              <input
                className="form-input"
                placeholder="Enter registration number…"
                value={regNo}
                onChange={e => { setRegNo(e.target.value); setStudent(null); setSearchErr('') }}
                required
              />
            </div>
            <button type="submit" className="btn btn-ghost" disabled={searching}>
              {searching ? <span className="spinner spinner-sm" /> : '🔍 Search'}
            </button>
          </form>
          {searchErr && <div className="alert alert-error" style={{ marginTop: '0.875rem', marginBottom: 0 }}>⚠️ {searchErr}</div>}
        </div>

        {/* Student Preview */}
        {student && (
          <div className="card" style={{ border: '1px solid rgba(244,63,94,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,var(--rose-500),#c0392b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'white',
                }}>
                  {student.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{student.name}</div>
                  <div style={{ color: 'var(--teal-400)', fontWeight: 600, fontSize: '0.875rem' }}>{student.reg_no}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                    Hostel {student.hostel_block} · ID: {student.id}
                  </div>
                </div>
              </div>
              <span className="badge badge-rose">Student</span>
            </div>

            {deleteErr && <div className="alert alert-error" style={{ marginTop: '1rem', marginBottom: 0 }}>⚠️ {deleteErr}</div>}

            {!showConfirm ? (
              <button className="btn btn-danger btn-full" style={{ marginTop: '1.25rem' }}
                onClick={() => setShowConfirm(true)}>
                🗑️ Delete This Student
              </button>
            ) : (
              <div style={{
                marginTop: '1.25rem', padding: '1rem 1.25rem',
                background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--rose-400)', marginBottom: '0.3rem' }}>⚠️ Confirm Deletion</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  This permanently deletes <strong style={{ color: 'var(--text-primary)' }}>{student.name}</strong> and all their
                  attendance and block records. This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? <><span className="spinner spinner-sm" /> Deleting…</> : '🗑️ Yes, Delete'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
