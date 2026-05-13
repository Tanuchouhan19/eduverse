import { useState, useEffect, useRef } from "react"
import { useTheme } from "../context/ThemeContext"

const CAT = {
  books:       { icon:"📚", ga:"#fde68a", gb:"#f59e0b" },
  electronics: { icon:"⚡", ga:"#bae6fd", gb:"#0ea5e9" },
  furniture:   { icon:"🪑", ga:"#bbf7d0", gb:"#22c55e" },
  clothing:    { icon:"👕", ga:"#fbcfe8", gb:"#ec4899" },
  other:       { icon:"📦", ga:"#e9d5ff", gb:"#a855f7" },
}

function Counter({ to }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf, t0
    const tick = ts => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / 1000, 1)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <>{n.toLocaleString("en-IN")}</>
}

export default function EduVerseProfile() {
  const { theme } = useTheme()
  const D = theme === "dark"

  const [tab,       setTab]       = useState("listings")
  const [listings,  setListings]  = useState([])
  const [messages,  setMessages]  = useState([])
  const [form,      setForm]      = useState({ title:"", desc:"", price:"", cat:"", img:"" })
  const [editId,    setEditId]    = useState(null)
  const [filterCat, setFilterCat] = useState("all")
  const [sortBy,    setSortBy]    = useState("newest")
  const [msgQ,      setMsgQ]      = useState("")
  const [replyTo,   setReplyTo]   = useState(null)
  const [replyText, setReplyText] = useState("")
  const [toast,     setToast]     = useState(null)
  const [delId,     setDelId]     = useState(null)
  const [errs,      setErrs]      = useState({})
  const [simName,   setSimName]   = useState("")
  const [simMsg,    setSimMsg]    = useState("")
  const toastTmr = useRef()

  /* ── THEME TOKENS ── */
  const T = D ? {
    /* DARK — deep navy / electric blue */
    pageBg:"#070c1d", surf:"#0c1226", surf2:"#101a35", surf3:"#162040",
    bd:"#1c2e50", bd2:"#243660",
    tx:"#dce8ff", tx2:"#6b8ab8", tx3:"#344d72",
    ac:"#3b82f6", ac2:"#60a5fa", acBg:"#060e26", acBd:"#1a3566",
    glow:"rgba(59,130,246,.25)", glowLg:"rgba(59,130,246,.15)",
    pos:"#34d399", posBg:"#021910", posBd:"rgba(52,211,153,.2)",
    navBg:"rgba(7,12,29,.96)", heroBg:"linear-gradient(155deg,#0a1430 0%,#070c1d 100%)",
    cardBg:"rgba(12,18,38,.93)",
    mesh1:"rgba(59,130,246,.08)", mesh2:"rgba(14,165,233,.06)",
    danger:"#f87171", dangerBg:"rgba(248,113,113,.08)",
    sh:"0 8px 48px rgba(0,0,0,.75)", shSm:"0 3px 20px rgba(0,0,0,.55)",
    inp:"#101a35", tagBg:"rgba(0,0,0,.75)",
  } : {
    /* LIGHT — warm ivory / amber-orange */
    pageBg:"#faf6f0", surf:"#ffffff", surf2:"#fdf9f4", surf3:"#f3e8d8",
    bd:"#e8d9c5", bd2:"#d8c8b0",
    tx:"#1c1410", tx2:"#6b5544", tx3:"#a8907a",
    ac:"#c2410c", ac2:"#ea580c", acBg:"#fff4eb", acBd:"#fddcc6",
    glow:"rgba(194,65,12,.22)", glowLg:"rgba(234,88,12,.12)",
    pos:"#15803d", posBg:"#f0fdf4", posBd:"rgba(21,128,61,.2)",
    navBg:"rgba(250,246,240,.96)", heroBg:"linear-gradient(155deg,#fffbf5 0%,#faf6f0 100%)",
    cardBg:"rgba(255,255,255,.93)",
    mesh1:"rgba(234,88,12,.09)", mesh2:"rgba(245,158,11,.07)",
    danger:"#dc2626", dangerBg:"rgba(220,38,38,.06)",
    sh:"0 8px 48px rgba(150,90,40,.14)", shSm:"0 3px 20px rgba(150,90,40,.09)",
    inp:"#f3ebe0", tagBg:"rgba(255,255,255,.9)",
  }

  const fire = (msg, type="success") => {
    clearTimeout(toastTmr.current)
    setToast({ msg, type })
    toastTmr.current = setTimeout(() => setToast(null), 3200)
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = "Title is required"
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = "Enter a valid price"
    if (!form.cat) e.cat = "Select a category"
    return e
  }

  const handleSubmit = ev => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrs(e); return }
    setErrs({})
    if (editId) {
      setListings(p => p.map(l => l.id === editId ? { ...l, ...form, price: +form.price } : l))
      setEditId(null); fire("Listing updated!")
    } else {
      setListings(p => [{ id:Date.now(), ...form, price:+form.price, views:0, saves:0, badge:"New" }, ...p])
      fire("Listing posted!")
    }
    setForm({ title:"", desc:"", price:"", cat:"", img:"" })
    setTab("listings")
  }

  const startEdit = l => {
    setForm({ title:l.title, desc:l.desc, price:String(l.price), cat:l.cat, img:l.img||"" })
    setEditId(l.id); setTab("add")
    window.scrollTo({ top:0, behavior:"smooth" })
  }

  const doDelete = id => {
    setListings(p => p.filter(l => l.id !== id)); setDelId(null); fire("Listing removed","info")
  }

  const sendReply = id => {
    if (!replyText.trim()) return
    setMessages(p => p.map(m => m.id===id ? { ...m, replied:true, unread:false } : m))
    setReplyTo(null); setReplyText(""); fire("Reply sent!")
  }

  const simulateInquiry = () => {
    const name = simName.trim() || "Anonymous Buyer"
    const fallbacks = ["Is this still available?","Can you lower the price?","What's the condition?","Can I pick it up today?","Is warranty included?"]
    const text = simMsg.trim() || fallbacks[Math.floor(Math.random() * fallbacks.length)]
    const cols = ["#f97316","#8b5cf6","#0ea5e9","#ec4899","#22c55e","#f59e0b"]
    const av = name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)
    setMessages(p => [{ id:Date.now(), from:name, av, col:cols[Math.floor(Math.random()*cols.length)], text, time:"Just now", unread:true }, ...p])
    setSimName(""); setSimMsg(""); fire(`New inquiry from ${name}!`)
  }

  const unread   = messages.filter(m => m.unread).length
  const shown    = listings.filter(l => filterCat==="all" || l.cat===filterCat)
    .sort((a,b) => sortBy==="price-asc" ? a.price-b.price : sortBy==="price-desc" ? b.price-a.price : b.id-a.id)
  const filtMsgs = messages.filter(m =>
    m.from.toLowerCase().includes(msgQ.toLowerCase()) ||
    m.text.toLowerCase().includes(msgQ.toLowerCase())
  )

  const inp = {
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:`1.5px solid ${T.bd}`, background:T.inp, color:T.tx,
    fontSize:14, fontFamily:"'DM Sans',sans-serif",
    outline:"none", resize:"vertical",
    transition:"border-color .2s, box-shadow .2s",
  }
  const lbl = { fontSize:11, fontWeight:700, color:T.tx2, textTransform:"uppercase", letterSpacing:"0.07em", display:"block", marginBottom:7 }
  const errS = { fontSize:12, color:T.danger, marginTop:4 }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        /* ─── Keyframes ─────────────────────────────── */
        @keyframes ev-up    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ev-scale { from{opacity:0;transform:scale(.94)}       to{opacity:1;transform:scale(1)}      }
        @keyframes ev-toast { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes ev-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes ev-ring  { 0%,100%{box-shadow:0 0 0 0 ${T.pos}44} 65%{box-shadow:0 0 0 10px transparent} }
        @keyframes ev-slide { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ev-spin  { to{transform:rotate(360deg)} }

        /* ─── Root ──────────────────────────────────── */
        .ev-root {
          background:${T.pageBg}; color:${T.tx};
          font-family:'DM Sans',sans-serif; font-size:14.5px; line-height:1.6;
          min-height:100vh;
          transition:background .5s cubic-bezier(.4,0,.2,1), color .5s cubic-bezier(.4,0,.2,1);
        }

        /* ─── Hero ──────────────────────────────────── */
        .ev-hero {
          background:${T.heroBg}; position:relative; overflow:hidden;
          transition:background .5s;
        }
        .ev-hero-mesh {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background:
            radial-gradient(ellipse 55% 75% at 5% 20%, ${T.mesh1} 0%, transparent 65%),
            radial-gradient(ellipse 40% 55% at 95% 85%, ${T.mesh2} 0%, transparent 65%);
          transition:background .5s;
        }
        .ev-hero-inner { max-width:1280px; margin:0 auto; padding:40px 28px 0; position:relative; z-index:1; }

        /* ─── Profile card ──────────────────────────── */
        .ev-profile {
          background:${T.cardBg}; backdrop-filter:blur(24px);
          border:1px solid ${T.bd}; border-radius:22px;
          padding:34px 40px; box-shadow:${T.sh};
          display:flex; gap:32px; align-items:center; flex-wrap:wrap;
          position:relative; overflow:hidden;
          transition:background .5s, border-color .5s, box-shadow .5s;
        }
        .ev-profile-orb1 {
          position:absolute; top:-80px; right:-80px; width:260px; height:260px;
          border-radius:50%; pointer-events:none;
          background:radial-gradient(circle, ${T.mesh1} 0%, transparent 70%);
          transition:background .5s;
        }
        .ev-profile-orb2 {
          position:absolute; bottom:-60px; left:-20px; width:180px; height:180px;
          border-radius:50%; pointer-events:none;
          background:radial-gradient(circle, ${T.mesh2} 0%, transparent 70%);
          transition:background .5s;
        }
        .ev-avatar-wrap { position:relative; flex-shrink:0; animation:ev-float 4.5s ease-in-out infinite; }
        .ev-avatar {
          width:100px; height:100px; border-radius:50%;
          background:${D ? "linear-gradient(135deg,#1d4ed8,#3b82f6,#93c5fd)" : "linear-gradient(135deg,#9a3412,#c2410c,#f97316)"};
          display:flex; align-items:center; justify-content:center;
          font-family:'Fraunces',serif; font-weight:900; font-size:36px; color:#fff;
          box-shadow:0 0 0 4px ${T.surf}, 0 0 0 8px ${D?"#1a3566":"#fddcc6"};
          transition:background .5s, box-shadow .5s;
        }
        .ev-online {
          position:absolute; bottom:4px; right:4px;
          width:20px; height:20px; border-radius:50%;
          background:#22c55e; border:3px solid ${T.surf};
          animation:ev-ring 2.8s ease-in-out infinite;
          transition:border-color .5s;
        }
        .ev-profile-info { flex:1; min-width:210px; }
        .ev-profile-tag { font-size:11px; font-weight:700; letter-spacing:.09em; color:${T.ac}; text-transform:uppercase; margin-bottom:5px; transition:color .5s; }
        .ev-profile-name {
          font-family:'Fraunces',serif; font-weight:900;
          font-size:36px; line-height:1; letter-spacing:-.5px;
          color:${T.tx}; margin-bottom:14px; transition:color .5s;
        }
        .ev-info-chips { display:flex; gap:8px; flex-wrap:wrap; }
        .ev-info-chip {
          display:flex; align-items:center; gap:6px;
          padding:6px 12px; border-radius:9px;
          background:${D?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)"};
          border:1px solid ${T.bd}; font-size:12.5px; color:${T.tx2}; font-weight:500;
          transition:background .5s, border-color .5s, color .5s;
        }
        .ev-badges { display:flex; flex-direction:column; gap:9px; align-items:flex-end; }
        .ev-badge-row { display:flex; gap:8px; }
        .ev-badge {
          padding:6px 14px; border-radius:99px; font-size:12.5px; font-weight:700;
          transition:all .5s;
        }
        .ev-badge-ac { background:${T.acBg}; color:${T.ac}; border:1.5px solid ${T.acBd}; }
        .ev-badge-pos { background:${T.posBg}; color:${T.pos}; border:1.5px solid ${T.posBd}; }
        .ev-badge-sm {
          padding:4px 11px; border-radius:99px; font-size:11.5px; font-weight:600;
          background:${T.surf3}; border:1px solid ${T.bd}; color:${T.tx2};
          transition:all .5s;
        }

        /* ─── Stats grid ────────────────────────────── */
        .ev-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin:20px 0 0; }
        .ev-stat {
          background:${T.surf}; border:1px solid ${T.bd}; border-radius:20px;
          padding:22px 16px 18px; text-align:center; cursor:default; position:relative; overflow:hidden;
          transition:transform .3s cubic-bezier(.34,1.4,.64,1), box-shadow .3s, background .5s, border-color .5s;
        }
        .ev-stat:hover { transform:translateY(-6px); box-shadow:${T.sh}; }
        .ev-stat::after {
          content:''; position:absolute; inset:0; opacity:0;
          background:radial-gradient(circle at 50% 0, ${T.glowLg}, transparent 70%);
          transition:opacity .3s;
        }
        .ev-stat:hover::after { opacity:1; }
        .ev-stat-val {
          font-family:'Fraunces',serif; font-size:34px; font-weight:900;
          line-height:1; margin-bottom:5px; letter-spacing:-.5px;
        }
        .ev-stat-lbl { font-size:12px; color:${T.tx2}; font-weight:600; transition:color .5s; }

        /* ─── Tabs ──────────────────────────────────── */
        .ev-tabs { display:flex; gap:5px; padding:20px 0 0; position:relative; z-index:1; }
        .ev-tab {
          flex:1; padding:10px 14px; border-radius:11px; border:none;
          font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif;
          cursor:pointer; white-space:nowrap; min-width:0;
          transition:all .25s cubic-bezier(.34,1.2,.64,1);
        }
        .ev-tab.off { background:${T.surf3}; color:${T.tx2}; }
        .ev-tab.off:hover { color:${T.tx}; background:${T.surf3}; filter:brightness(${D?1.15:.97}); }
        .ev-tab.on {
          background:linear-gradient(135deg,${T.ac},${T.ac2}); color:#fff;
          box-shadow:0 4px 20px ${T.glow}; transform:translateY(-2px);
        }

        /* ─── Main grid ─────────────────────────────── */
        .ev-main { max-width:1280px; margin:0 auto; padding:24px 28px 72px; display:grid; grid-template-columns:1fr 360px; gap:22px; align-items:start; }

        /* ─── Filter bar ────────────────────────────── */
        .ev-chip {
          padding:7px 15px; border-radius:99px; font-size:13px; font-weight:600;
          border:1.5px solid ${T.bd}; background:transparent; color:${T.tx2};
          cursor:pointer; font-family:'DM Sans',sans-serif;
          transition:all .18s;
        }
        .ev-chip:hover { border-color:${T.ac}; color:${T.ac}; transform:translateY(-1px); }
        .ev-chip.on { background:${T.acBg}; border-color:${T.ac}; color:${T.ac}; }

        /* ─── Listing cards ─────────────────────────── */
        .ev-lcard {
          background:${T.surf}; border:1px solid ${T.bd}; border-radius:18px; overflow:hidden;
          transition:transform .28s cubic-bezier(.34,1.2,.64,1), box-shadow .28s, background .5s, border-color .5s;
        }
        .ev-lcard:hover { transform:translateY(-6px) scale(1.012); box-shadow:${T.sh}; }
        .ev-lcard-img { width:100%; height:165px; object-fit:cover; display:block; transition:transform .5s; }
        .ev-lcard:hover .ev-lcard-img { transform:scale(1.07); }

        /* ─── Form inputs ───────────────────────────── */
        .ev-inp:focus { border-color:${T.ac} !important; box-shadow:0 0 0 3px ${T.acBg}; }
        .ev-inp::placeholder { color:${T.tx3}; }
        select.ev-inp { cursor:pointer; }
        select.ev-inp option { background:${T.surf2}; color:${T.tx}; }

        /* ─── Buttons ───────────────────────────────── */
        .btn-primary {
          background:linear-gradient(135deg,${T.ac},${T.ac2}); color:#fff;
          border:none; border-radius:11px; padding:11px 24px; font-weight:700; font-size:14px;
          font-family:'DM Sans',sans-serif; cursor:pointer;
          transition:all .22s; box-shadow:0 4px 18px ${T.glow};
        }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px ${T.glow}; }
        .btn-primary:active { transform:scale(.97); }
        .btn-ghost {
          background:${T.surf3}; color:${T.tx2}; border:1.5px solid ${T.bd};
          border-radius:11px; padding:11px 20px; font-weight:600; font-size:13.5px;
          font-family:'DM Sans',sans-serif; cursor:pointer;
          transition:all .2s;
        }
        .btn-ghost:hover { border-color:${T.ac}; color:${T.ac}; }
        .btn-edit {
          background:${T.posBg}; color:${T.pos}; border:1.5px solid ${T.posBd};
          border-radius:8px; padding:5px 12px; font-weight:700; font-size:12px;
          font-family:'DM Sans',sans-serif; cursor:pointer; transition:transform .15s;
        }
        .btn-edit:hover { transform:scale(1.06); }
        .btn-del {
          background:${T.dangerBg}; color:${T.danger}; border:1.5px solid ${T.danger}28;
          border-radius:8px; padding:5px 12px; font-weight:700; font-size:12px;
          font-family:'DM Sans',sans-serif; cursor:pointer; transition:transform .15s;
        }
        .btn-del:hover { transform:scale(1.06); }

        /* ─── Message cards ─────────────────────────── */
        .ev-msg { border-radius:13px; padding:14px; margin-bottom:8px; cursor:pointer; transition:transform .18s; }
        .ev-msg:hover { transform:translateX(4px); }
        .ev-msg.unread { background:${T.acBg}; border:1px solid ${T.ac}44; border-left:3px solid ${T.ac}; }
        .ev-msg.read { background:${T.surf2}; border:1px solid ${T.bd}; }

        /* ─── Panel ─────────────────────────────────── */
        .ev-panel {
          background:${T.surf}; border:1px solid ${T.bd}; border-radius:22px;
          padding:26px; box-shadow:${T.sh};
          transition:background .5s, border-color .5s, box-shadow .5s;
        }
        .ev-panel-icon {
          width:36px; height:36px; border-radius:10px;
          background:${T.acBg}; border:1.5px solid ${T.acBd};
          display:flex; align-items:center; justify-content:center; font-size:15px;
          flex-shrink:0; transition:all .5s;
        }
        .ev-panel-title {
          font-family:'Fraunces',serif; font-weight:700; font-size:18px;
          color:${T.tx}; display:flex; align-items:center; gap:10px;
          transition:color .5s;
        }

        /* ─── Overlay / Modal ───────────────────────── */
        .ev-overlay {
          position:fixed; inset:0; background:rgba(0,0,0,.62); z-index:500;
          display:flex; align-items:center; justify-content:center;
          backdrop-filter:blur(8px); animation:ev-up .2s ease;
        }

        /* ─── Empty state ───────────────────────────── */
        .ev-empty { text-align:center; padding:70px 0; }
        .ev-empty-icon { font-size:52px; display:block; margin-bottom:14px; opacity:.5; }
        .ev-empty-title { font-size:15px; font-weight:700; color:${T.tx2}; margin-bottom:8px; transition:color .5s; }
        .ev-empty-sub { font-size:13px; color:${T.tx3}; margin-bottom:22px; transition:color .5s; }

        /* ─── Anims ─────────────────────────────────── */
        .aup { animation:ev-up .45s ease both; }
        .asc { animation:ev-scale .35s ease both; }

        /* ─── Scrollbar ─────────────────────────────── */
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${T.bd2}; border-radius:2px; }

        /* ─── Responsive ────────────────────────────── */
        @media(max-width:1100px) {
          .ev-main { grid-template-columns:1fr !important; }
          .ev-msgs-col { position:static !important; }
        }
        @media(max-width:768px) {
          .ev-stats { grid-template-columns:repeat(2,1fr) !important; }
          .ev-profile { flex-direction:column; text-align:center; padding:24px 22px; }
          .ev-badges { align-items:center; }
          .ev-info-chips { justify-content:center; }
          .ev-profile-name { font-size:28px !important; }
          .ev-hero-inner { padding:24px 16px 0 !important; }
          .ev-main { padding:18px 16px 60px !important; }
        }
        @media(max-width:500px) {
          .ev-profile-name { font-size:24px !important; }
          .ev-tabs { flex-wrap:wrap; }
          .ev-tab { font-size:12px; padding:8px 10px; }
          .ev-stats { grid-template-columns:1fr 1fr !important; }
          .ev-form-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div className="ev-root">
        {/* ════════════ HERO ════════════ */}
        <div className="ev-hero">
          <div className="ev-hero-mesh" />
          <div className="ev-hero-inner">

            {/* Profile card */}
            <div className="ev-profile aup">
              <div className="ev-profile-orb1" /><div className="ev-profile-orb2" />
              <div className="ev-avatar-wrap">
                <div className="ev-avatar">B</div>
                <div className="ev-online" />
              </div>
              <div className="ev-profile-info">
                <p className="ev-profile-tag">✦ Student Seller · Premium Member</p>
                <h1 className="ev-profile-name">Bome</h1>
                <div className="ev-info-chips">
                  {[["✉","bome@gmail.com"],["✆","+91 98765 43214"],["⊙","IIT Indore, MP"],["◈","B.Tech · 3rd Year"]].map(([ic,v])=>(
                    <div key={v} className="ev-info-chip"><span style={{fontSize:11}}>{ic}</span><span>{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="ev-badges">
                <div className="ev-badge-row">
                  <div className="ev-badge ev-badge-ac">★ 4.8 Rating</div>
                  <div className="ev-badge ev-badge-pos">✓ Verified</div>
                </div>
                <div className="ev-badge-row">
                  <div className="ev-badge-sm">⊛ {listings.length} Sales</div>
                  <div className="ev-badge-sm">● Top Seller</div>
                  <div className="ev-badge-sm">⬡ Trusted</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="ev-stats">
              {[
                { label:"Active Listings",  val:listings.length,                              c:T.ac  },
                { label:"Unread Messages",  val:unread,                                       c:D?"#a78bfa":"#7c3aed" },
                { label:"Total Views",      val:listings.reduce((a,l)=>a+l.views,0),          c:T.pos },
                { label:"Total Saves",      val:listings.reduce((a,l)=>a+l.saves,0),          c:D?"#f472b6":"#db2777" },
              ].map((s,i)=>(
                <div key={i} className="ev-stat aup" style={{animationDelay:`${i*.07}s`}}>
                  <div className="ev-stat-val" style={{color:s.c}}><Counter to={s.val} /></div>
                  <div className="ev-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="ev-tabs">
              {[["listings","🗂 Listings"],["add",editId?"✎ Edit Listing":"＋ Add Listing"],["analytics","📊 Analytics"]].map(([id,label])=>(
                <button key={id} className={`ev-tab ${tab===id?"on":"off"}`} onClick={()=>setTab(id)}>{label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════ MAIN GRID ════════════ */}
        <div className="ev-main">

          {/* ── LEFT ── */}
          <div>

            {/* LISTINGS TAB */}
            {tab==="listings" && (
              <div className="aup">
                <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
                  {["all","books","electronics","furniture","clothing","other"].map(c=>(
                    <button key={c} className={`ev-chip${filterCat===c?" on":""}`} onClick={()=>setFilterCat(c)}>
                      {CAT[c]?CAT[c].icon+" ":""}{c==="all"?"All":c.charAt(0).toUpperCase()+c.slice(1)}
                    </button>
                  ))}
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="ev-inp"
                    style={{...inp,width:"auto",padding:"7px 13px",marginLeft:"auto",borderRadius:10}}>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price ↑</option>
                    <option value="price-desc">Price ↓</option>
                  </select>
                </div>
                <p style={{fontSize:13,color:T.tx3,marginBottom:16,fontWeight:500}}>
                  Showing <strong style={{color:T.tx}}>{shown.length}</strong> listing{shown.length!==1?"s":""}
                  {filterCat!=="all"?` in ${filterCat}`:""}
                </p>

                {shown.length===0 ? (
                  <div className="ev-empty">
                    <span className="ev-empty-icon">📭</span>
                    <p className="ev-empty-title">No listings yet</p>
                    <p className="ev-empty-sub">Post your first item to get started</p>
                    <button className="btn-primary" onClick={()=>{setFilterCat("all");setTab("add")}}>Post a Listing</button>
                  </div>
                ) : (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:16}}>
                    {shown.map((l,i)=>{
                      const m = CAT[l.cat]||CAT.other
                      return (
                        <div key={l.id} className="ev-lcard aup" style={{animationDelay:`${i*.05}s`}}>
                          <div style={{position:"relative",overflow:"hidden"}}>
                            {l.img
                              ? <img src={l.img} alt={l.title} className="ev-lcard-img" />
                              : <div style={{width:"100%",height:165,background:`linear-gradient(135deg,${m.ga},${m.gb})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44}}>{m.icon}</div>
                            }
                            {l.badge && (
                              <div style={{position:"absolute",top:10,left:10,padding:"3px 11px",borderRadius:99,fontSize:11,fontWeight:700,background:`linear-gradient(135deg,${T.ac},${T.ac2})`,color:"#fff",boxShadow:`0 2px 10px ${T.glow}`}}>{l.badge}</div>
                            )}
                            <div style={{position:"absolute",top:10,right:10,padding:"4px 11px",borderRadius:99,background:T.tagBg,backdropFilter:"blur(8px)",border:`1px solid ${T.bd}`,fontSize:11,fontWeight:700,color:T.tx}}>{m.icon} {l.cat}</div>
                          </div>
                          <div style={{padding:"15px 16px 14px"}}>
                            <h3 style={{fontSize:14.5,fontWeight:700,lineHeight:1.35,marginBottom:6,color:T.tx}}>{l.title}</h3>
                            <p style={{fontSize:13,color:T.tx2,lineHeight:1.6,marginBottom:12,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{l.desc||"No description provided."}</p>
                            <div style={{display:"flex",gap:12,fontSize:12,color:T.tx3,marginBottom:12,fontWeight:500}}>
                              <span>👁 {l.views.toLocaleString()}</span><span>⊕ {l.saves}</span>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:11,borderTop:`1px solid ${T.bd}`}}>
                              <span style={{fontSize:19,fontWeight:800,color:T.ac,fontFamily:"'Fraunces',serif"}}>₹{l.price.toLocaleString("en-IN")}</span>
                              <div style={{display:"flex",gap:6}}>
                                <button className="btn-edit" onClick={()=>startEdit(l)}>Edit</button>
                                <button className="btn-del"  onClick={()=>setDelId(l.id)}>Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ADD/EDIT TAB */}
            {tab==="add" && (
              <div className="asc ev-panel" style={{maxWidth:620}}>
                <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:26}}>
                  <div className="ev-panel-icon" style={{fontSize:18}}>{editId?"✎":"＋"}</div>
                  <div>
                    <h2 style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:20,color:T.tx,lineHeight:1}}>{editId?"Edit Listing":"Post New Listing"}</h2>
                    <p style={{fontSize:13,color:T.tx2,marginTop:3}}>{editId?"Update the details below":"Fill in details to list your item"}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:18}}>
                  <div>
                    <label style={lbl}>Title *</label>
                    <input className="ev-inp" style={inp} placeholder="What are you selling?" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} />
                    {errs.title && <p style={errS}>⚠ {errs.title}</p>}
                  </div>
                  <div>
                    <label style={lbl}>Description</label>
                    <textarea className="ev-inp" style={{...inp,minHeight:88}} rows={3} placeholder="Condition, features, reason for selling…" value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} />
                  </div>
                  <div className="ev-form-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div>
                      <label style={lbl}>Category *</label>
                      <select className="ev-inp" style={inp} value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))}>
                        <option value="">Choose category</option>
                        {Object.entries(CAT).map(([k,v])=>(
                          <option key={k} value={k}>{v.icon} {k.charAt(0).toUpperCase()+k.slice(1)}</option>
                        ))}
                      </select>
                      {errs.cat && <p style={errS}>⚠ {errs.cat}</p>}
                    </div>
                    <div>
                      <label style={lbl}>Price (₹) *</label>
                      <input className="ev-inp" style={inp} type="number" min="1" placeholder="0" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} />
                      {errs.price && <p style={errS}>⚠ {errs.price}</p>}
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Image URL <span style={{textTransform:"none",fontWeight:400,color:T.tx3}}>(optional)</span></label>
                    <input className="ev-inp" style={inp} placeholder="https://..." value={form.img} onChange={e=>setForm(p=>({...p,img:e.target.value}))} />
                    {form.img && <img src={form.img} alt="preview" style={{marginTop:9,width:"100%",height:148,objectFit:"cover",borderRadius:10,border:`1.5px solid ${T.bd}`,display:"block"}} onError={e=>e.target.style.display="none"} />}
                  </div>
                  <div style={{display:"flex",gap:11,paddingTop:4}}>
                    <button type="submit" className="btn-primary" style={{flex:1}}>{editId?"Save Changes":"Post Listing"}</button>
                    {editId && <button type="button" className="btn-ghost" onClick={()=>{setEditId(null);setForm({title:"",desc:"",price:"",cat:"",img:""})}}>Cancel</button>}
                  </div>
                </form>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {tab==="analytics" && (
              <div className="aup">
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:20}}>
                  {[
                    {label:"Revenue Potential",val:`₹${listings.reduce((a,l)=>a+l.price,0).toLocaleString("en-IN")}`,c:T.ac},
                    {label:"Avg Price",val:`₹${listings.length?Math.round(listings.reduce((a,l)=>a+l.price,0)/listings.length).toLocaleString("en-IN"):"0"}`,c:T.pos},
                    {label:"Total Views",val:listings.reduce((a,l)=>a+l.views,0).toLocaleString(),c:D?"#60a5fa":"#1d4ed8"},
                    {label:"Total Saves",val:listings.reduce((a,l)=>a+l.saves,0),c:D?"#f472b6":"#db2777"},
                  ].map((k,i)=>(
                    <div key={i} className="aup ev-panel" style={{display:"flex",gap:14,alignItems:"center",padding:"20px 22px",animationDelay:`${i*.06}s`}}>
                      <div style={{width:44,height:44,borderRadius:12,background:`${k.c}18`,border:`1.5px solid ${k.c}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                        {["₹","~","👁","⊕"][i]}
                      </div>
                      <div>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:k.c,letterSpacing:"-.3px",lineHeight:1}}>{k.val}</div>
                        <div style={{fontSize:12.5,color:T.tx2,marginTop:3}}>{k.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ev-panel aup">
                  <div className="ev-panel-title" style={{marginBottom:22}}><div className="ev-panel-icon">📊</div> Category Breakdown</div>
                  {listings.length===0 ? (
                    <div className="ev-empty" style={{padding:"40px 0"}}>
                      <span className="ev-empty-icon" style={{fontSize:36}}>📊</span>
                      <p className="ev-empty-title">No data yet</p>
                      <p className="ev-empty-sub">Add listings to see analytics</p>
                    </div>
                  ) : Object.entries(
                    listings.reduce((a,l)=>{ a[l.cat]=a[l.cat]||{count:0,views:0,val:0}; a[l.cat].count++; a[l.cat].views+=l.views; a[l.cat].val+=l.price; return a },{})
                  ).map(([cat,s],i)=>{
                    const pct = Math.round((s.count/listings.length)*100)
                    const m = CAT[cat]||CAT.other
                    return (
                      <div key={cat} className="aup" style={{marginBottom:20,animationDelay:`${i*.06}s`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                          <span style={{fontSize:13.5,fontWeight:700,color:T.tx}}>{m.icon} {cat.charAt(0).toUpperCase()+cat.slice(1)}</span>
                          <span style={{fontSize:12.5,color:T.tx2}}>{s.count} item{s.count>1?"s":""} · {pct}% · ₹{s.val.toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{height:7,background:T.surf3,borderRadius:4,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${m.ga},${m.gb})`,borderRadius:4,transition:"width 1.1s cubic-bezier(.34,1.2,.64,1)"}} />
                        </div>
                        <p style={{fontSize:12,color:T.tx3,marginTop:5}}>{s.views.toLocaleString()} total views</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: MESSAGES ── */}
          <div className="ev-msgs-col" style={{position:"sticky",top:70}}>
            <div className="ev-panel">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:15}}>
                <div className="ev-panel-title"><div className="ev-panel-icon">✉</div> Messages</div>
                {unread>0 && (
                  <div style={{padding:"3px 12px",borderRadius:99,background:`linear-gradient(135deg,${T.ac},${T.ac2})`,color:"#fff",fontSize:12,fontWeight:700,boxShadow:`0 2px 10px ${T.glow}`}}>{unread} new</div>
                )}
              </div>

              <div style={{position:"relative",marginBottom:13}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,color:T.tx3,pointerEvents:"none"}}>🔍</span>
                <input className="ev-inp" style={{...inp,paddingLeft:34}} placeholder="Search messages…" value={msgQ} onChange={e=>setMsgQ(e.target.value)} />
              </div>

              <div style={{maxHeight:380,overflowY:"auto",paddingRight:2,marginBottom:16}}>
                {filtMsgs.length===0 ? (
                  <div style={{textAlign:"center",padding:"36px 0",color:T.tx3}}>
                    <div style={{fontSize:36,marginBottom:10,opacity:.5}}>✉</div>
                    <p style={{fontWeight:600,color:T.tx2,marginBottom:4}}>No messages yet</p>
                    <p style={{fontSize:13}}>Buyer inquiries appear here</p>
                  </div>
                ) : filtMsgs.map(m=>(
                  <div key={m.id} className={`ev-msg ${m.unread?"unread":"read"}`}
                    onClick={()=>setMessages(p=>p.map(x=>x.id===m.id?{...x,unread:false}:x))}>
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:38,height:38,borderRadius:"50%",background:m.col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0,boxShadow:`0 2px 8px ${m.col}55`}}>{m.av}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                          <span style={{fontWeight:700,fontSize:13.5,color:T.tx}}>{m.from}</span>
                          <span style={{fontSize:11,color:T.tx3,flexShrink:0,marginLeft:8}}>{m.time}</span>
                        </div>
                        <p style={{fontSize:13,color:T.tx2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.text}</p>
                        {m.replied && <span style={{fontSize:11,color:T.pos,fontWeight:700}}>✓ Replied</span>}
                        <button onClick={e=>{e.stopPropagation();setReplyTo(replyTo===m.id?null:m.id);setReplyText("")}}
                          style={{marginTop:8,padding:"4px 12px",borderRadius:7,background:T.acBg,color:T.ac,border:`1px solid ${T.acBd}`,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .18s"}}>
                          {replyTo===m.id?"✕ Cancel":"↩ Reply"}
                        </button>
                        {replyTo===m.id && (
                          <div style={{marginTop:10,animation:"ev-slide .22s ease"}} onClick={e=>e.stopPropagation()}>
                            <textarea className="ev-inp" style={{...inp,minHeight:68,marginBottom:8,fontSize:13}} placeholder="Type your reply…" value={replyText} onChange={e=>setReplyText(e.target.value)} rows={2} />
                            <button className="btn-primary" style={{padding:"7px 17px",fontSize:13}} onClick={()=>sendReply(m.id)}>Send</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulate buyer inquiry */}
              <div style={{borderTop:`1px solid ${T.bd}`,paddingTop:14}}>
                <label style={{...lbl,marginBottom:10}}>Simulate Buyer Inquiry</label>
                <input className="ev-inp" style={{...inp,marginBottom:8}} placeholder="Buyer name" value={simName} onChange={e=>setSimName(e.target.value)} />
                <input className="ev-inp" style={{...inp,marginBottom:10}} placeholder="Message (optional)" value={simMsg} onChange={e=>setSimMsg(e.target.value)} />
                <button className="btn-primary" style={{width:"100%"}} onClick={simulateInquiry}>Send Inquiry</button>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════ DELETE MODAL ════════════ */}
        {delId && (
          <div className="ev-overlay" onClick={()=>setDelId(null)}>
            <div className="asc" style={{background:T.surf,borderRadius:22,padding:"36px 32px",maxWidth:360,width:"92%",border:`1px solid ${T.bd}`,boxShadow:"0 32px 80px rgba(0,0,0,.45)"}}
              onClick={e=>e.stopPropagation()}>
              <div style={{fontSize:42,textAlign:"center",marginBottom:12}}>🗑</div>
              <h3 style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:700,textAlign:"center",marginBottom:8,color:T.tx}}>Delete this listing?</h3>
              <p style={{color:T.tx2,textAlign:"center",marginBottom:24,fontSize:13.5,lineHeight:1.65}}>This action is permanent and cannot be undone.</p>
              <div style={{display:"flex",gap:11}}>
                <button className="btn-ghost" style={{flex:1}} onClick={()=>setDelId(null)}>Keep it</button>
                <button style={{flex:1,padding:"11px 20px",borderRadius:11,background:"linear-gradient(135deg,#dc2626,#ef4444)",color:"#fff",border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 16px rgba(220,38,38,.4)"}} onClick={()=>doDelete(delId)}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ TOAST ════════════ */}
        {toast && (
          <div style={{position:"fixed",bottom:28,right:28,zIndex:9999,padding:"13px 20px",borderRadius:13,fontWeight:700,fontSize:14,color:"#fff",
            background:toast.type==="success"?"linear-gradient(135deg,#15803d,#22c55e)":toast.type==="info"?`linear-gradient(135deg,${T.ac},${T.ac2})`:"linear-gradient(135deg,#dc2626,#ef4444)",
            boxShadow:"0 10px 36px rgba(0,0,0,.3)",animation:"ev-toast .28s ease",fontFamily:"'DM Sans',sans-serif",maxWidth:320}}>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  )
}
