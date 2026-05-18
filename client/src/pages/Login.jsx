import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { loginUser } from "../features/auth/authSlice";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

/* ═══════════════════════════════════════════════════════════
   EduVerse Login — World-Class Redesign
   Full-bleed split layout · Social auth at top · Cinematic
═══════════════════════════════════════════════════════════ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Theme tokens ── */
  .ev-root {
    min-height: 100vh; width: 100vw;
    font-family: 'Bricolage Grotesque', sans-serif;
    display: flex; align-items: stretch;
    position: relative; overflow: hidden;
    transition: background 0.4s, color 0.4s;
  }

  /* LIGHT */
  .ev-root.ev-light {
    --bg:       #F7F2EB;
    --panel:    #FFFDF9;
    --card:     #FFFFFF;
    --border:   rgba(0,0,0,0.09);
    --text:     #1A120A;
    --sub:      #6E5440;
    --muted:    #B09880;
    --accent:   #C8610A;
    --accent2:  #E07B25;
    --accentBg: rgba(200,97,10,0.07);
    --inp-bg:   #F8F4EE;
    --inp-bdr:  rgba(200,97,10,0.18);
    --ring:     rgba(200,97,10,0.14);
    --grad1:    #E8915A;
    --grad2:    #C8610A;
    --grad3:    #8B3A00;
    --glow:     rgba(200,97,10,0.22);
    --shine:    rgba(255,255,255,0.55);
    --hero-bg:  #1A0E06;
    --hero-txt: #F5EBE0;
    --hero-sub: rgba(245,235,224,0.60);
    --hero-acc: #F4A56A;
    --noise:    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }

  /* DARK */
  .ev-root.ev-dark {
    --bg:       #080E1C;
    --panel:    #0C1525;
    --card:     #111E33;
    --border:   rgba(255,255,255,0.07);
    --text:     #EBF3FF;
    --sub:      #7BAAD4;
    --muted:    #3D6080;
    --accent:   #4A9EFF;
    --accent2:  #74B8FF;
    --accentBg: rgba(74,158,255,0.08);
    --inp-bg:   #0A1422;
    --inp-bdr:  rgba(74,158,255,0.20);
    --ring:     rgba(74,158,255,0.16);
    --grad1:    #3B82F6;
    --grad2:    #1D4ED8;
    --grad3:    #1E40AF;
    --glow:     rgba(74,158,255,0.28);
    --shine:    rgba(255,255,255,0.06);
    --hero-bg:  #040A16;
    --hero-txt: #E8F4FF;
    --hero-sub: rgba(232,244,255,0.55);
    --hero-acc: #74B8FF;
    --noise:    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  }

  /* ── LAYOUT ── */
  .ev-hero {
    flex: 1; min-width: 0;
    background: var(--hero-bg);
    position: relative; overflow: hidden;
    display: none; flex-direction: column;
    justify-content: flex-end; padding: 3.5rem;
  }
  @media(min-width:900px) { .ev-hero { display: flex; } }

  /* Hero mesh gradient */
  .ev-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 30% 20%, rgba(200,97,10,0.28) 0%, transparent 60%),
      radial-gradient(ellipse 50% 70% at 80% 80%, rgba(139,58,0,0.20) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 60% 40%, rgba(232,145,90,0.12) 0%, transparent 50%);
  }
  .ev-dark .ev-hero::before {
    background:
      radial-gradient(ellipse 70% 60% at 25% 20%, rgba(30,64,175,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 50% 70% at 80% 85%, rgba(17,40,100,0.30) 0%, transparent 55%),
      radial-gradient(ellipse 45% 45% at 65% 45%, rgba(59,130,246,0.18) 0%, transparent 50%);
  }

  /* Animated grid lines on hero */
  .ev-hero-grid {
    position: absolute; inset: 0; opacity: 0.06;
    background-image:
      linear-gradient(var(--hero-acc) 1px, transparent 1px),
      linear-gradient(90deg, var(--hero-acc) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridDrift 18s linear infinite;
  }
  @keyframes gridDrift {
    from { background-position: 0 0; }
    to   { background-position: 60px 60px; }
  }

  /* Floating orbs */
  .ev-orb {
    position: absolute; border-radius: 50%;
    filter: blur(60px); pointer-events: none;
    animation: orbFloat 10s ease-in-out infinite alternate;
  }
  .ev-orb-a {
    width: 360px; height: 360px;
    top: -80px; right: -60px;
    background: radial-gradient(circle, rgba(200,97,10,0.25), transparent 70%);
  }
  .ev-orb-b {
    width: 260px; height: 260px;
    bottom: 20%; left: -40px;
    background: radial-gradient(circle, rgba(232,145,90,0.15), transparent 70%);
    animation-delay: -5s;
  }
  .ev-dark .ev-orb-a { background: radial-gradient(circle, rgba(59,130,246,0.28), transparent 70%); }
  .ev-dark .ev-orb-b { background: radial-gradient(circle, rgba(96,165,250,0.14), transparent 70%); }
  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(18px,-22px) scale(1.06); }
  }

  /* Decorative large number */
  .ev-hero-num {
    position: absolute; top: -0.1em; right: -0.04em;
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(12rem, 22vw, 20rem);
    font-weight: 700; line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.04);
    pointer-events: none; user-select: none;
  }

  /* Floating course cards */
  .ev-cards-stack {
    position: absolute;
    top: 50%; right: 3rem;
    transform: translateY(-55%);
    display: flex; flex-direction: column; gap: 12px;
    pointer-events: none;
  }
  .ev-card-chip {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 14px;
    padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
    color: var(--hero-txt);
    font-size: 0.78rem; font-weight: 500;
    animation: chipIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
    white-space: nowrap;
  }
  .ev-card-chip:nth-child(1) { animation-delay: 0.1s; }
  .ev-card-chip:nth-child(2) { animation-delay: 0.22s; }
  .ev-card-chip:nth-child(3) { animation-delay: 0.34s; }
  .ev-card-chip:nth-child(4) { animation-delay: 0.46s; }
  @keyframes chipIn {
    from { opacity:0; transform:translateX(30px); }
    to   { opacity:1; transform:translateX(0); }
  }
  .ev-chip-dot {
    width: 28px; height: 28px; border-radius: 8px;
    background: linear-gradient(135deg, var(--grad1), var(--grad2));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; flex-shrink: 0;
  }

  /* Hero content */
  .ev-hero-content { position: relative; z-index: 2; }
  .ev-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--hero-acc); margin-bottom: 1.2rem;
  }
  .ev-hero-eyebrow::before {
    content: ''; width: 22px; height: 1.5px;
    background: var(--hero-acc); display: block;
  }

  .ev-hero-title {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(2.4rem, 4vw, 3.8rem);
    font-weight: 700; line-height: 1.05;
    letter-spacing: -0.035em;
    color: var(--hero-txt);
    margin-bottom: 1.2rem;
  }
  .ev-hero-italic {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    color: var(--hero-acc);
  }

  .ev-hero-desc {
    font-size: 0.95rem; line-height: 1.75;
    color: var(--hero-sub);
    max-width: 380px; margin-bottom: 2.5rem;
  }

  .ev-stats-row { display: flex; gap: 2.5rem; }
  .ev-stat-val {
    font-family: 'Clash Display', sans-serif;
    font-size: 1.8rem; font-weight: 700;
    color: var(--hero-txt); line-height: 1;
    letter-spacing: -0.03em;
  }
  .ev-stat-lbl {
    font-size: 0.7rem; color: var(--hero-sub);
    margin-top: 4px; letter-spacing: 0.04em;
  }

  /* ── RIGHT / FORM PANEL ── */
  .ev-panel {
    width: 100%; flex-shrink: 0;
    background: var(--panel);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 2.5rem 1.5rem;
    position: relative; overflow-y: auto;
    /* subtle noise texture */
    background-image: var(--noise);
  }
  @media(min-width:900px) { .ev-panel { width: 480px; padding: 3rem 2.5rem; } }

  /* Subtle top accent line */
  .ev-panel::before {
    content: '';
    position: absolute; top: 0; left: 10%; right: 10%; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.5;
  }

  .ev-form-wrap {
    width: 100%; max-width: 390px;
    animation: formUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes formUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Logo */
  .ev-logo {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 2rem;
  }
  .ev-logo-mark {
    width: 42px; height: 42px; border-radius: 12px;
    background: linear-gradient(135deg, var(--grad1), var(--grad2), var(--grad3));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Clash Display', sans-serif;
    font-weight: 700; font-size: 1rem; color: #fff;
    box-shadow: 0 6px 20px var(--glow);
    position: relative; overflow: hidden;
  }
  .ev-logo-mark::after {
    content: '';
    position: absolute; top: -30%; left: -20%; width: 60%; height: 60%;
    background: rgba(255,255,255,0.22); border-radius: 50%;
    filter: blur(6px);
  }
  .ev-logo-txt {
    font-family: 'Clash Display', sans-serif;
    font-size: 1.3rem; font-weight: 600;
    letter-spacing: -0.025em;
  }
  .ev-logo-txt span:first-child { color: var(--accent); }
  .ev-logo-txt span:last-child  { color: var(--text); }

  /* Heading */
  .ev-heading {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(1.7rem, 3.5vw, 2.1rem);
    font-weight: 700; letter-spacing: -0.03em;
    color: var(--text); line-height: 1.1;
    margin-bottom: 0.35rem;
  }
  .ev-subhead { font-size: 0.9rem; color: var(--sub); margin-bottom: 1.8rem; }

  /* ══ SOCIAL BUTTONS — TOP ══ */
  .ev-social-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.6rem; }
  .ev-social-btn {
    width: 100%; padding: 11px 16px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    border-radius: 12px; border: 1.5px solid var(--border);
    background: var(--card); cursor: pointer;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.9rem; font-weight: 600;
    color: var(--text);
    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
    position: relative; overflow: hidden;
  }
  .ev-social-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--accentBg);
    opacity: 0; transition: opacity 0.22s;
  }
  .ev-social-btn:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 6px 20px var(--ring); }
  .ev-social-btn:hover::before { opacity: 1; }
  .ev-social-btn:active { transform: translateY(0); }

  .ev-social-icon {
    width: 20px; height: 20px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* Divider */
  .ev-divider {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 1.6rem;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted);
  }
  .ev-div-line { flex: 1; height: 1px; background: var(--border); }

  /* Form fields */
  .ev-field { margin-bottom: 1.1rem; }
  .ev-label {
    display: block; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--sub); margin-bottom: 7px;
  }
  .ev-input-wrap { position: relative; }
  .ev-input-ico {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); pointer-events: none; transition: color 0.2s;
  }
  .ev-input-wrap:focus-within .ev-input-ico { color: var(--accent); }
  .ev-input {
    width: 100%; padding: 12px 14px 12px 42px;
    border-radius: 12px; border: 1.5px solid var(--inp-bdr);
    background: var(--inp-bg); color: var(--text);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.92rem; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .ev-input::placeholder { color: var(--muted); }
  .ev-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3.5px var(--ring);
    background: var(--card);
  }
  .ev-input-pr { padding-right: 44px; }
  .ev-eye-btn {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    padding: 4px; border-radius: 7px;
    color: var(--muted); display: flex;
    transition: color 0.2s;
  }
  .ev-eye-btn:hover { color: var(--accent); }

  /* Forgot row */
  .ev-meta-row {
    display: flex; justify-content: flex-end;
    margin: 2px 0 1.5rem;
  }
  .ev-forgot {
    font-size: 0.8rem; font-weight: 600;
    color: var(--accent); text-decoration: none;
    opacity: 0.85; transition: opacity 0.2s;
  }
  .ev-forgot:hover { opacity: 1; }

  /* Submit button */
  .ev-submit {
    width: 100%; padding: 14px;
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
  .ev-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.55s ease;
  }
  .ev-submit:hover { background-position: right center; transform: translateY(-2px); box-shadow: 0 8px 28px var(--glow); }
  .ev-submit:hover::before { transform: translateX(100%); }
  .ev-submit:active { transform: translateY(0); }

  /* Arrow on button */
  .ev-arrow {
    display: inline-flex; transition: transform 0.25s;
  }
  .ev-submit:hover .ev-arrow { transform: translateX(4px); }

  /* Footer text */
  .ev-footer-txt {
    text-align: center; font-size: 0.86rem;
    color: var(--sub); margin-top: 1.6rem;
  }
  .ev-footer-txt a {
    color: var(--accent); font-weight: 700;
    text-decoration: none; transition: opacity 0.2s;
  }
  .ev-footer-txt a:hover { opacity: 0.75; }

  /* Trust badge strip at very bottom */
  .ev-trust {
    display: flex; align-items: center; justify-content: center; gap: 16px;
    margin-top: 1.8rem; padding-top: 1.4rem;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }
  .ev-trust-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.7rem; color: var(--muted); font-weight: 500;
  }
  .ev-trust-ico { color: var(--accent); flex-shrink: 0; }

  /* Responsive */
  @media(max-width:480px) {
    .ev-panel { padding: 2rem 1.25rem; }
    .ev-heading { font-size: 1.6rem; }
  }
`;

/* ── SVG Icons ── */
const IcoMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
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
  <svg className="ev-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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

/* ── COMPONENT ── */
const Login = () => {
  const { login }                                        = useAuth();
  const { theme }                                        = useTheme();
  const { user, isLoading, isSuccess, isError, message } = useSelector(s => s.auth);
  const navigate     = useNavigate();
  const location     = useLocation();
  const dispatch     = useDispatch();
  const redirectPath = location.state?.from?.pathname || "/auth/myprofile";

  const [showPwd, setShowPwd] = useState(false);
  const [form,    setForm]    = useState({ email: "", password: "" });
  const isDark = theme === "dark";

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  const handleGoogleLogin = () => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${base}/auth/google`;
  };

  const handleGithubLogin = () => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${base}/auth/github`;
  };

  useEffect(() => {
    if (isSuccess && user) { login(user); navigate(redirectPath, { replace: true }); }
    if (isError && message) toast.error(message, { position: "top-center" });
  }, [isError, isSuccess, login, message, navigate, redirectPath, user]);

  if (isLoading) return <Loader />;

  const chips = [
    { icon: "🎓", text: "500+ Expert Courses" },
    { icon: "🤖", text: "AI Learning Paths" },
    { icon: "🎯", text: "Live Mentorship" },
    { icon: "🏆", text: "Career Certificates" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className={`ev-root ${isDark ? "ev-dark" : "ev-light"}`}>

        {/* ── LEFT — cinematic hero ── */}
        <div className="ev-hero">
          <div className="ev-hero-grid" />
          <div className="ev-orb ev-orb-a" />
          <div className="ev-orb ev-orb-b" />
          <div className="ev-hero-num">50K</div>

          {/* Floating course chips */}
          <div className="ev-cards-stack">
            {chips.map(({ icon, text }) => (
              <div className="ev-card-chip" key={text}>
                <div className="ev-chip-dot">{icon}</div>
                {text}
              </div>
            ))}
          </div>

          {/* Bottom content */}
          <div className="ev-hero-content">
            <div className="ev-hero-eyebrow">Learning Platform</div>
            <h1 className="ev-hero-title">
              Your World of<br />
              <span className="ev-hero-italic">Knowledge</span><br />
              Awaits You
            </h1>
            <p className="ev-hero-desc">
              Join 50,000+ students unlocking their potential with
              AI-powered paths, expert mentors, and live sessions.
            </p>
            <div className="ev-stats-row">
              {[["50K+","Students"],["500+","Courses"],["98%","Success"]].map(([v,l]) => (
                <div key={l}>
                  <div className="ev-stat-val">{v}</div>
                  <div className="ev-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT — form panel ── */}
        <div className="ev-panel">
          <div className="ev-form-wrap">

            {/* Logo */}
            <div className="ev-logo">
              <div className="ev-logo-mark">EV</div>
              <div className="ev-logo-txt">
                <span>Edu</span><span>Verse 🌍</span>
              </div>
            </div>

            <h1 className="ev-heading">Welcome back!</h1>
            <p className="ev-subhead">Sign in to continue your learning journey.</p>

            {/* ══ Social buttons FIRST ══ */}
            <div className="ev-social-group">
              <button type="button" className="ev-social-btn" onClick={handleGoogleLogin}>
                <span className="ev-social-icon"><IcoGoogle /></span>
                Continue with Google
              </button>
              <button type="button" className="ev-social-btn" onClick={handleGithubLogin}>
                <span className="ev-social-icon"><IcoGithub isDark={isDark} /></span>
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="ev-divider">
              <div className="ev-div-line" />
              <span>or sign in with email</span>
              <div className="ev-div-line" />
            </div>

            {/* Email + Password form */}
            <form onSubmit={handleSubmit}>
              <div className="ev-field">
                <label className="ev-label">Email address</label>
                <div className="ev-input-wrap">
                  <span className="ev-input-ico"><IcoMail /></span>
                  <input
                    type="email" autoComplete="email"
                    className="ev-input"
                    placeholder="you@college.edu"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="ev-field">
                <label className="ev-label">Password</label>
                <div className="ev-input-wrap">
                  <span className="ev-input-ico"><IcoLock /></span>
                  <input
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    className="ev-input ev-input-pr"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button" className="ev-eye-btn"
                    onClick={() => setShowPwd(s => !s)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <IcoEyeOff /> : <IcoEye />}
                  </button>
                </div>
              </div>

              <div className="ev-meta-row">
                <a href="#" className="ev-forgot">Forgot password?</a>
              </div>

              <button type="submit" className="ev-submit">
                Sign In <IcoArrow />
              </button>
            </form>

            <p className="ev-footer-txt">
              Don't have an account?{" "}
              <Link to="/register">Create one free →</Link>
            </p>

            {/* Trust badges */}
            <div className="ev-trust">
              <div className="ev-trust-item">
                <span className="ev-trust-ico"><IcoShield /></span>
                SSL Secured
              </div>
              <div className="ev-trust-item">
                <span className="ev-trust-ico"><IcoZap /></span>
                Instant Access
              </div>
              <div className="ev-trust-item">
                <span className="ev-trust-ico"><IcoUsers /></span>
                50K+ Students
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default Login;