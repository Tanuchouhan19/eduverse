import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import EventCard from "../components/EventCard.jsx";
import Footer from "../components/Footer.jsx";
import { getProducts } from "../features/products/productSlice";
import { getEvents } from "../features/events/eventsSlice";
import { useTheme } from "../context/ThemeContext";

// ── Typewriter ──────────────────────────────────────────────────────────────
const WORDS = [
  "Student Hustle",
  "Campus Dreams",
  "Side Hustle",
  "Exam Season",
  "College Life",
  "Your Future",
];

function useTypewriter() {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = WORDS[wordIdx];
    let t;
    if (!deleting) {
      if (charIdx < word.length)
        t = setTimeout(() => setCharIdx((c) => c + 1), 88);
      else t = setTimeout(() => setDeleting(true), 2000);
    } else {
      if (charIdx > 0) t = setTimeout(() => setCharIdx((c) => c - 1), 48);
      else {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % WORDS.length);
      }
    }
    setText(WORDS[wordIdx].slice(0, charIdx));
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);
  return text;
}

// ── Counter ────────────────────────────────────────────────────────────────
function useCounter(target, suffix = "+", duration = 1600, trigger = false) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      const current = Math.floor(ease * target);
      setDisplay(p < 1 ? current.toString() : target + suffix);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, suffix, duration]);
  return display;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const TICKER = [
  {
    type: "hot",
    text: "iPhone 14 Pro listed for ₹72,000 — 3 students interested!",
    time: "2m ago",
  },
  {
    type: "event",
    text: "Coding Marathon at SGSITS — registrations close tonight!",
    time: "15m ago",
  },
  {
    type: "new",
    text: "Study desk + chair set — perfect hostel combo at ₹4,500",
    time: "28m ago",
  },
  {
    type: "hot",
    text: "GATE 2025 study materials — full package for ₹599 only!",
    time: "44m ago",
  },
  {
    type: "event",
    text: "TechFest 2025 @ IIT Indore — Early bird passes live now!",
    time: "1h ago",
  },
];

const MARQUEE_ITEMS = [
  { tag: "🔥 Trending", text: "MacBook Pro M2 — ₹65,000" },
  { tag: "🎉 Event", text: "TechFest 2025 — IIT Indore" },
  { tag: "📚 Books", text: "JEE Advanced PYQs — ₹299" },
  { tag: "🎵 Night", text: "Fresher's Night — This Saturday" },
  { tag: "💻 Sell", text: "Dell XPS 15 — ₹55,000" },
  { tag: "🏆 Hack", text: "Smart India Hackathon — Register Now" },
  { tag: "🎒 Buy", text: "Casio Scientific Calc — ₹450" },
  { tag: "🎤 Live", text: "DJ Night — NIT Bhopal Campus" },
];

// ── Theme tokens ──────────────────────────────────────────────────────────────
const T = {
  dark: {
    bg: "#080810",
    bgAlt: "#0d0d1a",
    bgCard: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    borderHov: "rgba(160,130,255,0.45)",
    fg: "#f0eeff",
    fg2: "#9490b8",
    fg3: "#4e4a6e",
    acc1: "#7c5aff",
    acc2: "#ff6b35",
    acc3: "#00c9a7",
    tagBg: "rgba(124,90,255,0.14)",
    tagFg: "#a07cff",
    statGrad: "linear-gradient(135deg,#a07cff,#00c9a7)",
    btnShadow: "0 8px 32px rgba(124,90,255,0.38)",
    scrollbarThumb: "#7c5aff44",
    statFg: "#a07cff",
  },
  light: {
    bg: "#faf7f0",
    bgAlt: "#f3ede3",
    bgCard: "rgba(255,255,255,0.78)",
    border: "rgba(180,140,90,0.2)",
    borderHov: "rgba(180,100,40,0.55)",
    fg: "#1a1208",
    fg2: "#6b5740",
    fg3: "#b09c88",
    acc1: "#c2560a",
    acc2: "#d4821e",
    acc3: "#0e7c5e",
    tagBg: "rgba(194,86,10,0.1)",
    tagFg: "#c2560a",
    statGrad: "linear-gradient(135deg,#c2560a,#0e7c5e)",
    btnShadow: "0 8px 32px rgba(194,86,10,0.32)",
    scrollbarThumb: "#c2560a44",
    statFg: "#c2560a",
  },
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Landing = () => {
  const dispatch = useDispatch();
  const twText = useTypewriter();

  // ✅ FIX 1: Correct field names matching productSlice initialState
  const { allProducts, productLoading } = useSelector(
    (state) => state.products,
  );

  // ✅ FIX 2: Correct field names matching eventsSlice initialState
  const { allEvents, eventsLoading } = useSelector((state) => state.events);

  // const [theme, setTheme] = useState("dark");
  const { theme } = useTheme();
  const [statsVisible, setStatsVisible] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const statsRef = useRef(null);

  const tv = T[theme];
  const isDark = theme === "dark";

  const c500 = useCounter(500, "+", 1600, statsVisible);
  const c50 = useCounter(50, "+", 1200, statsVisible);
  const c5000 = useCounter(5000, "+", 2000, statsVisible);
  const c25 = useCounter(25, "+", 1000, statsVisible);

  // ✅ FIX 3: Added [] so this runs only once, not on every render
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getEvents());
  }, []);

  // IntersectionObserver for stats
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.15 },
    );
    const el = statsRef.current;
    if (el) obs.observe(el);
    return () => {
      if (el) obs.unobserve(el);
    };
  }, []);

  // Ticker
  useEffect(() => {
    const t = setInterval(
      () => setTickerIdx((i) => (i + 1) % TICKER.length),
      3500,
    );
    return () => clearInterval(t);
  }, []);

  // ✅ FIX 4: Using allProducts and allEvents (correct redux field names)
  const featuredProducts = Array.isArray(allProducts)
    ? allProducts.slice(0, 4)
    : [];
  const upcomingEvents = Array.isArray(allEvents) ? allEvents.slice(0, 3) : [];

  const FEATURES = [
    {
      icon: "🛍️",
      title: "Buy & Sell Instantly",
      desc: "List in 30 seconds. Electronics, books, bikes — sell to verified students on your campus.",
      color: tv.acc1,
    },
    {
      icon: "💰",
      title: "Turn Clutter into Cash",
      desc: "That old textbook gathering dust? Someone needs it right now. Earn real ₹₹₹.",
      color: tv.acc2,
    },
    {
      icon: "⚡",
      title: "Never Miss Events",
      desc: "Fests, hackathons, workshops, parties — stay locked in. RSVP, comment, connect.",
      color: tv.acc3,
    },
    {
      icon: "🔒",
      title: "Safe Campus Trades",
      desc: "Buy and sell only with verified students from your college. Zero strangers, zero scams.",
      color: tv.acc1,
    },
    {
      icon: "🌐",
      title: "Multi-Campus Network",
      desc: "Connected across 25+ colleges. Your reach isn't just your hostel floor.",
      color: tv.acc2,
    },
    {
      icon: "💬",
      title: "Real-time Chat",
      desc: "DM sellers directly, negotiate prices, and close deals — all inside EduVerse.",
      color: tv.acc3,
    },
  ];

  const STATS = [
    { val: c500, label: "Active Listings", icon: "📦" },
    { val: c50, label: "Events Monthly", icon: "🎉" },
    { val: c5000, label: "Students", icon: "🎓" },
    { val: c25, label: "Colleges", icon: "🏛️" },
  ];

  return (
    <div
      style={{
        background: tv.bg,
        color: tv.fg,
        minHeight: "100vh",
        overflowX: "hidden",
        transition: "background 0.4s, color 0.3s",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Navbar/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800;12..96,900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        @keyframes cursorBlink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        .ev-cursor { display:inline-block;width:2.5px;height:0.88em;background:${tv.acc3};margin-left:3px;border-radius:2px;vertical-align:middle;animation:cursorBlink 0.8s step-end infinite; }
        @keyframes orbFloat1 { 0%,100%{transform:translate(0,0);} 40%{transform:translate(28px,-22px);} 75%{transform:translate(-14px,20px);} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0,0);} 35%{transform:translate(-24px,28px);} 70%{transform:translate(18px,-14px);} }
        @keyframes orbFloat3 { 0%,100%{transform:translate(-50%,-50%) scale(1);} 50%{transform:translate(-50%,-50%) scale(1.1);} }
        @keyframes marqueeRun { from{transform:translateX(0);} to{transform:translateX(-50%);} }
        .ev-marquee-track { display:flex;width:max-content;animation:marqueeRun 34s linear infinite; }
        .ev-marquee-track:hover { animation-play-state:paused; }
        @keyframes slideUp { from{opacity:0;transform:translateY(26px);} to{opacity:1;transform:translateY(0);} }
        .ev-reveal { opacity:0;animation:slideUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ev-d1{animation-delay:0.08s;} .ev-d2{animation-delay:0.2s;} .ev-d3{animation-delay:0.32s;} .ev-d4{animation-delay:0.44s;} .ev-d5{animation-delay:0.56s;}
        .ev-grad  { background:linear-gradient(108deg,${tv.acc1},${tv.acc2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .ev-grad2 { background:linear-gradient(108deg,${tv.acc2},${tv.acc3});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .ev-stat-num { font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(26px,3.5vw,42px);font-weight:900;letter-spacing:-1px;line-height:1;color:${tv.statFg};background:${tv.statGrad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .ev-btn-primary { display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:12px;font-size:14.5px;font-weight:600;color:#fff !important;background:linear-gradient(135deg,${tv.acc1},${tv.acc2});border:none;cursor:pointer;text-decoration:none;transition:all 0.25s;box-shadow:${tv.btnShadow};font-family:'DM Sans',sans-serif; }
        .ev-btn-primary:hover { transform:translateY(-3px);box-shadow:0 14px 40px ${tv.acc1}55; }
        .ev-btn-outline { display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:12px;font-size:14.5px;font-weight:600;color:${tv.fg} !important;background:${tv.bgCard};border:1px solid ${tv.border};cursor:pointer;text-decoration:none;transition:all 0.25s;font-family:'DM Sans',sans-serif;backdrop-filter:blur(8px); }
        .ev-btn-outline:hover { border-color:${tv.acc1};color:${tv.acc1} !important;background:${tv.acc1}14;transform:translateY(-2px); }
        .ev-feat { padding:30px;border-radius:20px;background:${tv.bgCard};border:1px solid ${tv.border};transition:all 0.3s cubic-bezier(0.22,1,0.36,1);cursor:default;position:relative;overflow:hidden;backdrop-filter:blur(12px); }
        .ev-feat:hover { transform:translateY(-6px);border-color:${tv.borderHov};box-shadow:0 24px 60px ${isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)"}; }
        .ev-ticker-item { position:absolute;inset:0;display:flex;align-items:center;gap:12px;padding:0 24px;transition:opacity 0.5s ease,transform 0.5s ease; }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.55;transform:scale(0.85);} }
        .ev-live-dot { width:8px;height:8px;border-radius:50%;background:${tv.acc2};display:inline-block;animation:livePulse 1.4s ease-in-out infinite; }
        @keyframes progressFill { from{width:0%;} to{width:100%;} }
        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${tv.scrollbarThumb};border-radius:4px;}
        h1,h2,h3 { font-family:'Bricolage Grotesque',sans-serif; }
        @media(max-width:768px){ .ev-hero-title{ font-size:clamp(36px,9vw,60px) !important; } .ev-stat-row{ flex-direction:column; } .ev-hide-mob{ display:none !important; } }
      `}</style>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "5px 24px 80px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 680,
              height: 680,
              borderRadius: "50%",
              background: `radial-gradient(circle,${tv.acc1}25,transparent 65%)`,
              filter: "blur(80px)",
              top: "4%",
              left: "-16%",
              animation: "orbFloat1 13s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 580,
              height: 580,
              borderRadius: "50%",
              background: `radial-gradient(circle,${tv.acc2}1e,transparent 65%)`,
              filter: "blur(80px)",
              bottom: "-4%",
              right: "-12%",
              animation: "orbFloat2 16s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background: `radial-gradient(circle,${tv.acc3}18,transparent 65%)`,
              filter: "blur(60px)",
              top: "44%",
              left: "46%",
              animation: "orbFloat3 11s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(${tv.border} 1px,transparent 1px),linear-gradient(90deg,${tv.border} 1px,transparent 1px)`,
              backgroundSize: "56px 56px",
              opacity: 0.4,
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 960,
            width: "100%",
          }}
        >
          <div
            className="ev-reveal ev-d1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              background: `${tv.acc1}18`,
              border: `1px solid ${tv.acc1}40`,
              borderRadius: 100,
              marginBottom: 28,
              fontSize: 12.5,
              fontWeight: 600,
              color: tv.acc1,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: tv.acc1,
                display: "inline-block",
                animation: "livePulse 1.5s infinite",
              }}
            />
            Campus Life, Elevated — EduVerse 2025
            <span
              style={{
                padding: "1px 8px",
                background: tv.acc1,
                color: "white",
                borderRadius: 50,
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              NEW
            </span>
          </div>

          <h1
            className="ev-reveal ev-d2 ev-hero-title"
            style={{
              fontSize: "clamp(46px,7.5vw,88px)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-3px",
              marginBottom: 28,
            }}
          >
            <span style={{ display: "block", marginBottom: 8 }}>
              Your Campus,
            </span>
            <span
              className="ev-grad"
              style={{ display: "block", marginBottom: 8 }}
            >
              Supercharged
            </span>
            <span style={{ display: "block", marginBottom: 8 }}>for the</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: tv.bgCard,
                border: `1.5px solid ${tv.border}`,
                borderRadius: 14,
                padding: "6px 22px",
                backdropFilter: "blur(16px)",
                minWidth: 340,
                minHeight: 86,
              }}
            >
              <em style={{ color: tv.acc3, fontStyle: "normal" }}>{twText}</em>
              <span className="ev-cursor" />
            </span>
          </h1>

          <p
            className="ev-reveal ev-d3"
            style={{
              fontSize: "clamp(15px,1.8vw,18.5px)",
              color: tv.fg2,
              maxWidth: 530,
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            Buy, sell, discover events — EduVerse is the{" "}
            <strong style={{ color: tv.fg, fontWeight: 600 }}>
              ultimate platform
            </strong>{" "}
            built by students, for students. Stop missing out.
          </p>

          <div
            className="ev-reveal ev-d4"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginBottom: 64,
            }}
          >
            <Link
              to="/auth/marketplace"
              className="ev-btn-primary"
              style={{ fontSize: 15, padding: "14px 30px" }}
            >
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path
                  d="M2 3h13l-1.5 8H3.5L2 3z"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="6" cy="14.5" r="1" fill="white" />
                <circle cx="12" cy="14.5" r="1" fill="white" />
              </svg>
              Explore Marketplace
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7h9M7 2.5L11.5 7 7 11.5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              to="/auth/events"
              className="ev-btn-outline"
              style={{ fontSize: 15, padding: "14px 30px" }}
            >
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <rect
                  x="2"
                  y="3"
                  width="13"
                  height="12"
                  rx="2.5"
                  stroke={tv.fg}
                  strokeWidth="1.6"
                />
                <path
                  d="M5.5 2v2.5M11.5 2v2.5M2 7.5h13"
                  stroke={tv.fg}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              View Events
            </Link>
          </div>

          <div ref={statsRef} className="ev-reveal ev-d5">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                background: tv.bgCard,
                border: `1px solid ${tv.border}`,
                borderRadius: 20,
                overflow: "hidden",
                backdropFilter: "blur(16px)",
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: "1 1 120px",
                    textAlign: "center",
                    padding: "22px 16px",
                    borderRight:
                      i < STATS.length - 1 ? `1px solid ${tv.border}` : "none",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div className="ev-stat-num">{s.val}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: tv.fg3,
                      fontWeight: 500,
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ═════════════════════════════════════════════════════════ */}
      <div
        style={{
          padding: "22px 0",
          overflow: "hidden",
          borderTop: `1px solid ${tv.border}`,
          borderBottom: `1px solid ${tv.border}`,
          background: tv.bgAlt,
        }}
      >
        <div className="ev-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "5px 26px",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  padding: "4px 11px",
                  borderRadius: 100,
                  background: tv.tagBg,
                  color: tv.tagFg,
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                {item.tag}
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: tv.fg2 }}>
                {item.text}
              </span>
              <span
                style={{
                  color: tv.acc1,
                  fontSize: 13,
                  margin: "0 4px",
                  opacity: 0.45,
                }}
              >
                ◆
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ════════════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 24px", background: tv.bgAlt }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 14px",
                borderRadius: 100,
                background: tv.tagBg,
                color: tv.tagFg,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              ✦ Platform Features
            </div>
            <h2
              style={{
                fontSize: "clamp(28px,4vw,52px)",
                fontWeight: 800,
                letterSpacing: "-2px",
                lineHeight: 1,
                marginBottom: 14,
              }}
            >
              Everything Campus.
              <br />
              <span className="ev-grad">One Platform.</span>
            </h2>
            <p
              style={{
                fontSize: 16,
                color: tv.fg2,
                maxWidth: 460,
                margin: "0 auto",
              }}
            >
              Built for the student who wants it all — sell fast, buy smart,
              never miss a moment.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
              gap: 18,
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="ev-feat"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg,transparent,${f.color},transparent)`,
                    opacity: hoveredFeature === i ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    fontSize: 20,
                    transition: "transform 0.3s",
                    transform:
                      hoveredFeature === i
                        ? "scale(1.1) rotate(-4deg)"
                        : "none",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 16.5,
                    fontWeight: 700,
                    marginBottom: 8,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 13.5, color: tv.fg2, lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LIVE TICKER ═════════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: 100,
                  background: tv.tagBg,
                  color: tv.tagFg,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Live Feed
              </div>
              <h2
                style={{
                  fontSize: "clamp(26px,3.8vw,48px)",
                  fontWeight: 800,
                  letterSpacing: "-2px",
                  lineHeight: 1,
                }}
              >
                What's Happening
                <br />
                <span className="ev-grad2">Right Now</span>
              </h2>
            </div>
            <Link
              to="/auth/events"
              className="ev-btn-outline"
              style={{ marginBottom: 6 }}
            >
              See All Events
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7h9M7 2.5L11.5 7 7 11.5"
                  stroke={tv.fg}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          <div
            style={{
              borderRadius: 20,
              background: tv.bgCard,
              border: `1px solid ${tv.border}`,
              overflow: "hidden",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 22px",
                borderBottom: `1px solid ${tv.border}`,
                background: tv.bgAlt,
              }}
            >
              <span className="ev-live-dot" />
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: tv.acc2,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                LIVE
              </span>
              <span style={{ color: tv.border }}>|</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: tv.fg2 }}>
                Campus Updates
              </span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                {["🔥 HOT", "🎯 EVENT", "✨ NEW"].map((label, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "2px 9px",
                      borderRadius: 100,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      background: `${tv.acc1}14`,
                      color: tv.acc1,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{ height: 54, position: "relative", overflow: "hidden" }}
            >
              {TICKER.map((item, i) => {
                const isActive = i === tickerIdx;
                return (
                  <div
                    key={i}
                    className="ev-ticker-item"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : "translateY(16px)",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 9px",
                        borderRadius: 100,
                        fontSize: 10.5,
                        fontWeight: 700,
                        flexShrink: 0,
                        background:
                          item.type === "hot"
                            ? `${tv.acc2}18`
                            : item.type === "event"
                              ? `${tv.acc1}18`
                              : `${tv.acc3}18`,
                        color:
                          item.type === "hot"
                            ? tv.acc2
                            : item.type === "event"
                              ? tv.acc1
                              : tv.acc3,
                      }}
                    >
                      {item.type === "hot"
                        ? "🔥 HOT"
                        : item.type === "event"
                          ? "🎯 EVENT"
                          : "✨ NEW"}
                    </span>
                    <span
                      style={{ fontSize: 13.5, color: tv.fg, fontWeight: 500 }}
                    >
                      {item.text}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: tv.fg3,
                        marginLeft: "auto",
                        flexShrink: 0,
                      }}
                    >
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                height: 2,
                background: tv.border,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                key={tickerIdx}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  background: `linear-gradient(90deg,${tv.acc1},${tv.acc2})`,
                  animation: "progressFill 3.5s linear forwards",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══════════════════════════════════════════════ */}
      <section style={{ padding: "96px 24px", background: tv.bgAlt }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 44,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: 100,
                  background: tv.tagBg,
                  color: tv.tagFg,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Marketplace
              </div>
              <h2
                style={{
                  fontSize: "clamp(24px,3.5vw,42px)",
                  fontWeight: 800,
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                Featured Products
              </h2>
              <p style={{ marginTop: 7, fontSize: 14.5, color: tv.fg2 }}>
                Hot picks from students near you
              </p>
            </div>
            <Link
              to="/auth/marketplace"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: tv.acc1,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              View All{" "}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7h9M7 2.5L11.5 7 7 11.5"
                  stroke={tv.acc1}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          {productLoading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 18,
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 320,
                    borderRadius: 18,
                    background: tv.bgCard,
                    border: `1px solid ${tv.border}`,
                    backdropFilter: "blur(8px)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: 180,
                      background: `linear-gradient(135deg,${tv.acc1}12,${tv.acc2}0a)`,
                    }}
                  />
                  <div style={{ padding: 16 }}>
                    <div
                      style={{
                        height: 12,
                        width: "70%",
                        borderRadius: 6,
                        background: tv.border,
                        marginBottom: 10,
                      }}
                    />
                    <div
                      style={{
                        height: 10,
                        width: "90%",
                        borderRadius: 6,
                        background: tv.border,
                        marginBottom: 6,
                      }}
                    />
                    <div
                      style={{
                        height: 10,
                        width: "60%",
                        borderRadius: 6,
                        background: tv.border,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 18,
              }}
            >
              {featuredProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} theme={theme} /> ))}{" "}</div>
          ) : (
            <p
              style={{ color: tv.fg2, textAlign: "center", padding: "40px 0" }}
            >
              No products found.
            </p>
          )}
        </div>
      </section>

      {/* ══ UPCOMING EVENTS ════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 44,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: 100,
                  background: `${tv.acc3}14`,
                  color: tv.acc3,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Events
              </div>
              <h2
                style={{
                  fontSize: "clamp(24px,3.5vw,42px)",
                  fontWeight: 800,
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                Upcoming Events
              </h2>
              <p style={{ marginTop: 7, fontSize: 14.5, color: tv.fg2 }}>
                Don't miss what's happening on campus
              </p>
            </div>
            <Link
              to="/auth/events"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: tv.acc3,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              View All{" "}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7h9M7 2.5L11.5 7 7 11.5"
                  stroke={tv.acc3}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          {eventsLoading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
                gap: 18,
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 280,
                    borderRadius: 18,
                    background: tv.bgCard,
                    border: `1px solid ${tv.border}`,
                    backdropFilter: "blur(8px)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: 160,
                      background: `linear-gradient(135deg,${tv.acc3}12,${tv.acc1}08)`,
                    }}
                  />
                  <div style={{ padding: 16 }}>
                    <div
                      style={{
                        height: 12,
                        width: "65%",
                        borderRadius: 6,
                        background: tv.border,
                        marginBottom: 10,
                      }}
                    />
                    <div
                      style={{
                        height: 10,
                        width: "80%",
                        borderRadius: 6,
                        background: tv.border,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
                gap: 18,
              }}
            >
              {upcomingEvents.map((e) => (
                <EventCard key={e._id || e.id} event={e} />
              ))}
            </div>
          ) : (
            <p
              style={{ color: tv.fg2, textAlign: "center", padding: "40px 0" }}
            >
              No events found.
            </p>
          )}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 24px", background: tv.bgAlt }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: 100,
              background: tv.tagBg,
              color: tv.tagFg,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            How It Works
          </div>
          <h2
            style={{
              fontSize: "clamp(26px,4vw,48px)",
              fontWeight: 800,
              letterSpacing: "-2px",
              lineHeight: 1,
              marginBottom: 14,
            }}
          >
            Up and running
            <br />
            <span className="ev-grad">in 3 simple steps</span>
          </h2>
          <p
            style={{
              fontSize: 15.5,
              color: tv.fg2,
              maxWidth: 400,
              margin: "0 auto 56px",
            }}
          >
            No complicated onboarding. Just sign up and dive in.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
              gap: 24,
            }}
          >
            {[
              {
                n: "01",
                icon: "🎓",
                title: "Create Account",
                desc: "Sign up with your college email. Get verified in seconds.",
              },
              {
                n: "02",
                icon: "📸",
                title: "List or Browse",
                desc: "Post your item with a photo, or browse what others are selling.",
              },
              {
                n: "03",
                icon: "🤝",
                title: "Connect & Trade",
                desc: "Chat directly, meet on campus, close the deal safely.",
              },
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  padding: "32px 24px",
                  borderRadius: 20,
                  background: tv.bgCard,
                  border: `1px solid ${tv.border}`,
                  backdropFilter: "blur(12px)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    fontSize: 60,
                    fontWeight: 900,
                    color: tv.acc1,
                    opacity: 0.07,
                    position: "absolute",
                    top: 10,
                    right: 18,
                    lineHeight: 1,
                  }}
                >
                  {step.n}
                </div>
                <div style={{ fontSize: 30, marginBottom: 14 }}>
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontSize: 16.5,
                    fontWeight: 700,
                    marginBottom: 8,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 13.5, color: tv.fg2, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 24px" }}>
        <div
          style={{
            maxWidth: 840,
            margin: "0 auto",
            padding: "68px 48px",
            borderRadius: 28,
            textAlign: "center",
            background: `linear-gradient(135deg,${tv.acc1}18,${tv.acc2}12,${tv.acc3}0c)`,
            border: `1px solid ${tv.acc1}30`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -90,
              right: -90,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: `radial-gradient(circle,${tv.acc1}22,transparent)`,
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -70,
              left: -70,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: `radial-gradient(circle,${tv.acc3}18,transparent)`,
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ fontSize: 48, marginBottom: 18 }}>🚀</div>
          <h2
            style={{
              fontSize: "clamp(26px,4vw,52px)",
              fontWeight: 900,
              letterSpacing: "-2.5px",
              lineHeight: 0.95,
              marginBottom: 16,
            }}
          >
            Ready to Level Up
            <br />
            Your Campus Life?
          </h2>
          <p
            style={{
              fontSize: 16.5,
              color: tv.fg2,
              maxWidth: 440,
              margin: "0 auto 32px",
              lineHeight: 1.65,
            }}
          >
            Join <strong style={{ color: tv.fg }}>5,000+ students</strong>{" "}
            already buying, selling, and experiencing campus like never before.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/register"
              className="ev-btn-primary"
              style={{ fontSize: 15.5, padding: "15px 34px" }}
            >
              Get Started — It's Free
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M3 7.5h9M7.5 3l4.5 4.5-4.5 4.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              to="/auth/marketplace"
              className="ev-btn-outline"
              style={{ fontSize: 15.5, padding: "15px 28px" }}
            >
              Browse Listings
            </Link>
          </div>
          <p
            style={{
              marginTop: 18,
              fontSize: 12,
              color: tv.fg3,
              letterSpacing: "0.3px",
            }}
          >
            No credit card required · No spam ever · Just campus goodness ✨
          </p>
        </div>
      </section>

      <Footer theme={theme} />
      <style>{`@keyframes shimmerSkel{0%{background-position:200% 0;}100%{background-position:-200% 0;}}`}</style>
    </div>
  );
};

export default Landing;
