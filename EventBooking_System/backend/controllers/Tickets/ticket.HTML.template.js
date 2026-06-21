export function ticketTemplate(ticket,event,qrData) {
return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Event Ticket</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0b0c10;
      --gold: #c9a84c;
      --gold-light: #e8c97a;
      --gold-dim: #7a6230;
      --white: #f4f0e8;
      --muted: #8a8070;
      --card-bg: #13141a;
      --stub-bg: #0f1014;
      --border: rgba(201,168,76,0.25);
      --radius: 20px;
    }

    html, body {
      width: 900px;
      height: 340px;
      background: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Sans', sans-serif;
    }

    /* ── Ticket wrapper ── */
    .ticket {
      width: 860px;
      height: 300px;
      display: flex;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow:
        0 0 0 1px var(--border),
        0 30px 80px rgba(0,0,0,0.7),
        0 0 60px rgba(201,168,76,0.06);
      position: relative;
    }

    /* ── Left main body ── */
    .ticket-main {
      flex: 1;
      background: var(--card-bg);
      padding: 32px 36px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    /* decorative arc */
    .ticket-main::before {
      content: '';
      position: absolute;
      top: -80px; left: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    /* ── Header row ── */
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .badge {
      font-family: 'DM Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold);
      background: rgba(201,168,76,0.10);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 4px 10px;
    }

    .ticket-id {
      font-family: 'DM Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.15em;
      color: var(--muted);
    }

    /* ── Event title ── */
    .event-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 900;
      color: var(--white);
      line-height: 1.1;
      margin: 10px 0 4px;
      max-width: 420px;
      letter-spacing: -0.02em;
    }

    .event-category {
      font-size: 11px;
      color: var(--gold-dim);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 500;
    }

    /* ── Meta row ── */
    .meta-row {
      display: flex;
      gap: 28px;
      align-items: flex-end;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .meta-label {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
    }

    .meta-value {
      font-size: 13px;
      font-weight: 500;
      color: var(--white);
      letter-spacing: 0.01em;
    }

    .meta-value.gold { color: var(--gold-light); }

    /* ── Bottom participant bar ── */
    .participant-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 14px;
      border-top: 1px solid rgba(201,168,76,0.12);
    }

    .avatar {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold-dim), var(--gold));
      display: flex; align-items: center; justify-content: center;
      font-family: 'Playfair Display', serif;
      font-size: 14px;
      font-weight: 700;
      color: #0b0c10;
      flex-shrink: 0;
    }

    .participant-info { flex: 1; }

    .participant-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--white);
      letter-spacing: 0.01em;
    }

    .participant-sub {
      font-size: 10px;
      color: var(--muted);
      margin-top: 1px;
    }

    .status-pill {
      font-family: 'DM Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 20px;
      background: rgba(80,200,120,0.12);
      color: #50c878;
      border: 1px solid rgba(80,200,120,0.25);
    }

    .status-pill.checked-in {
      background: rgba(80,200,120,0.15);
      color: #50c878;
      border-color: rgba(80,200,120,0.35);
    }

    /* ── Perforated divider ── */
    .perforated {
      width: 2px;
      background: repeating-linear-gradient(
        to bottom,
        transparent,
        transparent 6px,
        rgba(201,168,76,0.20) 6px,
        rgba(201,168,76,0.20) 12px
      );
      position: relative;
      flex-shrink: 0;
    }

    /* notch circles */
    .perforated::before,
    .perforated::after {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 24px; height: 24px;
      border-radius: 50%;
      background: var(--bg);
      border: 1px solid var(--border);
    }
    .perforated::before { top: -12px; }
    .perforated::after  { bottom: -12px; }

    /* ── Stub (right side) ── */
    .ticket-stub {
      width: 200px;
      background: var(--stub-bg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
      gap: 12px;
      position: relative;
    }

    /* gold corner accents */
    .ticket-stub::before,
    .ticket-stub::after {
      content: '';
      position: absolute;
      width: 30px; height: 30px;
      border-color: var(--gold-dim);
      border-style: solid;
    }
    .ticket-stub::before {
      top: 16px; right: 16px;
      border-width: 1px 1px 0 0;
    }
    .ticket-stub::after {
      bottom: 16px; left: 16px;
      border-width: 0 0 1px 1px;
    }

    .qr-wrap {
      background: #fff;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 0 20px rgba(201,168,76,0.15);
    }

    .qr-wrap img {
      width: 110px;
      height: 110px;
      display: block;
    }

    /* fallback QR placeholder (shown when no img src) */
    .qr-placeholder {
      width: 110px;
      height: 110px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stub-token {
      font-family: 'DM Mono', monospace;
      font-size: 8px;
      letter-spacing: 0.12em;
      color: var(--muted);
      text-align: center;
      word-break: break-all;
      max-width: 150px;
    }

    .stub-label {
      font-size: 9px;
      letter-spacing: 0.20em;
      text-transform: uppercase;
      color: var(--gold-dim);
      text-align: center;
    }

    .price-tag {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--gold-light);
      text-align: center;
    }

    .price-tag span {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      color: var(--muted);
      display: block;
      font-weight: 400;
      letter-spacing: 0.1em;
    }
  </style>
</head>
<body>

<div class="ticket">

  <!-- ═══ MAIN BODY ═══ -->
  <div class="ticket-main">

    <div>
      <!-- Header -->
      <div class="header">
        <div class="badge">&#x2605; Event Ticket</div>
        <div class="ticket-id">ID &nbsp;${ticket.id}</div>
      </div>

      <!-- Title -->
      <div class="event-title">${event.title}</div>
      <div class="event-category">${event.category} &nbsp;·&nbsp; ${event.mode}</div>
    </div>

    <!-- Meta details -->
    <div class="meta-row">
      <div class="meta-item">
        <div class="meta-label">Date</div>
        <div class="meta-value">${event.startTime.toLocaleDateString()}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Time</div>
        <div class="meta-value">${event.startTime.toLocaleTimeString()}-${event.endTime.toLocaleTimeString()}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Venue</div>
        <div class="meta-value">${event.venue}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Seat Limit</div>
        <div class="meta-value gold">${event.seatLimit}</div>
      </div>
    </div>

    <!-- Participant bar -->
    <div class="participant-bar">
      <div class="avatar">${ticket.participantName.split(' ').map(n => n[0]).join(' ')}</div>
      <div class="participant-info">
        <div class="participant-name">${ticket.participantName}</div>
        <div class="participant-sub">Registered Attendee &nbsp;·&nbsp; Booking ${ticket.booking}</div>
      </div>
      <div class="status-pill">${ticket.isCheckedIn}</div>
    </div>

  </div>

  <!-- ═══ PERFORATED DIVIDER ═══ -->
  <div class="perforated"></div>

  <!-- ═══ STUB ═══ -->
  <div class="ticket-stub">
    <div class="stub-label">Scan to verify</div>

    <div class="qr-wrap">
      <!-- Replace src with your generated QR image (base64 or URL) -->
      <img src="${qrData}" alt="QR Code" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
      <!-- SVG fallback placeholder -->
      <div class="qr-placeholder" style="display:none;">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="35" height="35" rx="3" fill="#111" stroke="#333" stroke-width="2"/>
          <rect x="13" y="13" width="19" height="19" rx="1" fill="#333"/>
          <rect x="60" y="5" width="35" height="35" rx="3" fill="#111" stroke="#333" stroke-width="2"/>
          <rect x="68" y="13" width="19" height="19" rx="1" fill="#333"/>
          <rect x="5" y="60" width="35" height="35" rx="3" fill="#111" stroke="#333" stroke-width="2"/>
          <rect x="13" y="68" width="19" height="19" rx="1" fill="#333"/>
          <rect x="58" y="58" width="8" height="8" rx="1" fill="#333"/>
          <rect x="72" y="58" width="8" height="8" rx="1" fill="#333"/>
          <rect x="86" y="58" width="8" height="8" rx="1" fill="#333"/>
          <rect x="58" y="72" width="8" height="8" rx="1" fill="#333"/>
          <rect x="72" y="72" width="8" height="8" rx="1" fill="#333"/>
          <rect x="86" y="86" width="8" height="8" rx="1" fill="#333"/>
          <rect x="58" y="86" width="8" height="8" rx="1" fill="#333"/>
        </svg>
      </div>
    </div>

    <div class="stub-token">${ticket.qrToken}</div>

    <div class="price-tag">
      ${event.price}
      <span>Admission</span>
    </div>

    <div class="stub-label">${event.status}</div>
  </div>

</div>

</body>
</html>`;
}