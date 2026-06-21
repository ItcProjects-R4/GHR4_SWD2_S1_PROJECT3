import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function BrowseEvents() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [filters, setFilters] = useState({
    title: '', category: '', venue: '',
    mode: '', minPrice: '', maxPrice: '', page: 1
  })

  const fetchEvents = async (f = filters) => {
    setLoading(true)
    try {
      const params = Object.fromEntries(
        Object.entries(f).filter(([, v]) => v !== '')
      )
      const res = await api.get('/events/browse-events', { params })
      setEvents(res.data.data)
      setPagination(res.data.pagination)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const updated = { ...filters, page: 1 }
    setFilters(updated)
    fetchEvents(updated)
  }

  const handlePage = (p) => {
    const updated = { ...filters, page: p }
    setFilters(updated)
    fetchEvents(updated)
  }

  const handleLogout = async () => {
    try { await api.post('/users/log-out') } catch {}
    logout()
    navigate('/login')
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const modeColor = { Online: '#0f2e1a', Campus: '#0f1a2e', External: '#2e0f1a' }
  const modeText = { Online: '#4ade80', Campus: '#60a5fa', External: '#f472b6' }

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.brand}>
          <div style={s.brandIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
            </svg>
          </div>
          <span style={s.brandName}>EventBooking</span>
        </div>
      <div style={s.navRight}>
  <span style={s.navUser}>👤 {user?.username || user?.email}</span>

  <button
    onClick={() => navigate('/my-bookings')}
    style={s.logoutBtn}
  >
    My Bookings
  </button>

  <button
    onClick={handleLogout}
    style={s.logoutBtn}
  >
    Sign out
  </button>
</div>
      </nav>

      <div style={s.body}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={s.heading}>Discover events</h1>
          <p style={s.sub}>Find and book events happening around you</p>
        </div>

        {/* Search + Filters */}
        <form onSubmit={handleSearch} style={s.filterBar}>
          <input name="title" value={filters.title} onChange={handleFilter}
            placeholder="Search events..." style={{ ...s.input, flex: 2 }} />
          <input name="category" value={filters.category} onChange={handleFilter}
            placeholder="Category" style={s.input} />
          <input name="venue" value={filters.venue} onChange={handleFilter}
            placeholder="Venue" style={s.input} />
          <select name="mode" value={filters.mode} onChange={handleFilter} style={s.select}>
            <option value="">All modes</option>
            <option value="Online">Online</option>
            <option value="Campus">Campus</option>
            <option value="External">External</option>
          </select>
          <input name="minPrice" value={filters.minPrice} onChange={handleFilter}
            placeholder="Min $" style={{ ...s.input, width: '80px' }} type="number" />
          <input name="maxPrice" value={filters.maxPrice} onChange={handleFilter}
            placeholder="Max $" style={{ ...s.input, width: '80px' }} type="number" />
          <button type="submit" style={s.searchBtn}>Search</button>
        </form>

        {/* States */}
        {error && <p style={s.error}>{error}</p>}
        {loading && (
          <div style={s.center}>
            <p style={{ color: '#666' }}>Loading events...</p>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div style={s.center}>
            <p style={{ color: '#666', fontSize: '15px' }}>No events found</p>
            <p style={{ color: '#444', fontSize: '13px', marginTop: '6px' }}>Try adjusting your filters</p>
          </div>
        )}

        {/* Event Grid */}
        {!loading && events.length > 0 && (
          <div style={s.grid}>
            {events.map(event => (
              <div key={event._id} style={s.card}
                onClick={() => navigate(`/events/${event._id}`)}
              >
                <div style={s.cardTop}>
                  <span style={{
                    ...s.modeBadge,
                    background: modeColor[event.mode] || '#1a1a1a',
                    color: modeText[event.mode] || '#aaa'
                  }}>
                    {event.mode}
                  </span>
                  <span style={s.price}>
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </span>
                </div>

                <h3 style={s.cardTitle}>{event.title}</h3>
                <p style={s.cardCategory}>{event.category}</p>

                <div style={s.cardMeta}>
                  <div style={s.metaRow}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{event.venue}</span>
                  </div>
                  <div style={s.metaRow}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>{formatDate(event.startTime)}</span>
                  </div>
                  <div style={s.metaRow}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                    <span>{event.seatLimit} seats left</span>
                  </div>
                </div>

                <button style={s.bookBtn}>View & Book</button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={s.pagination}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => handlePage(p)}
                style={{ ...s.pageBtn, ...(p === pagination.currentPage ? s.pageBtnActive : {}) }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid #1e1e1e', background: '#0d0d0d', position: 'sticky', top: 0, zIndex: 10 },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandIcon: { width: '30px', height: '30px', background: '#6d28d9', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: { color: '#fff', fontSize: '15px', fontWeight: '500' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  navUser: { color: '#666', fontSize: '13px' },
  logoutBtn: { background: 'none', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '6px 14px', color: '#888', fontSize: '13px', cursor: 'pointer' },
  body: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
  header: { marginBottom: '32px' },
  heading: { color: '#fff', fontSize: '26px', fontWeight: '500', letterSpacing: '-0.5px', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '14px' },
  filterBar: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px', alignItems: 'center' },
  input: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '9px 13px', color: '#fff', fontSize: '13px', outline: 'none', flex: 1, minWidth: '120px' },
  select: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '9px 13px', color: '#fff', fontSize: '13px', outline: 'none' },
  searchBtn: { background: '#6d28d9', border: 'none', borderRadius: '8px', padding: '9px 20px', color: '#fff', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' },
  error: { color: '#f87171', fontSize: '13px', marginBottom: '16px' },
  center: { textAlign: 'center', padding: '80px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  modeBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' },
  price: { color: '#9d71f7', fontSize: '14px', fontWeight: '500' },
  cardTitle: { color: '#fff', fontSize: '15px', fontWeight: '500', marginBottom: '4px', lineHeight: '1.4' },
  cardCategory: { color: '#555', fontSize: '12px', marginBottom: '16px' },
  cardMeta: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' },
  metaRow: { display: 'flex', alignItems: 'center', gap: '7px', color: '#666', fontSize: '12px' },
  bookBtn: { width: '100%', background: '#1a0f2e', border: '1px solid #4c1d95', borderRadius: '8px', padding: '10px', color: '#9d71f7', fontSize: '13px', cursor: 'pointer' },
  pagination: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '40px' },
  pageBtn: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '8px 14px', color: '#666', fontSize: '13px', cursor: 'pointer' },
  pageBtnActive: { background: '#6d28d9', border: '1px solid #6d28d9', color: '#fff' },
}