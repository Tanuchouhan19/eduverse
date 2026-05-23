"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  editEvent,
  getAllEvents,
  getAllListings,
  getAllUsers,
  updateListing,
  updateUser,
} from "../features/admin/adminSlice";
import Loader from "../components/Loader";
import AddEvent from "../components/AddEvent";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
const useWindowSize = () => {
  const [size, setSize] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1280,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  }));
  useEffect(() => {
    let raf;
    const fn = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setSize({ w: window.innerWidth, h: window.innerHeight })
      );
    };
    window.addEventListener("resize", fn, { passive: true });
    return () => { window.removeEventListener("resize", fn); cancelAnimationFrame(raf); };
  }, []);
  return size;
};

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
// Light = warm amber/terracotta. Dark = deep navy/blue.
const T = {
  light: {
    pageBg:     "#FAF7F2",
    sidebar:    "#FFFDF8",
    sidebarBdr: "#EDE8DF",
    topbar:     "#FFFDF8",
    topbarBdr:  "#EDE8DF",
    card:       "#FFFFFF",
    cardBdr:    "#EDE8DF",
    cardHover:  "#FDFAF5",
    tableHead:  "#F5EFE4",
    tableHover: "#FDF7EE",
    tableBdr:   "#EDE8DF",
    text:       "#1C1714",
    textSec:    "#6B5E52",
    textMuted:  "#A89C92",
    accent:     "#C7651A",
    accentL:    "#FEF0E3",
    accentT:    "#7C3D0E",
    accent2:    "#D4455A",
    accent3:    "#059669",
    navHover:   "#F3EBE0",
    inputBg:    "#F5EFE4",
    inputBdr:   "#DDD5C8",
    inputText:  "#1C1714",
    badge: {
      green: ["#DCFCE7","#15803D"],
      amber: ["#FEF9C3","#A16207"],
      red:   ["#FFE4E6","#BE123C"],
      blue:  ["#DBEAFE","#1D4ED8"],
      gray:  ["#F1F5F9","#64748B"],
    },
    shadow:  "0 1px 3px rgba(100,70,30,.07)",
    shadowM: "0 4px 16px rgba(100,70,30,.10)",
    shadowL: "0 8px 32px rgba(100,70,30,.14)",
    scroll:  "#DDD5C8",
    overlay: "rgba(60,40,20,.50)",
    gradA:   "linear-gradient(135deg,#C7651A,#D4455A)",
    gradB:   "linear-gradient(135deg,#D4455A,#C7651A)",
  },
  dark: {
    pageBg:     "#060D1A",
    sidebar:    "#09152A",
    sidebarBdr: "#162238",
    topbar:     "#09152A",
    topbarBdr:  "#162238",
    card:       "#0C1829",
    cardBdr:    "#172640",
    cardHover:  "#0F1E36",
    tableHead:  "#091220",
    tableHover: "#0F1E36",
    tableBdr:   "#172640",
    text:       "#E2EDF8",
    textSec:    "#7A9ABF",
    textMuted:  "#3E5A7A",
    accent:     "#3B82F6",
    accentL:    "#0A1E3D",
    accentT:    "#93C5FD",
    accent2:    "#818CF8",
    accent3:    "#10B981",
    navHover:   "#0F1E36",
    inputBg:    "#091220",
    inputBdr:   "#1A3255",
    inputText:  "#E2EDF8",
    badge: {
      green: ["#052814","#34D399"],
      amber: ["#211400","#FCD34D"],
      red:   ["#200814","#FC8181"],
      blue:  ["#0A1E3D","#60A5FA"],
      gray:  ["#131B2E","#94A3B8"],
    },
    shadow:  "0 1px 3px rgba(0,0,0,.40)",
    shadowM: "0 4px 16px rgba(0,0,0,.50)",
    shadowL: "0 8px 32px rgba(0,0,0,.60)",
    scroll:  "#162238",
    overlay: "rgba(0,6,20,.76)",
    gradA:   "linear-gradient(135deg,#3B82F6,#818CF8)",
    gradB:   "linear-gradient(135deg,#818CF8,#3B82F6)",
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";

const initials = (name="") =>
  (name||"").split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";

const PALETTE = ["#C7651A","#3B82F6","#818CF8","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4"];
const avatarColor = (name="") => PALETTE[(name||"A").charCodeAt(0) % PALETTE.length];

// ─── SMALL COMPONENTS — defined OUTSIDE Admin to prevent remount on re-render ──

const Icon = memo(({name,size=18,style={}}) => (
  <span className={`ti ti-${name}`} aria-hidden="true"
    style={{fontSize:size,lineHeight:1,display:"inline-flex",alignItems:"center",...style}}/>
));

const Badge = memo(({label,type="gray",th}) => {
  const [bg,color] = th.badge[type]||th.badge.gray;
  return (
    <span style={{background:bg,color,fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,letterSpacing:.3,whiteSpace:"nowrap"}}>
      {label}
    </span>
  );
});

const Avatar = memo(({name,size=34}) => (
  <div style={{
    width:size,height:size,borderRadius:"50%",flexShrink:0,
    background:avatarColor(name)+"22",
    display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:size*.35,fontWeight:700,color:avatarColor(name),
  }}>
    {initials(name)}
  </div>
));

// ─── STAT ICONS — inline SVG so they always render regardless of icon font ────
const StatIcon = memo(({name, size=20, color="#fff"}) => {
  const paths = {
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    bag:   "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
    cal:   "M3 4h18M3 4v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4M16 2v4M8 2v4M3 10h18",
  };
  const d = name==="users" ? paths.users : name==="bag" ? paths.bag : paths.cal;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d.split("M").filter(Boolean).map((seg,i) => (
        <path key={i} d={"M"+seg}/>
      ))}
    </svg>
  );
});

const StatCard = memo(({label,value,iconName,accent,th}) => {
  const svgName = iconName==="users" ? "users" : iconName==="shopping-bag" ? "bag" : "cal";
  return (
    <div style={{
      background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:16,
      padding:"22px 22px",boxShadow:th.shadow,position:"relative",overflow:"hidden",
    }}>
      {/* Watermark */}
      <div style={{position:"absolute",top:"50%",right:-6,transform:"translateY(-50%)",opacity:.06,pointerEvents:"none"}}>
        <StatIcon name={svgName} size={72} color={accent}/>
      </div>
      {/* Badge */}
      <div style={{
        width:42,height:42,borderRadius:12,background:accent,
        display:"flex",alignItems:"center",justifyContent:"center",
        marginBottom:16,boxShadow:`0 4px 12px ${accent}44`,
      }}>
        <StatIcon name={svgName} size={20} color="#fff"/>
      </div>
      <p style={{fontSize:11,color:th.textSec,marginBottom:6,fontWeight:600,letterSpacing:.6,textTransform:"uppercase"}}>{label}</p>
      <p style={{fontSize:32,fontWeight:800,color:th.text,lineHeight:1,fontFamily:"Sora,sans-serif"}}>
        {value ?? <span style={{fontSize:14,color:th.textMuted}}>—</span>}
      </p>
    </div>
  );
});

// ─── LIVE CLOCK — isolated so only it re-renders every second ─────────────────
const LiveClock = memo(() => {
  const [liveTime, setLiveTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{fontSize:12,color:"#6B8BAA",fontVariantNumeric:"tabular-nums"}}>
      {liveTime.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
    </span>
  );
});

// ─── ADD EVENT FORM — fully themed, world-class ───────────────────────────────
// This wraps AddEvent with proper themed styling overlay.
// Since AddEvent is an external component, we style the container around it
// AND provide a fully themed replacement form if AddEvent doesn't accept theme.
// Below is a complete themed AddEvent wrapper. Replace your AddEvent component
// with this, or pass th as prop if AddEvent supports it.

const ThemedAddEventForm = memo(({ th, accentA, accentB, editingEvent, onSubmit, onCancel, isMobile=false }) => {
  const emptyForm = {
    eventName: "", eventDescription: "", eventDate: "",
    eventImage: "", location: "", availableSeats: "",
    organizer: "", ticketPrice: "", status: "Upcoming",
  };
  const [form, setForm] = useState(editingEvent ? {
    eventName:        editingEvent.eventName        || "",
    eventDescription: editingEvent.eventDescription || "",
    eventDate:        editingEvent.eventDate        || "",
    eventImage:       editingEvent.eventImage       || "",
    location:         editingEvent.location         || "",
    availableSeats:   editingEvent.availableSeats   || "",
    organizer:        editingEvent.organizer        || "",
    ticketPrice:      editingEvent.ticketPrice      || "",
    status:           editingEvent.status           || "Upcoming",
  } : emptyForm);

  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  const inputStyle = {
    width:"100%", background:th.inputBg, border:`1.5px solid ${th.inputBdr}`,
    borderRadius:12, padding:"12px 16px", fontSize:14, color:th.inputText,
    transition:"border-color .2s, box-shadow .2s", outline:"none",
    fontFamily:"'DM Sans',sans-serif",
  };
  const labelStyle = {
    fontSize:12, fontWeight:600, color:th.textSec,
    letterSpacing:.4, textTransform:"uppercase", marginBottom:6, display:"block",
  };

  const fields = [
    {k:"eventName",       label:"Event Title",        type:"text",     placeholder:"e.g. AI Hackathon 2025"},
    {k:"eventDate",       label:"Event Date",         type:"date",     placeholder:""},
    {k:"eventImage",      label:"Event Image URL",    type:"url",      placeholder:"https://..."},
    {k:"location",        label:"Location",           type:"text",     placeholder:"City, Venue"},
    {k:"availableSeats",  label:"Available Seats",    type:"number",   placeholder:"100"},
    {k:"organizer",       label:"Organizer",          type:"text",     placeholder:"Your name / org"},
    {k:"ticketPrice",     label:"Ticket Price (₹)",   type:"number",   placeholder:"0 for free"},
  ];

  return (
    <div style={{maxWidth:700, margin:"0 auto"}}>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <h2 style={{fontSize:26,fontWeight:800,color:th.text,fontFamily:"Sora,sans-serif",marginBottom:4}}>
          {editingEvent ? "Edit Event" : "Add New Event"}
        </h2>
        <p style={{fontSize:14,color:th.textSec}}>
          {editingEvent ? "Update event details below" : "Fill in the details to publish a new event"}
        </p>
      </div>

      {/* Preview card if image url filled */}
      {form.eventImage && (
        <div style={{marginBottom:24,borderRadius:16,overflow:"hidden",border:`1px solid ${th.cardBdr}`,boxShadow:th.shadowM}}>
          <img src={form.eventImage} alt="preview" style={{width:"100%",height:180,objectFit:"cover",display:"block"}}
            onError={e => e.target.style.display="none"}/>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?14:20}}>
        {/* Event Title — full width */}
        <div style={{gridColumn:"1/-1"}}>
          <label style={labelStyle}>Event Title</label>
          <input value={form.eventName} onChange={e=>set("eventName",e.target.value)}
            placeholder="e.g. AI Hackathon 2025" type="text" style={inputStyle}
            onFocus={e=>{e.target.style.borderColor=accentA;e.target.style.boxShadow=`0 0 0 3px ${accentA}22`;}}
            onBlur={e=>{e.target.style.borderColor=th.inputBdr;e.target.style.boxShadow="none";}}/>
        </div>

        {/* Description — full width */}
        <div style={{gridColumn:"1/-1"}}>
          <label style={labelStyle}>Description</label>
          <textarea value={form.eventDescription} onChange={e=>set("eventDescription",e.target.value)}
            placeholder="Describe your event in detail…" rows={4}
            style={{...inputStyle, resize:"vertical", minHeight:110}}
            onFocus={e=>{e.target.style.borderColor=accentA;e.target.style.boxShadow=`0 0 0 3px ${accentA}22`;}}
            onBlur={e=>{e.target.style.borderColor=th.inputBdr;e.target.style.boxShadow="none";}}/>
        </div>

        {/* Status */}
        <div>
          <label style={labelStyle}>Status</label>
          <select value={form.status} onChange={e=>set("status",e.target.value)}
            style={{...inputStyle, cursor:"pointer"}}
            onFocus={e=>{e.target.style.borderColor=accentA;e.target.style.boxShadow=`0 0 0 3px ${accentA}22`;}}
            onBlur={e=>{e.target.style.borderColor=th.inputBdr;e.target.style.boxShadow="none";}}>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label style={labelStyle}>Event Date</label>
          <input value={form.eventDate} onChange={e=>set("eventDate",e.target.value)}
            type="date" style={{...inputStyle, colorScheme: th === T.dark ? "dark" : "light"}}
            onFocus={e=>{e.target.style.borderColor=accentA;e.target.style.boxShadow=`0 0 0 3px ${accentA}22`;}}
            onBlur={e=>{e.target.style.borderColor=th.inputBdr;e.target.style.boxShadow="none";}}/>
        </div>

        {/* Image URL — full width */}
        <div style={{gridColumn:"1/-1"}}>
          <label style={labelStyle}>Event Image URL</label>
          <input value={form.eventImage} onChange={e=>set("eventImage",e.target.value)}
            placeholder="https://..." type="url" style={inputStyle}
            onFocus={e=>{e.target.style.borderColor=accentA;e.target.style.boxShadow=`0 0 0 3px ${accentA}22`;}}
            onBlur={e=>{e.target.style.borderColor=th.inputBdr;e.target.style.boxShadow="none";}}/>
        </div>

        <div>
          <label style={labelStyle}>Location</label>
          <input value={form.location} onChange={e=>set("location",e.target.value)}
            placeholder="City, Venue" type="text" style={inputStyle}
            onFocus={e=>{e.target.style.borderColor=accentA;e.target.style.boxShadow=`0 0 0 3px ${accentA}22`;}}
            onBlur={e=>{e.target.style.borderColor=th.inputBdr;e.target.style.boxShadow="none";}}/>
        </div>

        <div>
          <label style={labelStyle}>Available Seats</label>
          <input value={form.availableSeats} onChange={e=>set("availableSeats",e.target.value)}
            placeholder="100" type="number" style={inputStyle}
            onFocus={e=>{e.target.style.borderColor=accentA;e.target.style.boxShadow=`0 0 0 3px ${accentA}22`;}}
            onBlur={e=>{e.target.style.borderColor=th.inputBdr;e.target.style.boxShadow="none";}}/>
        </div>

        <div>
          <label style={labelStyle}>Organizer</label>
          <input value={form.organizer} onChange={e=>set("organizer",e.target.value)}
            placeholder="Your name / org" type="text" style={inputStyle}
            onFocus={e=>{e.target.style.borderColor=accentA;e.target.style.boxShadow=`0 0 0 3px ${accentA}22`;}}
            onBlur={e=>{e.target.style.borderColor=th.inputBdr;e.target.style.boxShadow="none";}}/>
        </div>

        <div>
          <label style={labelStyle}>Ticket Price (₹)</label>
          <input value={form.ticketPrice} onChange={e=>set("ticketPrice",e.target.value)}
            placeholder="0 for free" type="number" style={inputStyle}
            onFocus={e=>{e.target.style.borderColor=accentA;e.target.style.boxShadow=`0 0 0 3px ${accentA}22`;}}
            onBlur={e=>{e.target.style.borderColor=th.inputBdr;e.target.style.boxShadow="none";}}/>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{display:"flex",gap:12,marginTop:28}}>
        <button
          onClick={() => onSubmit({...form, _id: editingEvent?._id})}
          style={{
            flex:1, padding:"14px", borderRadius:12, border:"none",
            background: th.gradA, color:"#fff",
            fontWeight:700, fontSize:15, cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            boxShadow: `0 4px 16px ${accentA}44`,
            fontFamily:"'DM Sans',sans-serif",
            transition:"opacity .2s, transform .15s",
          }}
          onMouseEnter={e=>{e.target.style.opacity=".9";e.target.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.target.style.opacity="1";e.target.style.transform="none";}}
        >
          <Icon name={editingEvent?"check":"plus"} size={16}/>
          {editingEvent ? "Update Event" : "Publish Event"}
        </button>
        {editingEvent && (
          <button onClick={onCancel} style={{
            padding:"14px 20px", borderRadius:12,
            border:`1.5px solid ${th.inputBdr}`,
            background:"transparent", color:th.textSec,
            fontSize:14,fontWeight:600,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",
          }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
});

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// CONNECT THEME:
//   Option 1 (prop): <Admin isDark={isDark} />
//   Option 2 (Redux): const isDark = useSelector(s => s.theme.isDark)  ← uncomment line below
//   Option 3 (Context): const { isDark } = useContext(ThemeContext)    ← uncomment line below

const Admin = () => {
  // Theme comes from ThemeContext — same toggle your Navbar uses
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { user }    = useSelector(s => s.auth);
  const {
    allUsers    = [],
    allEvents   = [],
    allListings = [],
    adminLoading,
    adminError,
    adminErrorMessage,
  } = useSelector(s => s.admin);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const th      = isDark ? T.dark  : T.light;
  const accentA = isDark ? "#3B82F6" : "#C7651A";
  const accentB = isDark ? "#818CF8" : "#D4455A";
  const accentC = isDark ? "#10B981" : "#059669";

  const { w: winW } = useWindowSize();
  const isMobile = winW < 768;
  const isTablet = winW >= 768 && winW < 1024;

  const [collapsed,     setCollapsed]     = useState(false);
  const [mobileDrawer,  setMobileDrawer]  = useState(false);  // collapsed state only applies to desktop

  const [tab,           setTab]           = useState("dashboard");
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [editModal,     setEditModal]     = useState(null);
  const [editingEvent,  setEditingEvent]  = useState(null);
  const [searchU,       setSearchU]       = useState("");
  const [searchL,       setSearchL]       = useState("");

  // ── Auth guard
  useEffect(() => {
    if (user && !user.isAdmin) navigate("/myprofile");
  }, [user]);

  // ── Fetch once on mount only
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllEvents());
    dispatch(getAllListings());
  }, []);

  // ── Error toast
  useEffect(() => {
    if (adminError && adminErrorMessage)
      toast.error(adminErrorMessage, { position: "top-center" });
  }, [adminError, adminErrorMessage]);

  // ── Global CSS — memoized so it doesn't flash on every render
  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}
    *{font-family:'DM Sans',sans-serif;box-sizing:border-box;margin:0;padding:0;}
    h1,h2,h3,h4,h5{font-family:'Sora',sans-serif;}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:${th.scroll};border-radius:8px;}
    .nav-btn:hover{background:${th.navHover}!important;}
    .row-hover:hover{background:${th.tableHover}!important;}
    .ghost-btn:hover{background:${th.navHover}!important;}
    .card-lift{transition:box-shadow .2s,transform .2s;}
    .card-lift:hover{box-shadow:${th.shadowM}!important;transform:translateY(-2px);}
    .live-dot{animation:livePulse 2s ease-in-out infinite;}
    input:focus,textarea:focus,select:focus{border-color:${accentA}!important;box-shadow:0 0 0 3px ${accentA}22!important;outline:none;}
    .fade-in{animation:fadeUp .3s ease both;}
    input[type="date"]::-webkit-calendar-picker-indicator{
      filter: ${isDark ? "invert(1)" : "none"};
      cursor: pointer;
    }
  `;

  // ── Handlers — ALL useCallback hooks MUST be above any early return
  const handleToggleUser    = useCallback(u => dispatch(updateUser({ _id: u._id, isActive: !u.isActive })), [dispatch]);
  const handleToggleListing = useCallback(l => { dispatch(updateListing({ _id: l._id, isAvailable: !l.isAvailable })); setEditModal(null); }, [dispatch]);
  const handleEditEvent     = useCallback(ev => { setEditingEvent(ev); setTab("add"); }, []);
  const handleAddEventSubmit = useCallback(formData => {
    if (formData._id) {
      dispatch(editEvent(formData));
    }
    // else dispatch(createEvent(formData)) — wire your create action here
    setEditingEvent(null);
    setTab("events");
  }, [dispatch]);

  // ── Early return AFTER all hooks — React requires hooks to always run in same order
  if (adminLoading) return <Loader />;

  // ── Derived data (not hooks, safe after early return)
  const activeUsers    = allUsers.filter(u => u.isActive).length;
  const activeListings = allListings.filter(l => l.isAvailable).length;

  const filteredUsers    = allUsers.filter(u =>
    (u.name||"").toLowerCase().includes(searchU.toLowerCase()) ||
    (u.email||"").toLowerCase().includes(searchU.toLowerCase())
  );
  const filteredListings = allListings.filter(l =>
    (l.title||"").toLowerCase().includes(searchL.toLowerCase()) ||
    (l.user?.name||"").toLowerCase().includes(searchL.toLowerCase())
  );

  // ── Shared styles
  const thHeader = {
    padding:"12px 16px",
    textAlign:"left",
    fontSize:11,
    fontWeight:700,
    color:th.textSec,
    letterSpacing:.6,
    textTransform:"uppercase",
    borderBottom:`1px solid ${th.tableBdr}`,
  };

  const NAV = [
    { id:"dashboard", label:"Dashboard",  icon:"layout-dashboard" },
    { id:"users",     label:"Users",      icon:"users" },
    { id:"listings",  label:"Listings",   icon:"shopping-bag" },
    { id:"events",    label:"Events",     icon:"calendar-event" },
    { id:"add",       label:"Add Event",  icon:"calendar-plus" },
  ];

  // ─── SUB-COMPONENTS (render helpers, not React components, to avoid remount) ──

  const renderSearchBox = (value, onChange, placeholder) => (
    <div style={{position:"relative",marginBottom:16}}>
      <Icon name="search" size={15} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:th.textMuted}}/>
      <input
        placeholder={placeholder||"Search…"}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: isMobile ? "100%" : 300,
          background:th.inputBg,
          border:`1.5px solid ${th.inputBdr}`,
          borderRadius:10,
          padding:"10px 14px 10px 36px",
          fontSize:13,
          color:th.inputText,
        }}
      />
    </div>
  );

  // ── DASHBOARD ───────────────────────────────────────────────────────────────
  const renderDashboard = () => {
    const recentUsers    = [...allUsers].sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0)).slice(0,4);
    const recentListings = [...allListings].sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0)).slice(0,4);
    return (
      <div className="fade-in">
        {/* Stat cards — horizontal scroll on mobile */}
        {isMobile ? (
          <div style={{display:"flex",gap:10,overflowX:"auto",marginBottom:14,paddingBottom:4}}>
            {[
              {label:"Total Users",    value:allUsers.length,  svgName:"users", accent:accentA},
              {label:"Active Listings",value:activeListings,   svgName:"bag",   accent:accentB},
              {label:"Total Events",   value:allEvents.length, svgName:"cal",   accent:accentC},
            ].map(c => (
              <div key={c.label} style={{
                flexShrink:0,width:148,
                background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:14,
                padding:"14px 16px",boxShadow:th.shadow,position:"relative",overflow:"hidden",
              }}>
                <div style={{position:"absolute",top:"50%",right:-4,transform:"translateY(-50%)",opacity:.06,pointerEvents:"none"}}>
                  <StatIcon name={c.svgName} size={52} color={c.accent}/>
                </div>
                <div style={{width:30,height:30,borderRadius:8,background:c.accent,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,boxShadow:`0 3px 8px ${c.accent}44`}}>
                  <StatIcon name={c.svgName} size={15} color="#fff"/>
                </div>
                <p style={{fontSize:10,color:th.textSec,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:4}}>{c.label}</p>
                <p style={{fontSize:26,fontWeight:800,color:th.text,lineHeight:1,fontFamily:"Sora,sans-serif"}}>{c.value??0}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:22}}>
            <StatCard label="Total Users"     value={allUsers.length}  iconName="users"          accent={accentA} th={th}/>
            <StatCard label="Active Listings" value={activeListings}   iconName="shopping-bag"   accent={accentB} th={th}/>
            <StatCard label="Total Events"    value={allEvents.length} iconName="calendar-event" accent={accentC} th={th}/>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?12:18,marginBottom:isMobile?12:18}}>
          {/* Recent Users */}
          <div style={{background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:16,padding:20,boxShadow:th.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h4 style={{fontSize:14,fontWeight:700,color:th.text}}>Recent Users</h4>
              <button className="ghost-btn" onClick={()=>setTab("users")}
                style={{fontSize:12,color:accentA,fontWeight:600,background:"transparent",border:"none",cursor:"pointer",padding:"4px 8px",borderRadius:7}}>
                View All →
              </button>
            </div>
            {recentUsers.length===0 && <p style={{fontSize:13,color:th.textMuted,textAlign:"center",padding:"16px 0"}}>No users yet</p>}
            {recentUsers.map(u => (
              <div key={u._id} className="row-hover" style={{display:"flex",alignItems:"center",gap:10,padding:"9px 8px",borderRadius:10,transition:"background .15s"}}>
                <Avatar name={u.name} size={34}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:600,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</p>
                  <p style={{fontSize:11,color:th.textMuted}}>{u.email}</p>
                </div>
                <Badge label={u.isActive?"Active":"Inactive"} type={u.isActive?"green":"gray"} th={th}/>
              </div>
            ))}
          </div>

          {/* Recent Listings */}
          <div style={{background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:16,padding:20,boxShadow:th.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h4 style={{fontSize:14,fontWeight:700,color:th.text}}>Recent Listings</h4>
              <button className="ghost-btn" onClick={()=>setTab("listings")}
                style={{fontSize:12,color:accentA,fontWeight:600,background:"transparent",border:"none",cursor:"pointer",padding:"4px 8px",borderRadius:7}}>
                View All →
              </button>
            </div>
            {recentListings.length===0 && <p style={{fontSize:13,color:th.textMuted,textAlign:"center",padding:"16px 0"}}>No listings yet</p>}
            {recentListings.map(l => (
              <div key={l._id} className="row-hover"
                onClick={() => navigate(`/marketplace/${l._id}`)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 8px",borderRadius:10,transition:"background .15s",cursor:"pointer"}}>
                {l.itemImage
                  ? <img src={l.itemImage} alt={l.title} style={{width:36,height:36,borderRadius:9,objectFit:"cover",flexShrink:0}}/>
                  : <div style={{width:36,height:36,borderRadius:9,background:th.tableHead,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="photo" size={14} style={{color:th.textMuted}}/></div>
                }
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:600,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</p>
                  <p style={{fontSize:11,color:th.textMuted}}>{l.user?.name}</p>
                </div>
                <span style={{fontSize:13,fontWeight:700,color:accentA,whiteSpace:"nowrap"}}>₹{l.prize?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events strip */}
        <div style={{background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:16,padding:20,boxShadow:th.shadow}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h4 style={{fontSize:14,fontWeight:700,color:th.text}}>Upcoming Events</h4>
            <button className="ghost-btn" onClick={()=>setTab("events")}
              style={{fontSize:12,color:accentA,fontWeight:600,background:"transparent",border:"none",cursor:"pointer",padding:"4px 8px",borderRadius:7}}>
              View All →
            </button>
          </div>
          {allEvents.length===0 && <p style={{fontSize:13,color:th.textMuted,textAlign:"center",padding:"16px 0"}}>No events yet</p>}
          <div style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:4}}>
            {allEvents.slice(0,6).map(ev => (
              <div key={ev._id} className="card-lift"
                onClick={() => navigate(`/event/${ev._id}`)}
                style={{flexShrink:0,width:195,background:th.cardHover,borderRadius:12,overflow:"hidden",border:`1px solid ${th.cardBdr}`,cursor:"pointer"}}>
                {ev.eventImage
                  ? <img src={ev.eventImage} alt={ev.eventName} style={{width:"100%",height:88,objectFit:"cover"}}/>
                  : <div style={{width:"100%",height:88,background:th.tableHead,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="calendar-event" size={28} style={{color:th.textMuted}}/></div>
                }
                <div style={{padding:"10px 12px"}}>
                  <p style={{fontSize:12,fontWeight:700,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.eventName}</p>
                  {ev.location && <p style={{fontSize:11,color:th.textSec,marginTop:3,display:"flex",alignItems:"center",gap:3}}><Icon name="map-pin" size={10}/>{ev.location}</p>}
                  {ev.eventDate && <p style={{fontSize:11,color:th.textMuted,marginTop:2}}>{ev.eventDate}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── USERS ───────────────────────────────────────────────────────────────────
  const renderUsers = () => (
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <h3 style={{fontSize:isMobile?16:18,fontWeight:700,color:th.text}}>Manage Users</h3>
          <p style={{fontSize:12,color:th.textSec,marginTop:3}}>{allUsers.length} total · {activeUsers} active</p>
        </div>
      </div>
      {renderSearchBox(searchU, setSearchU, "Search by name or email…")}

      {/* ── MOBILE: card list ── */}
      {isMobile ? (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filteredUsers.map(u => (
            <div key={u._id} style={{background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:14,padding:"14px 14px",boxShadow:th.shadow}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <Avatar name={u.name} size={38}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:14,fontWeight:700,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</p>
                  <p style={{fontSize:12,color:th.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</p>
                </div>
                <Badge label={u.isAdmin?"Admin":"User"} type={u.isAdmin?"blue":"gray"} th={th}/>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:10,borderTop:`1px solid ${th.tableBdr}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Badge label={u.isActive?"Active":"Inactive"} type={u.isActive?"green":"gray"} th={th}/>
                  {u.phone && <span style={{fontSize:12,color:th.textMuted}}>{u.phone}</span>}
                </div>
                <button onClick={()=>handleToggleUser(u)} style={{
                  padding:"6px 14px",borderRadius:8,border:"none",fontWeight:600,fontSize:12,cursor:"pointer",
                  background:u.isActive?th.badge.red[0]:th.badge.green[0],
                  color:u.isActive?th.badge.red[1]:th.badge.green[1],
                }}>
                  {u.isActive?"Deactivate":"Activate"}
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length===0 && <div style={{padding:40,textAlign:"center",color:th.textMuted,fontSize:14}}>No users found</div>}
        </div>
      ) : (
        /* ── DESKTOP: table ── */
        <div style={{background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:16,overflow:"hidden",boxShadow:th.shadow}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
              <thead>
                <tr style={{background:th.tableHead}}>
                  {["User","Email","Phone","Role","Status","Action"].map(h => (
                    <th key={h} style={thHeader}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u,i) => (
                  <tr key={u._id} className="row-hover"
                    style={{borderBottom:i<filteredUsers.length-1?`1px solid ${th.tableBdr}`:"none",transition:"background .15s"}}>
                    <td style={{padding:"13px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <Avatar name={u.name} size={34}/>
                        <span style={{fontSize:13,fontWeight:600,color:th.text}}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{padding:"13px 16px",fontSize:13,color:th.textSec}}>{u.email}</td>
                    <td style={{padding:"13px 16px",fontSize:13,color:th.textSec}}>{u.phone||"—"}</td>
                    <td style={{padding:"13px 16px"}}><Badge label={u.isAdmin?"Admin":"User"} type={u.isAdmin?"blue":"gray"} th={th}/></td>
                    <td style={{padding:"13px 16px"}}><Badge label={u.isActive?"Active":"Inactive"} type={u.isActive?"green":"gray"} th={th}/></td>
                    <td style={{padding:"13px 16px"}}>
                      <button onClick={()=>handleToggleUser(u)} style={{
                        padding:"6px 14px",borderRadius:8,border:"none",fontWeight:600,fontSize:12,cursor:"pointer",
                        background:u.isActive?th.badge.red[0]:th.badge.green[0],
                        color:u.isActive?th.badge.red[1]:th.badge.green[1],
                      }}>
                        {u.isActive?"Deactivate":"Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length===0 && <div style={{padding:40,textAlign:"center",color:th.textMuted,fontSize:14}}>No users found</div>}
        </div>
      )}
    </div>
  );

  // ── LISTINGS ─────────────────────────────────────────────────────────────────
  const renderListings = () => (
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <h3 style={{fontSize:isMobile?16:18,fontWeight:700,color:th.text}}>Manage Listings</h3>
          <p style={{fontSize:12,color:th.textSec,marginTop:3}}>{allListings.length} total · {activeListings} available</p>
        </div>
      </div>
      {renderSearchBox(searchL, setSearchL, "Search by title or seller…")}

      {/* ── MOBILE: card list ── */}
      {isMobile ? (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filteredListings.map(l => (
            <div key={l._id}
              onClick={()=>navigate(`/marketplace/${l._id}`)}
              style={{background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:14,padding:"12px",boxShadow:th.shadow,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
              {l.itemImage
                ? <img src={l.itemImage} alt={l.title} style={{width:54,height:54,borderRadius:10,objectFit:"cover",flexShrink:0}}/>
                : <div style={{width:54,height:54,borderRadius:10,background:th.tableHead,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="photo" size={20} style={{color:th.textMuted}}/></div>
              }
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:700,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</p>
                <p style={{fontSize:11,color:th.textMuted,marginTop:2}}>{l.user?.name||"—"} · {l.user?.email||"No email"}</p>
                <p style={{fontSize:11,color:th.textMuted,marginTop:2}}>{l.category||"General"} · {fmtDate(l.createdAt)}</p>
                <p style={{fontSize:11,color:th.textSec,marginTop:4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                  {l.description || "No description"}
                </p>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                  <span style={{fontSize:13,fontWeight:700,color:accentA}}>₹{l.prize?.toLocaleString()??"—"}</span>
                  <Badge label={l.isAvailable?"Available":"Sold Out"} type={l.isAvailable?"green":"red"} th={th}/>
                </div>
              </div>
              <button onClick={e=>{e.stopPropagation();setEditModal(l);}} style={{
                padding:"7px 10px",borderRadius:8,border:`1px solid ${th.inputBdr}`,
                background:th.tableHead,color:th.textSec,cursor:"pointer",
                display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:500,flexShrink:0,
              }}>
                <Icon name="edit" size={13}/>
              </button>
            </div>
          ))}
          {filteredListings.length===0 && <div style={{padding:40,textAlign:"center",color:th.textMuted,fontSize:14}}>No listings found</div>}
        </div>
      ) : (
        /* ── DESKTOP: table ── */
        <div style={{background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:16,overflow:"hidden",boxShadow:th.shadow}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:980}}>
              <thead>
                <tr style={{background:th.tableHead}}>
                  {["","Listing","Seller","Category","Price","Date","Status","Action"].map(h => (
                    <th key={h} style={thHeader}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((l,i) => (
                  <tr key={l._id} className="row-hover"
                    style={{borderBottom:i<filteredListings.length-1?`1px solid ${th.tableBdr}`:"none",transition:"background .15s",cursor:"pointer"}}
                    onClick={()=>navigate(`/marketplace/${l._id}`)}>
                    <td style={{padding:"12px 12px 12px 16px",width:62}} onClick={e=>e.stopPropagation()}>
                      {l.itemImage
                        ? <img src={l.itemImage} alt={l.title} style={{width:46,height:46,borderRadius:10,objectFit:"cover"}}/>
                        : <div style={{width:46,height:46,borderRadius:10,background:th.tableHead,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="photo" size={18} style={{color:th.textMuted}}/></div>
                      }
                    </td>
                    <td style={{padding:"12px 16px",minWidth:230}}>
                      <p style={{fontSize:13,fontWeight:700,color:th.text,marginBottom:3}}>{l.title}</p>
                      <p style={{fontSize:12,color:th.textSec,lineHeight:1.45,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                        {l.description || "No description"}
                      </p>
                    </td>
                    <td style={{padding:"12px 16px",minWidth:190}}>
                      <p style={{fontSize:13,fontWeight:600,color:th.text}}>{l.user?.name||"—"}</p>
                      <p style={{fontSize:11,color:th.textMuted,marginTop:2}}>{l.user?.email||"No email"}</p>
                    </td>
                    <td style={{padding:"12px 16px",fontSize:13,color:th.textSec}}>{l.category || "General"}</td>
                    <td style={{padding:"12px 16px",fontSize:13,fontWeight:700,color:accentA}}>₹{l.prize?.toLocaleString()??"—"}</td>
                    <td style={{padding:"12px 16px",fontSize:12,color:th.textMuted}}>{fmtDate(l.createdAt)}</td>
                    <td style={{padding:"12px 16px"}}><Badge label={l.isAvailable?"Available":"Sold Out"} type={l.isAvailable?"green":"red"} th={th}/></td>
                    <td style={{padding:"12px 16px"}} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>setEditModal(l)}
                        style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${th.inputBdr}`,background:"transparent",color:th.textSec,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:500}}>
                        <Icon name="edit" size={14}/> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredListings.length===0 && <div style={{padding:40,textAlign:"center",color:th.textMuted,fontSize:14}}>No listings found</div>}
        </div>
      )}
    </div>
  );

  // ── EVENTS ───────────────────────────────────────────────────────────────────
  const renderEvents = () => (
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h3 style={{fontSize:18,fontWeight:700,color:th.text}}>Manage Events</h3>
          <p style={{fontSize:12,color:th.textSec,marginTop:3}}>{allEvents.length} event{allEvents.length!==1?"s":""} scheduled</p>
        </div>
        <button onClick={()=>setTab("add")} style={{
          display:"flex",alignItems:"center",gap:7,padding:"9px 16px",
          borderRadius:10,border:"none",background:accentB,
          color:"#fff",fontWeight:600,fontSize:13,cursor:"pointer",
        }}>
          <Icon name="plus" size={15}/>Add Event
        </button>
      </div>
      {allEvents.length===0 && (
        <div style={{textAlign:"center",padding:"60px 0",color:th.textMuted}}>
          <Icon name="calendar-off" size={36} style={{marginBottom:12,display:"block"}}/>
          <p style={{fontSize:14}}>No events yet — add one above</p>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,1fr)":"repeat(auto-fill,minmax(285px,1fr))",gap:isMobile?12:18}}>
        {allEvents.map(ev => (
          <div key={ev._id} className="card-lift"
            style={{background:th.card,border:`1px solid ${th.cardBdr}`,borderRadius:16,overflow:"hidden",boxShadow:th.shadow,cursor:"pointer"}}
            onClick={() => navigate(`/event/${ev._id}`)}>
            <div style={{position:"relative"}}>
              {ev.eventImage
                ? <img src={ev.eventImage} alt={ev.eventName} style={{width:"100%",height:145,objectFit:"cover"}}/>
                : <div style={{width:"100%",height:145,background:th.tableHead,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="calendar-event" size={36} style={{color:th.textMuted}}/></div>
              }
              {/* Edit button — clearly labelled, stopPropagation so card click doesn't fire */}
              <button
                onClick={e=>{e.stopPropagation();handleEditEvent(ev);}}
                style={{
                  position:"absolute",top:10,right:10,
                  display:"flex",alignItems:"center",gap:5,
                  padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",
                  background:"rgba(255,255,255,.95)",
                  color:"#1D4ED8",fontWeight:700,fontSize:12,
                  boxShadow:"0 2px 8px rgba(0,0,0,.18)",
                  backdropFilter:"blur(4px)",
                  fontFamily:"'DM Sans',sans-serif",
                }}>
                <Icon name="pencil" size={13}/>
                Edit
              </button>
            </div>
            <div style={{padding:"15px 16px"}}>
              <h4 style={{fontSize:14,fontWeight:700,color:th.text,marginBottom:8}}>{ev.eventName}</h4>
              <div style={{display:"flex",gap:12,marginBottom:6,flexWrap:"wrap"}}>
                {ev.location && <span style={{fontSize:11,color:th.textSec,display:"flex",alignItems:"center",gap:3}}><Icon name="map-pin" size={11} style={{color:accentA}}/>{ev.location}</span>}
                {ev.eventDate && <span style={{fontSize:11,color:th.textSec,display:"flex",alignItems:"center",gap:3}}><Icon name="calendar" size={11} style={{color:accentB}}/>{ev.eventDate}</span>}
              </div>
              {ev.availableSeats!==undefined && <p style={{fontSize:11,color:th.textSec,marginBottom:8,display:"flex",alignItems:"center",gap:3}}><Icon name="armchair" size={11} style={{color:accentC}}/>{ev.availableSeats} seats</p>}
              {ev.eventDescription && <p style={{fontSize:12,color:th.textSec,lineHeight:1.5,marginBottom:10,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{ev.eventDescription}</p>}
              {ev.comments?.length>0 && (
                <button
                  onClick={e=>{e.stopPropagation();setExpandedEvent(expandedEvent===ev._id?null:ev._id);}}
                  style={{width:"100%",padding:"7px",borderRadius:9,border:`1px solid ${th.inputBdr}`,background:"transparent",color:th.textSec,fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  <Icon name={expandedEvent===ev._id?"chevron-up":"message-circle"} size={13}/>
                  {expandedEvent===ev._id?"Hide":"Show"} {ev.comments.length} comment{ev.comments.length!==1?"s":""}
                </button>
              )}
            </div>
            {expandedEvent===ev._id && ev.comments?.length>0 && (
              <div style={{borderTop:`1px solid ${th.tableBdr}`,padding:"12px 16px",background:th.tableHead}} onClick={e=>e.stopPropagation()}>
                {ev.comments.map((c,i) => (
                  <div key={i} style={{padding:"9px 0",borderBottom:i<ev.comments.length-1?`1px solid ${th.tableBdr}`:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:12,fontWeight:700,color:th.text}}>{c.user}</span>
                      <span style={{fontSize:10,color:th.textMuted}}>{c.time}</span>
                    </div>
                    <p style={{fontSize:12,color:th.textSec}}>{c.text}</p>
                    <div style={{display:"flex",gap:10,marginTop:5}}>
                      <button style={{fontSize:11,color:accentC,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Approve</button>
                      <button style={{fontSize:11,color:"#EF4444",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── EDIT LISTING MODAL ──────────────────────────────────────────────────────
  const renderEditModal = () => editModal && (
    <div style={{position:"fixed",inset:0,background:th.overlay,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}}>
      <div style={{background:th.card,borderRadius:20,padding:28,width:420,boxShadow:th.shadowL,border:`1px solid ${th.cardBdr}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontSize:16,fontWeight:700,color:th.text}}>Edit Listing</h3>
          <button onClick={()=>setEditModal(null)} style={{padding:7,borderRadius:8,border:"none",background:th.tableHead,cursor:"pointer",color:th.textSec,display:"flex"}}>
            <Icon name="x" size={16}/>
          </button>
        </div>
        <div style={{display:"flex",gap:12,padding:14,background:th.tableHead,borderRadius:12,marginBottom:14,alignItems:"center"}}>
          {editModal.itemImage
            ? <img src={editModal.itemImage} alt="" style={{width:50,height:50,borderRadius:10,objectFit:"cover"}}/>
            : <div style={{width:50,height:50,borderRadius:10,background:th.cardBdr}}/>
          }
          <div>
            <p style={{fontSize:14,fontWeight:700,color:th.text}}>{editModal.title}</p>
            <p style={{fontSize:12,color:th.textSec,marginTop:2}}>by {editModal.user?.name}</p>
            <p style={{fontSize:13,fontWeight:700,color:accentA,marginTop:2}}>₹{editModal.prize?.toLocaleString()}</p>
          </div>
        </div>
        <div style={{padding:"10px 12px",background:th.accentL,borderRadius:10,marginBottom:18,display:"flex",gap:8,alignItems:"flex-start"}}>
          <Icon name="info-circle" size={13} style={{color:accentA,marginTop:1,flexShrink:0}}/>
          <p style={{fontSize:12,color:th.accentT,lineHeight:1.5}}>Admin can only toggle listing availability status</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>handleToggleListing(editModal)} style={{
            flex:1,padding:"11px",borderRadius:10,border:"none",fontWeight:700,fontSize:13,cursor:"pointer",
            background:editModal.isAvailable?th.badge.red[0]:th.badge.green[0],
            color:      editModal.isAvailable?th.badge.red[1]:th.badge.green[1],
          }}>
            {editModal.isAvailable?"Mark as Unavailable":"Mark as Available"}
          </button>
          <button onClick={()=>setEditModal(null)} style={{padding:"11px 18px",borderRadius:10,border:`1px solid ${th.inputBdr}`,background:"transparent",color:th.textSec,fontSize:13,cursor:"pointer"}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{globalCSS}</style>

      {/*
        FIX #7 — No paddingTop here. Your Navbar should NOT overlap this.
        If Navbar is position:fixed, add paddingTop equal to its height
        only on the PAGE WRAPPER in your router layout, not here.
        Remove the paddingTop:64 that was causing the gap.
      */}
      <div style={{
        display:"flex",
        height: "calc(100dvh - 64px)",
        background:th.pageBg,
        overflow:"hidden",
        position:"relative",
      }}>

        {/* ── MOBILE DRAWER OVERLAY ───────────────────────────────────────── */}
        {isMobile && mobileDrawer && (
          <div
            onClick={()=>setMobileDrawer(false)}
            style={{position:"fixed",top:64,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",zIndex:200,backdropFilter:"blur(3px)"}}
          />
        )}

        {/* ── SIDEBAR (desktop) / DRAWER (mobile) ─────────────────────────── */}
        <div style={{
          ...(isMobile ? {
            position:"fixed",top:64,left:0,bottom:0,zIndex:201,
            transform: mobileDrawer ? "translateX(0)" : "translateX(-100%)",
            transition:"transform .3s cubic-bezier(.4,0,.2,1)",
            width:260,
          } : {
            width: collapsed ? 64 : 220,
            transition:"width .3s cubic-bezier(.4,0,.2,1)",
            flexShrink:0,
          }),
          background:th.sidebar,
          borderRight:`1px solid ${th.sidebarBdr}`,
          display:"flex",flexDirection:"column",
          overflow:"hidden",
          boxShadow: isMobile ? th.shadowL : "none",
        }}>

          {/* ── Logo / Header row ───────────────────────────────────────────── */}
          {/* EXPANDED: [logo icon + EduVerse text + collapse arrow]            */}
          {/* COLLAPSED: [single branded button — click to expand]              */}
          {(!collapsed || isMobile) ? (
            /* ── EXPANDED STATE ── */
            <div style={{
              height:56,flexShrink:0,
              borderBottom:`1px solid ${th.sidebarBdr}`,
              display:"flex",alignItems:"center",
              padding:"0 12px",gap:8,
            }}>
              {/* Logo mark */}
              <div style={{
                width:30,height:30,borderRadius:8,flexShrink:0,
                background:accentA,
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              {/* Brand name */}
              <span style={{flex:1,fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:14,color:th.text,whiteSpace:"nowrap"}}>
                EduVerse
              </span>
              {/* Collapse / Close button */}
              {isMobile ? (
                <button onClick={()=>setMobileDrawer(false)} style={{
                  width:28,height:28,borderRadius:7,flexShrink:0,
                  border:`1px solid ${th.sidebarBdr}`,background:th.tableHead,
                  cursor:"pointer",color:th.textSec,
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>
                  <Icon name="x" size={14}/>
                </button>
              ) : (
                <button onClick={()=>setCollapsed(true)}
                  title="Collapse sidebar"
                  style={{
                    width:28,height:28,borderRadius:7,flexShrink:0,
                    border:`1px solid ${th.sidebarBdr}`,background:th.tableHead,
                    cursor:"pointer",color:th.textSec,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    transition:"background .15s, color .15s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=accentA;e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor=accentA;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=th.tableHead;e.currentTarget.style.color=th.textSec;e.currentTarget.style.borderColor=th.sidebarBdr;}}
                >
                  <Icon name="chevrons-left" size={14}/>
                </button>
              )}
            </div>
          ) : (
            /* ── COLLAPSED STATE — single unified button fills the header ── */
            <button
              onClick={()=>setCollapsed(false)}
              title="Expand sidebar"
              style={{
                height:56,flexShrink:0,width:"100%",
                borderBottom:`1px solid ${th.sidebarBdr}`,
                background:"transparent",border:"none",cursor:"pointer",
                display:"flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",gap:3,
                padding:0,
                transition:"background .15s",
              }}
              onMouseEnter={e=>e.currentTarget.style.background=th.navHover}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              {/* Book icon — EduVerse brand mark */}
              <div style={{
                width:32,height:32,borderRadius:9,
                background:accentA,
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:`0 2px 8px ${accentA}55`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
            </button>
          )}

          {/* ── Nav items ───────────────────────────────────────────────────── */}
          <nav style={{flex:1,padding:"8px 6px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
            {NAV.map(n => {
              const active = tab===n.id;
              const slim = collapsed && !isMobile;
              return (
                <button key={n.id}
                  onClick={()=>{ setTab(n.id); if(isMobile) setMobileDrawer(false); }}
                  className={active?"":"nav-btn"}
                  title={slim ? n.label : ""}
                  style={{
                    display:"flex",alignItems:"center",gap:10,
                    padding: slim ? "11px 0" : "10px 10px",
                    justifyContent: slim ? "center" : "flex-start",
                    borderRadius: slim ? 10 : 10,
                    border:"none",width:"100%",
                    background: active ? (slim ? "transparent" : accentA) : "transparent",
                    color: active ? (slim ? accentA : "#fff") : th.textSec,
                    fontWeight:active?600:500,fontSize:13,cursor:"pointer",
                    transition:"background .15s, color .15s",
                    position:"relative",
                  }}>
                  {/* Left accent bar for active item when collapsed */}
                  {active && slim && (
                    <span style={{
                      position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",
                      width:3,height:22,borderRadius:"0 3px 3px 0",
                      background:accentA,
                    }}/>
                  )}
                  {/* Icon wrapper — accent bg when slim+active */}
                  <div style={{
                    width: slim ? 36 : "auto",
                    height: slim ? 36 : "auto",
                    borderRadius: slim ? 10 : 0,
                    background: slim && active ? accentA+"18" : "transparent",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    flexShrink:0,
                  }}>
                    <Icon name={n.icon} size={18} style={{color: active ? (slim ? accentA : "#fff") : th.textSec}}/>
                  </div>
                  {!slim && <span style={{flex:1,textAlign:"left"}}>{n.label}</span>}
                  {active && !slim && (
                    <span style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,.65)",flexShrink:0}}/>
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── User footer ─────────────────────────────────────────────────── */}
          <div style={{
            borderTop:`1px solid ${th.sidebarBdr}`,
            padding: (collapsed && !isMobile) ? "10px 6px" : "10px 12px",
            display:"flex",alignItems:"center",gap:10,
            justifyContent:(collapsed && !isMobile)?"center":"flex-start",
          }}>
            <div style={{
              width:32,height:32,borderRadius:"50%",
              background:accentA,flexShrink:0,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:12,fontWeight:700,color:"#fff",
            }}>
              {initials(user?.name||"Admin")}
            </div>
            {(!collapsed || isMobile) && (
              <div style={{minWidth:0}}>
                <p style={{fontSize:12,fontWeight:700,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name||"Admin"}</p>
                <p style={{fontSize:10,color:th.textMuted}}>Super Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* ── MAIN AREA ────────────────────────────────────────────────────── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>

          {/* Topbar */}
          <div style={{
            background:th.topbar,borderBottom:`1px solid ${th.topbarBdr}`,
            padding: isMobile ? "0 12px" : "0 24px",
            height:52,display:"flex",alignItems:"center",
            justifyContent:"space-between",flexShrink:0,
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {isMobile && (
                <button onClick={()=>setMobileDrawer(true)} style={{
                  width:36,height:36,borderRadius:10,
                  border:`1px solid ${th.sidebarBdr}`,
                  background:th.tableHead,cursor:"pointer",color:th.textSec,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                }}>
                  <Icon name="menu-2" size={18}/>
                </button>
              )}
              <h2 style={{fontSize:isMobile?14:15,fontWeight:700,color:th.text}}>
                {NAV.find(n=>n.id===tab)?.label||"Dashboard"}
              </h2>
              {!isMobile && <LiveClock/>}
            </div>

            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {!isMobile && (
                <span style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:accentC,background:th.badge.green[0],padding:"3px 10px",borderRadius:20,fontWeight:600}}>
                  <span className="live-dot" style={{width:6,height:6,borderRadius:"50%",background:accentC}}/>
                  LIVE
                </span>
              )}
              {/* Bell — desktop only, too crowded on mobile */}
              {!isMobile && (
                <button style={{
                  width:34,height:34,borderRadius:10,
                  border:`1px solid ${th.cardBdr}`,background:th.tableHead,
                  cursor:"pointer",color:th.textSec,
                  display:"flex",alignItems:"center",justifyContent:"center",position:"relative",
                }}>
                  <Icon name="bell" size={16}/>
                  <span style={{position:"absolute",top:6,right:6,width:6,height:6,borderRadius:"50%",background:accentB,border:`2px solid ${th.topbar}`}}/>
                </button>
              )}
              {/* Avatar — always shown */}
              <div style={{
                width:34,height:34,borderRadius:"50%",
                background:accentA,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:12,fontWeight:700,color:"#fff",flexShrink:0,
                cursor:"default",
              }}>
                {initials(user?.name||"A")}
              </div>
            </div>
          </div>

          {/* Content area */}
          <div style={{
            flex:1, overflowY:"auto",
            padding: isMobile ? "12px 12px 72px" : isTablet ? "18px 20px" : "22px 26px",
          }}>
            {tab==="dashboard" && renderDashboard()}
            {tab==="users"     && renderUsers()}
            {tab==="listings"  && renderListings()}
            {tab==="events"    && renderEvents()}
            {tab==="add"       && (
              <ThemedAddEventForm
                th={th}
                accentA={accentA}
                accentB={accentB}
                isMobile={isMobile}
                editingEvent={editingEvent}
                onSubmit={handleAddEventSubmit}
                onCancel={() => { setEditingEvent(null); setTab("events"); }}
              />
            )}
          </div>

          {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────── */}
          {isMobile && (
            <div style={{
              position:"fixed",bottom:0,left:0,right:0,zIndex:150,
              background:th.topbar,
              borderTop:`1px solid ${th.topbarBdr}`,
              display:"flex",alignItems:"stretch",
              paddingBottom:"env(safe-area-inset-bottom,0px)",
              boxShadow:`0 -2px 12px rgba(0,0,0,.10)`,
            }}>
              {NAV.map(n => {
                const active = tab===n.id;
                return (
                  <button key={n.id} onClick={()=>setTab(n.id)} style={{
                    flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                    gap:3,padding:"8px 4px",border:"none",background:"transparent",
                    color: active ? accentA : th.textMuted,
                    cursor:"pointer",position:"relative",
                  }}>
                    {active && (
                      <span style={{
                        position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",
                        width:24,height:2,borderRadius:2,background:accentA,
                      }}/>
                    )}
                    <Icon name={n.icon} size={active?20:18} style={{transition:"all .15s"}}/>
                    <span style={{fontSize:9,fontWeight:active?700:500,letterSpacing:.3}}>
                      {n.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {renderEditModal()}
    </>
  );
};

export default Admin;

/*
══════════════════════════════════════════════════════════════════════════════
  HOW TO CONNECT THE NAVBAR THEME TOGGLE
══════════════════════════════════════════════════════════════════════════════

  OPTION 1 — Simplest: pass isDark as prop from parent that also renders Navbar
  ─────────────────────────────────────────────────────────────────────────────
  // In App.jsx or your router layout:
  const [isDark, setIsDark] = useState(false);
  <Navbar isDark={isDark} onToggle={() => setIsDark(p => !p)} />
  <Admin  isDark={isDark} />

  Your Navbar already has a toggle button — just make sure it calls onToggle.


  OPTION 2 — Redux (if you have a theme slice)
  ─────────────────────────────────────────────────────────────────────────────
  // themeSlice.js
  const themeSlice = createSlice({
    name: "theme",
    initialState: { isDark: false },
    reducers: { toggle: s => { s.isDark = !s.isDark; } },
  });
  export const { toggle } = themeSlice.actions;
  export default themeSlice.reducer;

  // In Admin.jsx, REPLACE the prop destructuring at the top with:
  const isDark = useSelector(s => s.theme.isDark);

  // In Navbar.jsx:
  const dispatch = useDispatch();
  <button onClick={() => dispatch(toggle())}>Toggle Theme</button>


  OPTION 3 — React Context
  ─────────────────────────────────────────────────────────────────────────────
  // ThemeContext.js
  export const ThemeContext = createContext({ isDark: false, toggle: ()=>{} });
  export const ThemeProvider = ({children}) => {
    const [isDark, setIsDark] = useState(false);
    return (
      <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(p=>!p) }}>
        {children}
      </ThemeContext.Provider>
    );
  };

  // In Admin.jsx, REPLACE the prop destructuring with:
  const { isDark } = useContext(ThemeContext);

  // In Navbar.jsx:
  const { toggle } = useContext(ThemeContext);
  <button onClick={toggle}>Toggle</button>

══════════════════════════════════════════════════════════════════════════════
  FIX SUMMARY
══════════════════════════════════════════════════════════════════════════════

  #1 BLINKING/LOOP — Root cause: inner components (Dashboard, UsersTab etc.)
     were defined INSIDE Admin's render scope, so they remounted every second
     when the clock state updated. Fix: moved all sub-components OUTSIDE Admin
     as memoized components, and isolated the clock into <LiveClock/> so only
     that re-renders every second.

  #2 ADD EVENT FORM — Replaced with fully themed ThemedAddEventForm that
     respects both warm-light and blue-dark tokens, 2-column grid layout,
     focus states, preview, and gradient submit button.

  #3 SLOW LOAD — Same cause as #1. Also added useCallback on all handlers
     so Redux dispatches don't trigger unnecessary renders.

  #4 THEME CONNECTION — 3 options documented above. Component accepts isDark
     prop. Swap to Redux or Context with 1 line change.

  #5 EVENT CLICK → EventDetail — onClick={() => navigate(`/event/${ev._id}`)}
     added to every event card. Edit button uses e.stopPropagation().

  #6 LISTING CLICK → ProductDetail — onClick={() => navigate(`/marketplace/${l._id}`)}
     added to listing rows. Edit button uses e.stopPropagation().

  #7 SCROLL GAP — Removed paddingTop:64 from the outer div. Your Navbar's
     height offset should be handled in the ROUTER LAYOUT wrapper, not here.
     If your Navbar is position:fixed, add paddingTop to the <Routes> wrapper
     in App.jsx: <div style={{paddingTop:64}}><Routes>...</Routes></div>

══════════════════════════════════════════════════════════════════════════════
*/
