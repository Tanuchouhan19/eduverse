import { Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

/* ═══════════════════════════════════════════════════════════════
   EduVerse Footer — Premium · Fully Mobile Responsive
   useTheme() hook · Collapsible mobile sections · Real logo
═══════════════════════════════════════════════════════════════ */

const CSS = (tv) => `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@600;700&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  /* ── NEWSLETTER ── */
  .ef-nl-strip {
    border-bottom: 1px solid ${tv.border};
    padding: 52px 48px;
  }
  .ef-nl-inner {
    max-width: 1140px; margin: 0 auto;
    display: flex; align-items: center;
    justify-content: space-between;
    gap: 28px; flex-wrap: wrap;
  }
  .ef-nl-heading {
    font-family: 'Clash Display', sans-serif;
    font-size: 24px; font-weight: 700;
    letter-spacing: -0.04em; color: ${tv.fg};
    margin: 0 0 6px;
  }
  .ef-nl-sub {
    font-size: 14px; color: ${tv.fg2};
    font-family: 'Bricolage Grotesque', sans-serif;
    margin: 0;
  }
  .ef-nl-form {
    display: flex; gap: 10px; flex-wrap: wrap;
    flex: 1; justify-content: flex-end;
  }
  .ef-nl-input {
    flex: 1; min-width: 200px; max-width: 280px;
    padding: 12px 18px;
    border-radius: 12px;
    border: 1.5px solid ${tv.border};
    background: ${tv.inputBg};
    color: ${tv.fg};
    font-size: 14px;
    font-family: 'Bricolage Grotesque', sans-serif;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .ef-nl-input::placeholder { color: ${tv.fg3}; }
  .ef-nl-input:focus {
    border-color: ${tv.acc1}80;
    box-shadow: 0 0 0 3px ${tv.acc1}14;
  }
  .ef-nl-btn {
    padding: 12px 22px;
    border-radius: 12px;
    background: linear-gradient(135deg, ${tv.acc1}, ${tv.acc2});
    color: #fff;
    font-size: 14px; font-weight: 700;
    border: none; cursor: pointer;
    font-family: 'Bricolage Grotesque', sans-serif;
    white-space: nowrap;
    transition: all .22s;
    box-shadow: 0 4px 18px ${tv.acc1}35;
    display: flex; align-items: center; gap: 7px;
  }
  .ef-nl-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px ${tv.acc1}50; }
  .ef-nl-btn:active { transform: translateY(0); }

  /* ── MAIN GRID ── */
  .ef-main {
    max-width: 1140px; margin: 0 auto;
    padding: 60px 48px 52px;
    display: grid;
    grid-template-columns: 2.2fr 1fr 1fr 1fr;
    gap: 52px;
  }

  /* ── BRAND COL ── */
  .ef-brand-desc {
    font-size: 13.5px; color: ${tv.fg2}; line-height: 1.75;
    max-width: 290px; margin: 0 0 24px;
    font-family: 'Bricolage Grotesque', sans-serif;
  }
  .ef-socials { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
  .ef-social-btn {
    width: 38px; height: 38px; border-radius: 11px;
    background: ${tv.cardBg}; border: 1px solid ${tv.border};
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; color: ${tv.fg2};
    transition: all .22s cubic-bezier(.34,1.56,.64,1);
  }
  .ef-social-btn:hover {
    border-color: ${tv.acc1}80; color: ${tv.acc1};
    background: ${tv.acc1}14; transform: translateY(-3px);
    box-shadow: 0 6px 16px ${tv.acc1}25;
  }
  .ef-app-badges { display: flex; gap: 10px; flex-wrap: wrap; }
  .ef-app-badge {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 16px; border-radius: 12px;
    background: ${tv.cardBg}; border: 1px solid ${tv.border};
    text-decoration: none; transition: all .22s;
  }
  .ef-app-badge:hover {
    border-color: ${tv.acc1}50;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px ${tv.acc1}15;
  }
  .ef-badge-top {
    font-size: 8.5px; color: ${tv.fg3}; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    font-family: 'Bricolage Grotesque', sans-serif;
  }
  .ef-badge-bot {
    font-size: 13px; color: ${tv.fg}; font-weight: 700;
    font-family: 'Bricolage Grotesque', sans-serif;
    line-height: 1.1;
  }

  /* ── LINK COLS ── */
  .ef-col-heading {
    font-size: 10.5px; font-weight: 700; color: ${tv.fg3};
    letter-spacing: 2.2px; text-transform: uppercase;
    margin-bottom: 20px;
    font-family: 'Bricolage Grotesque', sans-serif;
  }
  .ef-links { display: flex; flex-direction: column; gap: 14px; }
  .ef-link {
    color: ${tv.fg2}; text-decoration: none;
    font-size: 13.5px; font-weight: 400;
    font-family: 'Bricolage Grotesque', sans-serif;
    transition: color .18s, transform .18s;
    display: inline-flex; align-items: center; gap: 5px;
    width: fit-content;
  }
  .ef-link:hover { color: ${tv.acc1}; transform: translateX(3px); }

  /* ── BOTTOM BAR ── */
  .ef-bottom {
    border-top: 1px solid ${tv.border};
    padding: 22px 48px;
  }
  .ef-bottom-inner {
    max-width: 1140px; margin: 0 auto;
    display: flex; align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; gap: 14px;
  }
  .ef-copyright {
    font-size: 12.5px; color: ${tv.fg3};
    font-family: 'Bricolage Grotesque', sans-serif;
  }
  .ef-bottom-links { display: flex; gap: 22px; }
  .ef-bottom-link {
    font-size: 12.5px; color: ${tv.fg3};
    text-decoration: none;
    font-family: 'Bricolage Grotesque', sans-serif;
    transition: color .18s;
  }
  .ef-bottom-link:hover { color: ${tv.acc1}; }

  /* ── STATS ROW ── */
  .ef-stats {
    display: flex; gap: 0;
    background: ${tv.cardBg};
    border: 1px solid ${tv.border};
    border-radius: 18px;
    margin: 0 0 28px;
    overflow: hidden;
  }
  .ef-stat {
    flex: 1; padding: 16px 18px;
    text-align: center; position: relative;
  }
  .ef-stat + .ef-stat::before {
    content: ''; position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 1px; background: ${tv.border};
  }
  .ef-stat-val {
    font-family: 'Clash Display', sans-serif;
    font-size: 18px; font-weight: 700;
    color: ${tv.acc1}; line-height: 1; margin-bottom: 3px;
  }
  .ef-stat-lbl {
    font-size: 10px; color: ${tv.fg3};
    font-family: 'Bricolage Grotesque', sans-serif;
    letter-spacing: .5px; text-transform: uppercase;
  }

  /* ── MOBILE ACCORDION ── */
  .ef-mob-section { border-bottom: 1px solid ${tv.border}; }
  .ef-mob-trigger {
    width: 100%; padding: 18px 20px;
    display: flex; align-items: center; justify-content: space-between;
    background: none; border: none; cursor: pointer;
    color: ${tv.fg}; font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 1.8px; text-transform: uppercase;
  }
  .ef-mob-chevron {
    transition: transform .28s cubic-bezier(.4,0,.2,1);
    color: ${tv.fg3};
    display: flex;
  }
  .ef-mob-chevron.open { transform: rotate(180deg); }
  .ef-mob-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows .28s cubic-bezier(.4,0,.2,1);
  }
  .ef-mob-body.open { grid-template-rows: 1fr; }
  .ef-mob-body-inner { overflow: hidden; }
  .ef-mob-links {
    display: flex; flex-direction: column; gap: 0;
    padding: 4px 20px 20px;
  }
  .ef-mob-link {
    color: ${tv.fg2}; text-decoration: none;
    font-size: 14px; font-family: 'Bricolage Grotesque', sans-serif;
    padding: 10px 0; border-bottom: 1px solid ${tv.border}80;
    transition: color .18s, padding-left .18s;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ef-mob-link:last-child { border-bottom: none; }
  .ef-mob-link:hover { color: ${tv.acc1}; padding-left: 4px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .ef-nl-strip { padding: 36px 24px; }
    .ef-nl-inner { flex-direction: column; align-items: stretch; gap: 20px; }
    .ef-nl-form { justify-content: stretch; }
    .ef-nl-input { max-width: none; }
    .ef-main { display: none; }
    .ef-bottom { padding: 20px 20px; }
    .ef-bottom-inner { flex-direction: column; align-items: center; text-align: center; gap: 10px; }
    .ef-bottom-links { flex-wrap: wrap; justify-content: center; gap: 16px; }
  }

  @media (min-width: 901px) {
    .ef-mobile-only { display: none !important; }
  }

  /* mobile brand section */
  .ef-mob-brand {
    padding: 36px 20px 28px;
    border-bottom: 1px solid ${tv.border};
  }
  .ef-mob-stats { margin: 20px 0 0; }
  .ef-mob-app-badges { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
`;

/* ── Real EduVerse Logo SVG ─────────────────────────── */
const EduVerseLogo = ({ acc1, acc2, fg, size = 38 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
    {/* Mark */}
    <div style={{
      width: size, height: size, borderRadius: 12,
      background: `linear-gradient(135deg, ${acc1} 0%, ${acc2} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 4px 18px ${acc1}45`, flexShrink: 0, position: "relative", overflow: "hidden"
    }}>
      {/* shine */}
      <div style={{
        position: "absolute", top: -8, left: -8, width: 28, height: 28,
        background: "rgba(255,255,255,0.18)", borderRadius: "50%", filter: "blur(5px)"
      }}/>
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none">
        {/* Open book */}
        <path d="M12 20V7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4 6C4 6 7 5 12 7C17 5 20 6 20 6V18C20 18 17 17 12 19C7 17 4 18 4 18V6Z"
          stroke="white" strokeWidth="2" strokeLinejoin="round" fill="rgba(255,255,255,0.15)"/>
        {/* Sparkle */}
        <circle cx="18" cy="5" r="1.5" fill="white" opacity="0.9"/>
        <path d="M18 3v1M18 7v1M16 5h1M20 5h1" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      </svg>
    </div>
    {/* Wordmark */}
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <div style={{
        fontFamily: "'Clash Display', sans-serif",
        fontSize: 19, fontWeight: 700,
        letterSpacing: "-0.04em",
        color: fg, lineHeight: 1.1,
      }}>
        Edu<span style={{ color: acc1 }}>Verse</span>
        <span style={{ fontSize: 14, marginLeft: 2 }}>🌍</span>
      </div>
      <div style={{
        fontSize: 8, color: acc1, fontFamily: "'Bricolage Grotesque', sans-serif",
        letterSpacing: "2.5px", fontWeight: 700, textTransform: "uppercase",
        opacity: 0.7, marginTop: 2
      }}>
        Learn · Grow · Thrive
      </div>
    </div>
  </div>
);

/* ── Chevron icon ── */
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const ArrowRight = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════ */
const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [openSections, setOpenSections] = useState({});

  const tv = isDark ? {
    bg:      "#060610",
    border:  "rgba(255,255,255,0.07)",
    fg:      "#f0eeff",
    fg2:     "#8a86b0",
    fg3:     "#4a4668",
    acc1:    "#7c5aff",
    acc2:    "#a78bfa",
    cardBg:  "rgba(255,255,255,0.04)",
    inputBg: "rgba(255,255,255,0.06)",
  } : {
    bg:      "#1a1208",
    border:  "rgba(255,255,255,0.10)",
    fg:      "#faf7f0",
    fg2:     "#c4ad92",
    fg3:     "#7a6548",
    acc1:    "#e8722a",
    acc2:    "#f0a040",
    cardBg:  "rgba(255,255,255,0.05)",
    inputBg: "rgba(255,255,255,0.08)",
  };

  const LINKS = {
    Platform: [
      { label: "Marketplace",  to: "/auth/marketplace" },
      { label: "Events",       to: "/auth/events" },
      { label: "How It Works", to: "/#how-it-works" },
      { label: "Pricing",      to: "/pricing" },
    ],
    Company: [
      { label: "About Us",  to: "/about" },
      { label: "Blog",      to: "/blog" },
      { label: "Careers",   to: "/careers" },
      { label: "Contact",   to: "/contact" },
    ],
    Legal: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use",   to: "/terms" },
      { label: "Cookie Policy",  to: "/cookies" },
      { label: "Refund Policy",  to: "/refund" },
    ],
  };

  const SOCIALS = [
    { label: "Twitter/X", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.722-8.818-8.148-10.682h6.07l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" fill="currentColor"/></svg> },
    { label: "Instagram", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg> },
    { label: "LinkedIn",  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M7 10v7M7 7v.01M12 10v7M12 13c0-1.657 1.343-3 3-3s3 1.343 3 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
    { label: "GitHub",    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg> },
  ];

  const STATS = [
    { val: "50K+", lbl: "Students" },
    { val: "12K+", lbl: "Listings" },
    { val: "800+", lbl: "Events" },
  ];

  const APP_BADGES = [
    { label: "App Store", sub: "Download on the", emoji: "🍎" },
    { label: "Play Store", sub: "Get it on", emoji: "▶" },
  ];

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ─────────────────────────────────────────── */
  return (
    <footer style={{ background: tv.bg, color: tv.fg, borderTop: `1px solid ${tv.border}` }}>
      <style>{CSS(tv)}</style>

      {/* ══ NEWSLETTER STRIP ══ */}
      <div className="ef-nl-strip">
        <div className="ef-nl-inner">
          <div>
            <h3 className="ef-nl-heading">Stay in the loop 📬</h3>
            <p className="ef-nl-sub">Get the latest listings, events & campus drops — weekly digest.</p>
          </div>
          <div className="ef-nl-form">
            <input
              className="ef-nl-input"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="ef-nl-btn">
              Subscribe
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ══ DESKTOP MAIN GRID ══ */}
      <div className="ef-main">

        {/* Brand col */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <EduVerseLogo acc1={tv.acc1} acc2={tv.acc2} fg={tv.fg} />
          </div>

          {/* Stats */}
          <div className="ef-stats">
            {STATS.map(({ val, lbl }) => (
              <div className="ef-stat" key={lbl}>
                <div className="ef-stat-val">{val}</div>
                <div className="ef-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>

          <p className="ef-brand-desc">
            Your one-stop campus platform — buy, sell, discover events, and connect with thousands of students across India.
          </p>

          {/* Socials */}
          <div className="ef-socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href="#" className="ef-social-btn" title={s.label}>{s.icon}</a>
            ))}
          </div>

          {/* App badges */}
          <div className="ef-app-badges">
            {APP_BADGES.map((b) => (
              <a key={b.label} href="#" className="ef-app-badge">
                <span style={{ fontSize: 20 }}>{b.emoji}</span>
                <div>
                  <div className="ef-badge-top">{b.sub}</div>
                  <div className="ef-badge-bot">{b.label}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Link cols */}
        {Object.entries(LINKS).map(([heading, links]) => (
          <div key={heading}>
            <div className="ef-col-heading">{heading}</div>
            <div className="ef-links">
              {links.map((l) => (
                <Link key={l.label} to={l.to} className="ef-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ══ MOBILE LAYOUT ══ */}
      <div className="ef-mobile-only">

        {/* Mobile brand block */}
        <div className="ef-mob-brand">
          <EduVerseLogo acc1={tv.acc1} acc2={tv.acc2} fg={tv.fg} size={36} />

          {/* Stats */}
          <div className="ef-stats ef-mob-stats">
            {STATS.map(({ val, lbl }) => (
              <div className="ef-stat" key={lbl}>
                <div className="ef-stat-val">{val}</div>
                <div className="ef-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>

          <p style={{
            fontSize: 13.5, color: tv.fg2, lineHeight: 1.7,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            margin: "18px 0 0"
          }}>
            Your one-stop campus platform — buy, sell, discover events, and connect with thousands of students across India.
          </p>

          {/* Socials */}
          <div className="ef-socials" style={{ marginTop: 20 }}>
            {SOCIALS.map((s) => (
              <a key={s.label} href="#" className="ef-social-btn" title={s.label}>{s.icon}</a>
            ))}
          </div>

          {/* App badges */}
          <div className="ef-mob-app-badges">
            {APP_BADGES.map((b) => (
              <a key={b.label} href="#" className="ef-app-badge" style={{ flex: 1, justifyContent: "center" }}>
                <span style={{ fontSize: 18 }}>{b.emoji}</span>
                <div>
                  <div className="ef-badge-top">{b.sub}</div>
                  <div className="ef-badge-bot">{b.label}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter on mobile */}
        <div style={{ padding: "24px 20px", borderBottom: `1px solid ${tv.border}` }}>
          <p style={{ fontSize: 13, color: tv.fg2, fontFamily: "'Bricolage Grotesque',sans-serif", marginBottom: 12 }}>
            📬 <strong style={{ color: tv.fg }}>Weekly digest</strong> — listings, events & campus drops.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="ef-nl-input"
              type="email"
              placeholder="your@college.edu"
              style={{ flex: 1 }}
            />
            <button className="ef-nl-btn" style={{ padding: "12px 16px", fontSize: 13 }}>
              Go <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* Accordion link sections */}
        {Object.entries(LINKS).map(([heading, links]) => (
          <div className="ef-mob-section" key={heading}>
            <button
              className="ef-mob-trigger"
              onClick={() => toggleSection(heading)}
            >
              {heading}
              <span className={`ef-mob-chevron${openSections[heading] ? " open" : ""}`}>
                <ChevronDown />
              </span>
            </button>
            <div className={`ef-mob-body${openSections[heading] ? " open" : ""}`}>
              <div className="ef-mob-body-inner">
                <div className="ef-mob-links">
                  {links.map((l) => (
                    <Link key={l.label} to={l.to} className="ef-mob-link">
                      {l.label}
                      <ArrowRight size={10} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ BOTTOM BAR ══ */}
      <div className="ef-bottom">
        <div className="ef-bottom-inner">
          <div className="ef-copyright">
            © 2025 EduVerse Technologies Pvt. Ltd. — Made with 💜 by students, for students.
          </div>
          <div className="ef-bottom-links">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="ef-bottom-link"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;