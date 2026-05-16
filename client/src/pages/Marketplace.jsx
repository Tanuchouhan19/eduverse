import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/products/productSlice.js";
import { categories } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import { toast } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const T = {
  light: {
    pageBg:       "#F7F2EA",
    surface:      "#FFFFFF",
    surfaceAlt:   "#FDF8F0",
    surfaceCard:  "#FFFCF7",
    border:       "rgba(196,123,26,.16)",
    borderHover:  "rgba(196,123,26,.38)",
    text:         "#1C0F00",           // ← solid, never transparent
    textSec:      "#6B4512",
    textMuted:    "#B08040",
    accent:       "#C47B1A",
    accentDark:   "#9A5E0A",
    accentLight:  "rgba(196,123,26,.10)",
    accentGlow:   "rgba(196,123,26,.22)",
    inputBg:      "rgba(255,255,255,.95)",
    pillActive:   "linear-gradient(135deg,#D4870F 0%,#C47B1A 100%)",
    cardShadow:   "0 2px 12px rgba(160,100,20,.07)",
    cardHover:    "0 12px 36px rgba(160,100,20,.13)",
    heroGrad:     "linear-gradient(140deg,#B86A10 0%,#D9900A 50%,#C47B1A 100%)",
    // hero text is solid white — no gradient clip needed
    heroText:     "#FFFFFF",
    heroTextSub:  "rgba(255,255,255,.82)",
    heroBg:       "linear-gradient(140deg,#C47B1A 0%,#E09828 45%,#C07218 100%)",
    statBg:       "rgba(255,255,255,.70)",
    statBorder:   "rgba(196,123,26,.20)",
    searchShadow: "0 4px 20px rgba(160,100,20,.09)",
    scrollbar:    "#DDB870",
    skeletonA:    "#EEE2CC",
    skeletonB:    "#FBF4E4",
    emptyBorder:  "rgba(196,123,26,.28)",
    tagBg:        "rgba(196,123,26,.10)",
    tagColor:     "#92400E",
    badgeBg:      "rgba(196,123,26,.12)",
    badgeBorder:  "rgba(196,123,26,.30)",
    badgeText:    "#9A5E0A",
    divider:      "rgba(196,123,26,.18)",
    chipResult:   "rgba(196,123,26,.10)",
    chipBorder:   "rgba(196,123,26,.28)",
  },
  dark: {
    pageBg:       "#040C1A",
    surface:      "#071525",
    surfaceAlt:   "#091930",
    surfaceCard:  "#0A1C35",
    border:       "rgba(59,130,246,.14)",
    borderHover:  "rgba(59,130,246,.32)",
    text:         "#E4EFFF",           // ← solid, never transparent
    textSec:      "#6D9DC5",
    textMuted:    "#335570",
    accent:       "#3B82F6",
    accentDark:   "#1D4ED8",
    accentLight:  "rgba(59,130,246,.11)",
    accentGlow:   "rgba(59,130,246,.28)",
    inputBg:      "rgba(7,21,37,.96)",
    pillActive:   "linear-gradient(135deg,#1D4ED8 0%,#3B82F6 100%)",
    cardShadow:   "0 2px 14px rgba(0,0,0,.32)",
    cardHover:    "0 12px 36px rgba(0,0,0,.50)",
    heroGrad:     "linear-gradient(140deg,#1D4ED8 0%,#3B82F6 50%,#60A5FA 100%)",
    heroText:     "#FFFFFF",
    heroTextSub:  "rgba(255,255,255,.76)",
    heroBg:       "linear-gradient(140deg,#1A3A7A 0%,#1D4ED8 45%,#2563EB 100%)",
    statBg:       "rgba(7,21,37,.75)",
    statBorder:   "rgba(59,130,246,.18)",
    searchShadow: "0 4px 20px rgba(0,0,0,.28)",
    scrollbar:    "#1A3560",
    skeletonA:    "#0A1C35",
    skeletonB:    "#0D2140",
    emptyBorder:  "rgba(59,130,246,.22)",
    tagBg:        "rgba(59,130,246,.12)",
    tagColor:     "#93C5FD",
    badgeBg:      "rgba(59,130,246,.12)",
    badgeBorder:  "rgba(59,130,246,.28)",
    badgeText:    "#93C5FD",
    divider:      "rgba(59,130,246,.12)",
    chipResult:   "rgba(59,130,246,.10)",
    chipBorder:   "rgba(59,130,246,.28)",
  },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CAT_ICONS = {
  All:"🏪", Electronics:"⚡", Books:"📚",
  Furniture:"🪑", Stationery:"✏️", Clothing:"👗",
};

const PRICE_RANGES = [
  { value:"all",        label:"All Prices"     },
  { value:"0-5000",     label:"Under ₹5,000"   },
  { value:"5000-15000", label:"₹5k – ₹15k"     },
  { value:"15000-30000",label:"₹15k – ₹30k"    },
  { value:"30000+",     label:"Above ₹30,000"  },
];

const SORT_OPTIONS = [
  { value:"newest",   label:"Newest First"       },
  { value:"default",  label:"Default"            },
  { value:"low-high", label:"Price: Low → High"  },
  { value:"high-low", label:"Price: High → Low"  },
];

// ─── TINY SVG ICON ────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display:"block", flexShrink:0 }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS = {
  search:  ["M11 4a7 7 0 1 0 0 14A7 7 0 0 0 11 4z","M21 21l-4.35-4.35"],
  filter:  ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"],
  chevron: ["M6 9l6 6 6-6"],
  spark:   ["M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17.3l-6.2 4.2L8.2 13.9 2 9.4h7.6L12 2z"],
  trending:["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"],
  package: ["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z","M3.27 6.96L12 12.01l8.73-5.05","M12 22.08V12"],
  x:       ["M18 6L6 18","M6 6l12 12"],
  grid:    ["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"],
  tag:     ["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z","M7 7h.01"],
};

// ─── SKELETON ─────────────────────────────────────────────────────────────────
const SkeletonCard = ({ th }) => (
  <div style={{
    borderRadius: 20, overflow: "hidden",
    border: `1px solid ${th.border}`,
    background: th.surfaceCard,
    boxShadow: th.cardShadow,
  }}>
    <div style={{
      height: 200,
      background: `linear-gradient(90deg,${th.skeletonA} 25%,${th.skeletonB} 50%,${th.skeletonA} 75%)`,
      backgroundSize: "600px 100%", animation: "mkt-shimmer 1.4s ease-in-out infinite",
    }} />
    <div style={{ padding: "16px 18px" }}>
      {[[70, 14],[90, 10],[50, 10]].map(([w, h], i) => (
        <div key={i} style={{
          height: h, width: `${w}%`, borderRadius: 8,
          marginBottom: i < 2 ? 10 : 16,
          background: `linear-gradient(90deg,${th.skeletonA} 25%,${th.skeletonB} 50%,${th.skeletonA} 75%)`,
          backgroundSize: "600px 100%", animation: "mkt-shimmer 1.4s ease-in-out infinite",
        }} />
      ))}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[[35, 22],[30, 34]].map(([w, h], i) => (
          <div key={i} style={{
            height: h, width: `${w}%`, borderRadius: i === 1 ? 99 : 8,
            background: `linear-gradient(90deg,${th.skeletonA} 25%,${th.skeletonB} 50%,${th.skeletonA} 75%)`,
            backgroundSize: "600px 100%", animation: "mkt-shimmer 1.4s ease-in-out infinite",
          }} />
        ))}
      </div>
    </div>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const Marketplace = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const th = isDark ? T.dark : T.light;

  const { allProducts = [], productLoading, productError, productErrorMessage } =
    useSelector(s => s.products);
  const dispatch = useDispatch();

  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("All");
  const [price,       setPrice]       = useState("all");
  const [sort,        setSort]        = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { dispatch(getProducts()); }, []);
  useEffect(() => {
    if (productError && productErrorMessage) toast.error(productErrorMessage);
  }, [productError, productErrorMessage]);

  const filtered = useMemo(() => {
    let list = (allProducts || []).filter(p => {
      const q = search.toLowerCase();
      if (q && !p?.title?.toLowerCase().includes(q)) return false;
      if (category !== "All" && p.category !== category) return false;
      const v = p.prize || 0;
      if (price === "0-5000"      && v >= 5000)              return false;
      if (price === "5000-15000"  && (v < 5000 || v >= 15000)) return false;
      if (price === "15000-30000" && (v < 15000 || v >= 30000)) return false;
      if (price === "30000+"      && v < 30000)              return false;
      return true;
    });
    if (sort === "low-high") list = [...list].sort((a, b) => (a.prize || 0) - (b.prize || 0));
    if (sort === "high-low") list = [...list].sort((a, b) => (b.prize || 0) - (a.prize || 0));
    if (sort === "newest")   list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  }, [allProducts, search, category, price, sort]);

  const hasActiveFilter = search || category !== "All" || price !== "all" || sort !== "newest";
  const clearAll = useCallback(() => {
    setSearch(""); setCategory("All"); setPrice("all"); setSort("newest");
  }, []);

  // ── Global styles (theme-aware, injected once per render) ──────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

    @keyframes mkt-shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    @keyframes mkt-fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes mkt-pulse {
      0%,100% { opacity: .5; transform: scale(1);    }
      50%      { opacity: .8; transform: scale(1.06); }
    }
    @keyframes mkt-drift {
      0%,100% { transform: translate(0, 0)   rotate(0deg); }
      33%      { transform: translate(8px, -12px) rotate(3deg);  }
      66%      { transform: translate(-6px, 10px)  rotate(-2deg); }
    }

    /* ── Reset */
    .mkt-root *, .mkt-root *::before, .mkt-root *::after {
      box-sizing: border-box; margin: 0; padding: 0;
    }
    .mkt-root { font-family: 'Outfit', sans-serif; }

    /* ── Global text color guard: prevent -webkit-text-fill-color leaking */
    .mkt-root { -webkit-text-fill-color: unset !important; }
    .mkt-root h1, .mkt-root h2, .mkt-root h3,
    .mkt-root p, .mkt-root span, .mkt-root label,
    .mkt-root div, .mkt-root button, .mkt-root select,
    .mkt-root input {
      -webkit-text-fill-color: inherit;
    }

    /* ── Scrollbar */
    .mkt-root ::-webkit-scrollbar       { width: 5px; height: 5px; }
    .mkt-root ::-webkit-scrollbar-track { background: transparent; }
    .mkt-root ::-webkit-scrollbar-thumb { background: ${th.scrollbar}; border-radius: 8px; }

    /* ── Search input */
    .mkt-search {
      width: 100%; padding: 15px 20px 15px 52px;
      border-radius: 18px;
      border: 1.5px solid ${th.border};
      background: ${th.inputBg};
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      color: ${th.text};
      -webkit-text-fill-color: ${th.text};
      outline: none;
      box-shadow: ${th.searchShadow};
      transition: border .25s, box-shadow .25s;
      backdrop-filter: blur(12px);
    }
    .mkt-search::placeholder {
      color: ${th.textMuted};
      -webkit-text-fill-color: ${th.textMuted};
    }
    .mkt-search:focus {
      border-color: ${th.accent};
      box-shadow: 0 0 0 4px ${th.accentLight}, ${th.searchShadow};
    }

    /* ── Select */
    .mkt-select {
      width: 100%; padding: 11px 38px 11px 14px;
      border-radius: 14px;
      border: 1.5px solid ${th.border};
      background: ${th.inputBg};
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      color: ${th.textSec};
      -webkit-text-fill-color: ${th.textSec};
      appearance: none; cursor: pointer; outline: none;
      transition: border .2s, box-shadow .2s;
      backdrop-filter: blur(8px);
    }
    .mkt-select:focus {
      border-color: ${th.accent};
      box-shadow: 0 0 0 3px ${th.accentLight};
    }

    /* ── Category pill */
    .cat-pill {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 9px 18px; border-radius: 99px;
      font-family: 'Outfit', sans-serif;
      font-size: 13px; font-weight: 500; cursor: pointer;
      border: 1.5px solid ${th.border};
      background: ${th.surface};
      color: ${th.textSec};
      -webkit-text-fill-color: ${th.textSec};
      white-space: nowrap;
      transition: all .22s cubic-bezier(.34,1.56,.64,1);
      outline: none;
    }
    .cat-pill:hover {
      border-color: ${th.borderHover};
      color: ${th.text};
      -webkit-text-fill-color: ${th.text};
      transform: translateY(-2px);
      box-shadow: 0 6px 18px ${th.accentGlow};
    }
    .cat-pill.active {
      background: ${th.pillActive};
      border-color: transparent;
      color: #fff;
      -webkit-text-fill-color: #fff;
      box-shadow: 0 6px 20px ${th.accentGlow};
      transform: translateY(-2px);
    }

    /* ── Product grid stagger */
    .mkt-grid > * { animation: mkt-fadeUp .45s ease both; }
    ${[...Array(8)].map((_, i) => `.mkt-grid > *:nth-child(${i + 1}){animation-delay:${i * 0.055}s}`).join("\n")}

    /* ── Stat chip */
    .mkt-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px ${th.accentGlow}; }

    /* ── Hero shine */
    .hero-banner::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(105deg,rgba(255,255,255,.12) 0%,transparent 55%);
      border-radius: inherit;
      pointer-events: none;
    }

    /* ── Filter panel animation */
    .filter-panel {
      overflow: hidden;
      transition: max-height .32s cubic-bezier(.4,0,.2,1), opacity .28s;
    }
    .filter-panel.open   { max-height: 280px; opacity: 1; }
    .filter-panel.closed { max-height: 0;     opacity: 0; }
  `;

  // ── Background blobs ────────────────────────────────────────────────────────
  const blobs = isDark
    ? [
        { x: "5%",  y: "8%",  w: "500px", h: "400px", c: "rgba(29,78,216,.10)"  },
        { x: "72%", y: "2%",  w: "420px", h: "360px", c: "rgba(99,102,241,.08)" },
        { x: "42%", y: "78%", w: "480px", h: "360px", c: "rgba(59,130,246,.07)" },
      ]
    : [
        { x: "4%",  y: "6%",  w: "520px", h: "420px", c: "rgba(251,191,36,.14)" },
        { x: "68%", y: "0%",  w: "460px", h: "380px", c: "rgba(245,158,11,.11)" },
        { x: "38%", y: "74%", w: "500px", h: "380px", c: "rgba(196,123,26,.09)" },
      ];

  const selectWrap = (child) => (
    <div style={{ position: "relative" }}>
      {child}
      <div style={{
        position: "absolute", right: 12, top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none",
      }}>
        <Ico d={ICONS.chevron} size={14} color={th.accent} />
      </div>
    </div>
  );

  return (
    <div className="mkt-root" style={{
      minHeight: "100vh",
      background: th.pageBg,
      overflowX: "hidden",
      position: "relative",
      // ← critical: reset -webkit-text-fill-color at root level
      WebkitTextFillColor: th.text,
      color: th.text,
    }}>
      <style>{css}</style>

      {/* ── BACKGROUND BLOBS ──────────────────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {blobs.map((b, i) => (
          <div key={i} style={{
            position: "absolute", left: b.x, top: b.y,
            width: b.w, height: b.h,
            background: `radial-gradient(ellipse at center,${b.c},transparent 70%)`,
            filter: "blur(48px)",
            animation: `mkt-drift ${16 + i * 5}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "0 24px 100px" }}>

        {/* ══════════════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════════════ */}
        <div style={{ paddingTop: 52, paddingBottom: 40, textAlign: "center" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 20px", borderRadius: 99, marginBottom: 22,
            background: th.badgeBg,
            border: `1px solid ${th.badgeBorder}`,
            color: th.badgeText,
            WebkitTextFillColor: th.badgeText,   // ← explicit
            fontSize: 11, fontWeight: 600,
            letterSpacing: ".12em", textTransform: "uppercase",
          }}>
            <Ico d={ICONS.spark} size={11} color={th.accent} />
            Student Marketplace
          </div>

          {/* ── HERO BANNER CARD ─────────────────────────────────────── */}
          <div className="hero-banner" style={{
            position: "relative",
            background: th.heroBg,
            borderRadius: 28,
            padding: "48px 36px 44px",
            marginBottom: 28,
            boxShadow: `0 20px 60px ${th.accentGlow}, 0 4px 16px rgba(0,0,0,.12)`,
            overflow: "hidden",
          }}>
            {/* Decorative inner glow */}
            <div style={{
              position: "absolute", top: -60, left: "50%",
              transform: "translateX(-50%)",
              width: "70%", height: 180,
              background: "rgba(255,255,255,.10)",
              borderRadius: "50%",
              filter: "blur(40px)",
              pointerEvents: "none",
            }} />

            {/* Dot pattern overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,.07) 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
              pointerEvents: "none",
            }} />

            {/* ── TITLE: solid white text, no gradient-clip trick ── */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-.01em",
              color: th.heroText,
              WebkitTextFillColor: th.heroText,  // ← critical fix
              marginBottom: 10,
              position: "relative", zIndex: 1,
              textShadow: "0 2px 16px rgba(0,0,0,.18)",
            }}>
              EduVerse Bazaar
            </h1>

            <p style={{
              fontSize: 15,
              color: th.heroTextSub,
              WebkitTextFillColor: th.heroTextSub,  // ← critical fix
              fontWeight: 400,
              letterSpacing: ".04em",
              position: "relative", zIndex: 1,
            }}>
              Discover · Buy · Sell — within your campus community
            </p>

            {/* ── STAT CHIPS inside hero ────────────────────────────── */}
            <div style={{
              display: "flex", justifyContent: "center",
              gap: 12, marginTop: 28, flexWrap: "wrap",
              position: "relative", zIndex: 1,
            }}>
              {[
                { icon: ICONS.package, val: allProducts.length, label: "Listings"   },
                { icon: ICONS.trending,val: filtered.length,     label: "Matching"   },
                { icon: ICONS.tag,     val: categories.length,   label: "Categories" },
              ].map((s, i) => (
                <div key={i} className="mkt-stat" style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 22px", borderRadius: 16,
                  background: "rgba(255,255,255,.15)",
                  border: "1px solid rgba(255,255,255,.22)",
                  backdropFilter: "blur(16px)",
                  transition: "transform .2s, box-shadow .2s",
                  cursor: "default",
                }}>
                  <Ico d={s.icon} size={15} color="rgba(255,255,255,.85)" />
                  <div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.35rem", fontWeight: 700,
                      color: "#fff",
                      WebkitTextFillColor: "#fff",  // ← critical fix
                      lineHeight: 1,
                    }}>
                      {s.val}
                    </div>
                    <div style={{
                      fontSize: 10, fontWeight: 500,
                      color: "rgba(255,255,255,.70)",
                      WebkitTextFillColor: "rgba(255,255,255,.70)",
                      textTransform: "uppercase", letterSpacing: ".07em", marginTop: 2,
                    }}>
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 0 28px" }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${th.divider}, transparent)` }} />
          <span style={{ fontSize: 12, letterSpacing: ".16em", color: th.textMuted, WebkitTextFillColor: th.textMuted }}>
            ✦ ✦ ✦
          </span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${th.divider}, transparent)` }} />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SEARCH BAR
        ══════════════════════════════════════════════════════════════ */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <div style={{
            position: "absolute", left: 18, top: "50%",
            transform: "translateY(-50%)", zIndex: 1,
          }}>
            <Ico d={ICONS.search} size={18} color={th.accent} />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for books, laptops, chairs, notes…"
            className="mkt-search"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 16, top: "50%",
                transform: "translateY(-50%)",
                width: 26, height: 26, borderRadius: "50%",
                border: "none", background: th.accentLight,
                color: th.accent, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Ico d={ICONS.x} size={13} color={th.accent} />
            </button>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            FILTER TOGGLE
        ══════════════════════════════════════════════════════════════ */}
        <button
          onClick={() => setShowFilters(p => !p)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", marginBottom: 10,
            borderRadius: 14,
            border: `1.5px solid ${showFilters ? th.accent : th.border}`,
            background: showFilters ? th.accentLight : th.surface,
            color: th.textSec,
            WebkitTextFillColor: th.textSec,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "all .22s",
          }}
        >
          <Ico d={ICONS.filter} size={14} color={th.accent} />
          Filters &amp; Sort
          <span style={{
            display: "inline-flex",
            transition: "transform .3s",
            transform: showFilters ? "rotate(180deg)" : "none",
          }}>
            <Ico d={ICONS.chevron} size={13} color={th.textMuted} />
          </span>
          {hasActiveFilter && (
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: th.accent, marginLeft: 2,
              boxShadow: `0 0 6px ${th.accentGlow}`,
            }} />
          )}
        </button>

        {/* ══════════════════════════════════════════════════════════════
            FILTERS ROW
        ══════════════════════════════════════════════════════════════ */}
        <div className={`filter-panel ${showFilters ? "open" : "closed"}`}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12, marginBottom: 16, paddingBottom: 4,
          }}>
            {selectWrap(
              <select value={category} onChange={e => setCategory(e.target.value)} className="mkt-select">
                {categories.map(c => (
                  <option key={c} value={c}>{CAT_ICONS[c] || "🏷️"} {c}</option>
                ))}
              </select>
            )}
            {selectWrap(
              <select value={price} onChange={e => setPrice(e.target.value)} className="mkt-select">
                {PRICE_RANGES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            )}
            {selectWrap(
              <select value={sort} onChange={e => setSort(e.target.value)} className="mkt-select">
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
            {/* Result count chip */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 16px", borderRadius: 14,
              background: th.chipResult,
              border: `1.5px solid ${th.chipBorder}`,
              fontSize: 13, fontWeight: 600,
              color: th.accent,
              WebkitTextFillColor: th.accent,
            }}>
              <Ico d={ICONS.grid} size={14} color={th.accent} />
              <span>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
              {hasActiveFilter && (
                <button
                  onClick={clearAll}
                  style={{
                    marginLeft: "auto", padding: "3px 12px", borderRadius: 99,
                    border: `1px solid ${th.chipBorder}`,
                    background: "transparent",
                    color: th.accent,
                    WebkitTextFillColor: th.accent,
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "background .18s",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Always-visible result count (when filters closed) */}
        {!showFilters && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 16,
          }}>
            <span style={{
              fontSize: 12, fontWeight: 500,
              color: th.textMuted, WebkitTextFillColor: th.textMuted,
            }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
            {hasActiveFilter && (
              <button
                onClick={clearAll}
                style={{
                  fontSize: 11, fontWeight: 600,
                  color: th.accent, WebkitTextFillColor: th.accent,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  textDecoration: "underline", textUnderlineOffset: 3,
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            CATEGORY PILLS
        ══════════════════════════════════════════════════════════════ */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 32,
          overflowX: "auto", paddingBottom: 4,
          scrollbarWidth: "none",
        }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`cat-pill${category === c ? " active" : ""}`}
            >
              <span>{CAT_ICONS[c] || "🏷️"}</span>
              {c}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION HEADER
        ══════════════════════════════════════════════════════════════ */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24, flexWrap: "wrap", gap: 12,
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.25rem, 3vw, 1.65rem)",
            fontWeight: 700,
            color: th.text,
            WebkitTextFillColor: th.text,   // ← critical fix
            letterSpacing: "-.01em",
          }}>
            {category === "All"
              ? "All Listings"
              : `${CAT_ICONS[category] || ""} ${category}`}
          </h2>
          {search && (
            <span style={{
              fontSize: 12, fontWeight: 500,
              padding: "5px 14px", borderRadius: 99,
              background: th.tagBg,
              border: `1px solid ${th.borderHover}`,
              color: th.tagColor,
              WebkitTextFillColor: th.tagColor,
            }}>
              Results for &ldquo;{search}&rdquo;
            </span>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PRODUCTS GRID
        ══════════════════════════════════════════════════════════════ */}
        {productLoading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 22,
          }}>
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} th={th} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div
            className="mkt-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 22,
            }}
          >
            {filtered.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          /* ── EMPTY STATE ── */
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: th.surface,
            borderRadius: 28,
            border: `1.5px dashed ${th.emptyBorder}`,
            boxShadow: th.cardShadow,
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.6rem", fontWeight: 700,
              color: th.text,
              WebkitTextFillColor: th.text,   // ← critical fix
              marginBottom: 8,
            }}>
              Nothing found
            </h3>
            <p style={{
              color: th.textSec,
              WebkitTextFillColor: th.textSec,
              fontSize: 14, marginBottom: 28,
            }}>
              Try different keywords or adjust your filters
            </p>
            <button
              onClick={clearAll}
              style={{
                padding: "12px 32px", borderRadius: 14, border: "none",
                background: th.pillActive, color: "#fff",
                WebkitTextFillColor: "#fff",
                fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14,
                cursor: "pointer",
                boxShadow: `0 6px 20px ${th.accentGlow}`,
                transition: "opacity .2s, transform .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = ".88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1";   e.currentTarget.style.transform = "none"; }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;