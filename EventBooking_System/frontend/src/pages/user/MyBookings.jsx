import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function MyBookings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ticketLoading, setTicketLoading] = useState({});
  const [ticketError, setTicketError] = useState({});
  const [ticketUrls, setTicketUrls] = useState({});
  const [ticketIds, setTicketIds] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/get-booking-history");

        console.log("Bookings Data:", res.data.data);

        setBookings(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) setBookings([]);
        else setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDownloadTicket = async (booking) => {
    setTicketLoading((prev) => ({ ...prev, [booking._id]: true }));
    setTicketError((prev) => ({ ...prev, [booking._id]: "" }));
    try {
      const res = await api.post(
  `/tickets/${booking.event._id}/${booking._id}/generate-Ticket-PDF`,
);

      const { pdfData, ticketData } = res.data; //Fixed: should be ticketData and pdfData
      //not pdfbase64 or ticketId

      // Store ticketId
      setTicketIds((prev) => ({ ...prev, [booking._id]: ticketData._id }));

      // Decode base64 and create blob
      const binary = atob(pdfData);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Store for iframe
      setTicketUrls((prev) => ({ ...prev, [booking._id]: url }));

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket-${booking._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setTicketError((prev) => ({
        ...prev,
        [booking._id]:
          err.response?.data?.message || "Ticket generation failed",
      }));
    } finally {
      setTicketLoading((prev) => ({ ...prev, [booking._id]: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/users/log-out");
    } catch {}
    logout();
    navigate("/login");
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statusColors = {
    Confirmed: { bg: "#0f2e1a", text: "#4ade80" },
    Pending: { bg: "#2e2a0f", text: "#facc15" },
    Cancelled: { bg: "#2e0f0f", text: "#f87171" },
  };

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.brand}>
            <div style={s.brandIcon}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2">
                <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
            </div>
            <span style={s.brandName}>EventBooking</span>
          </div>
          <button onClick={() => navigate("/events")} style={s.navLink}>
            Browse events
          </button>
          <button style={{ ...s.navLink, color: "#fff" }}>My bookings</button>
        </div>
        <div style={s.navRight}>
          <span style={s.navUser}>👤 {user?.username || user?.email}</span>
          <button onClick={handleLogout} style={s.logoutBtn}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={s.body}>
        <div style={s.header}>
          <h1 style={s.heading}>My bookings</h1>
          <p style={s.sub}>View and manage your event bookings</p>
        </div>

        {loading && (
          <div style={s.center}>
            <p style={{ color: "#666" }}>Loading bookings...</p>
          </div>
        )}

        {error && <p style={s.error}>{error}</p>}

        {!loading && bookings.length === 0 && (
          <div style={s.empty}>
            <p style={s.emptyTitle}>No bookings yet</p>
            <p style={s.emptySub}>Browse events and book your first ticket</p>
            <button onClick={() => navigate("/events")} style={s.browseBtn}>
              Browse events
            </button>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div style={s.list}>
            {bookings.map((booking) => {
              const colors =
                statusColors[booking.bookingStatus] || statusColors.Pending;
              const isConfirmed = booking.bookingStatus === "Confirmed";
              const isPending = booking.bookingStatus === "Pending";

              return (
                <div key={booking._id} style={s.card}>
                  <div style={s.cardTop}>
                    <span
                      style={{
                        ...s.statusBadge,
                        background: colors.bg,
                        color: colors.text,
                      }}>
                      {booking.bookingStatus}
                    </span>
                    <span style={s.bookingId}>
                      #{booking._id.slice(-8).toUpperCase()}
                    </span>
                  </div>

                  <div style={s.cardMeta}>
                    <div style={s.metaItem}>
                      <span style={s.metaLabel}>Tickets</span>
                      <span style={s.metaValue}>{booking.ticketCount}</span>
                    </div>
                    <div style={s.metaItem}>
                      <span style={s.metaLabel}>Total paid</span>
                      <span style={s.metaValue}>
                        ${booking.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div style={s.metaItem}>
                      <span style={s.metaLabel}>Booked on</span>
                      <span style={s.metaValue}>
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={s.actions}>
                    {isConfirmed && (
                      <button
                        onClick={() => handleDownloadTicket(booking)}
                        disabled={ticketLoading[booking._id]}
                        style={{
                          ...s.ticketBtn,
                          opacity: ticketLoading[booking._id] ? 0.7 : 1,
                        }}>
                        {ticketLoading[booking._id] ?
                          "Generating..."
                        : "⬇ Download ticket"}
                      </button>
                    )}

                    {isPending && (
                      <button
                        onClick={() =>
                          navigate(`/payment/${booking._id}`, {
                            state: { booking },
                          })
                        }
                        style={s.payBtn}>
                        Complete payment
                      </button>
                    )}

                    {booking.bookingStatus === "Cancelled" && (
                      <span style={s.cancelledNote}>Booking cancelled</span>
                    )}
                  </div>

                  {/* Ticket error */}
                  {ticketError[booking._id] && (
                    <p style={s.ticketErr}>{ticketError[booking._id]}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    fontFamily: "system-ui, sans-serif",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    borderBottom: "1px solid #1e1e1e",
    background: "#0d0d0d",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  navLeft: { display: "flex", alignItems: "center", gap: "24px" },
  brand: { display: "flex", alignItems: "center", gap: "8px" },
  brandIcon: {
    width: "28px",
    height: "28px",
    background: "#6d28d9",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: { color: "#fff", fontSize: "14px", fontWeight: "500" },
  navLink: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: "13px",
    cursor: "pointer",
  },
  navRight: { display: "flex", alignItems: "center", gap: "16px" },
  navUser: { color: "#666", fontSize: "13px" },
  logoutBtn: {
    background: "none",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "6px 14px",
    color: "#888",
    fontSize: "13px",
    cursor: "pointer",
  },
  body: { maxWidth: "900px", margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: "32px" },
  heading: {
    color: "#fff",
    fontSize: "26px",
    fontWeight: "500",
    letterSpacing: "-0.5px",
    marginBottom: "6px",
  },
  sub: { color: "#666", fontSize: "14px" },
  center: { textAlign: "center", padding: "80px 0" },
  error: { color: "#f87171", fontSize: "13px" },
  empty: {
    textAlign: "center",
    padding: "80px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  emptyTitle: { color: "#fff", fontSize: "18px", fontWeight: "500" },
  emptySub: { color: "#666", fontSize: "14px", marginBottom: "8px" },
  browseBtn: {
    background: "#6d28d9",
    border: "none",
    borderRadius: "8px",
    padding: "10px 24px",
    color: "#fff",
    fontSize: "13px",
    cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: "14px",
    padding: "24px",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  statusBadge: {
    fontSize: "11px",
    padding: "3px 10px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  bookingId: { color: "#444", fontSize: "11px", fontFamily: "monospace" },
  cardMeta: { display: "flex", gap: "32px", marginBottom: "20px" },
  metaItem: { display: "flex", flexDirection: "column", gap: "4px" },
  metaLabel: {
    color: "#555",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  metaValue: { color: "#ccc", fontSize: "14px", fontWeight: "500" },
  actions: { display: "flex", gap: "10px", flexWrap: "wrap" },
  ticketBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#1a0f2e",
    border: "1px solid #4c1d95",
    borderRadius: "8px",
    padding: "10px 16px",
    color: "#9d71f7",
    fontSize: "13px",
    cursor: "pointer",
  },
  payBtn: {
    background: "#6d28d9",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    color: "#fff",
    fontSize: "13px",
    cursor: "pointer",
  },
  cancelledNote: { color: "#444", fontSize: "13px", padding: "10px 0" },
  ticketErr: { color: "#f87171", fontSize: "12px", marginTop: "10px" },
  iframeWrap: {
    marginTop: "20px",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    overflow: "hidden",
  },
  iframeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    background: "#1a1a1a",
    borderBottom: "1px solid #2a2a2a",
  },
  iframeTitle: { color: "#888", fontSize: "12px" },
  iframeClose: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: "12px",
    cursor: "pointer",
  },
  iframe: {
    width: "100%",
    height: "500px",
    border: "none",
    background: "#fff",
  },
};
