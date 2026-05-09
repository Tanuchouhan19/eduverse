import { Link } from "react-router-dom";

const Footer = ({ theme = "dark" }) => {
  const isDark = theme === "dark";

  const tv = isDark ? {
    bg:      "#060610",
    bgAlt:   "#0a0a16",
    border:  "rgba(255,255,255,0.07)",
    fg:      "#f0eeff",
    fg2:     "#8a86b0",
    fg3:     "#4a4668",
    acc1:    "#7c5aff",
    acc2:    "#ff6b35",
    acc3:    "#00c9a7",
    cardBg:  "rgba(255,255,255,0.04)",
    inputBg: "rgba(255,255,255,0.06)",
  } : {
    bg:      "#1a1208",
    bgAlt:   "#221809",
    border:  "rgba(255,255,255,0.1)",
    fg:      "#faf7f0",
    fg2:     "#c4ad92",
    fg3:     "#7a6548",
    acc1:    "#e8722a",
    acc2:    "#f0a040",
    acc3:    "#14a87a",
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
      { label: "About Us",    to: "/about" },
      { label: "Blog",        to: "/blog" },
      { label: "Careers",     to: "/careers" },
      { label: "Contact",     to: "/contact" },
    ],
    Legal: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use",   to: "/terms" },
      { label: "Cookie Policy",  to: "/cookies" },
      { label: "Refund Policy",  to: "/refund" },
    ],
  };

  const SOCIALS = [
    { label: "Twitter/X", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.722-8.818-8.148-10.682h6.07l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" fill="currentColor"/></svg>
    )},
    { label: "Instagram", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
    )},
    { label: "LinkedIn", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M7 10v7M7 7v.01M12 10v7M12 13c0-1.657 1.343-3 3-3s3 1.343 3 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    )},
    { label: "GitHub", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" fill="currentColor"/></svg>
    )},
  ];

  return (
    <footer style={{ background: tv.bg, color: tv.fg, borderTop: `1px solid ${tv.border}` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');
        .ev-footer-link { color:${tv.fg2};text-decoration:none;font-size:13.5px;font-weight:400;transition:color 0.18s;display:inline-block;line-height:1;font-family:'DM Sans',sans-serif; }
        .ev-footer-link:hover { color:${tv.acc1}; }
        .ev-social-btn { width:38px;height:38px;border-radius:10px;background:${tv.cardBg};border:1px solid ${tv.border};display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;color:${tv.fg2};transition:all 0.2s; }
        .ev-social-btn:hover { border-color:${tv.acc1}60;color:${tv.acc1};background:${tv.acc1}14;transform:translateY(-2px); }
        .ev-newsletter-input { flex:1;padding:11px 16px;border-radius:10px;background:${tv.inputBg};border:1px solid ${tv.border};color:${tv.fg};font-size:13.5px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s; }
        .ev-newsletter-input::placeholder { color:${tv.fg3}; }
        .ev-newsletter-input:focus { border-color:${tv.acc1}60; }
        .ev-newsletter-btn { padding:11px 20px;border-radius:10px;background:linear-gradient(135deg,${tv.acc1},${tv.acc2});color:#fff;font-size:13.5px;font-weight:600;border:none;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;white-space:nowrap; }
        .ev-newsletter-btn:hover { transform:translateY(-1px);box-shadow:0 6px 20px ${tv.acc1}40; }
      `}</style>

      {/* Top newsletter strip */}
      <div style={{ borderBottom: `1px solid ${tv.border}`, padding: "48px 40px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6, color: tv.fg }}>
              Stay in the loop 📬
            </h3>
            <p style={{ fontSize: 14, color: tv.fg2, fontFamily: "'DM Sans',sans-serif" }}>Get the latest listings, events, and campus news — weekly digest.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input className="ev-newsletter-input" type="email" placeholder="your@college.edu" style={{ minWidth: 220 }} />
            <button className="ev-newsletter-btn">Subscribe →</button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 40px 48px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>

        {/* Brand col */}
        <div>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${tv.acc1},${tv.acc2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${tv.acc1}40` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 20L12 6L18 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 15H15.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", color: tv.fg }}>
                Edu<span style={{ color: tv.acc1 }}>Verse</span>
              </div>
              <div style={{ fontSize: 8.5, color: tv.fg3, letterSpacing: "2.5px", fontWeight: 600, textTransform: "uppercase" }}>Learn · Grow · Thrive</div>
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: tv.fg2, lineHeight: 1.7, maxWidth: 280, marginBottom: 24, fontFamily: "'DM Sans',sans-serif" }}>
            Your one-stop campus platform — buy, sell, discover events, and connect with thousands of students across India.
          </p>

          {/* Socials */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {SOCIALS.map((s, i) => (
              <a key={i} href="#" className="ev-social-btn" title={s.label}>{s.icon}</a>
            ))}
          </div>

          {/* App badges */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "App Store", icon: "🍎" },
              { label: "Play Store", icon: "▶" },
            ].map((b, i) => (
              <a key={i} href="#" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: tv.cardBg, border: `1px solid ${tv.border}`, textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${tv.acc1}50`}
                onMouseLeave={e => e.currentTarget.style.borderColor = tv.border}
              >
                <span style={{ fontSize: 16 }}>{b.icon}</span>
                <div>
                  <div style={{ fontSize: 9, color: tv.fg3, fontWeight: 500, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.5px" }}>DOWNLOAD ON</div>
                  <div style={{ fontSize: 12.5, color: tv.fg, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.1 }}>{b.label}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Link cols */}
        {Object.entries(LINKS).map(([heading, links]) => (
          <div key={heading}>
            <div style={{ fontSize: 11, fontWeight: 700, color: tv.fg3, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>{heading}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {links.map((l, i) => (
                <Link key={i} to={l.to} className="ev-footer-link">{l.label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${tv.border}`, padding: "20px 40px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, color: tv.fg3, fontFamily: "'DM Sans',sans-serif" }}>
            © 2025 EduVerse Technologies Pvt. Ltd. — Made with 💜 by students, for students.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Contact"].map((item, i) => (
              <Link key={i} to={`/${item.toLowerCase()}`} style={{ fontSize: 12.5, color: tv.fg3, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", transition: "color 0.18s" }}
                onMouseEnter={e => e.currentTarget.style.color = tv.acc1}
                onMouseLeave={e => e.currentTarget.style.color = tv.fg3}
              >{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;