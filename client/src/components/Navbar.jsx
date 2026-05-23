import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Calendar, LogOut, ChevronDown, Sparkles, BookOpen, Users, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const getDisplayName = (user) =>
  user?.name || user?.username || user?.email?.split("@")[0] || "Account";

const getInitials = (name) =>
  name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);

/* ── CSS ─────────────────────────────────────────────────────────────── */
const makeCSS = (isDark) => {
  const t = isDark ? {
    // ── DARK: deep navy + blue ──
    navBg:        "rgba(6, 11, 26, 0.82)",
    border:       "rgba(96, 165, 250, 0.10)",
    borderHover:  "rgba(96, 165, 250, 0.28)",
    fg:           "#e8f4ff",
    fg2:          "#7db4e0",
    fg3:          "#3a5a7a",
    acc:          "#3b82f6",
    accHover:     "#60a5fa",
    accGlow:      "rgba(59,130,246,0.28)",
    accSub:       "rgba(59,130,246,0.12)",
    card:         "rgba(15, 28, 55, 0.80)",
    pill:         "rgba(59,130,246,0.15)",
    pillBorder:   "rgba(59,130,246,0.25)",
    badgeBg:      "rgba(59,130,246,0.18)",
    badgeTxt:     "#93c5fd",
    shadow:       "0 2px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(96,165,250,0.08)",
    dropBg:       "rgba(8,14,30,0.97)",
    dropShadow:   "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(96,165,250,0.10)",
    logoutBg:     "rgba(239,68,68,0.08)",
    logoutBorder: "rgba(239,68,68,0.20)",
    logoutTxt:    "#f87171",
    avatarGrad:   "linear-gradient(135deg,#2563eb,#7c3aed)",
    btnGrad:      "linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)",
    btnShadow:    "0 4px 20px rgba(37,99,235,0.45)",
    glow:         "0 0 30px rgba(59,130,246,0.12)",
    scanline:     "rgba(59,130,246,0.03)",
    mobBg:        "rgba(6,10,24,0.98)",
  } : {
    // ── LIGHT: warm parchment + terracotta ──
    navBg:        "rgba(253, 246, 238, 0.88)",
    border:       "rgba(200,97,10,0.12)",
    borderHover:  "rgba(200,97,10,0.30)",
    fg:           "#1a120a",
    fg2:          "#6e5440",
    fg3:          "#b09880",
    acc:          "#c8610a",
    accHover:     "#e07b25",
    accGlow:      "rgba(200,97,10,0.22)",
    accSub:       "rgba(200,97,10,0.07)",
    card:         "rgba(255,253,249,0.85)",
    pill:         "rgba(200,97,10,0.08)",
    pillBorder:   "rgba(200,97,10,0.20)",
    badgeBg:      "rgba(200,97,10,0.10)",
    badgeTxt:     "#c8610a",
    shadow:       "0 2px 32px rgba(180,100,40,0.12), 0 0 0 1px rgba(200,97,10,0.08)",
    dropBg:       "rgba(255,252,247,0.99)",
    dropShadow:   "0 24px 60px rgba(180,100,40,0.18), 0 0 0 1px rgba(200,97,10,0.10)",
    logoutBg:     "rgba(239,68,68,0.05)",
    logoutBorder: "rgba(239,68,68,0.15)",
    logoutTxt:    "#dc2626",
    avatarGrad:   "linear-gradient(135deg,#c8610a,#e07b25)",
    btnGrad:      "linear-gradient(135deg,#c8610a 0%,#a34f08 100%)",
    btnShadow:    "0 4px 20px rgba(200,97,10,0.38)",
    glow:         "0 0 30px rgba(200,97,10,0.10)",
    scanline:     "rgba(200,97,10,0.025)",
    mobBg:        "rgba(253,248,242,0.99)",
  };

  return { t, css: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cal+Sans&display=swap');

    .evn-root *, .evn-root *::before, .evn-root *::after { box-sizing: border-box; }

    /* ── Scanline shimmer on nav ── */
    .evn-bar::after {
      content: '';
      position: absolute; inset: 0; pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        ${t.scanline} 2px,
        ${t.scanline} 4px
      );
      opacity: 0.6;
    }

    /* ── Logo ── */
    .evn-logo-link {
      display: flex; align-items: center; gap: 11px;
      text-decoration: none; flex-shrink: 0;
      transition: opacity 0.18s;
    }
    .evn-logo-link:hover { opacity: 0.88; }
    .evn-logo-link:hover .evn-logo-mark { transform: scale(1.06); box-shadow: ${t.btnShadow}, 0 0 0 4px ${t.accGlow}; }

    .evn-logo-mark {
      width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
      background: ${t.btnGrad};
      display: flex; align-items: center; justify-content: center;
      box-shadow: ${t.btnShadow}, inset 0 1px 0 rgba(255,255,255,0.18);
      transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s;
      position: relative; overflow: hidden;
    }
    /* Glass highlight top-left */
    .evn-logo-mark::before {
      content: '';
      position: absolute; top: -4px; left: -4px;
      width: 22px; height: 22px;
      background: rgba(255,255,255,0.16);
      border-radius: 50%; filter: blur(5px);
      pointer-events: none;
    }
    /* Subtle bottom shine */
    .evn-logo-mark::after {
      content: '';
      position: absolute; bottom: 0; left: 0; right: 0; height: 40%;
      background: linear-gradient(to top, rgba(0,0,0,0.12), transparent);
      pointer-events: none;
    }

    /* Wordmark */
    .evn-wordmark {
      font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
      font-size: 19px; font-weight: 800;
      letter-spacing: -0.6px; line-height: 1;
      color: ${t.fg};
      display: flex; align-items: baseline; gap: 0px;
    }
    .evn-wordmark-edu {
      color: ${t.fg};
      font-weight: 800;
    }
    .evn-wordmark-verse {
      color: ${t.acc};
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .evn-tagline {
      font-size: 8px; color: ${t.fg3};
      letter-spacing: 2.8px; font-weight: 600;
      text-transform: uppercase; margin-top: 3px;
      font-family: 'Inter', sans-serif;
      display: flex; align-items: center; gap: 5px;
    }
    .evn-tagline-dot {
      width: 3px; height: 3px; border-radius: 50%;
      background: ${t.acc}; opacity: 0.6; flex-shrink: 0;
    }

    /* ── Nav links ── */
    .evn-link {
      display: flex; align-items: center; gap: 5px;
      padding: 7px 12px; border-radius: 8px;
      font-size: 13.5px; font-weight: 500;
      color: ${t.fg2}; text-decoration: none;
      border: 1px solid transparent;
      font-family: 'Inter', sans-serif;
      transition: color 0.18s, background 0.18s, border-color 0.18s;
      white-space: nowrap; position: relative;
    }
    .evn-link:hover { color: ${t.acc}; background: ${t.accSub}; border-color: ${t.pillBorder}; }
    .evn-link.active {
      color: ${t.acc}; background: ${t.pill};
      border-color: ${t.pillBorder}; font-weight: 600;
    }
    .evn-link.active::after {
      content: '';
      position: absolute; bottom: -1px; left: 20%; right: 20%; height: 2px;
      background: ${t.acc}; border-radius: 2px; opacity: 0.6;
    }

    /* ── Badge ── */
    .evn-badge {
      font-size: 9px; font-weight: 700; letter-spacing: 0.3px;
      padding: 1px 6px; border-radius: 100px;
      background: ${t.badgeBg}; color: ${t.badgeTxt};
      font-family: 'Inter', sans-serif;
      border: 1px solid ${t.pillBorder};
    }

    /* ── Divider ── */
    .evn-sep { width: 1px; height: 18px; background: ${t.border}; margin: 0 6px; flex-shrink: 0; }

    /* ── Theme toggle ── */
    .evn-theme-toggle {
      width: 52px; height: 28px; border-radius: 14px; flex-shrink: 0;
      background: ${t.pill}; border: 1px solid ${t.pillBorder};
      padding: 3px; cursor: pointer; position: relative;
      transition: background 0.3s, border-color 0.3s;
    }
    .evn-theme-thumb {
      width: 20px; height: 20px; border-radius: 50%;
      background: ${t.btnGrad};
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; position: absolute; top: 3px;
      transition: left 0.3s cubic-bezier(0.34,1.56,0.64,1);
      box-shadow: 0 2px 8px ${t.accGlow};
    }
    .evn-theme-thumb.left  { left: 3px; }
    .evn-theme-thumb.right { left: 27px; }

    /* ── User chip ── */
    .evn-user-chip {
      display: flex; align-items: center; gap: 8px;
      padding: 4px 12px 4px 4px; border-radius: 100px;
      background: ${t.card}; border: 1px solid ${t.border};
      cursor: pointer; transition: all 0.2s; text-decoration: none;
      position: relative;
    }
    .evn-user-chip:hover { border-color: ${t.borderHover}; box-shadow: 0 0 0 3px ${t.accSub}; }
    .evn-avatar {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: ${t.avatarGrad};
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; color: #fff; overflow: hidden;
      border: 1.5px solid rgba(255,255,255,0.15);
    }
    .evn-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .evn-chip-name { font-size: 13px; font-weight: 600; color: ${t.fg}; font-family: 'Inter', sans-serif; }

    /* ── CTA button ── */
    .evn-cta {
      display: flex; align-items: center; gap: 7px;
      padding: 9px 18px; border-radius: 10px;
      font-size: 13.5px; font-weight: 600; color: #fff;
      background: ${t.btnGrad}; border: none; cursor: pointer;
      box-shadow: ${t.btnShadow}; font-family: 'Inter', sans-serif;
      text-decoration: none; transition: all 0.2s; position: relative; overflow: hidden;
      white-space: nowrap;
    }
    .evn-cta::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%);
      transform: translateX(-100%); transition: transform 0.5s;
    }
    .evn-cta:hover { transform: translateY(-1.5px); box-shadow: ${t.btnShadow}, ${t.glow}; }
    .evn-cta:hover::before { transform: translateX(100%); }
    .evn-cta:active { transform: translateY(0); }

    /* ── Ghost login btn ── */
    .evn-ghost {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 9px;
      font-size: 13.5px; font-weight: 600; color: ${t.fg2};
      background: transparent; border: 1px solid ${t.border};
      cursor: pointer; text-decoration: none; transition: all 0.18s;
      font-family: 'Inter', sans-serif;
    }
    .evn-ghost:hover { border-color: ${t.borderHover}; color: ${t.acc}; background: ${t.accSub}; }

    /* ── Logout button ── */
    .evn-logout {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 13px; border-radius: 8px;
      font-size: 13.5px; font-weight: 600; color: ${t.logoutTxt};
      background: transparent; border: 1px solid transparent;
      cursor: pointer; transition: all 0.18s; font-family: 'Inter', sans-serif;
    }
    .evn-logout:hover { background: ${t.logoutBg}; border-color: ${t.logoutBorder}; }

    /* ── Dropdown ── */
    .evn-dropdown {
      position: absolute; top: calc(100% + 14px); right: 0;
      width: 240px; border-radius: 16px;
      background: ${t.dropBg}; border: 1px solid ${t.border};
      box-shadow: ${t.dropShadow}; overflow: hidden;
      animation: evnDropIn 0.22s cubic-bezier(0.22,1,0.36,1) both;
      z-index: 200;
    }
    @keyframes evnDropIn {
      from { opacity:0; transform:translateY(-8px) scale(0.97); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    .evn-drop-header {
      padding: 16px;
      border-bottom: 1px solid ${t.border};
      background: ${t.accSub};
    }
    .evn-drop-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 16px; font-size: 13.5px; font-weight: 500;
      color: ${t.fg2}; cursor: pointer; text-decoration: none;
      transition: background 0.15s, color 0.15s;
      font-family: 'Inter', sans-serif;
    }
    .evn-drop-item:hover { background: ${t.accSub}; color: ${t.acc}; }
    .evn-drop-item svg { flex-shrink: 0; }
    .evn-drop-sep { height: 1px; background: ${t.border}; margin: 4px 0; }
    .evn-drop-logout {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 16px; font-size: 13.5px; font-weight: 600;
      color: ${t.logoutTxt}; cursor: pointer;
      transition: background 0.15s; font-family: 'Inter', sans-serif;
      border: none; width: 100%; background: transparent;
    }
    .evn-drop-logout:hover { background: ${t.logoutBg}; }

    /* ── Mobile ── */
    .evn-mob-drawer {
      position: fixed; top: 64px; left: 0; right: 0;
      background: ${t.mobBg}; border-bottom: 1px solid ${t.border};
      padding: 10px 14px 18px; z-index: 998;
      animation: evnMobIn 0.22s cubic-bezier(0.22,1,0.36,1) both;
      backdrop-filter: blur(24px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.2);
    }
    @keyframes evnMobIn {
      from { opacity:0; transform:translateY(-12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .evn-mob-link {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 14px; border-radius: 10px;
      font-size: 14.5px; font-weight: 500; color: ${t.fg2};
      text-decoration: none; transition: all 0.15s;
      font-family: 'Inter', sans-serif; border: 1px solid transparent;
    }
    .evn-mob-link:hover, .evn-mob-link.active {
      background: ${t.accSub}; color: ${t.acc}; border-color: ${t.pillBorder};
    }
    .evn-mob-sep { height: 1px; background: ${t.border}; margin: 8px 0; }
    .evn-mob-logout {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 14px; border-radius: 10px;
      font-size: 14.5px; font-weight: 600; color: ${t.logoutTxt};
      background: transparent; border: 1px solid transparent;
      cursor: pointer; width: 100%; transition: all 0.15s;
      font-family: 'Inter', sans-serif;
    }
    .evn-mob-logout:hover { background: ${t.logoutBg}; border-color: ${t.logoutBorder}; }
    .evn-hamburger {
      width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
      background: ${t.card}; border: 1px solid ${t.border};
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.18s;
    }
    .evn-hamburger:hover { border-color: ${t.borderHover}; background: ${t.accSub}; }

    /* ── Marketplace mega-hint pill ── */
    .evn-new-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: ${t.acc}; flex-shrink: 0;
      box-shadow: 0 0 6px ${t.acc};
      animation: evnPulse 2s ease-in-out infinite;
    }
    @keyframes evnPulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.5; transform: scale(1.4); }
    }

    /* ── Responsive ── */
    @media(max-width: 880px) {
      .evn-desktop { display: none !important; }
      .evn-mobile  { display: flex !important; }
    }
    @media(min-width: 881px) {
      .evn-mobile  { display: none !important; }
      .evn-desktop { display: flex !important; }
    }
  `};
};

/* ══════════════════════════════════════════════════════════ */
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout }             = useAuth();
  const dispatch               = useDispatch();
  const navigate               = useNavigate();
  const location               = useLocation();
  const { user }               = useSelector(s => s.auth);

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const dropRef = useRef(null);

  const isDark      = theme === "dark";
  const { t, css }  = makeCSS(isDark);
  const displayName = getDisplayName(user);
  const firstName   = displayName.split(" ")[0];
  const isActive    = (p) => location.pathname === p;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logoutUser()); logout(); navigate("/login");
    setMenuOpen(false); setDropOpen(false);
  };

  const navLinks = [
    { path: "/",                  label: "Home" },
    { path: "/auth/marketplace",  label: "Marketplace", icon: ShoppingBag, badge: "New" },
    { path: "/auth/events",       label: "Events",      icon: Calendar },
  ];

  return (
    <div className="evn-root">
      <style>{css}</style>

      {/* ══ MAIN BAR ══ */}
      <nav className="evn-bar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: t.navBg,
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: `1px solid ${t.border}`,
        boxShadow: t.shadow,
        transition: "all 0.3s ease",
      }}>

        {/* ── Logo ── */}
        <Link to="/" className="evn-logo-link">
          {/* Icon mark: open book with orbital arc = Education + Universe */}
          <div className="evn-logo-mark">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Book pages left */}
              <path
                d="M14 8C14 8 10 7 6.5 8.5C5.5 9 5 10 5 11V21C5 21 8 20 14 21"
                stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                fill="none"
              />
              {/* Book pages right */}
              <path
                d="M14 8C14 8 18 7 21.5 8.5C22.5 9 23 10 23 11V21C23 21 20 20 14 21"
                stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                fill="none"
              />
              {/* Spine */}
              <line x1="14" y1="8" x2="14" y2="21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              {/* Orbital arc — the "verse" / universe element */}
              <path
                d="M8 5.5C10 3.5 13 2.5 16 3C19.5 3.6 22 6 22.5 9"
                stroke="white" strokeWidth="1.4" strokeLinecap="round"
                strokeDasharray="1.5 2" opacity="0.65"
              />
              {/* Orbit dot / star */}
              <circle cx="22.5" cy="9" r="1.4" fill="white" opacity="0.9"/>
              {/* Small sparkle top-left */}
              <circle cx="7.5" cy="5" r="0.9" fill="white" opacity="0.45"/>
            </svg>
          </div>

          {/* Wordmark */}
          <div>
            <div className="evn-wordmark">
              <span className="evn-wordmark-edu">Edu</span>
              <span className="evn-wordmark-verse">Verse</span>
            </div>
            <div className="evn-tagline">
              Learn
              <span className="evn-tagline-dot" />
              Grow
              <span className="evn-tagline-dot" />
              Thrive
            </div>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="evn-desktop" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navLinks.map(({ path, label, icon: Icon, badge }) => (
            <Link key={path} to={path} className={`evn-link${isActive(path) ? " active" : ""}`}>
              {Icon && <Icon size={13} />}
              {label}
              {badge && (
                <span className="evn-badge" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="evn-new-dot" />
                  {badge}
                </span>
              )}
            </Link>
          ))}

          <div className="evn-sep" />

          {/* Theme toggle */}
          <button className="evn-theme-toggle" onClick={toggleTheme}
            title={isDark ? "Light mode" : "Dark mode"}>
            <div className={`evn-theme-thumb ${isDark ? "left" : "right"}`}>
              {isDark ? "🌙" : "☀️"}
            </div>
          </button>

          <div className="evn-sep" />

          {user ? (
            /* ── Logged in ── */
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* User chip with dropdown */}
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  className="evn-user-chip"
                  onClick={() => setDropOpen(o => !o)}
                  style={{ border: "none", cursor: "pointer" }}
                >
                  <div className="evn-avatar" style={{
                    background: user.isAdmin
                      ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                      : t.avatarGrad
                  }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={displayName} />
                      : user.isAdmin ? "A" : getInitials(displayName)}
                  </div>
                  <span className="evn-chip-name">
                    {user.isAdmin ? "Admin" : `Hi, ${firstName}`}
                  </span>
                  {user.isAdmin && (
                    <span className="evn-badge" style={{ marginLeft: 2 }}>PRO</span>
                  )}
                  <ChevronDown size={13} style={{
                    color: t.fg3, marginLeft: 2,
                    transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s"
                  }} />
                </button>

                {dropOpen && (
                  <div className="evn-dropdown">
                    {/* Header */}
                    <div className="evn-drop-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="evn-avatar" style={{
                          width: 36, height: 36, fontSize: 13,
                          background: user.isAdmin
                            ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                            : t.avatarGrad
                        }}>
                          {user.avatar
                            ? <img src={user.avatar} alt={displayName} />
                            : user.isAdmin ? "A" : getInitials(displayName)}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: t.fg, fontFamily: "Inter,sans-serif" }}>
                            {displayName}
                          </div>
                          <div style={{ fontSize: 11, color: t.fg3, fontFamily: "Inter,sans-serif" }}>
                            {user.email || (user.isAdmin ? "Administrator" : "Student")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "6px 0" }}>
                      <Link
                        to={user.isAdmin ? "/auth/admin" : "/auth/myprofile"}
                        className="evn-drop-item"
                      >
                        <Users size={14} style={{ color: t.acc }} />
                        {user.isAdmin ? "Admin Dashboard" : "My Profile"}
                      </Link>
                      <Link to="/auth/marketplace" className="evn-drop-item">
                        <ShoppingBag size={14} style={{ color: t.acc }} />
                        Marketplace
                      </Link>
                      <Link to="/auth/events" className="evn-drop-item">
                        <Calendar size={14} style={{ color: t.acc }} />
                        Events
                      </Link>
                      {/* <Link to="/auth/progress" className="evn-drop-item">
                        <TrendingUp size={14} style={{ color: t.acc }} />
                        Progress
                      </Link> */}
                      <div className="evn-drop-sep" />
                      <button className="evn-drop-logout" onClick={handleLogout}>
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Logged out ── */
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link to="/login" className="evn-ghost">Log in</Link>
              <Link to="/register" className="evn-cta">
                Get started
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5h9M6.5 2l4.5 4.5-4.5 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile controls ── */}
        <div className="evn-mobile" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="evn-theme-toggle" onClick={toggleTheme}>
            <div className={`evn-theme-thumb ${isDark ? "left" : "right"}`}>
              {isDark ? "🌙" : "☀️"}
            </div>
          </button>
          <button className="evn-hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.fg} strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.fg} strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>
      </nav>

      {/* ══ MOBILE DRAWER ══ */}
      {menuOpen && (
        <div className="evn-mob-drawer">
          {navLinks.map(({ path, label, icon: Icon, badge }) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)}
              className={`evn-mob-link${isActive(path) ? " active" : ""}`}>
              {Icon && <Icon size={16} />}
              {label}
              {badge && <span className="evn-badge">{badge}</span>}
            </Link>
          ))}

          <div className="evn-mob-sep" />

          {user ? (
            <>
              {/* User info row */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", marginBottom: 4,
                background: t.accSub, borderRadius: 10,
                border: `1px solid ${t.pillBorder}`
              }}>
                <div className="evn-avatar" style={{
                  width: 32, height: 32, fontSize: 12,
                  background: user.isAdmin ? "linear-gradient(135deg,#7c3aed,#a855f7)" : t.avatarGrad
                }}>
                  {user.avatar
                    ? <img src={user.avatar} alt={displayName} />
                    : user.isAdmin ? "A" : getInitials(displayName)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.fg, fontFamily: "Inter,sans-serif" }}>
                    {displayName}
                  </div>
                  <div style={{ fontSize: 11, color: t.fg3, fontFamily: "Inter,sans-serif" }}>
                    {user.isAdmin ? "Administrator" : "Student"}
                  </div>
                </div>
              </div>

              <Link to={user.isAdmin ? "/auth/admin" : "/auth/myprofile"}
                onClick={() => setMenuOpen(false)} className="evn-mob-link">
                <Users size={16} /> {user.isAdmin ? "Admin Dashboard" : "My Profile"}
              </Link>
              <Link to="/auth/progress" onClick={() => setMenuOpen(false)} className="evn-mob-link">
                <TrendingUp size={16} /> Progress
              </Link>

              <div className="evn-mob-sep" />
              <button className="evn-mob-logout" onClick={handleLogout}>
                <LogOut size={16} /> Sign out
              </button>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="evn-mob-link">
                Log in
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="evn-cta" style={{ justifyContent: "center", borderRadius: 10 }}>
                Get started
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Spacer */}
      <div style={{ height: 64 }} />
    </div>
  );
};

export default Navbar;