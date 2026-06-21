import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'Admin') navigate('/admin/pending')
      else if (user.role === 'Organizer') navigate('/organizer/events')
      else navigate('/events')
    } else {
      navigate('/register')
    }
  }

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
        <div style={s.navBtns}>
          {user ? (
  <>
    <button
      onClick={() => navigate('/my-bookings')}
      style={s.btnGhost}
    >
      My Bookings
    </button>

    <button
      onClick={handleGetStarted}
      style={s.btnPrimary}
    >
      Go to Dashboard
    </button>
  </>
) : (
            <>
              <button onClick={() => navigate('/login')} style={s.btnGhost}>Sign in</button>
              <button onClick={() => navigate('/register')} style={s.btnPrimary}>Get started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroBadge}> Built for real events</div>
        <h1 style={s.heroTitle}>
          The simplest way to<br />
          <span style={{ color: '#7c3aed' }}>run your event</span>
        </h1>
        <p style={s.heroSub}>
          From booking tickets to scanning attendees at the door — EventFlow handles
          the whole thing so you can focus on making your event actually good.
        </p>
        <div style={s.heroBtns}>
          <button onClick={() => navigate('/events')} style={s.btnLgPrimary}>
            Browse events
          </button>
          <button onClick={() => navigate('/register')} style={s.btnLgGhost}>
            Host an event →
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Everything in one place</p>
        <p style={s.sectionSub}>No spreadsheets. No manual tracking. Just a system that works.</p>
        <div style={s.grid}>
          {[
            { icon: '🎟', bg: '#1a0f2e', title: 'Book in seconds', desc: 'Find an event, pick your seats, pay securely via PhonePe. Your ticket arrives instantly.' },
            { icon: '📄', bg: '#0f2e1a', title: 'Digital tickets ', desc: 'Every attendee gets a PDF ticket with a unique QR code.'},
            { icon: '📷', bg: '#0f1a2e', title: 'QR scan at the door', desc: 'Organizers scan attendee QR codes right from their phone browser. No app needed.' },
            // { icon: '💳', bg: '#2e2a0f', title: 'Secure payments', desc: 'PhonePe integration with webhook verification. Payments confirmed automatically, no manual checking.' },
            // { icon: '🛡', bg: '#2e0f1a', title: 'Admin approval flow', desc: 'Every event goes through admin review before going live. Quality stays consistent across the platform.' },
            // { icon: '📬', bg: '#1a1a2e', title: 'Email notifications', desc: 'Booking confirmations, certificates, approval updates — everything lands in your inbox automatically.' },
          ].map((f, i) => (
            <div key={i} style={s.featureCard}>
              <div style={{ ...s.featureIcon, background: f.bg }}>{f.icon}</div>
              <p style={s.featureTitle}>{f.title}</p>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Built for everyone involved</p>
        <p style={s.sectionSub}>Three roles, one platform.</p>
        <div style={s.rolesGrid}>
          {[
            { emoji: '🎟', title: 'Attendees', desc: 'Browse events, book tickets, download your ticket — all from one place.' },
            { emoji: '🎤', title: 'Organizers', desc: 'Create and manage events, scan tickets at the door' },
            // { emoji: '🛡', title: 'Admins', desc: 'Review and approve events before they go live. Keep the platform trustworthy for everyone on it.' },
          ].map((r, i) => (
            <div key={i} style={s.roleCard}>
              <div style={s.roleEmoji}>{r.emoji}</div>
              <p style={s.roleTitle}>{r.title}</p>
              <p style={s.roleDesc}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={s.cta}>
        <h2 style={s.ctaTitle}>Ready to get started?</h2>
        <p style={s.ctaSub}>Join as an attendee, organizer.</p>
        <button onClick={handleGetStarted} style={s.btnLgPrimary}>
          {user ? 'Go to dashboard' : 'Create your account'}
        </button>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <span style={s.footerText}>© 2026 Event Booking System </span>
        <span style={s.footerText}>Built with Team 3 DIPE React track· </span>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #1e1e1e' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandIcon: { width: '32px', height: '32px', background: '#6d28d9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: '15px', fontWeight: '500', color: '#fff' },
  navBtns: { display: 'flex', gap: '10px' },
  btnGhost: { background: 'none', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 18px', color: '#888', fontSize: '13px', cursor: 'pointer' },
  btnPrimary: { background: '#6d28d9', border: 'none', borderRadius: '8px', padding: '8px 18px', color: '#fff', fontSize: '13px', cursor: 'pointer' },
  hero: { maxWidth: '900px', margin: '0 auto', padding: '80px 40px 60px', textAlign: 'center' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1a0f2e', border: '1px solid #4c1d95', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#9d71f7', marginBottom: '28px' },
  heroTitle: { fontSize: '48px', fontWeight: '500', letterSpacing: '-1px', lineHeight: '1.15', marginBottom: '20px', color: '#fff' },
  heroSub: { color: '#666', fontSize: '16px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 40px' },
  heroBtns: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  btnLgPrimary: { background: '#6d28d9', border: 'none', borderRadius: '10px', padding: '13px 28px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  btnLgGhost: { background: 'none', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '13px 28px', color: '#888', fontSize: '14px', cursor: 'pointer' },
  section: { maxWidth: '900px', margin: '0 auto', padding: '20px 40px 60px' },
  sectionTitle: { textAlign: 'center', color: '#fff', fontSize: '22px', fontWeight: '500', marginBottom: '8px' },
  sectionSub: { textAlign: 'center', color: '#555', fontSize: '14px', marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  featureCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '24px' },
  featureIcon: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' },
  featureTitle: { color: '#fff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' },
  featureDesc: { color: '#555', fontSize: '13px', lineHeight: '1.6' },
  rolesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  roleCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '24px', textAlign: 'center' },
  roleEmoji: { fontSize: '32px', marginBottom: '12px' },
  roleTitle: { color: '#fff', fontSize: '15px', fontWeight: '500', marginBottom: '8px' },
  roleDesc: { color: '#555', fontSize: '12px', lineHeight: '1.6' },
  cta: { maxWidth: '600px', margin: '0 auto', padding: '20px 40px 80px', textAlign: 'center' },
  ctaTitle: { color: '#fff', fontSize: '28px', fontWeight: '500', letterSpacing: '-0.5px', marginBottom: '12px' },
  ctaSub: { color: '#666', fontSize: '14px', marginBottom: '28px' },
  footer: { borderTop: '1px solid #1e1e1e', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { color: '#444', fontSize: '12px' },
}