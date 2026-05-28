import { useState } from 'react'
import { blockMeal } from '../../api/index.js'
import { useAuth } from '../../context/AuthContext.jsx'

const MEAL_TYPES = ['breakfast','lunch','snacks','dinner']
const MEAL_ICONS = { breakfast:'🌅', lunch:'☀️', snacks:'🍪', dinner:'🌙' }
const MEAL_DESC = {
  breakfast: '7:00 AM – 9:00 AM',
  lunch:     '12:00 PM – 2:00 PM',
  snacks:    '4:00 PM – 5:30 PM',
  dinner:    '7:30 PM – 9:30 PM',
}

const tomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function BlockMeal() {
  const { user } = useAuth()
  const [form, setForm] = useState({ start_date: '', end_date: '', meal_types: [] })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const toggleMeal = mt => {
    setForm(f => ({
      ...f,
      meal_types: f.meal_types.includes(mt)
        ? f.meal_types.filter(m => m !== mt)
        : [...f.meal_types, mt]
    }))
    setSuccess(''); setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.meal_types.length === 0) { setError('Select at least one meal type to block'); return }
    setLoading(true); setSuccess(''); setError('')
    try {
      await blockMeal({
        student_id: user.id,
        start_date: form.start_date,
        end_date: form.end_date,
        meal_types: form.meal_types
      })
      setSuccess(`✅ Blocked ${form.meal_types.join(', ')} from ${form.start_date} to ${form.end_date}`)
      setForm({ start_date: '', end_date: '', meal_types: [] })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to block meals')
    } finally {
      setLoading(false)
    }
  }

  const minDate = tomorrow()
  const daysDiff = form.start_date && form.end_date
    ? Math.round((new Date(form.end_date) - new Date(form.start_date)) / 86400000) + 1
    : 0
  const isValid = daysDiff > 0 && daysDiff <= 30

  return (
    <div>
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>Block Meal</h1>
          <p className="subtitle">Skip upcoming meals in advance — request must be at least 1 day ahead</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 860 }}>
        {/* Form */}
        <div className="anim-in anim-delay-1">
          {success && <div className="alert alert-success">{success}</div>}
          {error   && <div className="alert alert-error">⚠️ {error}</div>}

          <div className="card card-glow">
            <h3 style={{ marginBottom: '0.3rem' }}>🚫 Schedule Block</h3>
            <p className="text-sm text-muted" style={{ marginBottom: '1.75rem' }}>
              Blocked meals won't be counted in your billing
            </p>

            <form onSubmit={handleSubmit}>
              {/* Meal selection */}
              <div className="form-group">
                <label className="form-label">Select Meals to Block</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {MEAL_TYPES.map(mt => {
                    const checked = form.meal_types.includes(mt)
                    return (
                      <button key={mt} type="button" onClick={() => toggleMeal(mt)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.875rem',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: checked ? '1.5px solid rgba(244,63,94,0.5)' : '1.5px solid var(--border)',
                          background: checked ? 'rgba(244,63,94,0.08)' : 'rgba(255,255,255,0.02)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          textAlign: 'left',
                        }}>
                        <span style={{ fontSize: '1.3rem' }}>{MEAL_ICONS[mt]}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, textTransform: 'capitalize',
                            color: checked ? 'var(--rose-400)' : 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {mt}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{MEAL_DESC[mt]}</div>
                        </div>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: checked ? '2px solid var(--rose-400)' : '2px solid var(--border)',
                          background: checked ? 'var(--rose-400)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.6rem', color: 'white', flexShrink: 0,
                          transition: 'all 0.15s',
                        }}>
                          {checked && '✓'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Date range */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">From Date</label>
                  <input className="form-input" type="date" min={minDate}
                    value={form.start_date}
                    onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">To Date</label>
                  <input className="form-input" type="date" min={form.start_date || minDate}
                    value={form.end_date}
                    onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} required />
                </div>
              </div>

              <button type="submit"
                className="btn btn-full"
                style={{
                  background: 'linear-gradient(135deg,var(--rose-500),#c0392b)',
                  color: 'white', fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(244,63,94,0.35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                  fontSize: '0.9rem',
                }}
                disabled={loading || form.meal_types.length === 0}>
                {loading ? <><span className="spinner spinner-sm" /> Blocking…</> : '🚫 Confirm Block'}
              </button>
            </form>
          </div>
        </div>

        {/* Summary + Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="anim-in anim-delay-2">
          {/* Block summary */}
          {form.meal_types.length > 0 && form.start_date && form.end_date && isValid && (
            <div className="card" style={{ border: '1px solid rgba(244,63,94,0.25)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--rose-400)' }}>📋 Block Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Selected meals</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {form.meal_types.map(m => MEAL_ICONS[m]).join(' ')} {form.meal_types.join(', ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>From</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{form.start_date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>To</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{form.end_date}</span>
                </div>
                <div style={{ height: 1, background: 'var(--border)', margin: '0.25rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Duration</span>
                  <span style={{ fontWeight: 700, color: 'var(--rose-400)', fontSize: '0.9rem' }}>
                    {daysDiff} day{daysDiff !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Total slots blocked</span>
                  <span style={{ fontWeight: 700, color: 'var(--rose-400)', fontSize: '0.9rem' }}>
                    {daysDiff * form.meal_types.length} meal slots
                  </span>
                </div>
              </div>
            </div>
          )}

          {daysDiff > 30 && (
            <div className="alert alert-warning">⚠️ Maximum block range is 30 days</div>
          )}

          {/* Info */}
          <div className="card">
            <h3 style={{ marginBottom: '0.875rem' }}>ℹ️ How It Works</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '⏰', text: 'Blocks must be set at least 1 day in advance' },
                { icon: '📅', text: 'Maximum block duration is 30 days' },
                { icon: '💰', text: 'Blocked meals are not charged in monthly billing' },
                { icon: '🔄', text: 'You can block multiple meal types simultaneously' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
