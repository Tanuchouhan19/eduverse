import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Calendar, User, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { useTheme } from "../context/ThemeContext"; // ✅ ADDED

// ── EduVerse Logo Mark ─────────────────────────────────────────────────────
const LogoMark = ({ accent }) => (
  <div style={{
    width: 40, height: 40, borderRadius: 11,
    background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${accent}40`,
    flexShrink: 0, transition: "transform 0.2s ease",
  }}
    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05) rotate(-3deg)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 20L12 6L18 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 15H15.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="6" r="2.2" fill="white" opacity="0.35" />
    </svg>
  </div>
);

const getDisplayName = (user) =>
  user?.name || user?.username || user?.email?.split("@")[0] || "Account";

const getInitials = (name) =>
  name.split(" ").map(part => part[0]).join("").toUpperCase().slice(0, 2);

// ✅ CHANGED: removed { theme, setTheme } props — now using useTheme()
const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // ✅ ADDED

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isDark = theme === "dark";
  const displayName = getDisplayName(user);
  const firstName = displayName.split(" ")[0];

  // Theme colors
  const tv = isDark ? {
    bg: "rgba(8,8,16,0.88)",
    border: "rgba(255,255,255,0.07)",
    fg: "#f0eeff",
    fg2: "#9490b8",
    fg3: "#4e4a6e",
    acc1: "#7c5aff",
    acc2: "#ff6b35",
    card: "rgba(255,255,255,0.06)",
    linkHoverBg: "rgba(124,90,255,0.12)",
    linkActiveBg: "rgba(124,90,255,0.16)",
    mobileBg: "rgba(10,10,20,0.97)",
  } : {
    bg: "rgba(250,247,240,0.92)",
    border: "rgba(180,140,90,0.16)",
    fg: "#1a1208",
    fg2: "#6b5740",
    fg3: "#b09c88",
    acc1: "#c2560a",
    acc2: "#d4821e",
    card: "rgba(255,255,255,0.7)",
    linkHoverBg: "rgba(194,86,10,0.08)",
    linkActiveBg: "rgba(194,86,10,0.14)",
    mobileBg: "rgba(250,247,240,0.98)",
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/auth/marketplace", label: "Marketplace", icon: ShoppingBag, badge: "New" },
    { path: "/auth/events", label: "Events", icon: Calendar },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

        .ev-nav-link-item {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 13px; border-radius: 9px;
          font-size: 13.5px; font-weight: 500;
          text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.18s ease;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
          color: ${tv.fg2};
        }
        .ev-nav-link-item:hover {
          background: ${tv.linkHoverBg};
          color: ${tv.acc1};
          border-color: ${tv.acc1}30;
        }
        .ev-nav-link-active {
          background: ${tv.linkActiveBg} !important;
          color: ${tv.acc1} !important;
          border-color: ${tv.acc1}40 !important;
          font-weight: 600 !important;
        }
        .ev-nav-badge {
          display: inline-flex; align-items: center; justify-content: center;
          background: ${tv.acc2}; color: #fff;
          font-size: 9px; font-weight: 700;
          border-radius: 100px; padding: 1px 6px;
          letter-spacing: 0.3px;
          font-family: 'DM Sans', sans-serif;
        }
        .ev-user-chip-nav {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 14px 5px 6px; border-radius: 100px;
          background: ${tv.card};
          border: 1px solid ${tv.border};
          cursor: pointer; transition: all 0.18s;
          text-decoration: none;
        }
        .ev-user-chip-nav:hover {
          border-color: ${tv.acc1}60;
          background: ${tv.linkHoverBg};
        }
        .ev-nav-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, ${tv.acc1}, ${tv.acc2});
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          flex-shrink: 0; overflow: hidden;
        }
        .ev-nav-avatar-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .ev-logout-nav {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 13px; border-radius: 9px;
          font-size: 13.5px; font-weight: 600;
          color: #e03d4f; cursor: pointer;
          border: 1px solid transparent; transition: all 0.18s;
          background: transparent; font-family: 'DM Sans', sans-serif;
        }
        .ev-logout-nav:hover { background: #fff0f2; border-color: #ffd4d9; }
        .ev-login-btn-nav {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 20px; border-radius: 10px;
          font-size: 13.5px; font-weight: 600; color: #fff !important;
          background: linear-gradient(135deg, ${tv.acc1}, ${tv.acc2});
          border: none; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 3px 12px ${tv.acc1}35;
          font-family: 'DM Sans', sans-serif; text-decoration: none;
        }
        .ev-login-btn-nav:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px ${tv.acc1}45;
        }
        .ev-theme-pill {
          display: flex; align-items: center;
          width: 50px; height: 26px; border-radius: 13px;
          background: ${isDark ? "rgba(124,90,255,0.2)" : "rgba(194,86,10,0.12)"};
          border: 1px solid ${tv.border};
          padding: 2px; cursor: pointer;
          transition: all 0.3s; position: relative;
        }
        .ev-theme-thumb-pill {
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, ${tv.acc1}, ${tv.acc2});
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          transform: translateX(${isDark ? "0px" : "24px"});
          box-shadow: 0 2px 8px ${tv.acc1}50;
        }
        .ev-mob-link {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 12px;
          font-size: 15px; font-weight: 500; color: ${tv.fg2};
          cursor: pointer; transition: all 0.15s;
          text-decoration: none; font-family: 'DM Sans', sans-serif;
        }
        .ev-mob-link:hover, .ev-mob-link-active { background: ${tv.linkHoverBg}; color: ${tv.acc1}; }
        .ev-mob-logout {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 12px;
          font-size: 15px; font-weight: 600; color: #e03d4f;
          cursor: pointer; transition: all 0.15s;
          background: transparent; border: none; width: 100%;
          font-family: 'DM Sans', sans-serif;
        }
        .ev-mob-logout:hover { background: #fff0f2; }
        .ev-nav-sep { width: 1px; height: 20px; background: ${tv.border}; margin: 0 4px; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 28px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: tv.bg,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${tv.border}`,
        boxShadow: isDark
          ? "0 1px 32px rgba(0,0,0,0.4)"
          : "0 1px 24px rgba(180,140,90,0.1)",
        transition: "all 0.3s ease",
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <LogoMark accent={tv.acc1} />
          <div>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 19, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1,
              color: tv.fg,
            }}>
              Edu<span style={{ color: tv.acc1 }}>Verse</span>
            </div>
            <div style={{ fontSize: 8.5, color: tv.fg3, letterSpacing: "2.5px", fontWeight: 600, textTransform: "uppercase", marginTop: 2 }}>
              Learn · Grow · Thrive
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="ev-desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`ev-nav-link-item ${isActive(link.path) ? "ev-nav-link-active" : ""}`}
            >
              {link.icon && <link.icon size={14} />}
              {link.label}
              {link.badge && <span className="ev-nav-badge">{link.badge}</span>}
            </Link>
          ))}

          <div className="ev-nav-sep" />

          {/* ✅ toggleTheme directly from useTheme — no local function needed */}
          <button className="ev-theme-pill" onClick={toggleTheme} title={isDark ? "Switch to Light" : "Switch to Dark"}>
            <div className="ev-theme-thumb-pill">{isDark ? "🌙" : "☀️"}</div>
          </button>

          <div className="ev-nav-sep" />

          {user ? (
            <>
              <Link
                to={user.isAdmin ? "/auth/admin" : "/auth/myprofile"}
                className="ev-user-chip-nav"
              >
                <div className="ev-nav-avatar" style={{ background: user.isAdmin ? "linear-gradient(135deg,#ff4d6d,#ff8c42)" : `linear-gradient(135deg,${tv.acc1},${tv.acc2})` }}>
                  {user.avatar
                    ? <img className="ev-nav-avatar-img" src={user.avatar} alt={displayName} />
                    : user.isAdmin ? "A" : getInitials(displayName)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: tv.fg, fontFamily: "'DM Sans',sans-serif" }}>
                  {user.isAdmin ? "Admin" : `Hi, ${firstName}`}
                </span>
                {user.isAdmin && <span className="ev-nav-badge" style={{ background: tv.acc1 }}>PRO</span>}
              </Link>
              <button className="ev-logout-nav" onClick={handleLogout}>
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: tv.fg, textDecoration: "none", border: `1px solid ${tv.border}`, background: tv.card, transition: "all 0.18s", fontFamily: "'DM Sans',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${tv.acc1}60`; e.currentTarget.style.color = tv.acc1; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = tv.border; e.currentTarget.style.color = tv.fg; }}
              >
                Log in
              </Link>
              <Link to="/register" className="ev-login-btn-nav">
                Sign up
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M6.5 2l4.5 4.5-4.5 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="ev-mobile-controls">
          <button className="ev-theme-pill" onClick={toggleTheme}>
            <div className="ev-theme-thumb-pill">{isDark ? "🌙" : "☀️"}</div>
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ padding: "8px", borderRadius: 10, background: tv.card, border: `1px solid ${tv.border}`, cursor: "pointer", color: tv.fg }}
            className="ev-hamburger"
          >
            {isOpen ? <X size={20} color={tv.fg} /> : <Menu size={20} color={tv.fg} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {isOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 999,
          background: tv.mobileBg,
          borderBottom: `1px solid ${tv.border}`,
          backdropFilter: "blur(24px)",
          padding: "12px 16px 16px",
          display: "flex", flexDirection: "column", gap: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`ev-mob-link ${isActive(link.path) ? "ev-mob-link-active" : ""}`}
            >
              {link.icon && <link.icon size={17} />}
              {link.label}
              {link.badge && <span className="ev-nav-badge">{link.badge}</span>}
            </Link>
          ))}
          <div style={{ height: 1, background: tv.border, margin: "6px 0" }} />
          {user ? (
            <>
              <Link to={user.isAdmin ? "/auth/admin" : "/auth/myprofile"} onClick={() => setIsOpen(false)} className="ev-mob-link">
                <div className="ev-nav-avatar" style={{ width: 30, height: 30, fontSize: 12 }}>
                  {user.avatar
                    ? <img className="ev-nav-avatar-img" src={user.avatar} alt={displayName} />
                    : user.isAdmin ? "A" : getInitials(displayName)}
                </div>
                {user.isAdmin ? "Admin Dashboard" : `My Profile (${firstName})`}
              </Link>
              <button className="ev-mob-logout" onClick={handleLogout}><LogOut size={17} />Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="ev-mob-link" style={{ color: tv.acc1, fontWeight: 600 }}>
              <User size={17} />Login / Sign Up
            </Link>
          )}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .ev-desktop-nav { display: none !important; }
          .ev-mobile-controls button { display: flex !important; }
        }
        @media (min-width: 769px) {
          .ev-mobile-controls { display: none !important; }
        }
      `}</style>

      <div style={{ height: 64 }} />
    </>
  );
};

export default Navbar;
