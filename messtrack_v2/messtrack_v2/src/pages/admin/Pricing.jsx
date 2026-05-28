import { useState, useEffect } from 'react'
import { setPrice, getAllPrices } from '../../api/index.js'

const MEAL_TYPES = ['breakfast','lunch','snacks','dinner']
const MEAL_ICONS = { breakfast:'🌅', lunch:'☀️', snacks:'🍪', dinner:'🌙' }
const MEAL_COLORS = {
  breakfast: { bg:'rgba(245,158,11,0.12)', color:'var(--amber-400)', border:'rgba(245,158,11,0.25)' },
  lunch:     { bg:'rgba(0,201,184,0.12)',  color:'var(--teal-400)',  border:'rgba(0,201,184,0.25)'  },
  snacks:    { bg:'rgba(59,130,246,0.12)', color:'var(--blue-400)', border:'rgba(59,130,246,0.25)' },
  dinner:    { bg:'rgba(244,63,94,0.12)',  color:'var(--rose-400)', border:'rgba(244,63,94,0.25)'  },
}

const today = new Date().toISOString().split('T')[0]

export default function SetPricing() {
  const [form, setForm] = useState({ meal_type: '', price: '', effective_from: '' })
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const fetchPrices = async () => {
    setLoadingPrices(true)
    try {
      const res = await getAllPrices()
      setPrices(res.data || [])
    } catch { /* silent */ }
    finally { setLoadingPrices(false) }
  }

  useEffect(() => { fetchPrices() }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setSuccess(''); setError('')
    try {
      await setPrice({ meal_type: form.meal_type, price: +form.price, effective_from: form.effective_from })
      setSuccess(`₹${form.price} set for ${form.meal_type} from ${form.effective_from}`)
      setForm({ meal_type: '', price: '', effective_from: '' })
      fetchPrices()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set price')
    } finally {
      setLoading(false)
    }
  }

  // Latest price per meal type
  const latestPriceMap = {}
  prices.forEach(p => {
    if (!latestPriceMap[p.meal_type] || p.effective_from > latestPriceMap[p.meal_type].effective_from) {
      latestPriceMap[p.meal_type] = p
    }
  })

  return (
    <div>
      <div className="page-header anim-in">
        <div className="page-header-left">
          <h1>Set Meal Pricing</h1>
          <p className="subtitle">Schedule meal prices with effective dates for each meal type</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 900 }} className="anim-in anim-delay-1">
        
        {/* Form */}
        <div>
          {success && <div className="alert alert-success">✅ {success}</div>}
          {error   && <div className="alert alert-error">⚠️ {error}</div>}

          <div className="card card-glow">
            <div style={{ marginBottom: '1.75rem' }}>
              <h3>💰 Set New Price</h3>
              <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                Price takes effect from the specified date onwards
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Meal Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {MEAL_TYPES.map(mt => {
                    const c = MEAL_COLORS[mt]
                    return (
                      <button key={mt} type="button"
                        onClick={() => setForm(f => ({ ...f, meal_type: mt }))}
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: form.meal_type === mt ? `1.5px solid ${c.color}` : '1.5px solid var(--border)',
                          background: form.meal_type === mt ? c.bg : 'transparent',
                          color: form.meal_type === mt ? c.color : 'var(--text-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontFamily: 'var(--font-body)',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}>
                        <span style={{ fontSize: '1.1rem' }}>{MEAL_ICONS[mt]}</span>
                        {mt.charAt(0).toUpperCase() + mt.slice(1)}
                        {form.meal_type === mt && ' ✓'}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <div className="input-with-icon">
                    <span className="input-icon" style={{ fontFamily: 'sans-serif', fontWeight: 700 }}>₹</span>
                    <input className="form-input" type="number" name="price"
                      placeholder="e.g. 50" min="1" step="0.5"
                      value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Effective From</label>
                  <input className="form-input" type="date" min={today}
                    value={form.effective_from}
                    onChange={e => setForm(f => ({ ...f, effective_from: e.target.value }))} required />
                </div>
              </div>

              <button type="submit" className="btn btn-amber btn-full"
                disabled={loading || !form.meal_type} style={{ marginTop: '0.25rem' }}>
                {loading
                  ? <><span className="spinner spinner-sm" style={{ borderTopColor: '#000' }} /> Setting Price…</>
                  : '💰 Set Price'}
              </button>
            </form>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Current prices */}
          <div className="card">
            <h3 style={{ marginBottom: '1.1rem' }}>📊 Current Prices</h3>
            {loadingPrices ? (
              <div className="loader-page" style={{ minHeight: 100 }}><div className="spinner spinner-sm" /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {MEAL_TYPES.map(mt => {
                  const p = latestPriceMap[mt]
                  const c = MEAL_COLORS[mt]
                  return (
                    <div key={mt} style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)',
                      background: p ? c.bg : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${p ? c.border : 'var(--border)'}`,
                    }}>
                      <span style={{ fontSize: '1.25rem' }}>{MEAL_ICONS[mt]}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, textTransform: 'capitalize', color: p ? c.color : 'var(--text-muted)', fontSize: '0.875rem' }}>
                          {mt}
                        </div>
                        {p && (
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                            From {p.effective_from?.slice(0, 10)}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800,
                        color: p ? 'var(--amber-400)' : 'var(--text-dim)'
                      }}>
                        {p ? `₹${p.price}` : '—'}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Price history */}
          {prices.length > 0 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)',
                background: 'rgba(245,158,11,0.06)'
              }}>
                <h3 style={{ fontSize: '0.9rem' }}>📋 Price History</h3>
              </div>
              <div className="table-wrapper" style={{ border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Meal</th>
                      <th>Price</th>
                      <th>Effective</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...prices]
                      .sort((a, b) => new Date(b.effective_from) - new Date(a.effective_from))
                      .map((p, i) => (
                        <tr key={i}>
                          <td>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              {MEAL_ICONS[p.meal_type]}
                              <span style={{ textTransform: 'capitalize' }}>{p.meal_type}</span>
                            </span>
                          </td>
                          <td className="td-mono">₹{p.price}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {p.effective_from?.slice(0, 10)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
