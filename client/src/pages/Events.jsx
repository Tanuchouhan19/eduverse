import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import EventCard from "../components/EventCard.jsx";
import Loader from "../components/Loader.jsx";
import { getEvents } from "../features/events/eventsSlice.js";

const CATEGORIES = ["All", "Workshop", "Hackathon", "Meetup", "Festival", "Concert"];

const STATS = [
  { icon: "🎯", label: "Live Events", key: "live" },
  { icon: "🏘️", label: "Communities", value: "120+" },
  { icon: "⭐", label: "Top Rated",   value: "4.9"  },
];

// ── Floating orbs (CSS animated) ────────────────────────────────────────────────
const ORBS = [
  { size: 320, top: "-80px",  left: "-80px",  dur: "18s", delay: "0s"   },
  { size: 260, top: "30%",    right: "-60px",  dur: "22s", delay: "3s"   },
  { size: 200, bottom: "10%", left: "20%",     dur: "15s", delay: "6s"   },
  { size: 180, top: "60%",    right: "25%",    dur: "20s", delay: "1.5s" },
];

export default function Events() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount]     = useState(6);
  const [mounted, setMounted]               = useState(false);

  const { allEvents, eventLoading, eventsError, eventsErrorMessage } =
    useSelector((s) => s.events);

  useEffect(() => { dispatch(getEvents()); }, [dispatch]);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const filtered =
    activeCategory === "All"
      ? allEvents
      : allEvents?.filter(
          (e) => e.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  // ── Theme classes ──────────────────────────────────────────────────────────────
  const pageBg    = isDark ? "bg-[#07091a]"         : "bg-[#faf6f0]";
  const orbColor  = isDark ? "#6d28d9"               : "#d97706";
  const titleCls  = isDark ? "text-white"             : "text-stone-900";
  const bodyCls   = isDark ? "text-slate-400"         : "text-stone-500";
  const badgeBg   = isDark
    ? "bg-violet-500/10 border-violet-500/20 text-violet-300"
    : "bg-amber-500/10 border-amber-500/20 text-amber-700";
  const statBg    = isDark
    ? "bg-white/[0.04] border-white/[0.07]"
    : "bg-white/80 border-amber-200/40";
  const pillBase  = isDark
    ? "bg-white/[0.05] border-white/[0.08] text-slate-400 hover:bg-white/[0.09] hover:text-white"
    : "bg-white/70 border-amber-200/40 text-stone-500 hover:bg-white hover:text-stone-800";
  const pillActive = isDark
    ? "bg-violet-600/25 border-violet-500/40 text-violet-200 shadow-[0_0_16px_rgba(124,58,237,0.2)]"
    : "bg-amber-500/15 border-amber-400/40 text-amber-700 shadow-[0_4px_16px_rgba(217,119,6,0.15)]";
  const sectionTitleCls = isDark ? "text-white"     : "text-stone-800";
  const trendingBg      = isDark
    ? "bg-white/[0.05] border-white/[0.08] text-slate-300"
    : "bg-white/80 border-amber-200/30 text-stone-600";
  const emptyBg   = isDark
    ? "bg-white/[0.03] border-white/[0.06]"
    : "bg-white/70 border-amber-100";
  const loadBtnCls = isDark
    ? "bg-gradient-to-r from-violet-600 to-cyan-600 hover:shadow-[0_8px_32px_rgba(124,58,237,0.35)]"
    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-[0_8px_32px_rgba(217,119,6,0.3)]";

  // ── Loading / Error ────────────────────────────────────────────────────────────
  if (eventLoading) return <Loader />;

  if (eventsError) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${pageBg}`}>
      <span className="text-5xl">⚠️</span>
      <p className="text-red-400 font-bold text-lg">
        {eventsErrorMessage || "Something went wrong"}
      </p>
    </div>
  );

  return (
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 ${pageBg}`}>

      {/* ── Keyframes ────────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(18px,-22px) scale(1.06); }
          66%      { transform: translate(-14px,14px) scale(0.96); }
        }
        @keyframes heroIn {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(20px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes gradFlow {
          0%,100% { background-position:0% 50%; }
          50%      { background-position:100% 50%; }
        }
        @keyframes badgePop {
          from { opacity:0; transform:scale(0.85) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes videoPan {
          0%   { transform:scale(1.08) translateX(0); }
          50%  { transform:scale(1.12) translateX(-1.5%); }
          100% { transform:scale(1.08) translateX(0); }
        }
        @keyframes scanline {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }

        .grad-title {
          background: linear-gradient(90deg,
            ${isDark ? "#f0ecff,#a78bfa,#22d3ee,#f0ecff" : "#1a1208,#c97c1a,#059669,#1a1208"}
          );
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation: gradFlow 6s ease infinite;
        }
        .card-reveal {
          animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .hero-animate {
          animation: heroIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        .badge-animate {
          animation: badgePop 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        .video-pan {
          animation: videoPan 20s ease-in-out infinite;
        }
        .stat-hover {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .stat-hover:hover {
          transform: translateY(-4px);
        }
      `}</style>

      {/* ── Animated ambient orbs ─────────────────────────────────────────────── */}
      {ORBS.map((o, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            width: o.size, height: o.size,
            top: o.top, left: o.left, right: o.right, bottom: o.bottom,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orbColor}33, transparent 70%)`,
            filter: "blur(60px)",
            animation: `orbFloat ${o.dur} ease-in-out ${o.delay} infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                                    */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-[88vh] flex flex-col items-center justify-center text-center overflow-hidden">

        {/* Video / animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay muted loop playsInline
            className="video-pan absolute inset-0 w-full h-full object-cover opacity-20"
            style={{ filter: isDark ? "hue-rotate(220deg) saturate(0.6)" : "hue-rotate(30deg) saturate(0.5)" }}
          >
            {/* Using a free edu/tech stock video — swap with your own */}
            <source
              src="https://cdn.coverr.co/videos/coverr-a-crowd-cheering-at-a-concert-2209/1080p.mp4"
              type="video/mp4"
            />
          </video>

          {/* Scanline texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.6) 2px, rgba(255,255,255,0.6) 3px)",
              backgroundSize: "100% 4px",
            }}
          />

          {/* Bottom fade */}
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? "from-transparent via-transparent to-[#07091a]" : "from-transparent via-transparent to-[#faf6f0]"}`} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center">

          {/* Badge */}
          <div className={`badge-animate inline-flex items-center gap-2 px-5 py-2.5 rounded-full border backdrop-blur-md mb-10 ${badgeBg}`}>
            <span className="text-sm">✦</span>
            <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ fontFamily: "'DM Sans',sans-serif" }}>
              Premium Event Experiences
            </span>
          </div>

          {/* Title */}
          <h1
            className={`grad-title hero-animate text-center leading-[0.92] mb-7 ${mounted ? "" : "opacity-0"}`}
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 900,
              fontSize: "clamp(52px, 10vw, 100px)",
              letterSpacing: "-3px",
              animationDelay: "0.15s",
            }}
          >
            Discover Events<br />
            <span style={{ fontSize: "0.78em" }}>That Feel Alive</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`hero-animate max-w-xl text-center text-[17px] leading-[1.85] mb-14 ${bodyCls} ${mounted ? "" : "opacity-0"}`}
            style={{ fontFamily: "'DM Sans',sans-serif", animationDelay: "0.25s" }}
          >
            Explore workshops, hackathons, meetups, festivals, concerts
            and unforgettable experiences happening around you.
          </p>

          {/* Stats */}
          <div
            className={`hero-animate flex justify-center gap-4 flex-wrap ${mounted ? "" : "opacity-0"}`}
            style={{ animationDelay: "0.38s" }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`stat-hover min-w-[150px] px-7 py-5 rounded-2xl border backdrop-blur-md text-center ${statBg}`}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className={`text-2xl font-black mb-1 ${sectionTitleCls}`} style={{ fontFamily: "'Syne',sans-serif" }}>
                  {s.key === "live" ? (allEvents?.length ?? 0) : s.value}
                </div>
                <div className={`text-xs font-semibold uppercase tracking-wider ${bodyCls}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${bodyCls}`}>
          <span className="text-xs font-medium tracking-widest uppercase opacity-60" style={{ fontFamily: "'DM Sans',sans-serif" }}>Scroll</span>
          <div className="w-px h-8 bg-current opacity-30 animate-pulse" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* EVENTS SECTION                                                          */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 pb-32">

        {/* Section header */}
        <div className="flex items-end justify-between flex-wrap gap-5 mb-8">
          <div>
            <h2
              className={`font-black leading-tight mb-2 ${sectionTitleCls}`}
              style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px" }}
            >
              Upcoming Events
            </h2>
            <p className={`text-sm leading-relaxed ${bodyCls}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
              Curated experiences for learning, networking and unforgettable moments.
            </p>
          </div>

          <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border backdrop-blur-md animate-pulse ${trendingBg}`}>
            <span>🔥</span>
            <span className="text-sm font-semibold" style={{ fontFamily: "'DM Sans',sans-serif" }}>Trending Now</span>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2.5 flex-wrap mb-10">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                className={`
                  px-5 py-2 rounded-full text-[13px] font-semibold border
                  transition-all duration-200 hover:-translate-y-0.5
                  backdrop-blur-md cursor-pointer
                  ${active ? pillActive : pillBase}
                `}
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {!filtered || filtered.length === 0 ? (
          <div className={`py-28 text-center rounded-3xl border backdrop-blur-md ${emptyBg}`}>
            <div className="text-6xl mb-5 animate-bounce">📅</div>
            <h3 className={`text-3xl font-black mb-3 ${sectionTitleCls}`} style={{ fontFamily: "'Syne',sans-serif" }}>
              No Events Found
            </h3>
            <p className={`text-base ${bodyCls}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
              New experiences will appear here soon.
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
              {filtered.slice(0, visibleCount).map((event, i) => (
                <div
                  key={event._id}
                  className="card-reveal"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>

            {/* Load more */}
            {visibleCount < filtered.length && (
              <div className="text-center mt-14">
                <button
                  onClick={() => setVisibleCount((p) => p + 6)}
                  className={`
                    px-12 py-4 rounded-full text-white text-[15px] font-bold
                    border-none cursor-pointer transition-all duration-300
                    hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.97]
                    ${loadBtnCls}
                  `}
                  style={{ fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.02em" }}
                >
                  Load More Events ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}