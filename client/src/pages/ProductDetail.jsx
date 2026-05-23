import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getProducts } from "../features/products/productSlice.js";
import { apiUrl } from "../config/api.js";
import { useTheme } from "../context/ThemeContext";

/* ═══════════════════════════════════════════════════════════
   ProductDetail — matches Register/Login theme architecture
   useTheme() · pd-light / pd-dark class · CSS string inject
═══════════════════════════════════════════════════════════ */

const isOAuthPhone = (p = "") => /^(google|github):/.test(String(p));

/* ── inline SVG icons (no lucide dep issues) ── */
const Ico = {
  ArrowLeft: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  Mail: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.81 19.79 19.79 0 0 1 .07 1.18 2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"/>
    </svg>
  ),
  Tag: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Heart: ({ filled }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Share: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  Check: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  X: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Sparkles: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.88 5.76a2 2 0 0 0 1.36 1.36L21 12l-5.76 1.88a2 2 0 0 0-1.36 1.36L12 21l-1.88-5.76a2 2 0 0 0-1.36-1.36L3 12l5.76-1.88a2 2 0 0 0 1.36-1.36L12 3z"/>
    </svg>
  ),
  Send: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Shield: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Star: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Bag: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  Eye: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Msg: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  User: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

/* ── CSS — same pattern as Register ── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  /* ── LIGHT / WARM ── */
  .pd-root.pd-light {
    --bg:          #F7F2EB;
    --surface:     #FFFDF9;
    --surface2:    #F4EEE5;
    --card:        #FFFFFF;
    --border:      rgba(0,0,0,0.09);
    --border2:     rgba(0,0,0,0.13);
    --text:        #1A120A;
    --sub:         #6E5440;
    --muted:       #B09880;
    --accent:      #C8610A;
    --accent2:     #E07B25;
    --accent-bg:   rgba(200,97,10,0.07);
    --inp-bg:      #F8F4EE;
    --inp-bdr:     rgba(200,97,10,0.18);
    --ring:        rgba(200,97,10,0.14);
    --grad1:       #E8915A;
    --grad2:       #C8610A;
    --grad3:       #8B3A00;
    --glow:        rgba(200,97,10,0.22);
    --green:       #1e7a45;
    --green-bg:    rgba(30,122,69,0.08);
    --red:         #c0392b;
    --red-bg:      rgba(192,57,43,0.08);
    --amber:       #b06000;
    --amber-bg:    rgba(176,96,0,0.08);
    --shadow:      0 4px 24px rgba(180,120,60,0.12);
    --shadow-lg:   0 12px 48px rgba(180,120,60,0.18);
    --skeleton-a:  #ece8e0;
    --skeleton-b:  #faf5ef;
  }

  /* ── DARK / BLUE ── */
  .pd-root.pd-dark {
    --bg:          #080E1C;
    --surface:     #0C1525;
    --surface2:    #111E33;
    --card:        #111E33;
    --border:      rgba(255,255,255,0.07);
    --border2:     rgba(255,255,255,0.11);
    --text:        #EBF3FF;
    --sub:         #7BAAD4;
    --muted:       #3D6080;
    --accent:      #4A9EFF;
    --accent2:     #74B8FF;
    --accent-bg:   rgba(74,158,255,0.08);
    --inp-bg:      #0A1422;
    --inp-bdr:     rgba(74,158,255,0.20);
    --ring:        rgba(74,158,255,0.16);
    --grad1:       #3B82F6;
    --grad2:       #1D4ED8;
    --grad3:       #1E40AF;
    --glow:        rgba(74,158,255,0.28);
    --green:       #34c472;
    --green-bg:    rgba(52,196,114,0.10);
    --red:         #f06a6a;
    --red-bg:      rgba(240,106,106,0.10);
    --amber:       #f5a623;
    --amber-bg:    rgba(245,166,35,0.10);
    --shadow:      0 4px 24px rgba(0,0,0,0.5);
    --shadow-lg:   0 12px 48px rgba(0,0,0,0.6);
    --skeleton-a:  #1e2636;
    --skeleton-b:  #2a3450;
  }

  /* ── ROOT ── */
  .pd-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'Bricolage Grotesque', sans-serif;
    transition: background 0.4s, color 0.4s;
  }

  .pd-wrap {
    max-width: 1160px;
    margin: 0 auto;
    padding: 32px 28px 100px;
  }
  @media(max-width:600px) { .pd-wrap { padding: 20px 16px 70px; } }

  /* ── BREADCRUMB ── */
  .pd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .pd-breadcrumb a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    transition: opacity .2s;
  }
  .pd-breadcrumb a:hover { opacity: .7; }
  .pd-breadcrumb-sep { color: var(--muted); display: flex; align-items: center; }
  .pd-breadcrumb-cur { color: var(--sub); }
  .pd-breadcrumb-end { color: var(--text); font-weight: 600; }

  /* ── BACK BTN ── */
  .pd-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 600;
    color: var(--sub);
    text-decoration: none;
    padding: 8px 18px 8px 13px;
    border-radius: 50px;
    border: 1.5px solid var(--border2);
    background: var(--surface);
    transition: all .22s cubic-bezier(.34,1.56,.64,1);
    margin-bottom: 32px;
    letter-spacing: .01em;
  }
  .pd-back:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--accent-bg);
    transform: translateX(-3px);
    box-shadow: var(--shadow);
  }

  /* ── GRID ── */
  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 44px;
    align-items: start;
  }
  @media(max-width:860px) { .pd-grid { grid-template-columns: 1fr; gap: 28px; } }

  /* ── LEFT COL ── */
  .pd-left { display: flex; flex-direction: column; gap: 14px; }

  /* IMAGE FRAME */
  .pd-img-frame {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 1;
    background: var(--surface);
    border: 1.5px solid var(--border2);
    box-shadow: var(--shadow);
    cursor: default;
    transition: border-color .3s, box-shadow .3s;
  }
  .pd-img-frame:hover {
    border-color: var(--accent);
    box-shadow: var(--shadow-lg);
  }
  .pd-img {
    width: 100%; height: 100%;
    object-fit: contain;
    padding: 32px;
    opacity: 0;
    transform: scale(.96);
    transition: opacity .5s ease, transform .7s ease;
  }
  .pd-img.loaded { opacity: 1; transform: scale(1); }
  .pd-img-frame:hover .pd-img.loaded { transform: scale(1.04); }

  .pd-no-img {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px; color: var(--muted);
    font-size: 13px;
  }

  /* STATUS BADGE */
  .pd-badge-tl { position: absolute; top: 16px; left: 16px; z-index: 2; }
  .pd-badge-tr { position: absolute; top: 16px; right: 16px; z-index: 2; }

  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700;
    padding: 5px 12px; border-radius: 50px;
    letter-spacing: .02em;
    backdrop-filter: blur(10px);
  }
  .badge-avail {
    background: var(--green-bg); color: var(--green);
    border: 1px solid color-mix(in srgb, var(--green) 25%, transparent);
  }
  .badge-sold {
    background: var(--red-bg); color: var(--red);
    border: 1px solid color-mix(in srgb, var(--red) 25%, transparent);
  }
  .badge-hot {
    background: var(--amber-bg); color: var(--amber);
    border: 1px solid color-mix(in srgb, var(--amber) 25%, transparent);
    animation: hotpulse 2s ease-in-out infinite;
  }
  @keyframes hotpulse { 0%,100%{opacity:1} 50%{opacity:.65} }

  /* OVERLAY ACTIONS */
  .pd-img-actions {
    position: absolute; bottom: 14px; right: 14px;
    display: flex; gap: 8px; z-index: 2;
    opacity: 0; transform: translateY(8px);
    transition: all .25s;
  }
  .pd-img-frame:hover .pd-img-actions { opacity: 1; transform: translateY(0); }

  .pd-ico-btn {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface);
    border: 1.5px solid var(--border2);
    color: var(--sub);
    cursor: pointer; transition: all .22s cubic-bezier(.34,1.56,.64,1);
    backdrop-filter: blur(10px);
  }
  .pd-ico-btn:hover { border-color: var(--accent); color: var(--accent); transform: scale(1.12); }
  .pd-ico-btn.wished { background: var(--red-bg); border-color: var(--red); color: var(--red); }

  /* COPIED */
  .pd-copied {
    text-align: center; font-size: 12px; font-weight: 600;
    color: var(--green); height: 20px;
    opacity: 0; transform: translateY(-4px);
    transition: all .3s; pointer-events: none;
  }
  .pd-copied.show { opacity: 1; transform: translateY(0); }

  /* META CHIPS */
  .pd-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .pd-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 500;
    color: var(--sub);
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 50px;
    padding: 5px 14px;
    transition: all .22s;
    cursor: default;
  }
  .pd-chip:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }

  /* TRUST STRIP */
  .pd-trust {
    display: flex; align-items: center;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 18px;
    padding: 14px 0;
  }
  .pd-trust-item {
    display: flex; align-items: center; gap: 7px;
    font-size: 11.5px; font-weight: 600;
    color: var(--sub); flex: 1;
    justify-content: center;
    letter-spacing: .01em;
  }
  .pd-trust-ico { color: var(--accent); display: flex; }
  .pd-trust-div { width: 1px; height: 22px; background: var(--border); flex-shrink: 0; }

  /* ── RIGHT COL ── */
  .pd-right { display: flex; flex-direction: column; gap: 22px; }

  /* TITLE BLOCK */
  .pd-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10.5px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-bg);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
    border-radius: 50px; padding: 5px 13px;
    width: fit-content;
  }
  .pd-title {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(1.7rem, 3.5vw, 2.4rem);
    font-weight: 700; letter-spacing: -.03em;
    color: var(--text); line-height: 1.2; margin: 0;
  }
  .pd-price-row { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
  .pd-price {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(2.2rem, 5vw, 3.2rem);
    font-weight: 700; letter-spacing: -.04em; line-height: 1;
    background: linear-gradient(135deg, var(--grad1), var(--grad2), var(--grad3));
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .pd-price-orig {
    font-size: .95rem; color: var(--muted);
    text-decoration: line-through; font-weight: 500;
  }
  .pd-discount {
    font-size: 11px; font-weight: 700;
    color: var(--green); background: var(--green-bg);
    border: 1px solid color-mix(in srgb, var(--green) 22%, transparent);
    border-radius: 50px; padding: 3px 10px; letter-spacing: .03em;
  }

  .pd-divider {
    height: 1px;
    background: linear-gradient(90deg, var(--accent) 0%, transparent 65%);
    opacity: .35; border-radius: 2px;
  }

  /* TABS */
  .pd-tabs {
    display: flex; gap: 4px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 4px;
  }
  .pd-tab {
    flex: 1; padding: 9px 16px;
    font-size: 13px; font-weight: 600;
    border-radius: 11px; border: none;
    background: transparent;
    color: var(--sub); cursor: pointer;
    transition: all .22s; letter-spacing: .02em;
    font-family: 'Bricolage Grotesque', sans-serif;
  }
  .pd-tab.active {
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow);
  }
  .pd-tab:hover:not(.active) { color: var(--text); }

  /* TAB CONTENT */
  .pd-tab-body {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 20px 22px;
    min-height: 90px;
    animation: fadeUp .25s ease;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .pd-desc { font-size: 14px; line-height: 1.8; color: var(--sub); margin: 0; }
  .pd-details { display: flex; flex-direction: column; gap: 0; }
  .pd-detail-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 13px; padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .pd-detail-row:last-child { border-bottom: none; }
  .pd-detail-lbl { color: var(--muted); font-weight: 500; }
  .pd-detail-val { color: var(--text); font-weight: 600; }
  .pd-val-green { color: var(--green); }
  .pd-val-red   { color: var(--red); }
  .pd-val-mono  { font-family: monospace; font-size: 12px; letter-spacing: .06em; }

  /* SELLER CARD */
  .pd-seller {
    background: var(--surface);
    border: 1.5px solid var(--border2);
    border-radius: 20px;
    padding: 20px;
    display: flex; flex-direction: column; gap: 14px;
    transition: border-color .25s, box-shadow .25s;
  }
  .pd-seller:hover { border-color: var(--accent); box-shadow: var(--shadow); }

  .pd-seller-hdr {
    display: flex; align-items: center; gap: 7px;
    font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .1em;
    color: var(--muted);
  }
  .pd-seller-hdr-ico { color: var(--accent); display: flex; }
  .pd-verified {
    margin-left: auto; font-size: 11px; font-weight: 700;
    color: var(--green); background: var(--green-bg);
    padding: 3px 10px; border-radius: 50px; letter-spacing: .02em;
    border: 1px solid color-mix(in srgb, var(--green) 22%, transparent);
  }

  .pd-seller-body { display: flex; align-items: center; gap: 14px; }
  .pd-avatar {
    width: 50px; height: 50px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--grad1), var(--grad2), var(--grad3));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Clash Display', sans-serif;
    font-size: 16px; font-weight: 700; color: #fff;
    box-shadow: 0 4px 18px var(--glow);
  }
  .pd-seller-name {
    font-size: 15px; font-weight: 700; color: var(--text); margin: 0 0 3px;
    font-family: 'Clash Display', sans-serif;
  }
  .pd-seller-sub { font-size: 12px; color: var(--muted); margin: 0; }

  .pd-contacts { display: flex; flex-direction: column; gap: 8px; }
  .pd-contact {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: var(--sub);
    background: var(--inp-bg);
    border: 1px solid var(--border);
    border-radius: 12px; padding: 10px 15px;
    transition: all .22s;
    overflow: hidden;
  }
  .pd-contact:hover { border-color: var(--accent); color: var(--text); background: var(--accent-bg); }
  .pd-contact span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pd-contact-ico { color: var(--accent); flex-shrink: 0; display: flex; }

  /* CTA */
  .pd-cta { display: flex; flex-direction: column; gap: 10px; }
  .pd-textarea-lbl {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    color: var(--sub); margin-bottom: -2px;
  }
  .pd-textarea {
    width: 100%; min-height: 90px;
    border-radius: 16px;
    border: 1.5px solid var(--inp-bdr);
    background: var(--inp-bg);
    color: var(--text);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 14px; line-height: 1.6;
    padding: 13px 16px;
    outline: none; resize: vertical;
    transition: border-color .2s, box-shadow .2s;
  }
  .pd-textarea::placeholder { color: var(--muted); }
  .pd-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3.5px var(--ring);
    background: var(--card);
  }

  .pd-btn-primary {
    width: 100%; padding: 15px 24px;
    border-radius: 14px; border: none;
    background: linear-gradient(135deg, var(--grad1) 0%, var(--grad2) 50%, var(--grad3) 100%);
    background-size: 200% 100%;
    color: #fff;
    font-family: 'Clash Display', sans-serif;
    font-size: 15px; font-weight: 600; letter-spacing: .02em;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    transition: all .3s ease;
    box-shadow: 0 6px 24px var(--glow);
    position: relative; overflow: hidden;
  }
  .pd-btn-primary::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transform: translateX(-100%); transition: transform .55s ease;
  }
  .pd-btn-primary:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 10px 32px var(--glow);
  }
  .pd-btn-primary:hover::before { transform: translateX(100%); }
  .pd-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .pd-btn-primary:disabled { opacity: .55; cursor: not-allowed; }

  .pd-btn-secondary {
    width: 100%; padding: 13px 24px;
    border-radius: 14px;
    border: 1.5px solid var(--border2);
    background: var(--surface);
    color: var(--sub);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 14px; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .22s cubic-bezier(.34,1.56,.64,1);
  }
  .pd-btn-secondary:hover { border-color: var(--red); color: var(--red); background: var(--red-bg); }
  .pd-btn-secondary.wished { border-color: var(--red); color: var(--red); background: var(--red-bg); }

  /* SENDING DOTS */
  .pd-dots { display: flex; align-items: center; gap: 5px; }
  .pd-dot {
    width: 5px; height: 5px; background: #fff; border-radius: 50%;
    animation: dotbounce 1.2s ease-in-out infinite;
  }
  .pd-dot:nth-child(2) { animation-delay: .18s; }
  .pd-dot:nth-child(3) { animation-delay: .36s; }
  @keyframes dotbounce { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }

  /* SKELETON */
  .pd-skel {
    background: linear-gradient(90deg, var(--skeleton-a) 25%, var(--skeleton-b) 50%, var(--skeleton-a) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 14px;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* EMPTY STATE */
  .pd-empty {
    min-height: 70vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; text-align: center; padding: 40px;
  }
  .pd-empty-ico {
    width: 84px; height: 84px; border-radius: 50%;
    background: var(--accent-bg);
    border: 1.5px solid color-mix(in srgb, var(--accent) 25%, transparent);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
  }
  .pd-empty h2 { font-family:'Clash Display',sans-serif; font-size:22px; font-weight:700; color:var(--text); margin:0; }
  .pd-empty p  { font-size:14px; color:var(--sub); margin:0; }
  .pd-empty-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; border-radius: 50px;
    background: linear-gradient(135deg, var(--grad1), var(--grad2));
    color: #fff; font-size: 14px; font-weight: 700;
    text-decoration: none; transition: all .25s;
    box-shadow: 0 4px 18px var(--glow);
    font-family: 'Clash Display', sans-serif;
  }
  .pd-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px var(--glow); }

  /* PAGE ENTER ANIMATION */
  .pd-grid { animation: pageIn .5s cubic-bezier(.22,1,.36,1) both; }
  @keyframes pageIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
`;

/* ═══════════════════════════════════════════════ */
const ProductDetail = () => {
  const { pid } = useParams();
  const dispatch = useDispatch();
  const { theme } = useTheme();                        // ← same as Register
  const isDark = theme === "dark";

  const { allProducts, productError, productErrorMessage } =
    useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);

  const fallback = allProducts?.find((p) => p._id === pid);
  const [product, setProduct]     = useState(null);
  const [fetching, setFetching]   = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wished, setWished]       = useState(false);
  const [copied, setCopied]       = useState(false);
  const [tab, setTab]             = useState("description");
  const [msg, setMsg]             = useState("");
  const [sending, setSending]     = useState(false);
  const taRef = useRef(null);

  /* fetch */
  useEffect(() => { if (!allProducts?.length) dispatch(getProducts()); }, []);
  useEffect(() => {
    if (productError && productErrorMessage) toast.error(productErrorMessage);
  }, [productError, productErrorMessage]);

  useEffect(() => {
    setFetching(true);
    axios
      .get(apiUrl(`/api/product/${pid}`))
      .then((r) => setProduct(r.data))
      .catch((e) =>
        toast.error(e.response?.data?.message || "Unable to load listing", { position: "top-center" })
      )
      .finally(() => setFetching(false));
  }, [pid]);

  const displayProduct = product || fallback;

  /* share */
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  /* contact */
  const handleContact = async () => {
    if (!user?.token) {
      toast.error("Please login to contact the seller", { position: "top-center" }); return;
    }
    if (!msg.trim()) {
      toast.error("Please write a message first", { position: "top-center" });
      taRef.current?.focus(); return;
    }
    try {
      setSending(true);
      await axios.post(
        apiUrl(`/api/message/${pid}`),
        { text: msg.trim() },
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      setMsg("");
      toast.success("✓ Message sent to seller!", { position: "top-center" });
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not send message", { position: "top-center" });
    } finally {
      setSending(false);
    }
  };

  const themeClass = `pd-root ${isDark ? "pd-dark" : "pd-light"}`;

  /* ── skeleton ── */
  if (fetching && !displayProduct) {
    return (
      <>
        <style>{CSS}</style>
        <div className={themeClass}>
          <div className="pd-wrap">
            <div className="pd-skel" style={{ height: 16, width: 180, marginBottom: 14 }} />
            <div className="pd-skel" style={{ height: 40, width: 140, marginBottom: 36, borderRadius: 50 }} />
            <div className="pd-grid" style={{ animation: "none" }}>
              <div>
                <div className="pd-skel" style={{ aspectRatio: "1", width: "100%", borderRadius: 24 }} />
                <div style={{ display:"flex", gap:8, marginTop:14 }}>
                  {[80,100,90].map(w => <div key={w} className="pd-skel" style={{ height: 30, width: w, borderRadius: 50 }} />)}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                <div className="pd-skel" style={{ height: 22, width: 120, borderRadius: 50 }} />
                <div className="pd-skel" style={{ height: 48, width: "80%" }} />
                <div className="pd-skel" style={{ height: 60, width: "60%" }} />
                <div className="pd-skel" style={{ height: 100 }} />
                <div className="pd-skel" style={{ height: 140 }} />
                <div className="pd-skel" style={{ height: 52, borderRadius: 14 }} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── empty ── */
  if (!displayProduct) {
    return (
      <>
        <style>{CSS}</style>
        <div className={themeClass}>
          <div className="pd-wrap">
            <div className="pd-empty">
              <div className="pd-empty-ico"><Ico.Bag /></div>
              <h2>Listing not found</h2>
              <p>This item may have been removed or is unavailable.</p>
              <Link to="/auth/marketplace" className="pd-empty-btn">
                <Ico.ArrowLeft /> Back to Marketplace
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const initials = displayProduct.user?.name
    ? displayProduct.user.name.slice(0, 2).toUpperCase()
    : "NA";
  const sellerPhone =
    displayProduct.user?.phone && !isOAuthPhone(displayProduct.user.phone)
      ? displayProduct.user.phone
      : "Not provided";
  const origPrice = displayProduct.prize
    ? Math.round(Number(displayProduct.prize) * 1.25).toLocaleString()
    : null;

  /* ── main render ── */
  return (
    <>
      <style>{CSS}</style>
      <div className={themeClass}>
        <div className="pd-wrap">

          {/* breadcrumb */}
          <nav className="pd-breadcrumb">
            <Link to="/auth/marketplace">Marketplace</Link>
            <span className="pd-breadcrumb-sep"><Ico.ChevronRight /></span>
            <span className="pd-breadcrumb-cur">{displayProduct.category || "Listing"}</span>
            <span className="pd-breadcrumb-sep"><Ico.ChevronRight /></span>
            <span className="pd-breadcrumb-end">
              {displayProduct.title?.length > 30
                ? displayProduct.title.slice(0, 30) + "…"
                : displayProduct.title}
            </span>
          </nav>

          {/* back */}
          <Link to="/auth/marketplace" className="pd-back">
            <Ico.ArrowLeft /> Back to Marketplace
          </Link>

          {/* grid */}
          <div className="pd-grid">

            {/* ══ LEFT ══ */}
            <div className="pd-left">

              {/* image frame */}
              <div className="pd-img-frame">
                <div className="pd-badge-tl">
                  {displayProduct.isAvailable ? (
                    <span className="badge badge-avail"><Ico.Check /> Available</span>
                  ) : (
                    <span className="badge badge-sold"><Ico.X /> Sold Out</span>
                  )}
                </div>
                {displayProduct.prize > 10000 && (
                  <div className="pd-badge-tr">
                    <span className="badge badge-hot"><Ico.Sparkles /> Hot Deal</span>
                  </div>
                )}
                {displayProduct.itemImage ? (
                  <img
                    src={displayProduct.itemImage}
                    alt={displayProduct.title}
                    className={`pd-img${imgLoaded ? " loaded" : ""}`}
                    onLoad={() => setImgLoaded(true)}
                  />
                ) : (
                  <div className="pd-no-img">
                    <Ico.Bag />
                    <span>No image available</span>
                  </div>
                )}
                <div className="pd-img-actions">
                  <button
                    className={`pd-ico-btn${wished ? " wished" : ""}`}
                    onClick={() => setWished(!wished)}
                    title={wished ? "Remove wishlist" : "Add to wishlist"}
                  >
                    <Ico.Heart filled={wished} />
                  </button>
                  <button className="pd-ico-btn" onClick={handleShare} title="Copy link">
                    <Ico.Share />
                  </button>
                </div>
              </div>

              {/* copied */}
              <div className={`pd-copied${copied ? " show" : ""}`}>✓ Link copied to clipboard</div>

              {/* meta chips */}
              <div className="pd-chips">
                <div className="pd-chip"><Ico.Tag /> {displayProduct.category || "For Sale"}</div>
                <div className="pd-chip"><Ico.Eye /> {Math.floor(Math.random() * 180) + 40} views</div>
                <div className="pd-chip"><Ico.Clock /> Posted recently</div>
              </div>

              {/* trust strip */}
              <div className="pd-trust">
                <div className="pd-trust-item">
                  <span className="pd-trust-ico"><Ico.Shield /></span>Verified Listing
                </div>
                <div className="pd-trust-div" />
                <div className="pd-trust-item">
                  <span className="pd-trust-ico"><Ico.Star /></span>Student Seller
                </div>
                <div className="pd-trust-div" />
                <div className="pd-trust-item">
                  <span className="pd-trust-ico"><Ico.Msg /></span>Quick Reply
                </div>
              </div>
            </div>

            {/* ══ RIGHT ══ */}
            <div className="pd-right">

              {/* title block */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <span className="pd-eyebrow"><Ico.Sparkles /> Student Listing</span>
                <h1 className="pd-title">{displayProduct.title}</h1>
                <div className="pd-price-row">
                  <span className="pd-price">₹{displayProduct.prize?.toLocaleString()}</span>
                  {origPrice && (
                    <>
                      <span className="pd-price-orig">₹{origPrice}</span>
                      <span className="pd-discount">25% off</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pd-divider" />

              {/* tabs */}
              <div className="pd-tabs">
                {["description", "details"].map((t) => (
                  <button
                    key={t}
                    className={`pd-tab${tab === t ? " active" : ""}`}
                    onClick={() => setTab(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className="pd-tab-body" key={tab}>
                {tab === "description" ? (
                  <p className="pd-desc">{displayProduct.description || "No description provided."}</p>
                ) : (
                  <div className="pd-details">
                    {[
                      ["Category",     displayProduct.category || "—",                             ""],
                      ["Availability", displayProduct.isAvailable ? "In Stock" : "Sold Out",        displayProduct.isAvailable ? "pd-val-green" : "pd-val-red"],
                      ["Price",        `₹${displayProduct.prize?.toLocaleString()}`,               ""],
                      ["Listing ID",   pid?.slice(-8),                                             "pd-val-mono"],
                    ].map(([lbl, val, cls]) => (
                      <div className="pd-detail-row" key={lbl}>
                        <span className="pd-detail-lbl">{lbl}</span>
                        <span className={`pd-detail-val ${cls}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* seller card */}
              <div className="pd-seller">
                <div className="pd-seller-hdr">
                  <span className="pd-seller-hdr-ico"><Ico.User /></span>
                  Seller Details
                  <span className="pd-verified">✓ Verified</span>
                </div>
                <div className="pd-seller-body">
                  <div className="pd-avatar">{initials}</div>
                  <div>
                    <p className="pd-seller-name">{displayProduct.user?.name || "Unknown Seller"}</p>
                    <p className="pd-seller-sub">Verified Student · Campus Seller</p>
                  </div>
                </div>
                <div className="pd-contacts">
                  <div className="pd-contact">
                    <span className="pd-contact-ico"><Ico.Mail /></span>
                    <span>{displayProduct.user?.email || "—"}</span>
                  </div>
                  <div className="pd-contact">
                    <span className="pd-contact-ico"><Ico.Phone /></span>
                    <span>{sellerPhone}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pd-cta">
                <div className="pd-textarea-lbl">
                  <Ico.Msg /> Message to seller
                </div>
                <textarea
                  ref={taRef}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Hi! Is this item still available? I'm interested in…"
                  className="pd-textarea"
                  rows={3}
                />
                <button
                  onClick={handleContact}
                  disabled={sending}
                  className="pd-btn-primary"
                >
                  {sending ? (
                    <span className="pd-dots">
                      <span className="pd-dot"/><span className="pd-dot"/><span className="pd-dot"/>
                      Sending…
                    </span>
                  ) : (
                    <><Ico.Send /> Contact Seller</>
                  )}
                </button>
                <button
                  onClick={() => setWished(!wished)}
                  className={`pd-btn-secondary${wished ? " wished" : ""}`}
                >
                  <Ico.Heart filled={wished} />
                  {wished ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;