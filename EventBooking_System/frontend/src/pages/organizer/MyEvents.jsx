import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function MyEvents() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState({})

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/events/browse-events')
        // Filter only this organizer's events
        const mine = res.data.data.filter(e => e.organizer === user?._id)
        setEvents(mine)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event?')) return
    setDeleting(prev => ({ ...prev, [eventId]: true }))
    try {
      await api.delete(`/events/${eventId}/delete-event`)
      setEvents(events.filter(e => e._id !== eventId))
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(prev => ({ ...prev, [eventId]: false }))
    }
  }

  const handleLogout = async () => {
    try { await api.post('/users/log-out') } catch {}
    logout()
    navigate('/login')
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const modeColor = { Online: { bg: '#0f2e1a', text: '#4ade80' }, Campus: { bg: '#0f1a2e', text: '#60a5fa' }, External: { bg: '#2e0f1a', text: '#f472b6' } }

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
          <button style={{ ...s.navLink, color: '#fff' }}>My events</button>
          <button onClick={() => navigate('/organizer/create-event')} style={s.navLink}>Create event</button>
        </div>
         <button onClick={() => navigate('/scan-ticket')} style={s.navLink}>
          Scan tickets
       </button>
        <div style={s.navRight}>
          <span style={s.navUser}>🎤 {user?.username || user?.email}</span>
          <button onClick={handleLogout} style={s.logoutBtn}>Sign out</button>
        </div>
      </nav>

      <div style={s.body}>
        <div style={s.header}>
          <div>
            <h1 style={s.heading}>My events</h1>
            <p style={s.sub}>Manage your created events</p>
          </div>
          <button onClick={() => navigate('/organizer/create-event')} style={s.createBtn}>
            + Create event
          </button>
        </div>

        {loading && <div style={s.center}><p style={{ color: '#666' }}>Loading events...</p></div>}
        {error && <p style={s.error}>{error}</p>}

        {!loading && events.length === 0 && (
          <div style={s.empty}>
            <p style={s.emptyTitle}>No events yet</p>
            <p style={s.emptySub}>Create your first event and submit it for approval</p>
            <button onClick={() => navigate('/organizer/create-event')} style={s.createBtn}>
              Create event
            </button>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div style={s.list}>
            {events.map(event => {
              const mc = modeColor[event.mode] || { bg: '#1a1a1a', text: '#aaa' }
              return (
                <div key={event._id} style={s.card}>
                  <div style={s.cardLeft}>
                    <div style={s.cardTop}>
                      <span style={{ ...s.badge, background: mc.bg, color: mc.text }}>{event.mode}</span>
                      <span style={{ ...s.badge, background: event.adminApproval ? '#0f2e1a' : '#2e2a0f', color: event.adminApproval ? '#4ade80' : '#facc15' }}>
                        {event.adminApproval ? 'Approved' : 'Pending approval'}
                      </span>
                      <span style={{ ...s.badge, background: '#1a1a1a', color: '#888' }}>{event.status}</span>
                    </div>
                    <h3 style={s.cardTitle}>{event.title}</h3>
                    <p style={s.cardCategory}>{event.category}</p>
                    <div style={s.cardMeta}>
                      <span style={s.metaItem}>📍 {event.venue}</span>
                      <span style={s.metaItem}>📅 {formatDate(event.startTime)}</span>
                      <span style={s.metaItem}>🎟 {event.seatLimit} seats</span>
                      <span style={s.metaItem}>💰 {event.price === 0 ? 'Free' : `$${event.price}`}</span>
                    </div>
                  </div>
                  <div style={s.cardActions}>
                    <button onClick={() => navigate(`/organizer/edit-event/${event._id}`, { state: { event } })} style={s.editBtn}>
                      Edit
                    </button>
                    {/* <button
                      onClick={() => navigate(`/organizer/certificates/${event._id}`)}
                      style={s.certBtn}>
                      Certificates
                    </button> */}
                    <button onClick={() => handleDelete(event._id)}
                      disabled={deleting[event._id]}
                      style={{ ...s.deleteBtn, opacity: deleting[event._id] ? 0.6 : 1 }}>
                      {deleting[event._id] ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
  body: { maxWidth: '900px', margin: '0 auto', padding: '40px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  heading: { color: '#fff', fontSize: '24px', fontWeight: '500', letterSpacing: '-0.5px', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '14px' },
  createBtn: { background: '#6d28d9', border: 'none', borderRadius: '8px', padding: '10px 20px', color: '#fff', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' },
  center: { textAlign: 'center', padding: '80px 0' },
  error: { color: '#f87171', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  emptyTitle: { color: '#fff', fontSize: '18px', fontWeight: '500' },
  emptySub: { color: '#666', fontSize: '14px', marginBottom: '8px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' },
  cardLeft: { flex: 1 },
  cardTop: { display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' },
  badge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' },
  cardTitle: { color: '#fff', fontSize: '15px', fontWeight: '500', marginBottom: '4px' },
  cardCategory: { color: '#555', fontSize: '12px', marginBottom: '12px' },
  cardMeta: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  metaItem: { color: '#666', fontSize: '12px' },
  cardActions: { display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 },
  editBtn: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 20px', color: '#ccc', fontSize: '13px', cursor: 'pointer' },
  deleteBtn: { background: '#2e0f0f', border: '1px solid #4a1a1a', borderRadius: '8px', padding: '8px 20px', color: '#f87171', fontSize: '13px', cursor: 'pointer' },
  certBtn: { background: '#0f1a2e', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '8px 20px', color: '#60a5fa', fontSize: '13px', cursor: 'pointer' },
}