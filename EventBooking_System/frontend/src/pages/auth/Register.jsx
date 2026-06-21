import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', password: '', phone: '', role: 'User'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/users/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.brand}>
          <div style={s.brandIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
            </svg>
          </div>
          <span style={s.brandName}>EventBooking</span>
        </div>

        <h1 style={s.heading}>Create an account</h1>
        <p style={s.sub}>Join thousands discovering events near you</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Username</label>
              <input name="username" value={form.username} onChange={handleChange}
                placeholder="yourname" style={s.input} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="9876543210" style={s.input} required />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" style={s.input} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="Min. 8 characters" style={s.input} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>I am joining as</label>
            <div style={s.roleRow}>
              {['User', 'Organizer'].map(r => (
                <button key={r} type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{ ...s.roleBtn, ...(form.role === r ? s.roleBtnActive : {}) }}>
                  {r === 'User' ? '🎟 Attendee' : '🎤 Organizer'}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '2rem', fontFamily: 'system-ui, sans-serif' },
  card: { width: '100%', maxWidth: '480px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '40px' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' },
  brandIcon: { width: '32px', height: '32px', background: '#6d28d9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: { color: '#fff', fontSize: '15px', fontWeight: '500' },
  heading: { color: '#fff', fontSize: '24px', fontWeight: '500', letterSpacing: '-0.5px', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '14px', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { color: '#888', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' },
  input: { background: '#0a0a0a', border: '1px solid #222', borderRadius: '10px', padding: '11px 14px', color: '#fff', fontSize: '14px', outline: 'none' },
  roleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  roleBtn: { background: '#0a0a0a', border: '1px solid #222', borderRadius: '10px', padding: '11px', color: '#666', fontSize: '13px', cursor: 'pointer' },
  roleBtnActive: { background: '#1a0f2e', border: '1px solid #6d28d9', color: '#9d71f7' },
  error: { color: '#f87171', fontSize: '13px' },
  btn: { background: '#6d28d9', border: 'none', borderRadius: '10px', padding: '13px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '4px' },
  footer: { color: '#555', fontSize: '13px', textAlign: 'center', marginTop: '1.5rem' },
  link: { color: '#7c3aed', textDecoration: 'none' },
}