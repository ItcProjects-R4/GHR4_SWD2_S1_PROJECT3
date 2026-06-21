import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function EditEvent() {
  const { id } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    title: '', category: '', mode: 'Online', venue: '',
    seatLimit: '', price: '', startTime: '', endTime: '', status: 'Active'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // If event data was passed via navigation state use it directly
    // otherwise fetch from backend
    if (location.state?.event) {
      const e = location.state.event
      setForm({
        title: e.title || '',
        category: e.category || '',
        mode: e.mode || 'Online',
        venue: e.venue || '',
        seatLimit: e.seatLimit || '',
        price: e.price ?? '',
        startTime: e.startTime ? new Date(e.startTime).toISOString().slice(0, 16) : '',
        endTime: e.endTime ? new Date(e.endTime).toISOString().slice(0, 16) : '',
        status: e.status || 'Active'
      })
      setLoading(false)
    } else {
      // Fetch event data if no state passed
      const fetchEvent = async () => {
        try {
          const res = await api.get(`/events/${id}/get-event-data`)
          const e = res.data.data
          setForm({
            title: e.title || '',
            category: e.category || '',
            mode: e.mode || 'Online',
            venue: e.venue || '',
            seatLimit: e.seatLimit || '',
            price: e.price ?? '',
            startTime: e.startTime ? new Date(e.startTime).toISOString().slice(0, 16) : '',
            endTime: e.endTime ? new Date(e.endTime).toISOString().slice(0, 16) : '',
            status: e.status || 'Active'
          })
        } catch (err) {
          setError('Failed to load event data')
        } finally {
          setLoading(false)
        }
      }
      fetchEvent()
    }
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.patch(`/events/${id}/edit-event`, form)
      setSuccess('Event updated successfully!')
      setTimeout(() => navigate('/organizer/events'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try { await api.post('/users/log-out') } catch {}
    logout()
    navigate('/login')
  }

  if (loading) return (
    <div style={s.page}>
      <div style={s.center}><p style={{ color: '#666' }}>Loading event...</p></div>
    </div>
  )

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.brand}>
            <div style={s.brandIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
              </svg>
            </div>
            <span style={s.brandName}>EventBooking</span>
          </div>
          <button onClick={() => navigate('/organizer/events')} style={s.navLink}>My events</button>
          <button style={{ ...s.navLink, color: '#fff' }}>Edit event</button>
        </div>
        <div style={s.navRight}>
          <span style={s.navUser}>🎤 {user?.username || user?.email}</span>
          <button onClick={handleLogout} style={s.logoutBtn}>Sign out</button>
        </div>
      </nav>

      <div style={s.body}>
        <div style={s.header}>
          <h1 style={s.heading}>Edit event</h1>
          <p style={s.sub}>Changes will re-approval </p>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.card}>
            <h2 style={s.sectionTitle}>Basic info</h2>

            <div style={s.field}>
              <label style={s.label}>Event title</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Tech Summit 2026" style={s.input} required />
            </div>

            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Category</label>
                <input name="category" value={form.category} onChange={handleChange}
                  placeholder="e.g. Technology, Music" style={s.input} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Mode</label>
                <select name="mode" value={form.mode} onChange={handleChange} style={s.select}>
                  <option value="Online">Online</option>
                  <option value="Campus">Campus</option>
                  <option value="External">External</option>
                </select>
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Venue</label>
              <input name="venue" value={form.venue} onChange={handleChange}
                placeholder="e.g. City Convention Centre" style={s.input} required />
            </div>
          </div>

          <div style={s.card}>
            <h2 style={s.sectionTitle}>Tickets & pricing</h2>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Seat limit</label>
                <input name="seatLimit" type="number" min="1" value={form.seatLimit}
                  onChange={handleChange} placeholder="e.g. 200" style={s.input} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Price per ticket ($)</label>
                <input name="price" type="number" min="0" value={form.price}
                  onChange={handleChange} placeholder="0 for free" style={s.input} required />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <h2 style={s.sectionTitle}>Date & time</h2>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Start time</label>
                <input name="startTime" type="datetime-local" value={form.startTime}
                  onChange={handleChange} style={s.input} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>End time</label>
                <input name="endTime" type="datetime-local" value={form.endTime}
                  onChange={handleChange} style={s.input} required />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <h2 style={s.sectionTitle}>Status</h2>
            <div style={s.field}>
              <label style={s.label}>Event status</label>
              <select name="status" value={form.status} onChange={handleChange} style={s.select}>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
          </div>

          {error && <p style={s.error}>{error}</p>}
          {success && <p style={s.successMsg}>{success}</p>}

          <div style={s.actions}>
            <button type="button" onClick={() => navigate('/organizer/events')} style={s.cancelBtn}>
              Cancel
            </button>
            <button type="submit"
              style={{ ...s.submitBtn, opacity: saving ? 0.7 : 1 }}
              disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid #1e1e1e', background: '#0d0d0d', position: 'sticky', top: 0, zIndex: 10 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '24px' },
  brand: { display: 'flex', alignItems: 'center', gap: '8px' },
  brandIcon: { width: '28px', height: '28px', background: '#6d28d9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: { color: '#fff', fontSize: '14px', fontWeight: '500' },
  navLink: { background: 'none', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  navUser: { color: '#666', fontSize: '13px' },
  logoutBtn: { background: 'none', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '6px 14px', color: '#888', fontSize: '13px', cursor: 'pointer' },
  body: { maxWidth: '700px', margin: '0 auto', padding: '40px 24px' },
  header: { marginBottom: '32px' },
  heading: { color: '#fff', fontSize: '24px', fontWeight: '500', letterSpacing: '-0.5px', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  sectionTitle: { color: '#fff', fontSize: '14px', fontWeight: '500', marginBottom: '4px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { color: '#888', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' },
  input: { background: '#0a0a0a', border: '1px solid #222', borderRadius: '10px', padding: '11px 14px', color: '#fff', fontSize: '14px', outline: 'none' },
  select: { background: '#0a0a0a', border: '1px solid #222', borderRadius: '10px', padding: '11px 14px', color: '#fff', fontSize: '14px', outline: 'none' },
  error: { color: '#f87171', fontSize: '13px' },
  successMsg: { color: '#4ade80', fontSize: '13px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { background: 'none', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '11px 24px', color: '#888', fontSize: '14px', cursor: 'pointer' },
  submitBtn: { background: '#6d28d9', border: 'none', borderRadius: '10px', padding: '11px 28px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' },
}