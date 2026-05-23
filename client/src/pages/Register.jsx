import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { registerUser } from "../features/auth/authSlice";
import { useTheme } from "../context/ThemeContext";

/* ═══════════════════════════════════════════════════════════
   EduVerse Register — Matching Login Architecture
   useTheme() hook · ev-light / ev-dark class switching
   Split layout · Social auth first · Cinematic hero
═══════════════════════════════════════════════════════════ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .er-root {
    min-height: 100vh; width: 100vw;
    font-family: 'Bricolage Grotesque', sans-serif;
    display: flex; align-items: stretch;
    position: relative; overflow: hidden;
    transition: background 0.4s, color 0.4s;
  }

  /* ── LIGHT / WARM THEME ── */
  .er-root.er-light {
    --bg:        #F7F2EB;
    --panel:     #FFFDF9;
    --card:      #FFFFFF;
    --border:    rgba(0,0,0,0.09);
    --text:      #1A120A;
    --sub:       #6E5440;
    --muted:     #B09880;
    --accent:    #C8610A;
    --accent2:   #E07B25;
    --accentBg:  rgba(200,97,10,0.07);
    --inp-bg:    #F8F4EE;
    --inp-bdr:   rgba(200,97,10,0.18);
    --ring:      rgba(200,97,10,0.14);
    --grad1:     #E8915A;
    --grad2:     #C8610A;
    --grad3:     #8B3A00;
    --glow:      rgba(200,97,10,0.22);
    --hero-bg:   #1A0E06;
    --hero-txt:  #F5EBE0;
    --hero-sub:  rgba(245,235,224,0.60);
    --hero-acc:  #F4A56A;
    --noise:     url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }

  /* ── DARK / BLUE THEME ── */
  .er-root.er-dark {
    --bg:        #080E1C;
    --panel:     #0C1525;
    --card:      #111E33;
    --border:    rgba(255,255,255,0.07);
    --text:      #EBF3FF;
    --sub:       #7BAAD4;
    --muted:     #3D6080;
    --accent:    #4A9EFF;
    --accent2:   #74B8FF;
    --accentBg:  rgba(74,158,255,0.08);
    --inp-bg:    #0A1422;
    --inp-bdr:   rgba(74,158,255,0.20);
    --ring:      rgba(74,158,255,0.16);
    --grad1:     #3B82F6;
    --grad2:     #1D4ED8;
    --grad3:     #1E40AF;
    --glow:      rgba(74,158,255,0.28);
    --hero-bg:   #040A16;
    --hero-txt:  #E8F4FF;
    --hero-sub:  rgba(232,244,255,0.55);
    --hero-acc:  #74B8FF;
    --noise:     url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  }

  /* ════════════ HERO (LEFT) ════════════ */
  .er-hero {
    flex: 1; min-width: 0;
    background: var(--hero-bg);
    position: relative; overflow: hidden;
    display: none; flex-direction: column;
    justify-content: flex-end; padding: 3.5rem;
  }
  @media(min-width:900px) { .er-hero { display: flex; } }

  .er-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 30% 20%, rgba(200,97,10,0.28) 0%, transparent 60%),
      radial-gradient(ellipse 50% 70% at 80% 80%, rgba(139,58,0,0.20) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 60% 40%, rgba(232,145,90,0.12) 0%, transparent 50%);
  }
  .er-dark .er-hero::before {
    background:
      radial-gradient(ellipse 70% 60% at 25% 20%, rgba(30,64,175,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 50% 70% at 80% 85%, rgba(17,40,100,0.30) 0%, transparent 55%),
      radial-gradient(ellipse 45% 45% at 65% 45%, rgba(59,130,246,0.18) 0%, transparent 50%);
  }

  .er-hero-grid {
    position: absolute; inset: 0; opacity: 0.06;
    background-image:
      linear-gradient(var(--hero-acc) 1px, transparent 1px),
      linear-gradient(90deg, var(--hero-acc) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: erGridDrift 18s linear infinite;
  }
  @keyframes erGridDrift {
    from { background-position: 0 0; }
    to   { background-position: 60px 60px; }
  }

  .er-orb {
    position: absolute; border-radius: 50%;
    filter: blur(60px); pointer-events: none;
    animation: erOrbFloat 10s ease-in-out infinite alternate;
  }
  .er-orb-a {
    width: 360px; height: 360px; top: -80px; right: -60px;
    background: radial-gradient(circle, rgba(200,97,10,0.25), transparent 70%);
  }
  .er-orb-b {
    width: 260px; height: 260px; bottom: 20%; left: -40px;
    background: radial-gradient(circle, rgba(232,145,90,0.15), transparent 70%);
    animation-delay: -5s;
  }
  .er-dark .er-orb-a { background: radial-gradient(circle, rgba(59,130,246,0.28), transparent 70%); }
  .er-dark .er-orb-b { background: radial-gradient(circle, rgba(96,165,250,0.14), transparent 70%); }
  @keyframes erOrbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(18px,-22px) scale(1.06); }
  }

  .er-hero-num {
    position: absolute; top: -0.1em; right: -0.04em;
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(12rem, 22vw, 20rem);
    font-weight: 700; line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.04);
    pointer-events: none; user-select: none;
  }

  /* Floating feature chips */
  .er-chips-stack {
    position: absolute;
    top: 50%; right: 3rem;
    transform: translateY(-55%);
    display: flex; flex-direction: column; gap: 12px;
    pointer-events: none;
  }
  .er-chip {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 14px;
    padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
    color: var(--hero-txt);
    font-size: 0.78rem; font-weight: 500;
    animation: erChipIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
    white-space: nowrap;
  }
  .er-chip:nth-child(1) { animation-delay: 0.1s; }
  .er-chip:nth-child(2) { animation-delay: 0.22s; }
  .er-chip:nth-child(3) { animation-delay: 0.34s; }
  .er-chip:nth-child(4) { animation-delay: 0.46s; }
  @keyframes erChipIn {
    from { opacity:0; transform:translateX(30px); }
    to   { opacity:1; transform:translateX(0); }
  }
  .er-chip-dot {
    width: 28px; height: 28px; border-radius: 8px;
    background: linear-gradient(135deg, var(--grad1), var(--grad2));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; flex-shrink: 0;
  }

  .er-hero-content { position: relative; z-index: 2; }
  .er-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--hero-acc); margin-bottom: 1.2rem;
  }
  .er-hero-eyebrow::before {
    content: ''; width: 22px; height: 1.5px;
    background: var(--hero-acc); display: block;
  }
  .er-hero-title {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(2.4rem, 4vw, 3.8rem);
    font-weight: 700; line-height: 1.05;
    letter-spacing: -0.035em;
    color: var(--hero-txt); margin-bottom: 1.2rem;
  }
  .er-hero-italic {
    font-family: 'Instrument Serif', serif;
    font-style: italic; color: var(--hero-acc);
  }
  .er-hero-desc {
    font-size: 0.95rem; line-height: 1.75;
    color: var(--hero-sub);
    max-width: 380px; margin-bottom: 2.5rem;
  }
  .er-stats-row { display: flex; gap: 2.5rem; }
  .er-stat-val {
    font-family: 'Clash Display', sans-serif;
    font-size: 1.8rem; font-weight: 700;
    color: var(--hero-txt); line-height: 1;
    letter-spacing: -0.03em;
  }
  .er-stat-lbl {
    font-size: 0.7rem; color: var(--hero-sub);
    margin-top: 4px; letter-spacing: 0.04em;
  }

  /* ════════════ FORM PANEL (RIGHT) ════════════ */
  .er-panel {
    width: 100%; flex-shrink: 0;
    background: var(--panel);
    background-image: var(--noise);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 2.5rem 1.5rem;
    position: relative; overflow-y: auto;
  }
  @media(min-width:900px) { .er-panel { width: 520px; padding: 2.5rem; } }

  .er-panel::before {
    content: '';
    position: absolute; top: 0; left: 10%; right: 10%; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.5;
  }

  .er-form-wrap {
    width: 100%; max-width: 440px;
    animation: erFormUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes erFormUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Logo */
  .er-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 1.6rem; }
  .er-logo-mark {
    width: 42px; height: 42px; border-radius: 12px;
    background: linear-gradient(135deg, var(--grad1), var(--grad2), var(--grad3));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Clash Display', sans-serif;
    font-weight: 700; font-size: 1rem; color: #fff;
    box-shadow: 0 6px 20px var(--glow);
    position: relative; overflow: hidden;
  }
  .er-logo-mark::after {
    content: '';
    position: absolute; top: -30%; left: -20%; width: 60%; height: 60%;
    background: rgba(255,255,255,0.22); border-radius: 50%;
    filter: blur(6px);
  }
  .er-logo-txt {
    font-family: 'Clash Display', sans-serif;
    font-size: 1.3rem; font-weight: 600; letter-spacing: -0.025em;
  }
  .er-logo-txt span:first-child { color: var(--accent); }
  .er-logo-txt span:last-child  { color: var(--text); }

  /* Headings */
  .er-heading {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(1.6rem, 3vw, 2rem);
    font-weight: 700; letter-spacing: -0.03em;
    color: var(--text); line-height: 1.1; margin-bottom: 0.3rem;
  }
  .er-subhead { font-size: 0.875rem; color: var(--sub); margin-bottom: 1.6rem; }

  /* Social buttons */
  .er-social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.4rem; }
  .er-social-btn {
    padding: 11px 14px;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    border-radius: 12px; border: 1.5px solid var(--border);
    background: var(--card); cursor: pointer;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.875rem; font-weight: 600; color: var(--text);
    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
    position: relative; overflow: hidden; white-space: nowrap;
  }
  .er-social-btn::before {
    content: ''; position: absolute; inset: 0;
    background: var(--accentBg); opacity: 0; transition: opacity 0.22s;
  }
  .er-social-btn:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--ring);
  }
  .er-social-btn:hover::before { opacity: 1; }
  .er-social-btn:active { transform: translateY(0); }

  /* Divider */
  .er-divider {
    display: flex; align-items: center; gap: 12px; margin-bottom: 1.4rem;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted);
  }
  .er-div-line { flex: 1; height: 1px; background: var(--border); }

  /* Two-column grid for fields */
  .er-fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 14px;
  }
  .er-field-full { grid-column: 1 / -1; }
  @media(max-width:480px) {
    .er-fields-grid { grid-template-columns: 1fr; }
    .er-field-full  { grid-column: 1; }
  }

  .er-field { margin-bottom: 1rem; }
  .er-label {
    display: block; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--sub); margin-bottom: 7px;
  }
  .er-input-wrap { position: relative; }
  .er-input-ico {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); pointer-events: none; transition: color 0.2s;
  }
  .er-input-wrap:focus-within .er-input-ico { color: var(--accent); }
  .er-input {
    width: 100%; padding: 12px 14px 12px 42px;
    border-radius: 12px; border: 1.5px solid var(--inp-bdr);
    background: var(--inp-bg); color: var(--text);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.9rem; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .er-input::placeholder { color: var(--muted); }
  .er-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3.5px var(--ring);
    background: var(--card);
  }
  .er-input-pr { padding-right: 44px; }
  .er-eye-btn {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    padding: 4px; border-radius: 7px; color: var(--muted);
    display: flex; transition: color 0.2s;
  }
  .er-eye-btn:hover { color: var(--accent); }

  /* Submit */
  .er-submit {
    width: 100%; padding: 14px; margin-top: 4px;
    border: none; border-radius: 12px; cursor: pointer;
    font-family: 'Clash Display', sans-serif;
    font-size: 1rem; font-weight: 600; color: #fff;
    background: linear-gradient(135deg, var(--grad1) 0%, var(--grad2) 50%, var(--grad3) 100%);
    background-size: 200% 100%;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
    box-shadow: 0 4px 18px var(--glow);
  }
  .er-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
    transform: translateX(-100%); transition: transform 0.55s ease;
  }
  .er-submit:hover {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px var(--glow);
  }
  .er-submit:hover::before { transform: translateX(100%); }
  .er-submit:active { transform: translateY(0); }
  .er-arrow { display: inline-flex; transition: transform 0.25s; }
  .er-submit:hover .er-arrow { transform: translateX(4px); }

  /* Footer */
  .er-footer-txt {
    text-align: center; font-size: 0.86rem;
    color: var(--sub); margin-top: 1.4rem;
  }
  .er-footer-txt a {
    color: var(--accent); font-weight: 700;
    text-decoration: none; transition: opacity 0.2s;
  }
  .er-footer-txt a:hover { opacity: 0.75; }

  /* Trust strip */
  .er-trust {
    display: flex; align-items: center; justify-content: center; gap: 16px;
    margin-top: 1.4rem; padding-top: 1.2rem;
    border-top: 1px solid var(--border); flex-wrap: wrap;
  }
  .er-trust-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.7rem; color: var(--muted); font-weight: 500;
  }
  .er-trust-ico { color: var(--accent); flex-shrink: 0; }

  @media(max-width:480px) {
    .er-panel { padding: 2rem 1.25rem; }
    .er-heading { font-size: 1.6rem; }
    .er-social-row { grid-template-columns: 1fr 1fr; }
  }
`;

/* ════ Icons (identical style to Login) ════ */
const IcoMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IcoPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.81 19.79 19.79 0 0 1 .07 1.18 2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"/>
  </svg>
);
const IcoUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IcoEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IcoEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);
const IcoArrow = () => (
  <svg className="er-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IcoShield = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoZap = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IcoUsers = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const IcoGithub = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={isDark ? "#e8f4ff" : "#1a120a"}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

/* ════ MAIN COMPONENT ════ */
const Register = () => {
  const { theme }                                  = useTheme();
  const { user, isLoading, isError, message }      = useSelector(s => s.auth);
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const isDark    = theme === "dark";

  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }
    dispatch(registerUser(form));
  };

  const handleGoogleLogin = () => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
    window.location.href = `${base}/auth/google`;
  };

  const handleGithubLogin = () => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
    window.location.href = `${base}/auth/github`;
  };

  useEffect(() => {
    if (user)              navigate("/");
    if (isError && message) toast.error(message, { position: "top-center" });
  }, [isError, message, user, navigate]);

  if (isLoading) return <Loader />;

  const chips = [
    { icon: "🎓", text: "500+ Expert Courses" },
    { icon: "🤖", text: "AI Learning Paths"   },
    { icon: "🎯", text: "Live Mentorship"      },
    { icon: "🏆", text: "Career Certificates"  },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className={`er-root ${isDark ? "er-dark" : "er-light"}`}>

        {/* ── LEFT — cinematic hero ── */}
        <div className="er-hero">
          <div className="er-hero-grid" />
          <div className="er-orb er-orb-a" />
          <div className="er-orb er-orb-b" />
          <div className="er-hero-num">50K</div>

          <div className="er-chips-stack">
            {chips.map(({ icon, text }) => (
              <div className="er-chip" key={text}>
                <div className="er-chip-dot">{icon}</div>
                {text}
              </div>
            ))}
          </div>

          <div className="er-hero-content">
            <div className="er-hero-eyebrow">Learning Platform</div>
            <h1 className="er-hero-title">
              Start Your<br />
              <span className="er-hero-italic">Learning</span><br />
              Journey Today
            </h1>
            <p className="er-hero-desc">
              Join 50,000+ students unlocking their potential with
              AI-powered paths, expert mentors, and live sessions.
            </p>
            <div className="er-stats-row">
              {[["50K+","Students"],["500+","Courses"],["98%","Success"]].map(([v,l]) => (
                <div key={l}>
                  <div className="er-stat-val">{v}</div>
                  <div className="er-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT — form panel ── */}
        <div className="er-panel">
          <div className="er-form-wrap">

            {/* Logo */}
            <div className="er-logo">
              <div className="er-logo-mark">EV</div>
              <div className="er-logo-txt">
                <span>Edu</span><span>Verse 🌍</span>
              </div>
            </div>

            <h1 className="er-heading">Create your account</h1>
            <p className="er-subhead">Join thousands of students learning every day.</p>

            {/* Social auth */}
            <div className="er-social-row">
              <button type="button" className="er-social-btn" onClick={handleGoogleLogin}>
                <IcoGoogle />
                Google
              </button>
              <button type="button" className="er-social-btn" onClick={handleGithubLogin}>
                <IcoGithub isDark={isDark} />
                GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="er-divider">
              <div className="er-div-line" />
              <span>or register with email</span>
              <div className="er-div-line" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="er-fields-grid">

                {/* Name */}
                <div className="er-field">
                  <label className="er-label">Full Name</label>
                  <div className="er-input-wrap">
                    <span className="er-input-ico"><IcoUser /></span>
                    <input type="text" autoComplete="name" className="er-input"
                      placeholder="Jane Doe" value={form.name} onChange={set("name")} required />
                  </div>
                </div>

                {/* Phone */}
                <div className="er-field">
                  <label className="er-label">Phone</label>
                  <div className="er-input-wrap">
                    <span className="er-input-ico"><IcoPhone /></span>
                    <input type="tel" autoComplete="tel" className="er-input"
                      placeholder="+91 98765…" value={form.phone} onChange={set("phone")} required />
                  </div>
                </div>

                {/* Email — full width */}
                <div className="er-field er-field-full">
                  <label className="er-label">Email Address</label>
                  <div className="er-input-wrap">
                    <span className="er-input-ico"><IcoMail /></span>
                    <input type="email" autoComplete="email" className="er-input"
                      placeholder="you@college.edu" value={form.email} onChange={set("email")} required />
                  </div>
                </div>

                {/* Password */}
                <div className="er-field">
                  <label className="er-label">Password</label>
                  <div className="er-input-wrap">
                    <span className="er-input-ico"><IcoLock /></span>
                    <input type={showPwd ? "text" : "password"} autoComplete="new-password"
                      className="er-input er-input-pr" placeholder="••••••••"
                      value={form.password} onChange={set("password")} required />
                    <button type="button" className="er-eye-btn"
                      onClick={() => setShowPwd(p => !p)}
                      aria-label={showPwd ? "Hide password" : "Show password"}>
                      {showPwd ? <IcoEyeOff /> : <IcoEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div className="er-field">
                  <label className="er-label">Confirm</label>
                  <div className="er-input-wrap">
                    <span className="er-input-ico"><IcoLock /></span>
                    <input type={showConf ? "text" : "password"} autoComplete="new-password"
                      className="er-input er-input-pr" placeholder="••••••••"
                      value={form.confirmPassword} onChange={set("confirmPassword")} required />
                    <button type="button" className="er-eye-btn"
                      onClick={() => setShowConf(p => !p)}
                      aria-label={showConf ? "Hide password" : "Show password"}>
                      {showConf ? <IcoEyeOff /> : <IcoEye />}
                    </button>
                  </div>
                </div>

                {/* Submit — full width */}
                <div className="er-field-full">
                  <button type="submit" className="er-submit">
                    Create Account <IcoArrow />
                  </button>
                </div>

              </div>
            </form>

            <p className="er-footer-txt">
              Already have an account?{" "}
              <Link to="/login">Sign in →</Link>
            </p>

            {/* Trust badges */}
            <div className="er-trust">
              <div className="er-trust-item">
                <span className="er-trust-ico"><IcoShield /></span>
                SSL Secured
              </div>
              <div className="er-trust-item">
                <span className="er-trust-ico"><IcoZap /></span>
                Instant Access
              </div>
              <div className="er-trust-item">
                <span className="er-trust-ico"><IcoUsers /></span>
                50K+ Students
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default Register;