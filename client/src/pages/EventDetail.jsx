import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Send, User, MessageCircle, Star, Check } from "lucide-react";
import Loader from "../components/Loader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getEvent } from "../features/events/eventsSlice.js";
import { addComment, getComments } from "../features/Comments/commentsSlice.js";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const T = {
  light: {
    pageBg:        "#FDF8F0",
    glass:         "rgba(255,248,235,0.75)",
    glassHover:    "rgba(255,248,237,0.95)",
    surface:       "#FFFFFF",
    border:        "rgba(200,140,70,0.22)",
    borderHover:   "rgba(200,140,70,0.42)",
    borderFocus:   "#C4751A",
    text:          "#3A1A00",
    textSec:       "#6B3A18",
    textMuted:     "#9A6A45",
    accent:        "#C4751A",
    accentAlt:     "#E07B39",
    accentDeep:    "#B94A1A",
    accentGlow:    "rgba(196,117,26,0.22)",
    accentLight:   "rgba(232,160,69,0.13)",
    accentBorder:  "rgba(232,160,69,0.35)",
    heroOverlay:   "linear-gradient(to bottom,rgba(74,31,0,0.04) 0%,rgba(40,12,0,0.76) 100%)",
    heroBtnBg:     "#4A1F00",
    heroBtnIcon:   "linear-gradient(135deg,#E8A045,#C4751A)",
    heroBtnText:   "rgba(255,230,190,0.9)",
    heroBtnDot:    "rgba(232,160,69,0.6)",
    cardGlow:      "rgba(180,90,20,0.07)",
    cardHoverGlow: "rgba(180,90,20,0.14)",
    inset:         "rgba(255,255,255,0.62)",
    eyebrow:       "#C4751A",
    eyebrowLine:   "linear-gradient(90deg,#E8A045,#C4751A)",
    sectionTitle:  "#4A1F00",
    aboutText:     "#6B3A18",
    chip1Bg:       "rgba(232,160,69,0.14)",
    chip1Icon:     "#C4751A",
    chip2Bg:       "rgba(185,74,26,0.12)",
    chip2Icon:     "#B94A1A",
    chip3Bg:       "rgba(124,58,0,0.10)",
    chip3Icon:     "#7C3A00",
    chipLabel:     "#9A6A45",
    chipVal:       "#3A1A00",
    popupBg:       "#FFFFFF",
    popupTitle:    "#4A1F00",
    popupSub:      "#8A5030",
    inputBg:       "rgba(255,248,235,0.92)",
    inputBorder:   "rgba(200,140,70,0.26)",
    inputText:     "#3A1A00",
    inputPlaceholder:"#C8997A",
    commentBg:     "rgba(255,248,237,0.6)",
    commentBorder: "rgba(220,150,80,0.12)",
    commentHover:  "rgba(255,248,237,0.95)",
    commentName:   "#4A1F00",
    commentTime:   "#9A6A45",
    commentText:   "#6B3A18",
    cntBadgeBg:    "rgba(232,160,69,0.12)",
    cntBadgeBdr:   "rgba(232,160,69,0.32)",
    cntBadgeText:  "#C4751A",
    emptyText:     "#9A6A45",
    btnIdle:       "linear-gradient(135deg,#E07B39,#B94A1A)",
    btnDone:       "linear-gradient(135deg,#27AE60,#1A7A42)",
    btnGlow:       "rgba(185,74,26,0.32)",
    btnDoneGlow:   "rgba(34,120,80,0.28)",
    sendBtn:       "linear-gradient(135deg,#E07B39,#B94A1A)",
    sendGlow:      "rgba(185,74,26,0.30)",
    tagBg:         "rgba(232,160,69,0.18)",
    tagBorder:     "rgba(232,160,69,0.42)",
    tagText:       "#FFD080",
    intCount:      "#9A6A45",
    intNum:        "#C4751A",
    blobA:         "radial-gradient(circle,#F5A623,#E07B39)",
    blobB:         "radial-gradient(circle,#C0521A,#7C3A00)",
    blobC:         "radial-gradient(circle,#FFD080,#E8A045)",
    scrollbar:     "#DDB870",
    notFoundBg:    "rgba(255,248,235,0.92)",
    notFoundTitle: "#4A1F00",
    notFoundSub:   "#9A6A45",
    avatarColors:  [
      "linear-gradient(135deg,#E07B39,#B94A1A)",
      "linear-gradient(135deg,#7C3A00,#4A1F00)",
      "linear-gradient(135deg,#C4751A,#7C3A00)",
      "linear-gradient(135deg,#B94A1A,#7C3A00)",
    ],
  },
  dark: {
    pageBg:        "#040C1A",
    glass:         "rgba(7,21,40,0.80)",
    glassHover:    "rgba(9,26,50,0.95)",
    surface:       "#071525",
    border:        "rgba(59,130,246,0.14)",
    borderHover:   "rgba(59,130,246,0.34)",
    borderFocus:   "#3B82F6",
    text:          "#E4EFFF",
    textSec:       "#8BB8D8",
    textMuted:     "#4A7A9B",
    accent:        "#3B82F6",
    accentAlt:     "#60A5FA",
    accentDeep:    "#1D4ED8",
    accentGlow:    "rgba(59,130,246,0.25)",
    accentLight:   "rgba(59,130,246,0.10)",
    accentBorder:  "rgba(59,130,246,0.32)",
    heroOverlay:   "linear-gradient(to bottom,rgba(4,12,26,0.04) 0%,rgba(4,12,26,0.82) 100%)",
    heroBtnBg:     "#0A1C38",
    heroBtnIcon:   "linear-gradient(135deg,#3B82F6,#1D4ED8)",
    heroBtnText:   "rgba(180,210,255,0.90)",
    heroBtnDot:    "rgba(96,165,250,0.55)",
    cardGlow:      "rgba(30,80,160,0.09)",
    cardHoverGlow: "rgba(30,80,160,0.18)",
    inset:         "rgba(255,255,255,0.04)",
    eyebrow:       "#60A5FA",
    eyebrowLine:   "linear-gradient(90deg,#3B82F6,#60A5FA)",
    sectionTitle:  "#C8DEFF",
    aboutText:     "#8BB8D8",
    chip1Bg:       "rgba(59,130,246,0.13)",
    chip1Icon:     "#60A5FA",
    chip2Bg:       "rgba(99,102,241,0.12)",
    chip2Icon:     "#818CF8",
    chip3Bg:       "rgba(14,165,233,0.11)",
    chip3Icon:     "#38BDF8",
    chipLabel:     "#4A7A9B",
    chipVal:       "#C8DEFF",
    popupBg:       "#071525",
    popupTitle:    "#C8DEFF",
    popupSub:      "#6D9DC5",
    inputBg:       "rgba(7,21,40,0.95)",
    inputBorder:   "rgba(59,130,246,0.20)",
    inputText:     "#E4EFFF",
    inputPlaceholder:"#335570",
    commentBg:     "rgba(9,25,48,0.60)",
    commentBorder: "rgba(59,130,246,0.08)",
    commentHover:  "rgba(9,25,48,0.92)",
    commentName:   "#C8DEFF",
    commentTime:   "#4A7A9B",
    commentText:   "#8BB8D8",
    cntBadgeBg:    "rgba(59,130,246,0.12)",
    cntBadgeBdr:   "rgba(59,130,246,0.28)",
    cntBadgeText:  "#60A5FA",
    emptyText:     "#4A7A9B",
    btnIdle:       "linear-gradient(135deg,#2563EB,#3B82F6)",
    btnDone:       "linear-gradient(135deg,#059669,#10B981)",
    btnGlow:       "rgba(37,99,235,0.35)",
    btnDoneGlow:   "rgba(16,185,129,0.30)",
    sendBtn:       "linear-gradient(135deg,#1D4ED8,#3B82F6)",
    sendGlow:      "rgba(59,130,246,0.32)",
    tagBg:         "rgba(59,130,246,0.15)",
    tagBorder:     "rgba(59,130,246,0.38)",
    tagText:       "#93C5FD",
    intCount:      "#4A7A9B",
    intNum:        "#60A5FA",
    blobA:         "radial-gradient(circle,rgba(37,99,235,0.5),rgba(29,78,216,0.3))",
    blobB:         "radial-gradient(circle,rgba(99,102,241,0.4),rgba(67,56,202,0.2))",
    blobC:         "radial-gradient(circle,rgba(14,165,233,0.35),rgba(2,132,199,0.15))",
    scrollbar:     "#1A3560",
    notFoundBg:    "rgba(7,21,40,0.95)",
    notFoundTitle: "#C8DEFF",
    notFoundSub:   "#4A7A9B",
    avatarColors:  [
      "linear-gradient(135deg,#2563EB,#1D4ED8)",
      "linear-gradient(135deg,#1D4ED8,#1E3A8A)",
      "linear-gradient(135deg,#3B82F6,#2563EB)",
      "linear-gradient(135deg,#6366F1,#4338CA)",
    ],
  },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const EventDetail = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const th = isDark ? T.dark : T.light;

  const { event, eventsLoading } = useSelector((state) => state.events);
  const { allComments: savedComments, commentsLoading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);
  const { eid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isInterested, setIsInterested] = useState(false);
  const [showPopup,    setShowPopup]    = useState(false);
  const [intCount,     setIntCount]     = useState(247);
  const [text,         setText]         = useState("");

  useEffect(() => {
    dispatch(getEvent(eid));
    dispatch(getComments(eid));
  }, [dispatch, eid]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/auth/events");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || commentsLoading) return;
    if (!user) {
      toast.info("Please login to comment", { position: "top-center" });
      navigate("/login", { state: { from: { pathname: `/auth/event/${eid}` } }, replace: true });
      return;
    }
    try {
      await dispatch(addComment({ eid, text: trimmed, username: user.name || "User" })).unwrap();
      setText("");
      dispatch(getComments(eid));
    } catch (err) {
      toast.error(err || "Unable to add comment", { position: "top-center" });
    }
  };

  const handleInterested = () => {
    if (isInterested) return;
    setIsInterested(true);
    setIntCount((c) => c + 1);
    setShowPopup(true);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

  // ── Stylesheet (fully theme-aware) ─────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

    @keyframes ev-fadeIn  { from{opacity:0}             to{opacity:1} }
    @keyframes ev-popIn   { from{transform:scale(.82) translateY(22px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
    @keyframes ev-pulse   { 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.32)} }
    @keyframes ev-drift   { 0%,100%{transform:translate(0,0)} 40%{transform:translate(10px,-14px)} 70%{transform:translate(-8px,10px)} }
    @keyframes ev-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
    @keyframes ev-slideX  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }

    .ev-root *, .ev-root *::before, .ev-root *::after {
      box-sizing:border-box; margin:0; padding:0;
      -webkit-text-fill-color:inherit;
    }
    .ev-root {
      font-family:'Outfit',sans-serif;
      min-height:100vh;
      background:${th.pageBg};
      position:relative; overflow-x:hidden;
      color:${th.text};
      -webkit-text-fill-color:${th.text};
      transition:background .35s, color .35s;
    }

    /* scrollbar */
    .ev-root ::-webkit-scrollbar       { width:5px; height:5px; }
    .ev-root ::-webkit-scrollbar-track { background:transparent; }
    .ev-root ::-webkit-scrollbar-thumb { background:${th.scrollbar}; border-radius:8px; }

    /* ── BLOBS ── */
    .ev-blob {
      position:fixed; border-radius:50%;
      filter:blur(90px); opacity:${isDark ? ".22" : ".18"};
      pointer-events:none; z-index:0;
      animation:ev-drift 20s ease-in-out infinite;
    }

    /* ── CONTENT ── */
    .ev-content {
      position:relative; z-index:2;
      max-width:920px; margin:0 auto;
      padding:36px 24px 96px;
    }

    /* ── BACK BUTTON ── */
    .ev-back { display:inline-flex; align-items:center; border:none; background:none; cursor:pointer; padding:0; margin-bottom:44px; }
    .ev-back-track {
      display:flex; align-items:center;
      background:${th.heroBtnBg};
      border-radius:100px; overflow:hidden;
      box-shadow:0 8px 32px ${th.accentGlow},0 2px 8px rgba(0,0,0,.20),inset 0 1px 0 ${th.inset};
      transition:all .35s cubic-bezier(.34,1.56,.64,1);
    }
    .ev-back:hover .ev-back-track {
      transform:translateY(-3px);
      box-shadow:0 16px 44px ${th.accentGlow},0 4px 12px rgba(0,0,0,.22);
    }
    .ev-back-icon {
      width:48px; height:48px; flex-shrink:0;
      background:${th.heroBtnIcon};
      display:flex; align-items:center; justify-content:center;
    }
    .ev-back-arrow { transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
    .ev-back:hover .ev-back-arrow { transform:translateX(-4px); }
    .ev-back-label {
      padding:0 20px 0 16px;
      font-family:'Outfit',sans-serif;
      font-size:13px; font-weight:700;
      color:${th.heroBtnText};
      -webkit-text-fill-color:${th.heroBtnText};
      letter-spacing:.09em; text-transform:uppercase; white-space:nowrap;
    }
    .ev-back-dot {
      width:6px; height:6px; border-radius:50%;
      background:${th.heroBtnDot}; margin-right:14px;
      animation:ev-pulse 2s ease-in-out infinite;
    }

    /* ── HERO ── */
    .ev-hero {
      position:relative; border-radius:28px; overflow:hidden;
      height:440px; margin-bottom:28px;
      box-shadow:0 28px 72px ${th.accentGlow},0 8px 24px rgba(0,0,0,.18);
    }
    .ev-hero img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 6s ease; }
    .ev-hero:hover img { transform:scale(1.05); }
    .ev-hero-overlay {
      position:absolute; inset:0;
      background:${th.heroOverlay};
    }
    .ev-hero-content {
      position:absolute; bottom:0; left:0; right:0;
      padding:40px 44px; z-index:2;
    }
    .ev-hero-tag {
      display:inline-flex; align-items:center; gap:8px;
      padding:7px 18px; border-radius:100px; margin-bottom:14px;
      background:${th.tagBg}; border:1px solid ${th.tagBorder};
      backdrop-filter:blur(14px);
      font-size:11px; font-weight:700;
      letter-spacing:.11em; text-transform:uppercase;
      color:${th.tagText};
      -webkit-text-fill-color:${th.tagText};
    }
    .ev-hero-title {
      font-family:'Cormorant Garamond',serif;
      font-size:clamp(1.9rem,5vw,3rem);
      font-weight:700; color:#fff;
      -webkit-text-fill-color:#fff;
      line-height:1.08;
      text-shadow:0 4px 24px rgba(0,0,0,.42);
    }

    /* ── INFO STRIP ── */
    .ev-strip {
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:14px; margin-bottom:24px;
    }
    .ev-chip {
      display:flex; align-items:center; gap:14px;
      padding:20px 22px; border-radius:22px;
      background:${th.glass};
      border:1px solid ${th.border};
      backdrop-filter:blur(18px);
      box-shadow:0 4px 20px ${th.cardGlow},inset 0 1px 0 ${th.inset};
      transition:all .25s ease;
    }
    .ev-chip:hover {
      transform:translateY(-4px);
      box-shadow:0 12px 36px ${th.cardHoverGlow},inset 0 1px 0 ${th.inset};
      border-color:${th.borderHover};
    }
    .ev-chip-icon {
      width:46px; height:46px; border-radius:14px;
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .ev-chip-label {
      font-size:10.5px; font-weight:700;
      color:${th.chipLabel};
      -webkit-text-fill-color:${th.chipLabel};
      text-transform:uppercase; letter-spacing:.09em; margin-bottom:4px;
    }
    .ev-chip-val {
      font-size:13.5px; font-weight:700; line-height:1.3;
      color:${th.chipVal};
      -webkit-text-fill-color:${th.chipVal};
    }

    /* ── GLASS CARD ── */
    .ev-card {
      background:${th.glass};
      border:1px solid ${th.border};
      border-radius:28px;
      padding:44px;
      backdrop-filter:blur(18px);
      box-shadow:0 8px 40px ${th.cardGlow},inset 0 1px 0 ${th.inset};
      margin-bottom:24px;
      position:relative; overflow:hidden;
      transition:border-color .3s;
    }
    .ev-card::before {
      content:'';
      position:absolute; top:-70px; right:-70px;
      width:220px; height:220px; border-radius:50%;
      background:radial-gradient(circle,${th.accentLight},transparent 70%);
      pointer-events:none;
    }
    .ev-card::after {
      content:'';
      position:absolute; bottom:-80px; left:-60px;
      width:180px; height:180px; border-radius:50%;
      background:radial-gradient(circle,${th.accentLight},transparent 70%);
      pointer-events:none;
    }

    /* ── SECTION LABELS ── */
    .ev-eyebrow {
      display:flex; align-items:center; gap:10px;
      font-size:10.5px; font-weight:700;
      letter-spacing:.13em; text-transform:uppercase;
      color:${th.eyebrow};
      -webkit-text-fill-color:${th.eyebrow};
      margin-bottom:6px;
    }
    .ev-eyebrow::before {
      content:''; width:24px; height:2px; border-radius:2px;
      background:${th.eyebrowLine};
      flex-shrink:0;
    }
    .ev-section-title {
      font-family:'Cormorant Garamond',serif;
      font-size:1.65rem; font-weight:700;
      color:${th.sectionTitle};
      -webkit-text-fill-color:${th.sectionTitle};
      margin-bottom:20px;
    }
    .ev-about {
      font-family:'Instrument Serif',serif;
      font-size:16px; line-height:1.88;
      color:${th.aboutText};
      -webkit-text-fill-color:${th.aboutText};
      margin-bottom:32px;
    }

    /* ── INTERESTED BUTTON ── */
    .ev-btn-int {
      display:inline-flex; align-items:center;
      padding:0; border:none; cursor:pointer;
      border-radius:16px; overflow:hidden;
      transition:all .32s cubic-bezier(.34,1.56,.64,1);
    }
    .ev-btn-int.idle {
      background:${th.btnIdle};
      box-shadow:0 8px 28px ${th.btnGlow};
    }
    .ev-btn-int.done {
      background:${th.btnDone};
      box-shadow:0 8px 28px ${th.btnDoneGlow};
      cursor:default;
    }
    .ev-btn-int:not(:disabled):hover { transform:translateY(-3px) scale(1.02); }
    .ev-btn-int:active { transform:scale(.97); }
    .ev-btn-icon {
      width:52px; height:52px;
      background:rgba(0,0,0,.15);
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .ev-btn-label {
      padding:0 24px 0 12px;
      font-family:'Outfit',sans-serif;
      font-size:14.5px; font-weight:800;
      color:#fff; -webkit-text-fill-color:#fff;
      letter-spacing:.02em; white-space:nowrap;
    }
    .ev-int-wrap { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
    .ev-int-count {
      font-size:13px; font-weight:600;
      color:${th.intCount}; -webkit-text-fill-color:${th.intCount};
      display:flex; align-items:center; gap:6px;
    }
    .ev-int-num {
      font-family:'Cormorant Garamond',serif;
      font-size:21px; font-weight:700;
      color:${th.intNum}; -webkit-text-fill-color:${th.intNum};
    }

    /* ── COMMENT FORM ── */
    .ev-form {
      display:flex; gap:12px; align-items:center;
      margin-bottom:26px;
      padding:6px 6px 6px 16px;
      background:${th.inputBg};
      border:1.5px solid ${th.inputBorder};
      border-radius:18px;
      box-shadow:inset 0 2px 8px rgba(0,0,0,.04);
      transition:all .3s;
    }
    .ev-form:focus-within {
      border-color:${th.borderFocus};
      box-shadow:0 0 0 4px ${th.accentLight},inset 0 2px 8px rgba(0,0,0,.04);
    }
    .ev-form-avatar {
      width:36px; height:36px; border-radius:50%; flex-shrink:0;
      background:${isDark ? "linear-gradient(135deg,#3B82F6,#1D4ED8)" : "linear-gradient(135deg,#F5C78A,#C4751A)"};
      display:flex; align-items:center; justify-content:center;
    }
    .ev-form-input {
      flex:1; border:none; background:transparent; outline:none;
      font-family:'Outfit',sans-serif; font-size:14px;
      color:${th.inputText}; -webkit-text-fill-color:${th.inputText};
    }
    .ev-form-input::placeholder { color:${th.inputPlaceholder}; -webkit-text-fill-color:${th.inputPlaceholder}; }
    .ev-send {
      width:42px; height:42px; border-radius:12px; border:none; cursor:pointer; flex-shrink:0;
      background:${th.sendBtn};
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 4px 12px ${th.sendGlow};
      transition:all .25s;
    }
    .ev-send:hover { transform:scale(1.1); box-shadow:0 6px 20px ${th.sendGlow}; }
    .ev-send:disabled { opacity:.45; cursor:not-allowed; transform:none; }

    /* ── COMMENT CARDS ── */
    .ev-comment {
      display:flex; gap:14px;
      padding:20px 22px; border-radius:18px;
      background:${th.commentBg};
      border:1px solid ${th.commentBorder};
      margin-bottom:12px;
      transition:all .22s;
      animation:ev-slideX .35s ease both;
    }
    .ev-comment:hover {
      background:${th.commentHover};
      transform:translateX(5px);
      border-color:${th.borderHover};
    }
    .ev-c-ava {
      width:40px; height:40px; border-radius:50%; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-weight:800; font-size:14px; color:#fff;
      -webkit-text-fill-color:#fff;
      font-family:'Outfit',sans-serif;
    }
    .ev-c-name {
      font-size:13.5px; font-weight:700;
      color:${th.commentName}; -webkit-text-fill-color:${th.commentName};
    }
    .ev-c-time {
      font-size:11px;
      color:${th.commentTime}; -webkit-text-fill-color:${th.commentTime};
    }
    .ev-c-text {
      font-family:'Instrument Serif',serif;
      font-size:14.5px; line-height:1.68; margin-top:5px;
      color:${th.commentText}; -webkit-text-fill-color:${th.commentText};
    }
    .ev-cnt-badge {
      display:inline-flex; align-items:center; gap:6px;
      padding:5px 14px; border-radius:100px;
      background:${th.cntBadgeBg};
      border:1px solid ${th.cntBadgeBdr};
      font-size:12px; font-weight:700;
      color:${th.cntBadgeText}; -webkit-text-fill-color:${th.cntBadgeText};
    }
    .ev-empty {
      text-align:center; padding:52px 0;
      color:${th.emptyText}; -webkit-text-fill-color:${th.emptyText};
    }

    /* ── POPUP ── */
    .ev-popup-overlay {
      position:fixed; inset:0; z-index:9999;
      background:${isDark ? "rgba(4,12,26,.75)" : "rgba(40,12,0,.62)"};
      display:flex; align-items:center; justify-content:center;
      backdrop-filter:blur(8px);
      animation:ev-fadeIn .2s ease;
    }
    .ev-popup {
      background:${th.popupBg};
      border:1px solid ${th.border};
      border-radius:32px;
      padding:52px 44px;
      max-width:420px; width:90%;
      text-align:center;
      box-shadow:0 40px 100px ${th.accentGlow};
      animation:ev-popIn .42s cubic-bezier(.34,1.56,.64,1);
      position:relative; overflow:hidden;
    }
    .ev-popup::before {
      content:'';
      position:absolute; top:-90px; left:50%; transform:translateX(-50%);
      width:320px; height:220px;
      background:radial-gradient(circle,${th.accentLight},transparent 70%);
      pointer-events:none;
    }
    .ev-popup-title {
      font-family:'Cormorant Garamond',serif;
      font-size:1.75rem; font-weight:700;
      color:${th.popupTitle}; -webkit-text-fill-color:${th.popupTitle};
      margin-bottom:10px;
    }
    .ev-popup-sub {
      font-family:'Instrument Serif',serif;
      font-size:15.5px; line-height:1.72;
      color:${th.popupSub}; -webkit-text-fill-color:${th.popupSub};
      margin-bottom:34px;
    }
    .ev-popup-close {
      display:inline-flex; align-items:center; gap:10px;
      padding:14px 38px; border-radius:14px; border:none;
      background:${th.btnIdle}; color:#fff; -webkit-text-fill-color:#fff;
      font-family:'Outfit',sans-serif; font-size:14px; font-weight:800;
      cursor:pointer;
      box-shadow:0 8px 24px ${th.btnGlow};
      transition:all .28s cubic-bezier(.34,1.56,.64,1);
    }
    .ev-popup-close:hover { transform:translateY(-3px) scale(1.04); }

    /* ── NOT FOUND ── */
    .ev-not-found {
      min-height:100vh; display:flex; align-items:center; justify-content:center;
      background:${th.pageBg};
    }
    .ev-not-found-box {
      text-align:center; padding:52px 44px; border-radius:28px;
      background:${th.notFoundBg};
      border:1px solid ${th.border};
      box-shadow:0 8px 40px ${th.cardGlow};
    }

    /* ── RESPONSIVE ── */
    @media(max-width:640px) {
      .ev-strip { grid-template-columns:1fr; }
      .ev-hero  { height:260px; }
      .ev-card  { padding:24px; }
      .ev-hero-content { padding:24px; }
      .ev-hero-title { font-size:1.65rem; }
      .ev-content { padding:24px 16px 80px; }
    }
    @media(max-width:480px) {
      .ev-card  { padding:20px 18px; }
      .ev-back-label { display:none; }
      .ev-back-dot   { display:none; }
    }
  `;

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (eventsLoading) return <Loader />;

  // ── Not Found ────────────────────────────────────────────────────────────────
  if (!event) {
    return (
      <>
        <style>{css}</style>
        <div className="ev-root ev-not-found">
          <div className="ev-not-found-box">
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎓</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.85rem", fontWeight: 700,
              color: th.notFoundTitle,
              WebkitTextFillColor: th.notFoundTitle,
              marginBottom: 10,
            }}>
              Event Not Found
            </h1>
            <p style={{
              color: th.notFoundSub, WebkitTextFillColor: th.notFoundSub,
              marginBottom: 28, fontSize: 14,
            }}>
              This event may have ended or doesn't exist.
            </p>
            <button className="ev-back" onClick={handleBack}>
              <div className="ev-back-track">
                <div className="ev-back-icon">
                  <ArrowLeft className="ev-back-arrow" style={{ width: 20, height: 20, color: "#fff" }} />
                </div>
                <span className="ev-back-label">Back to Events</span>
                <span className="ev-back-dot" />
              </div>
            </button>
          </div>
        </div>
      </>
    );
  }

  const allComments = savedComments?.length ? savedComments : (event.comments ?? []);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      {/* ── POPUP ─────────────────────────────────────────────────────────── */}
      {showPopup && (
        <div className="ev-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="ev-popup" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "3.8rem", marginBottom: 16 }}>🎉</div>
            <h2 className="ev-popup-title">You're In!</h2>
            <p className="ev-popup-sub">
              We've noted your interest in <strong style={{ color: th.accent, WebkitTextFillColor: th.accent }}>{event.eventName}</strong>.
              We'll keep you posted with all updates and reminders as the event approaches.
            </p>
            <button className="ev-popup-close" onClick={() => setShowPopup(false)}>
              <Check style={{ width: 16, height: 16 }} />
              Awesome, got it!
            </button>
          </div>
        </div>
      )}

      <div className="ev-root">

        {/* ── BACKGROUND BLOBS ─────────────────────────────────────────────── */}
        <div className="ev-blob" style={{ width: 520, height: 520, background: th.blobA, top: -110, right: -110, animationDelay: "0s"   }} />
        <div className="ev-blob" style={{ width: 420, height: 420, background: th.blobB, bottom:  80, left:  -90, animationDelay: "7s"   }} />
        <div className="ev-blob" style={{ width: 320, height: 320, background: th.blobC, top: "42%", right: "10%", animationDelay: "14s" }} />

        <div className="ev-content">

          {/* ── BACK BUTTON ────────────────────────────────────────────────── */}
          <button className="ev-back" onClick={handleBack}>
            <div className="ev-back-track">
              <div className="ev-back-icon">
                <ArrowLeft className="ev-back-arrow" style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <span className="ev-back-label">Back to Events</span>
              <span className="ev-back-dot" />
            </div>
          </button>

          {/* ── HERO ───────────────────────────────────────────────────────── */}
          <div className="ev-hero">
            <img src={event.eventImage} alt={event.eventName} />
            <div className="ev-hero-overlay" />
            <div className="ev-hero-content">
              <div className="ev-hero-tag">
                <Star style={{ width: 12, height: 12 }} />
                Upcoming Event
              </div>
              <h1 className="ev-hero-title">{event.eventName}</h1>
            </div>
          </div>

          {/* ── INFO STRIP ─────────────────────────────────────────────────── */}
          <div className="ev-strip">
            <div className="ev-chip">
              <div className="ev-chip-icon" style={{ background: th.chip1Bg }}>
                <Calendar style={{ width: 22, height: 22, color: th.chip1Icon }} />
              </div>
              <div>
                <div className="ev-chip-label">Date</div>
                <div className="ev-chip-val">{formatDate(event.eventDate)}</div>
              </div>
            </div>
            <div className="ev-chip">
              <div className="ev-chip-icon" style={{ background: th.chip2Bg }}>
                <Clock style={{ width: 22, height: 22, color: th.chip2Icon }} />
              </div>
              <div>
                <div className="ev-chip-label">Time</div>
                <div className="ev-chip-val">{event.time}</div>
              </div>
            </div>
            <div className="ev-chip">
              <div className="ev-chip-icon" style={{ background: th.chip3Bg }}>
                <MapPin style={{ width: 22, height: 22, color: th.chip3Icon }} />
              </div>
              <div>
                <div className="ev-chip-label">Location</div>
                <div className="ev-chip-val">{event.location}</div>
              </div>
            </div>
          </div>

          {/* ── ABOUT CARD ─────────────────────────────────────────────────── */}
          <div className="ev-card">
            <div className="ev-eyebrow">About this Event</div>
            <h2 className="ev-section-title">What's waiting for you</h2>
            <p className="ev-about">{event.eventDescription}</p>

            <div className="ev-int-wrap">
              <button
                className={`ev-btn-int ${isInterested ? "done" : "idle"}`}
                onClick={handleInterested}
                disabled={isInterested}
              >
                <div className="ev-btn-icon">
                  {isInterested
                    ? <Check style={{ width: 22, height: 22, color: "#fff" }} />
                    : <Star  style={{ width: 22, height: 22, color: "#fff" }} />
                  }
                </div>
                <span className="ev-btn-label">
                  {isInterested ? "Interested!" : "I'm Interested"}
                </span>
              </button>
              <div className="ev-int-count">
                <span className="ev-int-num">{intCount}</span>
                <span>people interested</span>
              </div>
            </div>
          </div>

          {/* ── DISCUSSION CARD ────────────────────────────────────────────── */}
          <div className="ev-card" style={{ marginBottom: 0 }}>
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap", gap: 12, marginBottom: 28,
            }}>
              <div>
                <div className="ev-eyebrow">Community</div>
                <h2 className="ev-section-title" style={{ marginBottom: 0 }}>Discussion</h2>
              </div>
              <span className="ev-cnt-badge">
                <MessageCircle style={{ width: 13, height: 13 }} />
                {allComments.length} comment{allComments.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Input */}
            <form className="ev-form" onSubmit={handleSubmit}>
              <div className="ev-form-avatar">
                <User style={{ width: 16, height: 16, color: "#fff" }} />
              </div>
              <input
                type="text"
                className="ev-form-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts about this event…"
              />
              <button type="submit" className="ev-send" disabled={commentsLoading || !text.trim()}>
                <Send style={{ width: 16, height: 16, color: "#fff" }} />
              </button>
            </form>

            {/* Comments list */}
            {allComments.length === 0 ? (
              <div className="ev-empty">
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>💬</div>
                <p style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 15, fontStyle: "italic",
                }}>
                  No comments yet. Be the first to spark a conversation!
                </p>
              </div>
            ) : (
              <div>
                {allComments.map((c, idx) => {
                  const uname = c.username || c.user?.name || "User";
                  const avatarBg = th.avatarColors[uname.charCodeAt(0) % th.avatarColors.length];
                  return (
                    <div key={c.id || c._id} className="ev-comment"
                      style={{ animationDelay: `${idx * 0.045}s` }}>
                      <div className="ev-c-ava" style={{ background: avatarBg }}>
                        {uname.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: "flex", alignItems: "center",
                          gap: 8, marginBottom: 2, flexWrap: "wrap",
                        }}>
                          <span className="ev-c-name">{uname}</span>
                          <span className="ev-c-time">
                            {c.timestamp || new Date(c.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="ev-c-text">{c.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default EventDetail;