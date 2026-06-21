import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Html5QrcodeScanner } from 'html5-qrcode'
import api from '../../api/axios'

export default function ScanTicket() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [scannerReady, setScannerReady] = useState(false)
  const scannerRef = useRef(null)
  const hasScanned = useRef(false)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    }, false)

    scanner.render(
      async (decodedText) => {
        // Prevent multiple scans
        if (hasScanned.current) return
        hasScanned.current = true

        scanner.clear()
        await verifyQR(decodedText)
      },
      (err) => {
        // Ignore scan errors — these fire constantly while no QR in view
      }
    )

    scannerRef.current = scanner
    setScannerReady(true)

    return () => {
      scanner.clear().catch(() => {})
    }
  }, [])

  const verifyQR = async (qrCode) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await api.post('/tickets/verify-Ticket', { qrCode })
      setResult({ success: true, data: res.data.data })
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed'
      setResult({ success: false, message: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError('')
    hasScanned.current = false

    // Restart scanner
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    }, false)

    scanner.render(
      async (decodedText) => {
        if (hasScanned.current) return
        hasScanned.current = true
        scanner.clear()
        await verifyQR(decodedText)
      },
      () => {}
    )

    scannerRef.current = scanner
  }

  const handleLogout = async () => {
    try { await api.post('/users/log-out') } catch {}
    logout()
    navigate('/login')
  }

  const formatTime = (d) => new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

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
            <span style={s.brandName}>EventBooker</span>
          </div>
          {user?.role === 'Organizer' && (
            <button onClick={() => navigate('/organizer/events')} style={s.navLink}>
              My events
            </button>
          )}
          {user?.role === 'Admin' && (
            <button onClick={() => navigate('/admin/pending')} style={s.navLink}>
              Admin panel
            </button>
          )}
          <button style={{ ...s.navLink, color: '#fff' }}>Scan ticket</button>
        </div>
        <div style={s.navRight}>
          <span style={s.navUser}>
            {user?.role === 'Admin' ? '🛡' : '🎤'} {user?.username || user?.email}
          </span>
          <button onClick={handleLogout} style={s.logoutBtn}>Sign out</button>
        </div>
      </nav>

      <div style={s.body}>
        <div style={s.header}>
          <h1 style={s.heading}>Scan ticket</h1>
          <p style={s.sub}>Point camera at attendee's QR code to verify entry</p>
        </div>

        <div style={s.layout}>
          {/* Scanner */}
          <div style={s.scannerCard}>
            {!result && (
              <>
                <div id="qr-reader" style={s.qrReader} />
                {loading && (
                  <div style={s.loadingOverlay}>
                    <p style={{ color: '#fff' }}>Verifying ticket...</p>
                  </div>
                )}
              </>
            )}

            {/* Result */}
            {result && (
              <div style={s.resultWrap}>
                {result.success ? (
                  <div style={s.successResult}>
                    <div style={s.resultIcon}>✅</div>
                    <p style={s.resultTitle}>Valid ticket</p>
                    <p style={s.resultSub}>Entry approved</p>

                    <div style={s.ticketInfo}>
                      <div style={s.infoRow}>
                        <span style={s.infoLabel}>Participant</span>
                        <span style={s.infoValue}>{result.data.participantName}</span>
                      </div>
                      <div style={s.infoRow}>
                        <span style={s.infoLabel}>Checked in at</span>
                        <span style={s.infoValue}>{formatTime(result.data.isCheckedInAt)}</span>
                      </div>
                      <div style={s.infoRow}>
                        <span style={s.infoLabel}>Ticket ID</span>
                        <span style={{ ...s.infoValue, fontFamily: 'monospace', fontSize: '11px' }}>
                          {result.data._id}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={s.failResult}>
                    <div style={s.resultIcon}>❌</div>
                    <p style={s.resultTitle}>Invalid ticket</p>
                    <p style={s.resultSub}>{result.message}</p>
                  </div>
                )}

                <button onClick={handleReset} style={s.scanAgainBtn}>
                  Scan next ticket
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={s.instructions}>
            <h2 style={s.instrTitle}>How to scan</h2>
            <div style={s.instrList}>
              <div style={s.instrItem}>
                <span style={s.instrNum}>1</span>
                <span style={s.instrText}>Allow camera access when prompted</span>
              </div>
              <div style={s.instrItem}>
                <span style={s.instrNum}>2</span>
                <span style={s.instrText}>Ask attendee to show their ticket QR code</span>
              </div>
              <div style={s.instrItem}>
                <span style={s.instrNum}>3</span>
                <span style={s.instrText}>Point camera at the QR code until it scans</span>
              </div>
              <div style={s.instrItem}>
                <span style={s.instrNum}>4</span>
                <span style={s.instrText}>Green means valid entry, red means invalid</span>
              </div>
              <div style={s.instrItem}>
                <span style={s.instrNum}>5</span>
                <span style={s.instrText}>Each ticket can only be scanned once</span>
              </div>
            </div>

            <div style={s.warningCard}>
              <p style={s.warningTitle}>⚠️ Already used tickets</p>
              <p style={s.warningText}>
                If a ticket has already been scanned, it will show as invalid.
                Each QR code is single use only.
              </p>
            </div>
          </div>
        </div>
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
  header: { marginBottom: '32px' },
  heading: { color: '#fff', fontSize: '24px', fontWeight: '500', letterSpacing: '-0.5px', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '14px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' },
  scannerCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '24px', position: 'relative', minHeight: '400px' },
  qrReader: { width: '100%' },
  loadingOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px' },
  resultWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px 0' },
  successResult: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' },
  failResult: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  resultIcon: { fontSize: '56px', marginBottom: '8px' },
  resultTitle: { color: '#fff', fontSize: '20px', fontWeight: '500' },
  resultSub: { color: '#666', fontSize: '14px', marginBottom: '8px' },
  ticketInfo: { width: '100%', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { color: '#555', fontSize: '12px' },
  infoValue: { color: '#ccc', fontSize: '13px', fontWeight: '500' },
  scanAgainBtn: { width: '100%', background: '#6d28d9', border: 'none', borderRadius: '10px', padding: '13px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' },
  instructions: { display: 'flex', flexDirection: 'column', gap: '16px' },
  instrTitle: { color: '#fff', fontSize: '14px', fontWeight: '500', marginBottom: '4px' },
  instrList: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' },
  instrItem: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  instrNum: { width: '22px', height: '22px', background: '#1a0f2e', border: '1px solid #4c1d95', borderRadius: '50%', color: '#9d71f7', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  instrText: { color: '#888', fontSize: '13px', lineHeight: '1.5', paddingTop: '2px' },
  warningCard: { background: '#1a140a', border: '1px solid #3d2e0f', borderRadius: '12px', padding: '16px' },
  warningTitle: { color: '#fb923c', fontSize: '13px', fontWeight: '500', marginBottom: '6px' },
  warningText: { color: '#78533a', fontSize: '12px', lineHeight: '1.5' },
}