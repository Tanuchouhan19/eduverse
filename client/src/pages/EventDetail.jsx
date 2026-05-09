import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Send, User, MessageCircle, Star, Check } from "lucide-react";
import Loader from "../components/Loader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEvent } from "../features/events/eventsSlice.js";

const EventDetail = () => {
  const { event, eventLoading } = useSelector((state) => state.events);
  const { eid } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const [isInterested, setIsInterested] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [intCount, setIntCount] = useState(247);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getEvent(eid)); }, [eid]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/events");
  };

  if (eventLoading) return <Loader />;

  if (!event) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf8f0" }}>
        <div style={{ textAlign: "center", padding: "48px", borderRadius: "28px", background: "rgba(255,248,235,0.9)", boxShadow: "0 8px 40px rgba(74,31,0,0.12)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎓</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: "#4a1f00", marginBottom: "10px" }}>Event Not Found</h1>
          <p style={{ color: "#9a6a45", marginBottom: "28px" }}>This event may have ended or doesn't exist.</p>
          <button onClick={handleBack} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0", background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0", background: "#4a1f00", borderRadius: "100px", overflow: "hidden", boxShadow: "0 8px 24px rgba(74,31,0,0.3)" }}>
              <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg,#e8a045,#c4751a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <span style={{ padding: "0 20px 0 14px", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "13px", fontWeight: 700, color: "rgba(255,230,190,0.9)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Back to Events</span>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(232,160,69,0.6)", marginRight: "14px" }} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLocalComments((prev) => [...prev, { id: Date.now(), username: "You", text: newComment, timestamp: new Date().toLocaleString() }]);
    setNewComment("");
  };

  const handleInterested = () => {
    if (isInterested) return;
    setIsInterested(true);
    setIntCount((c) => c + 1);
    setShowPopup(true);
  };

  const allComments = [...(event.comments ?? []), ...localComments];
  const avatarColors = [
    "linear-gradient(135deg,#e07b39,#b94a1a)",
    "linear-gradient(135deg,#7c3a00,#4a1f00)",
    "linear-gradient(135deg,#c4751a,#7c3a00)",
    "linear-gradient(135deg,#b94a1a,#7c3a00)",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cabinet+Grotesk:wght@400;500;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        :root {
          --cream: #fdf8f0;
          --warm: #f5ede0;
          --amber: #e8a045;
          --amber-deep: #c4751a;
          --rust: #b94a1a;
          --brown: #7c3a00;
          --brown-dark: #4a1f00;
          --text: #3a1a00;
          --muted: #9a6a45;
          --glass: rgba(255,248,235,0.72);
          --border: rgba(200,140,70,0.22);
        }

        .edu-page {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'Cabinet Grotesk', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .bg-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          pointer-events: none;
          z-index: 0;
        }

        .page-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
          padding: 36px 24px 80px;
        }

        /* ── BACK BUTTON ── */
        .back-btn {
          display: inline-flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 48px;
        }

        .back-btn-track {
          display: flex;
          align-items: center;
          background: var(--brown-dark);
          border-radius: 100px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(74,31,0,0.35), 0 2px 8px rgba(74,31,0,0.2), inset 0 1px 0 rgba(255,200,100,0.15);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .back-btn:hover .back-btn-track {
          box-shadow: 0 14px 44px rgba(74,31,0,0.45), 0 4px 12px rgba(74,31,0,0.25);
          transform: translateY(-2px);
        }

        .back-btn-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #e8a045, #c4751a);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .back-arrow {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .back-btn:hover .back-arrow { transform: translateX(-3px); }

        .back-btn-label {
          padding: 0 20px 0 16px;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,230,190,0.9);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .back-btn-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(232,160,69,0.6);
          margin-right: 14px;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        /* ── HERO ── */
        .hero-wrap {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          height: 420px;
          box-shadow: 0 32px 80px rgba(74,31,0,0.3), 0 8px 24px rgba(74,31,0,0.15);
          margin-bottom: 32px;
        }

        .hero-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 6s ease; }
        .hero-wrap:hover img { transform: scale(1.04); }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(74,31,0,0.05) 0%, rgba(40,12,0,0.75) 100%);
        }

        .hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 36px 40px;
          z-index: 2;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: 100px;
          background: rgba(232,160,69,0.2);
          border: 1px solid rgba(232,160,69,0.4);
          backdrop-filter: blur(12px);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ffd080;
          margin-bottom: 14px;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          text-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }

        /* ── INFO STRIP ── */
        .info-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }

        .info-chip {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px 22px;
          border-radius: 20px;
          background: var(--glass);
          border: 1px solid var(--border);
          backdrop-filter: blur(16px);
          box-shadow: 0 4px 20px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
          transition: all 0.25s ease;
        }

        .info-chip:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(180,90,20,0.14), inset 0 1px 0 rgba(255,255,255,0.7);
        }

        .chip-icon {
          width: 46px; height: 46px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .chip-label {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }

        .chip-val { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.3; }

        /* ── CARDS ── */
        .glass-card {
          background: var(--glass);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 40px;
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 40px rgba(180,90,20,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,160,69,0.12), transparent 70%);
          pointer-events: none;
        }

        .section-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--amber-deep);
          margin-bottom: 6px;
        }

        .section-eyebrow::before {
          content: '';
          width: 24px; height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--amber), var(--amber-deep));
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--brown-dark);
          margin-bottom: 20px;
        }

        .about-text {
          font-family: 'Instrument Serif', serif;
          font-size: 16px;
          line-height: 1.85;
          color: #6b3a18;
          margin-bottom: 32px;
        }

        /* ── INTERESTED BUTTON ── */
        .btn-interested {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 0;
          border: none;
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 28px rgba(185,74,26,0.3), 0 2px 8px rgba(185,74,26,0.15);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .btn-interested:not(:disabled):hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 16px 40px rgba(185,74,26,0.4);
        }

        .btn-interested:active { transform: scale(0.97); }

        .btn-interested.idle { background: linear-gradient(135deg, #e07b39, #b94a1a); }
        .btn-interested.done { background: linear-gradient(135deg, #27ae60, #1a7a42); box-shadow: 0 8px 28px rgba(34,120,80,0.3); cursor: default; }

        .btn-i-icon {
          width: 52px; height: 52px;
          background: rgba(0,0,0,0.15);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .btn-i-body {
          padding: 0 24px 0 10px;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 14.5px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .int-wrap { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

        .int-count {
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .int-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--amber-deep);
        }

        /* ── COMMENT FORM ── */
        .comment-form {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 28px;
          padding: 6px 6px 6px 16px;
          background: rgba(255,248,235,0.9);
          border: 1.5px solid rgba(200,140,70,0.25);
          border-radius: 18px;
          box-shadow: inset 0 2px 8px rgba(180,90,20,0.04);
          transition: all 0.3s;
        }

        .comment-form:focus-within {
          border-color: var(--amber-deep);
          box-shadow: 0 0 0 4px rgba(200,117,26,0.1), inset 0 2px 8px rgba(180,90,20,0.04);
        }

        .c-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5c78a, #c4751a);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .comment-input-field {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 14px;
          color: var(--text);
        }

        .comment-input-field::placeholder { color: #c8997a; }

        .send-btn {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e07b39, #b94a1a);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(185,74,26,0.3);
          transition: all 0.25s;
        }

        .send-btn:hover { transform: scale(1.08); box-shadow: 0 6px 18px rgba(185,74,26,0.4); }

        /* ── COMMENT CARDS ── */
        .comment-card {
          display: flex;
          gap: 14px;
          padding: 20px;
          border-radius: 18px;
          background: rgba(255,248,237,0.6);
          border: 1px solid rgba(220,150,80,0.1);
          margin-bottom: 12px;
          transition: all 0.2s;
        }

        .comment-card:hover {
          background: rgba(255,248,237,0.9);
          transform: translateX(4px);
          border-color: rgba(220,150,80,0.2);
        }

        .c-ava {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 14px; color: #fff;
          flex-shrink: 0;
          font-family: 'Cabinet Grotesk', sans-serif;
        }

        .c-name { font-size: 13.5px; font-weight: 700; color: var(--brown-dark); }
        .c-time { font-size: 11px; color: var(--muted); }
        .c-text {
          font-family: 'Instrument Serif', serif;
          font-size: 14.5px;
          color: #6b3a18;
          line-height: 1.65;
          margin-top: 4px;
        }

        .c-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 100px;
          background: rgba(232,160,69,0.12);
          border: 1px solid rgba(232,160,69,0.3);
          font-size: 12px;
          font-weight: 700;
          color: var(--amber-deep);
        }

        .empty-state { text-align: center; padding: 48px 0; color: var(--muted); }
        .empty-icon { font-size: 3rem; margin-bottom: 12px; }

        /* ── POPUP ── */
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(40,12,0,0.6);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(6px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.8) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .popup-box {
          background: #fff;
          border-radius: 32px;
          padding: 48px 44px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 40px 100px rgba(74,31,0,0.35);
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .popup-box::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%; transform: translateX(-50%);
          width: 300px; height: 200px;
          background: radial-gradient(circle, rgba(232,160,69,0.15), transparent 70%);
          pointer-events: none;
        }

        .popup-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.7rem; font-weight: 700; color: var(--brown-dark);
          margin-bottom: 10px;
        }

        .popup-sub {
          font-family: 'Instrument Serif', serif;
          font-size: 15px; color: #8a5030; line-height: 1.7;
          margin-bottom: 32px;
        }

        .popup-close {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 36px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #e07b39, #b94a1a);
          color: #fff;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 14px; font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(185,74,26,0.35);
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .popup-close:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 14px 36px rgba(185,74,26,0.45); }

        @media(max-width: 640px) {
          .info-strip { grid-template-columns: 1fr; }
          .hero-wrap { height: 280px; }
          .glass-card { padding: 24px; }
          .hero-content { padding: 24px; }
        }
      `}</style>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
            <h2 className="popup-title">You're In!</h2>
            <p className="popup-sub">
              We've noted your interest in <strong>{event.eventName}</strong>. We'll keep you posted with all updates and reminders as the event approaches.
            </p>
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              <Check style={{ width: 16, height: 16 }} />
              Awesome, got it!
            </button>
          </div>
        </div>
      )}

      <div className="edu-page">
        {/* Ambient blobs */}
        <div className="bg-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle,#f5a623,#e07b39)", top: -100, right: -100 }} />
        <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle,#c0521a,#7c3a00)", bottom: 100, left: -80 }} />
        <div className="bg-blob" style={{ width: 300, height: 300, background: "radial-gradient(circle,#ffd080,#e8a045)", top: "40%", right: "10%" }} />

        <div className="page-content">

          {/* ── BACK BUTTON ── */}
          <div>
            <button className="back-btn" onClick={handleBack}>
              <div className="back-btn-track">
                <div className="back-btn-icon">
                  <ArrowLeft className="back-arrow" style={{ width: 20, height: 20, color: "#fff" }} />
                </div>
                <span className="back-btn-label">Back to Events</span>
                <span className="back-btn-dot" />
              </div>
            </button>
          </div>

          {/* ── HERO ── */}
          <div className="hero-wrap">
            <img src={event.eventImage} alt={event.eventName} />
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-tag">
                <Star style={{ width: 12, height: 12 }} />
                Upcoming Event
              </div>
              <h1 className="hero-title">{event.eventName}</h1>
            </div>
          </div>

          {/* ── INFO STRIP ── */}
          <div className="info-strip">
            <div className="info-chip">
              <div className="chip-icon" style={{ background: "rgba(232,160,69,0.15)" }}>
                <Calendar style={{ width: 22, height: 22, color: "#c4751a" }} />
              </div>
              <div>
                <div className="chip-label">Date</div>
                <div className="chip-val">{formatDate(event.eventDate)}</div>
              </div>
            </div>
            <div className="info-chip">
              <div className="chip-icon" style={{ background: "rgba(185,74,26,0.12)" }}>
                <Clock style={{ width: 22, height: 22, color: "#b94a1a" }} />
              </div>
              <div>
                <div className="chip-label">Time</div>
                <div className="chip-val">{event.time}</div>
              </div>
            </div>
            <div className="info-chip">
              <div className="chip-icon" style={{ background: "rgba(124,58,0,0.1)" }}>
                <MapPin style={{ width: 22, height: 22, color: "#7c3a00" }} />
              </div>
              <div>
                <div className="chip-label">Location</div>
                <div className="chip-val">{event.location}</div>
              </div>
            </div>
          </div>

          {/* ── ABOUT ── */}
          <div className="glass-card">
            <div className="section-eyebrow">About this Event</div>
            <h2 className="section-title">What's waiting for you</h2>
            <p className="about-text">{event.eventDescription}</p>
            <div className="int-wrap">
              <button
                className={`btn-interested ${isInterested ? "done" : "idle"}`}
                onClick={handleInterested}
                disabled={isInterested}
              >
                <div className="btn-i-icon">
                  {isInterested
                    ? <Check style={{ width: 22, height: 22, color: "#fff" }} />
                    : <Star style={{ width: 22, height: 22, color: "#fff" }} />
                  }
                </div>
                <span className="btn-i-body">
                  {isInterested ? "Interested!" : "I'm Interested"}
                </span>
              </button>
              <div className="int-count">
                <span className="int-num">{intCount}</span>
                <span>people interested</span>
              </div>
            </div>
          </div>

          {/* ── COMMENTS ── */}
          <div className="glass-card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
              <div>
                <div className="section-eyebrow">Community</div>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Discussion</h2>
              </div>
              <span className="c-count-badge">
                <MessageCircle style={{ width: 13, height: 13 }} />
                {allComments.length} comment{allComments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <form className="comment-form" onSubmit={handleAddComment}>
              <div className="c-avatar">
                <User style={{ width: 16, height: 16, color: "#fff" }} />
              </div>
              <input
                type="text"
                className="comment-input-field"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this event…"
              />
              <button type="submit" className="send-btn">
                <Send style={{ width: 16, height: 16, color: "#fff" }} />
              </button>
            </form>

            {allComments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 15, fontStyle: "italic" }}>
                  No comments yet. Be the first to spark a conversation!
                </p>
              </div>
            ) : (
              <div>
                {allComments.map((comment, i) => (
                  <div key={comment.id} className="comment-card">
                    <div
                      className="c-ava"
                      style={{ background: avatarColors[comment.username.charCodeAt(0) % avatarColors.length] }}
                    >
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px", flexWrap: "wrap" }}>
                        <span className="c-name">{comment.username}</span>
                        <span className="c-time">{comment.timestamp}</span>
                      </div>
                      <p className="c-text">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default EventDetail;