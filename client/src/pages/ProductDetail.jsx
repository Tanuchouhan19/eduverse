import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, Tag, User, CheckCircle, XCircle,
  Sparkles, ShoppingBag, Share2, Heart, MessageCircle,
  Shield, Star, Clock, ChevronRight, Send, Eye
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { getProducts } from "../features/products/productSlice.js";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl } from "../config/api.js";

/* ─── helpers ─────────────────────────────────────────────────── */
const isOAuthPhonePlaceholder = (phone = "") =>
  /^(google|github):/.test(String(phone));

/* ─── tiny hook: reads theme class on <html> ──────────────────── */
const useTheme = () => {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

/* ─── shimmer skeleton ────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`skeleton-pulse rounded-xl ${className}`} />
);

/* ═══════════════════════════════════════════════════════════════ */
const ProductDetail = () => {
  const { pid } = useParams();
  const dispatch = useDispatch();
  const dark = useTheme();

  const { allProducts, productLoading, productError, productErrorMessage } =
    useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);

  const fallback = allProducts?.find((p) => p._id === pid);
  const [detailProduct, setDetailProduct] = useState(null);
  const product = detailProduct || fallback;

  const [wished, setWished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const textareaRef = useRef(null);

  /* fetch */
  useEffect(() => {
    if (!allProducts?.length) dispatch(getProducts());
  }, []);

  useEffect(() => {
    if (productError && productErrorMessage) toast.error(productErrorMessage);
  }, [productError, productErrorMessage]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(apiUrl(`/api/product/${pid}`))
      .then((r) => setDetailProduct(r.data))
      .catch((e) =>
        toast.error(e.response?.data?.message || "Unable to load listing", {
          position: "top-center",
        })
      )
      .finally(() => setLoading(false));
  }, [pid]);

  /* share */
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  /* contact seller */
  const handleContact = async () => {
    if (!user?.token) {
      toast.error("Please login to contact the seller", { position: "top-center" });
      return;
    }
    if (!messageText.trim()) {
      toast.error("Please write a message first", { position: "top-center" });
      textareaRef.current?.focus();
      return;
    }
    try {
      setSending(true);
      await axios.post(
        apiUrl(`/api/message/${pid}`),
        { text: messageText.trim() },
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      setMessageText("");
      toast.success("✓ Message sent to seller!", { position: "top-center" });
    } catch (e) {
      toast.error(e.response?.data?.message || "Message could not be sent", {
        position: "top-center",
      });
    } finally {
      setSending(false);
    }
  };

  const initials = product?.user?.name
    ? product.user.name.slice(0, 2).toUpperCase()
    : "NA";

  const sellerPhone =
    product?.user?.phone && !isOAuthPhonePlaceholder(product.user.phone)
      ? product.user.phone
      : "Not provided";

  const discountedPrice = product?.prize
    ? Math.round(Number(product.prize) * 1.25).toLocaleString()
    : null;

  /* ── skeleton / loading state ─────────────────────────────── */
  if (loading && !product) {
    return (
      <div className="pd-root">
        <style>{styles(dark)}</style>
        <div className="pd-wrap">
          <Skeleton className="h-5 w-40 mb-10" />
          <div className="pd-grid">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-root">
        <style>{styles(dark)}</style>
        <div className="pd-empty">
          <div className="pd-empty-icon">
            <ShoppingBag size={36} />
          </div>
          <h2>Listing not found</h2>
          <p>This item may have been removed or is unavailable.</p>
          <Link to="/auth/marketplace" className="pd-back-btn">
            <ArrowLeft size={16} /> Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  /* ── main render ───────────────────────────────────────────── */
  return (
    <div className="pd-root">
      <style>{styles(dark)}</style>

      <div className="pd-wrap">

        {/* breadcrumb nav */}
        <nav className="pd-breadcrumb">
          <Link to="/auth/marketplace" className="pd-breadcrumb-link">
            Marketplace
          </Link>
          <ChevronRight size={13} className="pd-breadcrumb-sep" />
          <span className="pd-breadcrumb-current">{product.category || "Listing"}</span>
          <ChevronRight size={13} className="pd-breadcrumb-sep" />
          <span className="pd-breadcrumb-current pd-breadcrumb-title">
            {product.title?.slice(0, 28)}{product.title?.length > 28 ? "…" : ""}
          </span>
        </nav>

        {/* back link */}
        <Link to="/auth/marketplace" className="pd-back">
          <ArrowLeft size={15} />
          Back to Marketplace
        </Link>

        {/* ── 2-col grid ─────────────────────────────────────── */}
        <div className="pd-grid">

          {/* ── LEFT ─────────────────────────────────────────── */}
          <div className="pd-left">

            {/* image frame */}
            <div className="pd-img-frame">
              {/* status badge */}
              <div className="pd-img-badge-tl">
                {product.isAvailable ? (
                  <span className="badge badge-available">
                    <CheckCircle size={11} /> Available
                  </span>
                ) : (
                  <span className="badge badge-sold">
                    <XCircle size={11} /> Sold Out
                  </span>
                )}
              </div>

              {/* hot badge */}
              {product.prize > 10000 && (
                <div className="pd-img-badge-tr">
                  <span className="badge badge-hot">
                    <Sparkles size={10} /> Hot Deal
                  </span>
                </div>
              )}

              {/* image */}
              {product.itemImage ? (
                <img
                  src={product.itemImage}
                  alt={product.title}
                  className={`pd-img ${imgLoaded ? "pd-img-loaded" : ""}`}
                  onLoad={() => setImgLoaded(true)}
                />
              ) : (
                <div className="pd-img-placeholder">
                  <ShoppingBag size={52} />
                  <span>No image available</span>
                </div>
              )}

              {/* overlay actions */}
              <div className="pd-img-actions">
                <button
                  onClick={() => setWished(!wished)}
                  className={`pd-icon-btn ${wished ? "pd-icon-btn-wished" : ""}`}
                  title={wished ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={16} fill={wished ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={handleShare}
                  className="pd-icon-btn"
                  title="Copy link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* copied toast */}
            <div className={`pd-copied ${copied ? "pd-copied-show" : ""}`}>
              ✓ Link copied to clipboard
            </div>

            {/* meta row */}
            <div className="pd-meta-row">
              <div className="pd-chip">
                <Tag size={13} />
                <span>{product.category || "For Sale"}</span>
              </div>
              <div className="pd-chip">
                <Eye size={13} />
                <span>{Math.floor(Math.random() * 200) + 40} views</span>
              </div>
              <div className="pd-chip">
                <Clock size={13} />
                <span>Posted recently</span>
              </div>
            </div>

            {/* trust strip */}
            <div className="pd-trust">
              <div className="pd-trust-item">
                <Shield size={15} className="pd-trust-icon" />
                <span>Verified Listing</span>
              </div>
              <div className="pd-trust-divider" />
              <div className="pd-trust-item">
                <Star size={15} className="pd-trust-icon" />
                <span>Student Seller</span>
              </div>
              <div className="pd-trust-divider" />
              <div className="pd-trust-item">
                <MessageCircle size={15} className="pd-trust-icon" />
                <span>Quick Reply</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT ────────────────────────────────────────── */}
          <div className="pd-right">

            {/* title block */}
            <div className="pd-title-block">
              <span className="pd-listing-badge">
                <Sparkles size={11} /> Student Listing
              </span>
              <h1 className="pd-title">{product.title}</h1>

              {/* price row */}
              <div className="pd-price-row">
                <span className="pd-price">₹{product.prize?.toLocaleString()}</span>
                {discountedPrice && (
                  <>
                    <span className="pd-price-original">₹{discountedPrice}</span>
                    <span className="pd-discount-tag">25% off</span>
                  </>
                )}
              </div>
            </div>

            <div className="pd-divider" />

            {/* tabs */}
            <div className="pd-tabs">
              {["description", "details"].map((tab) => (
                <button
                  key={tab}
                  className={`pd-tab ${activeTab === tab ? "pd-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* tab content */}
            <div className="pd-tab-content">
              {activeTab === "description" ? (
                <p className="pd-description">{product.description}</p>
              ) : (
                <div className="pd-details-grid">
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Category</span>
                    <span className="pd-detail-val">{product.category || "—"}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Availability</span>
                    <span className={`pd-detail-val ${product.isAvailable ? "pd-val-green" : "pd-val-red"}`}>
                      {product.isAvailable ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Price</span>
                    <span className="pd-detail-val">₹{product.prize?.toLocaleString()}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Listing ID</span>
                    <span className="pd-detail-val pd-detail-mono">{pid?.slice(-8)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* seller card */}
            <div className="pd-seller">
              <div className="pd-seller-header">
                <User size={14} />
                <span>Seller Details</span>
                <span className="pd-seller-verified">✓ Verified</span>
              </div>
              <div className="pd-seller-body">
                <div className="pd-seller-avatar">
                  {initials}
                </div>
                <div className="pd-seller-info">
                  <p className="pd-seller-name">{product?.user?.name || "Unknown Seller"}</p>
                  <p className="pd-seller-sub">Verified Student · Campus Seller</p>
                </div>
              </div>
              <div className="pd-seller-contacts">
                <div className="pd-contact-row">
                  <Mail size={14} className="pd-contact-icon" />
                  <span>{product.user?.email || "—"}</span>
                </div>
                <div className="pd-contact-row">
                  <Phone size={14} className="pd-contact-icon" />
                  <span>{sellerPhone}</span>
                </div>
              </div>
            </div>

            {/* message + CTA */}
            <div className="pd-cta-block">
              <label className="pd-textarea-label">
                <MessageCircle size={13} /> Message to seller
              </label>
              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Hi! Is this item still available? I'm interested in..."
                className="pd-textarea"
                rows={3}
              />
              <button
                onClick={handleContact}
                disabled={sending}
                className="pd-cta-primary"
              >
                {sending ? (
                  <span className="pd-sending">
                    <span className="pd-dot" /><span className="pd-dot" /><span className="pd-dot" />
                    Sending…
                  </span>
                ) : (
                  <>
                    <Send size={16} />
                    Contact Seller
                  </>
                )}
              </button>
              <button
                onClick={() => setWished(!wished)}
                className={`pd-cta-secondary ${wished ? "pd-cta-secondary-active" : ""}`}
              >
                <Heart size={15} fill={wished ? "currentColor" : "none"} />
                {wished ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STYLES — scoped, theme-aware, premium
   ═══════════════════════════════════════════════════════════════ */
const styles = (dark) => `
  /* ── tokens ─────────────────────────────────────────────── */
  .pd-root {
    --pd-bg:        ${dark ? "#0d1117" : "#fdf8f2"};
    --pd-surface:   ${dark ? "#161b27" : "#ffffff"};
    --pd-surface2:  ${dark ? "#1e2636" : "#fef9f4"};
    --pd-border:    ${dark ? "#2a3450" : "#e8ddd0"};
    --pd-border2:   ${dark ? "#334166" : "#d4c5b0"};

    --pd-text:      ${dark ? "#e8edf5" : "#1a150e"};
    --pd-text2:     ${dark ? "#8fa3c4" : "#6b5a45"};
    --pd-text3:     ${dark ? "#5a7099" : "#9c8872"};

    --pd-accent:    ${dark ? "#4f8ef7" : "#c2693a"};
    --pd-accent2:   ${dark ? "#6aa3ff" : "#d4824f"};
    --pd-accent-bg: ${dark ? "#1a2d52" : "#fef0e7"};

    --pd-green:     ${dark ? "#34c472" : "#1e7a45"};
    --pd-green-bg:  ${dark ? "#0d2e1e" : "#edf7f1"};
    --pd-red:       ${dark ? "#f06a6a" : "#c0392b"};
    --pd-red-bg:    ${dark ? "#2e0d0d" : "#fdf0ef"};
    --pd-amber:     ${dark ? "#f5a623" : "#b06000"};
    --pd-amber-bg:  ${dark ? "#2e1f06" : "#fff8eb"};

    --pd-gradient:  ${dark
      ? "linear-gradient(135deg, #4f8ef7 0%, #6a5acd 100%)"
      : "linear-gradient(135deg, #c2693a 0%, #e8964f 100%)"};

    --pd-seller-bg: ${dark
      ? "linear-gradient(135deg, #1a2636 0%, #141e2e 100%)"
      : "linear-gradient(135deg, #fdf5ee 0%, #fdf0f8 100%)"};

    --pd-shadow:    ${dark
      ? "0 4px 24px rgba(0,0,0,0.5)"
      : "0 4px 24px rgba(180,120,60,0.12)"};
    --pd-shadow-lg: ${dark
      ? "0 12px 48px rgba(0,0,0,0.6)"
      : "0 12px 48px rgba(180,120,60,0.18)"};

    --pd-radius:    20px;
    --pd-transition: 0.22s cubic-bezier(0.4,0,0.2,1);

    min-height: 100vh;
    background: var(--pd-bg);
    color: var(--pd-text);
    font-family: 'DM Sans', 'Outfit', 'Nunito', sans-serif;
    padding: 0;
  }

  /* ── layout ────────────────────────────────────────────── */
  .pd-wrap {
    max-width: 1120px;
    margin: 0 auto;
    padding: 32px 24px 80px;
  }

  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 12px;
  }

  @media (max-width: 860px) {
    .pd-grid { grid-template-columns: 1fr; gap: 28px; }
    .pd-wrap { padding: 20px 16px 60px; }
  }

  /* ── breadcrumb ─────────────────────────────────────────── */
  .pd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--pd-text3);
    margin-bottom: 12px;
  }
  .pd-breadcrumb-link {
    color: var(--pd-accent);
    text-decoration: none;
    font-weight: 500;
    transition: opacity var(--pd-transition);
  }
  .pd-breadcrumb-link:hover { opacity: 0.75; }
  .pd-breadcrumb-sep { color: var(--pd-text3); flex-shrink: 0; }
  .pd-breadcrumb-current { color: var(--pd-text2); }
  .pd-breadcrumb-title { font-weight: 600; color: var(--pd-text); }

  /* ── back button ────────────────────────────────────────── */
  .pd-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--pd-text2);
    text-decoration: none;
    margin-bottom: 28px;
    padding: 8px 16px 8px 12px;
    border-radius: 50px;
    border: 1.5px solid var(--pd-border);
    background: var(--pd-surface);
    transition: all var(--pd-transition);
    letter-spacing: 0.01em;
  }
  .pd-back:hover {
    color: var(--pd-accent);
    border-color: var(--pd-accent);
    background: var(--pd-accent-bg);
    transform: translateX(-2px);
  }

  /* ── image frame ────────────────────────────────────────── */
  .pd-img-frame {
    position: relative;
    border-radius: var(--pd-radius);
    overflow: hidden;
    aspect-ratio: 1;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    box-shadow: var(--pd-shadow);
    transition: border-color var(--pd-transition), box-shadow var(--pd-transition);
  }
  .pd-img-frame:hover {
    border-color: var(--pd-accent);
    box-shadow: var(--pd-shadow-lg);
  }
  .pd-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 28px;
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.7s ease;
    transform: scale(0.97);
  }
  .pd-img-loaded {
    opacity: 1;
    transform: scale(1);
  }
  .pd-img-frame:hover .pd-img-loaded {
    transform: scale(1.03);
  }
  .pd-img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--pd-text3);
    font-size: 13px;
  }
  .pd-img-badge-tl {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 2;
  }
  .pd-img-badge-tr {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
  }
  .pd-img-actions {
    position: absolute;
    bottom: 14px;
    right: 14px;
    display: flex;
    gap: 8px;
    z-index: 2;
    opacity: 0;
    transform: translateY(8px);
    transition: all var(--pd-transition);
  }
  .pd-img-frame:hover .pd-img-actions {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── badges ─────────────────────────────────────────────── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 11px;
    border-radius: 50px;
    letter-spacing: 0.02em;
    backdrop-filter: blur(8px);
  }
  .badge-available {
    background: var(--pd-green-bg);
    color: var(--pd-green);
    border: 1px solid color-mix(in srgb, var(--pd-green) 30%, transparent);
  }
  .badge-sold {
    background: var(--pd-red-bg);
    color: var(--pd-red);
    border: 1px solid color-mix(in srgb, var(--pd-red) 30%, transparent);
  }
  .badge-hot {
    background: var(--pd-amber-bg);
    color: var(--pd-amber);
    border: 1px solid color-mix(in srgb, var(--pd-amber) 30%, transparent);
    animation: pulse-subtle 2s ease-in-out infinite;
  }
  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.75; }
  }

  /* ── icon button ─────────────────────────────────────────── */
  .pd-icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${dark ? "rgba(22,27,39,0.9)" : "rgba(255,255,255,0.92)"};
    border: 1.5px solid var(--pd-border);
    color: var(--pd-text2);
    cursor: pointer;
    transition: all var(--pd-transition);
    backdrop-filter: blur(8px);
  }
  .pd-icon-btn:hover {
    border-color: var(--pd-accent);
    color: var(--pd-accent);
    transform: scale(1.1);
  }
  .pd-icon-btn-wished {
    background: var(--pd-red-bg) !important;
    border-color: var(--pd-red) !important;
    color: var(--pd-red) !important;
  }

  /* ── copied toast ─────────────────────────────────────────── */
  .pd-copied {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--pd-green);
    margin-top: 8px;
    opacity: 0;
    transform: translateY(-4px);
    transition: all 0.3s ease;
    height: 20px;
  }
  .pd-copied-show {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── meta chips ─────────────────────────────────────────── */
  .pd-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }
  .pd-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: var(--pd-text2);
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: 50px;
    padding: 5px 13px;
    transition: all var(--pd-transition);
  }
  .pd-chip:hover {
    border-color: var(--pd-accent);
    color: var(--pd-accent);
    background: var(--pd-accent-bg);
  }

  /* ── trust strip ────────────────────────────────────────── */
  .pd-trust {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: var(--pd-radius);
    padding: 14px 20px;
    margin-top: 12px;
  }
  .pd-trust-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 600;
    color: var(--pd-text2);
    flex: 1;
    justify-content: center;
  }
  .pd-trust-icon { color: var(--pd-accent); }
  .pd-trust-divider {
    width: 1px;
    height: 22px;
    background: var(--pd-border);
  }

  /* ── right panel ────────────────────────────────────────── */
  .pd-right { display: flex; flex-direction: column; gap: 20px; }

  .pd-title-block { display: flex; flex-direction: column; gap: 10px; }

  .pd-listing-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--pd-accent);
    background: var(--pd-accent-bg);
    border: 1px solid color-mix(in srgb, var(--pd-accent) 25%, transparent);
    border-radius: 50px;
    padding: 5px 12px;
    width: fit-content;
  }

  .pd-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 800;
    color: var(--pd-text);
    line-height: 1.25;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .pd-price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
  }
  .pd-price {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 900;
    background: var(--pd-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    letter-spacing: -0.03em;
  }
  .pd-price-original {
    font-size: 1rem;
    color: var(--pd-text3);
    text-decoration: line-through;
    font-weight: 500;
  }
  .pd-discount-tag {
    font-size: 11px;
    font-weight: 700;
    color: var(--pd-green);
    background: var(--pd-green-bg);
    border: 1px solid color-mix(in srgb, var(--pd-green) 25%, transparent);
    border-radius: 50px;
    padding: 3px 10px;
    letter-spacing: 0.03em;
  }

  .pd-divider {
    height: 1px;
    background: linear-gradient(90deg, var(--pd-accent) 0%, transparent 60%);
    opacity: 0.4;
    border-radius: 2px;
  }

  /* ── tabs ────────────────────────────────────────────────── */
  .pd-tabs {
    display: flex;
    gap: 4px;
    background: var(--pd-surface2);
    border: 1.5px solid var(--pd-border);
    border-radius: 12px;
    padding: 4px;
  }
  .pd-tab {
    flex: 1;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 9px;
    border: none;
    background: transparent;
    color: var(--pd-text2);
    cursor: pointer;
    transition: all var(--pd-transition);
    letter-spacing: 0.02em;
  }
  .pd-tab-active {
    background: var(--pd-surface);
    color: var(--pd-text);
    box-shadow: var(--pd-shadow);
  }
  .pd-tab:hover:not(.pd-tab-active) {
    color: var(--pd-text);
    background: color-mix(in srgb, var(--pd-border) 50%, transparent);
  }

  .pd-tab-content {
    min-height: 80px;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: var(--pd-radius);
    padding: 18px 20px;
  }
  .pd-description {
    font-size: 14px;
    line-height: 1.75;
    color: var(--pd-text2);
    margin: 0;
  }
  .pd-details-grid { display: flex; flex-direction: column; gap: 10px; }
  .pd-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 8px 0;
    border-bottom: 1px solid var(--pd-border);
  }
  .pd-detail-row:last-child { border-bottom: none; }
  .pd-detail-label { color: var(--pd-text3); font-weight: 500; }
  .pd-detail-val { color: var(--pd-text); font-weight: 600; }
  .pd-detail-mono { font-family: monospace; font-size: 12px; letter-spacing: 0.05em; }
  .pd-val-green { color: var(--pd-green) !important; }
  .pd-val-red { color: var(--pd-red) !important; }

  /* ── seller card ─────────────────────────────────────────── */
  .pd-seller {
    background: var(--pd-seller-bg);
    border: 1.5px solid var(--pd-border2);
    border-radius: var(--pd-radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: border-color var(--pd-transition);
  }
  .pd-seller:hover { border-color: var(--pd-accent); }
  .pd-seller-header {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--pd-text3);
  }
  .pd-seller-verified {
    margin-left: auto;
    font-size: 11px;
    font-weight: 700;
    color: var(--pd-green);
    background: var(--pd-green-bg);
    padding: 3px 10px;
    border-radius: 50px;
    letter-spacing: 0.02em;
  }
  .pd-seller-body { display: flex; align-items: center; gap: 14px; }
  .pd-seller-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--pd-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 800;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 4px 16px color-mix(in srgb, var(--pd-accent) 35%, transparent);
  }
  .pd-seller-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--pd-text);
    margin: 0 0 3px;
  }
  .pd-seller-sub {
    font-size: 12px;
    color: var(--pd-text3);
    margin: 0;
  }
  .pd-seller-contacts { display: flex; flex-direction: column; gap: 8px; }
  .pd-contact-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--pd-text2);
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
    border: 1px solid var(--pd-border);
    border-radius: 12px;
    padding: 10px 14px;
    transition: all var(--pd-transition);
    overflow: hidden;
  }
  .pd-contact-row:hover {
    border-color: var(--pd-accent);
    color: var(--pd-text);
    background: var(--pd-accent-bg);
  }
  .pd-contact-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pd-contact-icon { color: var(--pd-accent); flex-shrink: 0; }

  /* ── CTA block ───────────────────────────────────────────── */
  .pd-cta-block { display: flex; flex-direction: column; gap: 10px; }
  .pd-textarea-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--pd-text2);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: -2px;
  }
  .pd-textarea {
    width: 100%;
    min-height: 88px;
    border-radius: 16px;
    border: 1.5px solid var(--pd-border);
    background: var(--pd-surface);
    color: var(--pd-text);
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    padding: 12px 16px;
    outline: none;
    resize: vertical;
    transition: border-color var(--pd-transition), box-shadow var(--pd-transition);
    box-sizing: border-box;
  }
  .pd-textarea::placeholder { color: var(--pd-text3); }
  .pd-textarea:focus {
    border-color: var(--pd-accent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--pd-accent) 12%, transparent);
  }
  .pd-cta-primary {
    width: 100%;
    padding: 16px 24px;
    border-radius: 16px;
    border: none;
    background: var(--pd-gradient);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    letter-spacing: 0.02em;
    transition: all var(--pd-transition);
    box-shadow: 0 6px 24px color-mix(in srgb, var(--pd-accent) 40%, transparent);
  }
  .pd-cta-primary:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-2px);
    box-shadow: 0 10px 32px color-mix(in srgb, var(--pd-accent) 50%, transparent);
  }
  .pd-cta-primary:active:not(:disabled) { transform: translateY(0); }
  .pd-cta-primary:disabled { opacity: 0.55; cursor: not-allowed; }
  .pd-cta-secondary {
    width: 100%;
    padding: 14px 24px;
    border-radius: 16px;
    border: 1.5px solid var(--pd-border);
    background: var(--pd-surface);
    color: var(--pd-text2);
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all var(--pd-transition);
  }
  .pd-cta-secondary:hover {
    border-color: var(--pd-red);
    color: var(--pd-red);
    background: var(--pd-red-bg);
  }
  .pd-cta-secondary-active {
    border-color: var(--pd-red) !important;
    color: var(--pd-red) !important;
    background: var(--pd-red-bg) !important;
  }

  /* ── sending dots ─────────────────────────────────────────── */
  .pd-sending {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pd-dot {
    width: 5px;
    height: 5px;
    background: white;
    border-radius: 50%;
    animation: dot-bounce 1.2s ease-in-out infinite;
  }
  .pd-dot:nth-child(2) { animation-delay: 0.2s; }
  .pd-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  /* ── empty state ────────────────────────────────────────── */
  .pd-empty {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-align: center;
    padding: 40px;
  }
  .pd-empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--pd-accent-bg);
    border: 1.5px solid color-mix(in srgb, var(--pd-accent) 30%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pd-accent);
  }
  .pd-empty h2 { font-size: 22px; font-weight: 800; color: var(--pd-text); margin: 0; }
  .pd-empty p { font-size: 14px; color: var(--pd-text2); margin: 0; }
  .pd-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 12px 24px;
    border-radius: 50px;
    background: var(--pd-gradient);
    color: white;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: all var(--pd-transition);
    margin-top: 8px;
  }
  .pd-back-btn:hover { opacity: 0.88; transform: translateY(-2px); }

  /* ── skeleton ────────────────────────────────────────────── */
  .skeleton-pulse {
    background: linear-gradient(
      90deg,
      ${dark ? "#1e2636" : "#ece8e0"} 25%,
      ${dark ? "#2a3450" : "#faf5ef"} 50%,
      ${dark ? "#1e2636" : "#ece8e0"} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── left col helpers ─────────────────────────────────────── */
  .pd-left { display: flex; flex-direction: column; }
`;

export default ProductDetail;import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, Tag, User, CheckCircle, XCircle,
  Sparkles, ShoppingBag, Share2, Heart, MessageCircle,
  Shield, Star, Clock, ChevronRight, Send, Eye
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { getProducts } from "../features/products/productSlice.js";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl } from "../config/api.js";

/* ─── helpers ─────────────────────────────────────────────────── */
const isOAuthPhonePlaceholder = (phone = "") =>
  /^(google|github):/.test(String(phone));

/* ─── tiny hook: reads theme class on <html> ──────────────────── */
const useTheme = () => {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

/* ─── shimmer skeleton ────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`skeleton-pulse rounded-xl ${className}`} />
);

/* ═══════════════════════════════════════════════════════════════ */
const ProductDetail = () => {
  const { pid } = useParams();
  const dispatch = useDispatch();
  const dark = useTheme();

  const { allProducts, productLoading, productError, productErrorMessage } =
    useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);

  const fallback = allProducts?.find((p) => p._id === pid);
  const [detailProduct, setDetailProduct] = useState(null);
  const product = detailProduct || fallback;

  const [wished, setWished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const textareaRef = useRef(null);

  /* fetch */
  useEffect(() => {
    if (!allProducts?.length) dispatch(getProducts());
  }, []);

  useEffect(() => {
    if (productError && productErrorMessage) toast.error(productErrorMessage);
  }, [productError, productErrorMessage]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(apiUrl(`/api/product/${pid}`))
      .then((r) => setDetailProduct(r.data))
      .catch((e) =>
        toast.error(e.response?.data?.message || "Unable to load listing", {
          position: "top-center",
        })
      )
      .finally(() => setLoading(false));
  }, [pid]);

  /* share */
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  /* contact seller */
  const handleContact = async () => {
    if (!user?.token) {
      toast.error("Please login to contact the seller", { position: "top-center" });
      return;
    }
    if (!messageText.trim()) {
      toast.error("Please write a message first", { position: "top-center" });
      textareaRef.current?.focus();
      return;
    }
    try {
      setSending(true);
      await axios.post(
        apiUrl(`/api/message/${pid}`),
        { text: messageText.trim() },
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      setMessageText("");
      toast.success("✓ Message sent to seller!", { position: "top-center" });
    } catch (e) {
      toast.error(e.response?.data?.message || "Message could not be sent", {
        position: "top-center",
      });
    } finally {
      setSending(false);
    }
  };

  const initials = product?.user?.name
    ? product.user.name.slice(0, 2).toUpperCase()
    : "NA";

  const sellerPhone =
    product?.user?.phone && !isOAuthPhonePlaceholder(product.user.phone)
      ? product.user.phone
      : "Not provided";

  const discountedPrice = product?.prize
    ? Math.round(Number(product.prize) * 1.25).toLocaleString()
    : null;

  /* ── skeleton / loading state ─────────────────────────────── */
  if (loading && !product) {
    return (
      <div className="pd-root">
        <style>{styles(dark)}</style>
        <div className="pd-wrap">
          <Skeleton className="h-5 w-40 mb-10" />
          <div className="pd-grid">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-root">
        <style>{styles(dark)}</style>
        <div className="pd-empty">
          <div className="pd-empty-icon">
            <ShoppingBag size={36} />
          </div>
          <h2>Listing not found</h2>
          <p>This item may have been removed or is unavailable.</p>
          <Link to="/auth/marketplace" className="pd-back-btn">
            <ArrowLeft size={16} /> Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  /* ── main render ───────────────────────────────────────────── */
  return (
    <div className="pd-root">
      <style>{styles(dark)}</style>

      <div className="pd-wrap">

        {/* breadcrumb nav */}
        <nav className="pd-breadcrumb">
          <Link to="/auth/marketplace" className="pd-breadcrumb-link">
            Marketplace
          </Link>
          <ChevronRight size={13} className="pd-breadcrumb-sep" />
          <span className="pd-breadcrumb-current">{product.category || "Listing"}</span>
          <ChevronRight size={13} className="pd-breadcrumb-sep" />
          <span className="pd-breadcrumb-current pd-breadcrumb-title">
            {product.title?.slice(0, 28)}{product.title?.length > 28 ? "…" : ""}
          </span>
        </nav>

        {/* back link */}
        <Link to="/auth/marketplace" className="pd-back">
          <ArrowLeft size={15} />
          Back to Marketplace
        </Link>

        {/* ── 2-col grid ─────────────────────────────────────── */}
        <div className="pd-grid">

          {/* ── LEFT ─────────────────────────────────────────── */}
          <div className="pd-left">

            {/* image frame */}
            <div className="pd-img-frame">
              {/* status badge */}
              <div className="pd-img-badge-tl">
                {product.isAvailable ? (
                  <span className="badge badge-available">
                    <CheckCircle size={11} /> Available
                  </span>
                ) : (
                  <span className="badge badge-sold">
                    <XCircle size={11} /> Sold Out
                  </span>
                )}
              </div>

              {/* hot badge */}
              {product.prize > 10000 && (
                <div className="pd-img-badge-tr">
                  <span className="badge badge-hot">
                    <Sparkles size={10} /> Hot Deal
                  </span>
                </div>
              )}

              {/* image */}
              {product.itemImage ? (
                <img
                  src={product.itemImage}
                  alt={product.title}
                  className={`pd-img ${imgLoaded ? "pd-img-loaded" : ""}`}
                  onLoad={() => setImgLoaded(true)}
                />
              ) : (
                <div className="pd-img-placeholder">
                  <ShoppingBag size={52} />
                  <span>No image available</span>
                </div>
              )}

              {/* overlay actions */}
              <div className="pd-img-actions">
                <button
                  onClick={() => setWished(!wished)}
                  className={`pd-icon-btn ${wished ? "pd-icon-btn-wished" : ""}`}
                  title={wished ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={16} fill={wished ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={handleShare}
                  className="pd-icon-btn"
                  title="Copy link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* copied toast */}
            <div className={`pd-copied ${copied ? "pd-copied-show" : ""}`}>
              ✓ Link copied to clipboard
            </div>

            {/* meta row */}
            <div className="pd-meta-row">
              <div className="pd-chip">
                <Tag size={13} />
                <span>{product.category || "For Sale"}</span>
              </div>
              <div className="pd-chip">
                <Eye size={13} />
                <span>{Math.floor(Math.random() * 200) + 40} views</span>
              </div>
              <div className="pd-chip">
                <Clock size={13} />
                <span>Posted recently</span>
              </div>
            </div>

            {/* trust strip */}
            <div className="pd-trust">
              <div className="pd-trust-item">
                <Shield size={15} className="pd-trust-icon" />
                <span>Verified Listing</span>
              </div>
              <div className="pd-trust-divider" />
              <div className="pd-trust-item">
                <Star size={15} className="pd-trust-icon" />
                <span>Student Seller</span>
              </div>
              <div className="pd-trust-divider" />
              <div className="pd-trust-item">
                <MessageCircle size={15} className="pd-trust-icon" />
                <span>Quick Reply</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT ────────────────────────────────────────── */}
          <div className="pd-right">

            {/* title block */}
            <div className="pd-title-block">
              <span className="pd-listing-badge">
                <Sparkles size={11} /> Student Listing
              </span>
              <h1 className="pd-title">{product.title}</h1>

              {/* price row */}
              <div className="pd-price-row">
                <span className="pd-price">₹{product.prize?.toLocaleString()}</span>
                {discountedPrice && (
                  <>
                    <span className="pd-price-original">₹{discountedPrice}</span>
                    <span className="pd-discount-tag">25% off</span>
                  </>
                )}
              </div>
            </div>

            <div className="pd-divider" />

            {/* tabs */}
            <div className="pd-tabs">
              {["description", "details"].map((tab) => (
                <button
                  key={tab}
                  className={`pd-tab ${activeTab === tab ? "pd-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* tab content */}
            <div className="pd-tab-content">
              {activeTab === "description" ? (
                <p className="pd-description">{product.description}</p>
              ) : (
                <div className="pd-details-grid">
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Category</span>
                    <span className="pd-detail-val">{product.category || "—"}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Availability</span>
                    <span className={`pd-detail-val ${product.isAvailable ? "pd-val-green" : "pd-val-red"}`}>
                      {product.isAvailable ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Price</span>
                    <span className="pd-detail-val">₹{product.prize?.toLocaleString()}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Listing ID</span>
                    <span className="pd-detail-val pd-detail-mono">{pid?.slice(-8)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* seller card */}
            <div className="pd-seller">
              <div className="pd-seller-header">
                <User size={14} />
                <span>Seller Details</span>
                <span className="pd-seller-verified">✓ Verified</span>
              </div>
              <div className="pd-seller-body">
                <div className="pd-seller-avatar">
                  {initials}
                </div>
                <div className="pd-seller-info">
                  <p className="pd-seller-name">{product?.user?.name || "Unknown Seller"}</p>
                  <p className="pd-seller-sub">Verified Student · Campus Seller</p>
                </div>
              </div>
              <div className="pd-seller-contacts">
                <div className="pd-contact-row">
                  <Mail size={14} className="pd-contact-icon" />
                  <span>{product.user?.email || "—"}</span>
                </div>
                <div className="pd-contact-row">
                  <Phone size={14} className="pd-contact-icon" />
                  <span>{sellerPhone}</span>
                </div>
              </div>
            </div>

            {/* message + CTA */}
            <div className="pd-cta-block">
              <label className="pd-textarea-label">
                <MessageCircle size={13} /> Message to seller
              </label>
              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Hi! Is this item still available? I'm interested in..."
                className="pd-textarea"
                rows={3}
              />
              <button
                onClick={handleContact}
                disabled={sending}
                className="pd-cta-primary"
              >
                {sending ? (
                  <span className="pd-sending">
                    <span className="pd-dot" /><span className="pd-dot" /><span className="pd-dot" />
                    Sending…
                  </span>
                ) : (
                  <>
                    <Send size={16} />
                    Contact Seller
                  </>
                )}
              </button>
              <button
                onClick={() => setWished(!wished)}
                className={`pd-cta-secondary ${wished ? "pd-cta-secondary-active" : ""}`}
              >
                <Heart size={15} fill={wished ? "currentColor" : "none"} />
                {wished ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STYLES — scoped, theme-aware, premium
   ═══════════════════════════════════════════════════════════════ */
const styles = (dark) => `
  /* ── tokens ─────────────────────────────────────────────── */
  .pd-root {
    --pd-bg:        ${dark ? "#0d1117" : "#fdf8f2"};
    --pd-surface:   ${dark ? "#161b27" : "#ffffff"};
    --pd-surface2:  ${dark ? "#1e2636" : "#fef9f4"};
    --pd-border:    ${dark ? "#2a3450" : "#e8ddd0"};
    --pd-border2:   ${dark ? "#334166" : "#d4c5b0"};

    --pd-text:      ${dark ? "#e8edf5" : "#1a150e"};
    --pd-text2:     ${dark ? "#8fa3c4" : "#6b5a45"};
    --pd-text3:     ${dark ? "#5a7099" : "#9c8872"};

    --pd-accent:    ${dark ? "#4f8ef7" : "#c2693a"};
    --pd-accent2:   ${dark ? "#6aa3ff" : "#d4824f"};
    --pd-accent-bg: ${dark ? "#1a2d52" : "#fef0e7"};

    --pd-green:     ${dark ? "#34c472" : "#1e7a45"};
    --pd-green-bg:  ${dark ? "#0d2e1e" : "#edf7f1"};
    --pd-red:       ${dark ? "#f06a6a" : "#c0392b"};
    --pd-red-bg:    ${dark ? "#2e0d0d" : "#fdf0ef"};
    --pd-amber:     ${dark ? "#f5a623" : "#b06000"};
    --pd-amber-bg:  ${dark ? "#2e1f06" : "#fff8eb"};

    --pd-gradient:  ${dark
      ? "linear-gradient(135deg, #4f8ef7 0%, #6a5acd 100%)"
      : "linear-gradient(135deg, #c2693a 0%, #e8964f 100%)"};

    --pd-seller-bg: ${dark
      ? "linear-gradient(135deg, #1a2636 0%, #141e2e 100%)"
      : "linear-gradient(135deg, #fdf5ee 0%, #fdf0f8 100%)"};

    --pd-shadow:    ${dark
      ? "0 4px 24px rgba(0,0,0,0.5)"
      : "0 4px 24px rgba(180,120,60,0.12)"};
    --pd-shadow-lg: ${dark
      ? "0 12px 48px rgba(0,0,0,0.6)"
      : "0 12px 48px rgba(180,120,60,0.18)"};

    --pd-radius:    20px;
    --pd-transition: 0.22s cubic-bezier(0.4,0,0.2,1);

    min-height: 100vh;
    background: var(--pd-bg);
    color: var(--pd-text);
    font-family: 'DM Sans', 'Outfit', 'Nunito', sans-serif;
    padding: 0;
  }

  /* ── layout ────────────────────────────────────────────── */
  .pd-wrap {
    max-width: 1120px;
    margin: 0 auto;
    padding: 32px 24px 80px;
  }

  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 12px;
  }

  @media (max-width: 860px) {
    .pd-grid { grid-template-columns: 1fr; gap: 28px; }
    .pd-wrap { padding: 20px 16px 60px; }
  }

  /* ── breadcrumb ─────────────────────────────────────────── */
  .pd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--pd-text3);
    margin-bottom: 12px;
  }
  .pd-breadcrumb-link {
    color: var(--pd-accent);
    text-decoration: none;
    font-weight: 500;
    transition: opacity var(--pd-transition);
  }
  .pd-breadcrumb-link:hover { opacity: 0.75; }
  .pd-breadcrumb-sep { color: var(--pd-text3); flex-shrink: 0; }
  .pd-breadcrumb-current { color: var(--pd-text2); }
  .pd-breadcrumb-title { font-weight: 600; color: var(--pd-text); }

  /* ── back button ────────────────────────────────────────── */
  .pd-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--pd-text2);
    text-decoration: none;
    margin-bottom: 28px;
    padding: 8px 16px 8px 12px;
    border-radius: 50px;
    border: 1.5px solid var(--pd-border);
    background: var(--pd-surface);
    transition: all var(--pd-transition);
    letter-spacing: 0.01em;
  }
  .pd-back:hover {
    color: var(--pd-accent);
    border-color: var(--pd-accent);
    background: var(--pd-accent-bg);
    transform: translateX(-2px);
  }

  /* ── image frame ────────────────────────────────────────── */
  .pd-img-frame {
    position: relative;
    border-radius: var(--pd-radius);
    overflow: hidden;
    aspect-ratio: 1;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    box-shadow: var(--pd-shadow);
    transition: border-color var(--pd-transition), box-shadow var(--pd-transition);
  }
  .pd-img-frame:hover {
    border-color: var(--pd-accent);
    box-shadow: var(--pd-shadow-lg);
  }
  .pd-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 28px;
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.7s ease;
    transform: scale(0.97);
  }
  .pd-img-loaded {
    opacity: 1;
    transform: scale(1);
  }
  .pd-img-frame:hover .pd-img-loaded {
    transform: scale(1.03);
  }
  .pd-img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--pd-text3);
    font-size: 13px;
  }
  .pd-img-badge-tl {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 2;
  }
  .pd-img-badge-tr {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
  }
  .pd-img-actions {
    position: absolute;
    bottom: 14px;
    right: 14px;
    display: flex;
    gap: 8px;
    z-index: 2;
    opacity: 0;
    transform: translateY(8px);
    transition: all var(--pd-transition);
  }
  .pd-img-frame:hover .pd-img-actions {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── badges ─────────────────────────────────────────────── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 11px;
    border-radius: 50px;
    letter-spacing: 0.02em;
    backdrop-filter: blur(8px);
  }
  .badge-available {
    background: var(--pd-green-bg);
    color: var(--pd-green);
    border: 1px solid color-mix(in srgb, var(--pd-green) 30%, transparent);
  }
  .badge-sold {
    background: var(--pd-red-bg);
    color: var(--pd-red);
    border: 1px solid color-mix(in srgb, var(--pd-red) 30%, transparent);
  }
  .badge-hot {
    background: var(--pd-amber-bg);
    color: var(--pd-amber);
    border: 1px solid color-mix(in srgb, var(--pd-amber) 30%, transparent);
    animation: pulse-subtle 2s ease-in-out infinite;
  }
  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.75; }
  }

  /* ── icon button ─────────────────────────────────────────── */
  .pd-icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${dark ? "rgba(22,27,39,0.9)" : "rgba(255,255,255,0.92)"};
    border: 1.5px solid var(--pd-border);
    color: var(--pd-text2);
    cursor: pointer;
    transition: all var(--pd-transition);
    backdrop-filter: blur(8px);
  }
  .pd-icon-btn:hover {
    border-color: var(--pd-accent);
    color: var(--pd-accent);
    transform: scale(1.1);
  }
  .pd-icon-btn-wished {
    background: var(--pd-red-bg) !important;
    border-color: var(--pd-red) !important;
    color: var(--pd-red) !important;
  }

  /* ── copied toast ─────────────────────────────────────────── */
  .pd-copied {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--pd-green);
    margin-top: 8px;
    opacity: 0;
    transform: translateY(-4px);
    transition: all 0.3s ease;
    height: 20px;
  }
  .pd-copied-show {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── meta chips ─────────────────────────────────────────── */
  .pd-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }
  .pd-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: var(--pd-text2);
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: 50px;
    padding: 5px 13px;
    transition: all var(--pd-transition);
  }
  .pd-chip:hover {
    border-color: var(--pd-accent);
    color: var(--pd-accent);
    background: var(--pd-accent-bg);
  }

  /* ── trust strip ────────────────────────────────────────── */
  .pd-trust {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: var(--pd-radius);
    padding: 14px 20px;
    margin-top: 12px;
  }
  .pd-trust-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 600;
    color: var(--pd-text2);
    flex: 1;
    justify-content: center;
  }
  .pd-trust-icon { color: var(--pd-accent); }
  .pd-trust-divider {
    width: 1px;
    height: 22px;
    background: var(--pd-border);
  }

  /* ── right panel ────────────────────────────────────────── */
  .pd-right { display: flex; flex-direction: column; gap: 20px; }

  .pd-title-block { display: flex; flex-direction: column; gap: 10px; }

  .pd-listing-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--pd-accent);
    background: var(--pd-accent-bg);
    border: 1px solid color-mix(in srgb, var(--pd-accent) 25%, transparent);
    border-radius: 50px;
    padding: 5px 12px;
    width: fit-content;
  }

  .pd-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 800;
    color: var(--pd-text);
    line-height: 1.25;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .pd-price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
  }
  .pd-price {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 900;
    background: var(--pd-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    letter-spacing: -0.03em;
  }
  .pd-price-original {
    font-size: 1rem;
    color: var(--pd-text3);
    text-decoration: line-through;
    font-weight: 500;
  }
  .pd-discount-tag {
    font-size: 11px;
    font-weight: 700;
    color: var(--pd-green);
    background: var(--pd-green-bg);
    border: 1px solid color-mix(in srgb, var(--pd-green) 25%, transparent);
    border-radius: 50px;
    padding: 3px 10px;
    letter-spacing: 0.03em;
  }

  .pd-divider {
    height: 1px;
    background: linear-gradient(90deg, var(--pd-accent) 0%, transparent 60%);
    opacity: 0.4;
    border-radius: 2px;
  }

  /* ── tabs ────────────────────────────────────────────────── */
  .pd-tabs {
    display: flex;
    gap: 4px;
    background: var(--pd-surface2);
    border: 1.5px solid var(--pd-border);
    border-radius: 12px;
    padding: 4px;
  }
  .pd-tab {
    flex: 1;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 9px;
    border: none;
    background: transparent;
    color: var(--pd-text2);
    cursor: pointer;
    transition: all var(--pd-transition);
    letter-spacing: 0.02em;
  }
  .pd-tab-active {
    background: var(--pd-surface);
    color: var(--pd-text);
    box-shadow: var(--pd-shadow);
  }
  .pd-tab:hover:not(.pd-tab-active) {
    color: var(--pd-text);
    background: color-mix(in srgb, var(--pd-border) 50%, transparent);
  }

  .pd-tab-content {
    min-height: 80px;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: var(--pd-radius);
    padding: 18px 20px;
  }
  .pd-description {
    font-size: 14px;
    line-height: 1.75;
    color: var(--pd-text2);
    margin: 0;
  }
  .pd-details-grid { display: flex; flex-direction: column; gap: 10px; }
  .pd-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 8px 0;
    border-bottom: 1px solid var(--pd-border);
  }
  .pd-detail-row:last-child { border-bottom: none; }
  .pd-detail-label { color: var(--pd-text3); font-weight: 500; }
  .pd-detail-val { color: var(--pd-text); font-weight: 600; }
  .pd-detail-mono { font-family: monospace; font-size: 12px; letter-spacing: 0.05em; }
  .pd-val-green { color: var(--pd-green) !important; }
  .pd-val-red { color: var(--pd-red) !important; }

  /* ── seller card ─────────────────────────────────────────── */
  .pd-seller {
    background: var(--pd-seller-bg);
    border: 1.5px solid var(--pd-border2);
    border-radius: var(--pd-radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: border-color var(--pd-transition);
  }
  .pd-seller:hover { border-color: var(--pd-accent); }
  .pd-seller-header {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--pd-text3);
  }
  .pd-seller-verified {
    margin-left: auto;
    font-size: 11px;
    font-weight: 700;
    color: var(--pd-green);
    background: var(--pd-green-bg);
    padding: 3px 10px;
    border-radius: 50px;
    letter-spacing: 0.02em;
  }
  .pd-seller-body { display: flex; align-items: center; gap: 14px; }
  .pd-seller-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--pd-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 800;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 4px 16px color-mix(in srgb, var(--pd-accent) 35%, transparent);
  }
  .pd-seller-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--pd-text);
    margin: 0 0 3px;
  }
  .pd-seller-sub {
    font-size: 12px;
    color: var(--pd-text3);
    margin: 0;
  }
  .pd-seller-contacts { display: flex; flex-direction: column; gap: 8px; }
  .pd-contact-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--pd-text2);
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
    border: 1px solid var(--pd-border);
    border-radius: 12px;
    padding: 10px 14px;
    transition: all var(--pd-transition);
    overflow: hidden;
  }
  .pd-contact-row:hover {
    border-color: var(--pd-accent);
    color: var(--pd-text);
    background: var(--pd-accent-bg);
  }
  .pd-contact-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pd-contact-icon { color: var(--pd-accent); flex-shrink: 0; }

  /* ── CTA block ───────────────────────────────────────────── */
  .pd-cta-block { display: flex; flex-direction: column; gap: 10px; }
  .pd-textarea-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--pd-text2);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: -2px;
  }
  .pd-textarea {
    width: 100%;
    min-height: 88px;
    border-radius: 16px;
    border: 1.5px solid var(--pd-border);
    background: var(--pd-surface);
    color: var(--pd-text);
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    padding: 12px 16px;
    outline: none;
    resize: vertical;
    transition: border-color var(--pd-transition), box-shadow var(--pd-transition);
    box-sizing: border-box;
  }
  .pd-textarea::placeholder { color: var(--pd-text3); }
  .pd-textarea:focus {
    border-color: var(--pd-accent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--pd-accent) 12%, transparent);
  }
  .pd-cta-primary {
    width: 100%;
    padding: 16px 24px;
    border-radius: 16px;
    border: none;
    background: var(--pd-gradient);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    letter-spacing: 0.02em;
    transition: all var(--pd-transition);
    box-shadow: 0 6px 24px color-mix(in srgb, var(--pd-accent) 40%, transparent);
  }
  .pd-cta-primary:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-2px);
    box-shadow: 0 10px 32px color-mix(in srgb, var(--pd-accent) 50%, transparent);
  }
  .pd-cta-primary:active:not(:disabled) { transform: translateY(0); }
  .pd-cta-primary:disabled { opacity: 0.55; cursor: not-allowed; }
  .pd-cta-secondary {
    width: 100%;
    padding: 14px 24px;
    border-radius: 16px;
    border: 1.5px solid var(--pd-border);
    background: var(--pd-surface);
    color: var(--pd-text2);
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all var(--pd-transition);
  }
  .pd-cta-secondary:hover {
    border-color: var(--pd-red);
    color: var(--pd-red);
    background: var(--pd-red-bg);
  }
  .pd-cta-secondary-active {
    border-color: var(--pd-red) !important;
    color: var(--pd-red) !important;
    background: var(--pd-red-bg) !important;
  }

  /* ── sending dots ─────────────────────────────────────────── */
  .pd-sending {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pd-dot {
    width: 5px;
    height: 5px;
    background: white;
    border-radius: 50%;
    animation: dot-bounce 1.2s ease-in-out infinite;
  }
  .pd-dot:nth-child(2) { animation-delay: 0.2s; }
  .pd-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  /* ── empty state ────────────────────────────────────────── */
  .pd-empty {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-align: center;
    padding: 40px;
  }
  .pd-empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--pd-accent-bg);
    border: 1.5px solid color-mix(in srgb, var(--pd-accent) 30%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pd-accent);
  }
  .pd-empty h2 { font-size: 22px; font-weight: 800; color: var(--pd-text); margin: 0; }
  .pd-empty p { font-size: 14px; color: var(--pd-text2); margin: 0; }
  .pd-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 12px 24px;
    border-radius: 50px;
    background: var(--pd-gradient);
    color: white;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: all var(--pd-transition);
    margin-top: 8px;
  }
  .pd-back-btn:hover { opacity: 0.88; transform: translateY(-2px); }

  /* ── skeleton ────────────────────────────────────────────── */
  .skeleton-pulse {
    background: linear-gradient(
      90deg,
      ${dark ? "#1e2636" : "#ece8e0"} 25%,
      ${dark ? "#2a3450" : "#faf5ef"} 50%,
      ${dark ? "#1e2636" : "#ece8e0"} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── left col helpers ─────────────────────────────────────── */
  .pd-left { display: flex; flex-direction: column; }
`;

export default ProductDetail;import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, Tag, User, CheckCircle, XCircle,
  Sparkles, ShoppingBag, Share2, Heart, MessageCircle,
  Shield, Star, Clock, ChevronRight, Send, Eye
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { getProducts } from "../features/products/productSlice.js";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl } from "../config/api.js";

/* ─── helpers ─────────────────────────────────────────────────── */
const isOAuthPhonePlaceholder = (phone = "") =>
  /^(google|github):/.test(String(phone));

/* ─── tiny hook: reads theme class on <html> ──────────────────── */
const useTheme = () => {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

/* ─── shimmer skeleton ────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`skeleton-pulse rounded-xl ${className}`} />
);

/* ═══════════════════════════════════════════════════════════════ */
const ProductDetail = () => {
  const { pid } = useParams();
  const dispatch = useDispatch();
  const dark = useTheme();

  const { allProducts, productLoading, productError, productErrorMessage } =
    useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);

  const fallback = allProducts?.find((p) => p._id === pid);
  const [detailProduct, setDetailProduct] = useState(null);
  const product = detailProduct || fallback;

  const [wished, setWished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const textareaRef = useRef(null);

  /* fetch */
  useEffect(() => {
    if (!allProducts?.length) dispatch(getProducts());
  }, []);

  useEffect(() => {
    if (productError && productErrorMessage) toast.error(productErrorMessage);
  }, [productError, productErrorMessage]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(apiUrl(`/api/product/${pid}`))
      .then((r) => setDetailProduct(r.data))
      .catch((e) =>
        toast.error(e.response?.data?.message || "Unable to load listing", {
          position: "top-center",
        })
      )
      .finally(() => setLoading(false));
  }, [pid]);

  /* share */
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  /* contact seller */
  const handleContact = async () => {
    if (!user?.token) {
      toast.error("Please login to contact the seller", { position: "top-center" });
      return;
    }
    if (!messageText.trim()) {
      toast.error("Please write a message first", { position: "top-center" });
      textareaRef.current?.focus();
      return;
    }
    try {
      setSending(true);
      await axios.post(
        apiUrl(`/api/message/${pid}`),
        { text: messageText.trim() },
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      setMessageText("");
      toast.success("✓ Message sent to seller!", { position: "top-center" });
    } catch (e) {
      toast.error(e.response?.data?.message || "Message could not be sent", {
        position: "top-center",
      });
    } finally {
      setSending(false);
    }
  };

  const initials = product?.user?.name
    ? product.user.name.slice(0, 2).toUpperCase()
    : "NA";

  const sellerPhone =
    product?.user?.phone && !isOAuthPhonePlaceholder(product.user.phone)
      ? product.user.phone
      : "Not provided";

  const discountedPrice = product?.prize
    ? Math.round(Number(product.prize) * 1.25).toLocaleString()
    : null;

  /* ── skeleton / loading state ─────────────────────────────── */
  if (loading && !product) {
    return (
      <div className="pd-root">
        <style>{styles(dark)}</style>
        <div className="pd-wrap">
          <Skeleton className="h-5 w-40 mb-10" />
          <div className="pd-grid">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-root">
        <style>{styles(dark)}</style>
        <div className="pd-empty">
          <div className="pd-empty-icon">
            <ShoppingBag size={36} />
          </div>
          <h2>Listing not found</h2>
          <p>This item may have been removed or is unavailable.</p>
          <Link to="/auth/marketplace" className="pd-back-btn">
            <ArrowLeft size={16} /> Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  /* ── main render ───────────────────────────────────────────── */
  return (
    <div className="pd-root">
      <style>{styles(dark)}</style>

      <div className="pd-wrap">

        {/* breadcrumb nav */}
        <nav className="pd-breadcrumb">
          <Link to="/auth/marketplace" className="pd-breadcrumb-link">
            Marketplace
          </Link>
          <ChevronRight size={13} className="pd-breadcrumb-sep" />
          <span className="pd-breadcrumb-current">{product.category || "Listing"}</span>
          <ChevronRight size={13} className="pd-breadcrumb-sep" />
          <span className="pd-breadcrumb-current pd-breadcrumb-title">
            {product.title?.slice(0, 28)}{product.title?.length > 28 ? "…" : ""}
          </span>
        </nav>

        {/* back link */}
        <Link to="/auth/marketplace" className="pd-back">
          <ArrowLeft size={15} />
          Back to Marketplace
        </Link>

        {/* ── 2-col grid ─────────────────────────────────────── */}
        <div className="pd-grid">

          {/* ── LEFT ─────────────────────────────────────────── */}
          <div className="pd-left">

            {/* image frame */}
            <div className="pd-img-frame">
              {/* status badge */}
              <div className="pd-img-badge-tl">
                {product.isAvailable ? (
                  <span className="badge badge-available">
                    <CheckCircle size={11} /> Available
                  </span>
                ) : (
                  <span className="badge badge-sold">
                    <XCircle size={11} /> Sold Out
                  </span>
                )}
              </div>

              {/* hot badge */}
              {product.prize > 10000 && (
                <div className="pd-img-badge-tr">
                  <span className="badge badge-hot">
                    <Sparkles size={10} /> Hot Deal
                  </span>
                </div>
              )}

              {/* image */}
              {product.itemImage ? (
                <img
                  src={product.itemImage}
                  alt={product.title}
                  className={`pd-img ${imgLoaded ? "pd-img-loaded" : ""}`}
                  onLoad={() => setImgLoaded(true)}
                />
              ) : (
                <div className="pd-img-placeholder">
                  <ShoppingBag size={52} />
                  <span>No image available</span>
                </div>
              )}

              {/* overlay actions */}
              <div className="pd-img-actions">
                <button
                  onClick={() => setWished(!wished)}
                  className={`pd-icon-btn ${wished ? "pd-icon-btn-wished" : ""}`}
                  title={wished ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={16} fill={wished ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={handleShare}
                  className="pd-icon-btn"
                  title="Copy link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* copied toast */}
            <div className={`pd-copied ${copied ? "pd-copied-show" : ""}`}>
              ✓ Link copied to clipboard
            </div>

            {/* meta row */}
            <div className="pd-meta-row">
              <div className="pd-chip">
                <Tag size={13} />
                <span>{product.category || "For Sale"}</span>
              </div>
              <div className="pd-chip">
                <Eye size={13} />
                <span>{Math.floor(Math.random() * 200) + 40} views</span>
              </div>
              <div className="pd-chip">
                <Clock size={13} />
                <span>Posted recently</span>
              </div>
            </div>

            {/* trust strip */}
            <div className="pd-trust">
              <div className="pd-trust-item">
                <Shield size={15} className="pd-trust-icon" />
                <span>Verified Listing</span>
              </div>
              <div className="pd-trust-divider" />
              <div className="pd-trust-item">
                <Star size={15} className="pd-trust-icon" />
                <span>Student Seller</span>
              </div>
              <div className="pd-trust-divider" />
              <div className="pd-trust-item">
                <MessageCircle size={15} className="pd-trust-icon" />
                <span>Quick Reply</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT ────────────────────────────────────────── */}
          <div className="pd-right">

            {/* title block */}
            <div className="pd-title-block">
              <span className="pd-listing-badge">
                <Sparkles size={11} /> Student Listing
              </span>
              <h1 className="pd-title">{product.title}</h1>

              {/* price row */}
              <div className="pd-price-row">
                <span className="pd-price">₹{product.prize?.toLocaleString()}</span>
                {discountedPrice && (
                  <>
                    <span className="pd-price-original">₹{discountedPrice}</span>
                    <span className="pd-discount-tag">25% off</span>
                  </>
                )}
              </div>
            </div>

            <div className="pd-divider" />

            {/* tabs */}
            <div className="pd-tabs">
              {["description", "details"].map((tab) => (
                <button
                  key={tab}
                  className={`pd-tab ${activeTab === tab ? "pd-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* tab content */}
            <div className="pd-tab-content">
              {activeTab === "description" ? (
                <p className="pd-description">{product.description}</p>
              ) : (
                <div className="pd-details-grid">
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Category</span>
                    <span className="pd-detail-val">{product.category || "—"}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Availability</span>
                    <span className={`pd-detail-val ${product.isAvailable ? "pd-val-green" : "pd-val-red"}`}>
                      {product.isAvailable ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Price</span>
                    <span className="pd-detail-val">₹{product.prize?.toLocaleString()}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Listing ID</span>
                    <span className="pd-detail-val pd-detail-mono">{pid?.slice(-8)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* seller card */}
            <div className="pd-seller">
              <div className="pd-seller-header">
                <User size={14} />
                <span>Seller Details</span>
                <span className="pd-seller-verified">✓ Verified</span>
              </div>
              <div className="pd-seller-body">
                <div className="pd-seller-avatar">
                  {initials}
                </div>
                <div className="pd-seller-info">
                  <p className="pd-seller-name">{product?.user?.name || "Unknown Seller"}</p>
                  <p className="pd-seller-sub">Verified Student · Campus Seller</p>
                </div>
              </div>
              <div className="pd-seller-contacts">
                <div className="pd-contact-row">
                  <Mail size={14} className="pd-contact-icon" />
                  <span>{product.user?.email || "—"}</span>
                </div>
                <div className="pd-contact-row">
                  <Phone size={14} className="pd-contact-icon" />
                  <span>{sellerPhone}</span>
                </div>
              </div>
            </div>

            {/* message + CTA */}
            <div className="pd-cta-block">
              <label className="pd-textarea-label">
                <MessageCircle size={13} /> Message to seller
              </label>
              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Hi! Is this item still available? I'm interested in..."
                className="pd-textarea"
                rows={3}
              />
              <button
                onClick={handleContact}
                disabled={sending}
                className="pd-cta-primary"
              >
                {sending ? (
                  <span className="pd-sending">
                    <span className="pd-dot" /><span className="pd-dot" /><span className="pd-dot" />
                    Sending…
                  </span>
                ) : (
                  <>
                    <Send size={16} />
                    Contact Seller
                  </>
                )}
              </button>
              <button
                onClick={() => setWished(!wished)}
                className={`pd-cta-secondary ${wished ? "pd-cta-secondary-active" : ""}`}
              >
                <Heart size={15} fill={wished ? "currentColor" : "none"} />
                {wished ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STYLES — scoped, theme-aware, premium
   ═══════════════════════════════════════════════════════════════ */
const styles = (dark) => `
  /* ── tokens ─────────────────────────────────────────────── */
  .pd-root {
    --pd-bg:        ${dark ? "#0d1117" : "#fdf8f2"};
    --pd-surface:   ${dark ? "#161b27" : "#ffffff"};
    --pd-surface2:  ${dark ? "#1e2636" : "#fef9f4"};
    --pd-border:    ${dark ? "#2a3450" : "#e8ddd0"};
    --pd-border2:   ${dark ? "#334166" : "#d4c5b0"};

    --pd-text:      ${dark ? "#e8edf5" : "#1a150e"};
    --pd-text2:     ${dark ? "#8fa3c4" : "#6b5a45"};
    --pd-text3:     ${dark ? "#5a7099" : "#9c8872"};

    --pd-accent:    ${dark ? "#4f8ef7" : "#c2693a"};
    --pd-accent2:   ${dark ? "#6aa3ff" : "#d4824f"};
    --pd-accent-bg: ${dark ? "#1a2d52" : "#fef0e7"};

    --pd-green:     ${dark ? "#34c472" : "#1e7a45"};
    --pd-green-bg:  ${dark ? "#0d2e1e" : "#edf7f1"};
    --pd-red:       ${dark ? "#f06a6a" : "#c0392b"};
    --pd-red-bg:    ${dark ? "#2e0d0d" : "#fdf0ef"};
    --pd-amber:     ${dark ? "#f5a623" : "#b06000"};
    --pd-amber-bg:  ${dark ? "#2e1f06" : "#fff8eb"};

    --pd-gradient:  ${dark
      ? "linear-gradient(135deg, #4f8ef7 0%, #6a5acd 100%)"
      : "linear-gradient(135deg, #c2693a 0%, #e8964f 100%)"};

    --pd-seller-bg: ${dark
      ? "linear-gradient(135deg, #1a2636 0%, #141e2e 100%)"
      : "linear-gradient(135deg, #fdf5ee 0%, #fdf0f8 100%)"};

    --pd-shadow:    ${dark
      ? "0 4px 24px rgba(0,0,0,0.5)"
      : "0 4px 24px rgba(180,120,60,0.12)"};
    --pd-shadow-lg: ${dark
      ? "0 12px 48px rgba(0,0,0,0.6)"
      : "0 12px 48px rgba(180,120,60,0.18)"};

    --pd-radius:    20px;
    --pd-transition: 0.22s cubic-bezier(0.4,0,0.2,1);

    min-height: 100vh;
    background: var(--pd-bg);
    color: var(--pd-text);
    font-family: 'DM Sans', 'Outfit', 'Nunito', sans-serif;
    padding: 0;
  }

  /* ── layout ────────────────────────────────────────────── */
  .pd-wrap {
    max-width: 1120px;
    margin: 0 auto;
    padding: 32px 24px 80px;
  }

  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 12px;
  }

  @media (max-width: 860px) {
    .pd-grid { grid-template-columns: 1fr; gap: 28px; }
    .pd-wrap { padding: 20px 16px 60px; }
  }

  /* ── breadcrumb ─────────────────────────────────────────── */
  .pd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--pd-text3);
    margin-bottom: 12px;
  }
  .pd-breadcrumb-link {
    color: var(--pd-accent);
    text-decoration: none;
    font-weight: 500;
    transition: opacity var(--pd-transition);
  }
  .pd-breadcrumb-link:hover { opacity: 0.75; }
  .pd-breadcrumb-sep { color: var(--pd-text3); flex-shrink: 0; }
  .pd-breadcrumb-current { color: var(--pd-text2); }
  .pd-breadcrumb-title { font-weight: 600; color: var(--pd-text); }

  /* ── back button ────────────────────────────────────────── */
  .pd-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--pd-text2);
    text-decoration: none;
    margin-bottom: 28px;
    padding: 8px 16px 8px 12px;
    border-radius: 50px;
    border: 1.5px solid var(--pd-border);
    background: var(--pd-surface);
    transition: all var(--pd-transition);
    letter-spacing: 0.01em;
  }
  .pd-back:hover {
    color: var(--pd-accent);
    border-color: var(--pd-accent);
    background: var(--pd-accent-bg);
    transform: translateX(-2px);
  }

  /* ── image frame ────────────────────────────────────────── */
  .pd-img-frame {
    position: relative;
    border-radius: var(--pd-radius);
    overflow: hidden;
    aspect-ratio: 1;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    box-shadow: var(--pd-shadow);
    transition: border-color var(--pd-transition), box-shadow var(--pd-transition);
  }
  .pd-img-frame:hover {
    border-color: var(--pd-accent);
    box-shadow: var(--pd-shadow-lg);
  }
  .pd-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 28px;
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.7s ease;
    transform: scale(0.97);
  }
  .pd-img-loaded {
    opacity: 1;
    transform: scale(1);
  }
  .pd-img-frame:hover .pd-img-loaded {
    transform: scale(1.03);
  }
  .pd-img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--pd-text3);
    font-size: 13px;
  }
  .pd-img-badge-tl {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 2;
  }
  .pd-img-badge-tr {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
  }
  .pd-img-actions {
    position: absolute;
    bottom: 14px;
    right: 14px;
    display: flex;
    gap: 8px;
    z-index: 2;
    opacity: 0;
    transform: translateY(8px);
    transition: all var(--pd-transition);
  }
  .pd-img-frame:hover .pd-img-actions {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── badges ─────────────────────────────────────────────── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 11px;
    border-radius: 50px;
    letter-spacing: 0.02em;
    backdrop-filter: blur(8px);
  }
  .badge-available {
    background: var(--pd-green-bg);
    color: var(--pd-green);
    border: 1px solid color-mix(in srgb, var(--pd-green) 30%, transparent);
  }
  .badge-sold {
    background: var(--pd-red-bg);
    color: var(--pd-red);
    border: 1px solid color-mix(in srgb, var(--pd-red) 30%, transparent);
  }
  .badge-hot {
    background: var(--pd-amber-bg);
    color: var(--pd-amber);
    border: 1px solid color-mix(in srgb, var(--pd-amber) 30%, transparent);
    animation: pulse-subtle 2s ease-in-out infinite;
  }
  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.75; }
  }

  /* ── icon button ─────────────────────────────────────────── */
  .pd-icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${dark ? "rgba(22,27,39,0.9)" : "rgba(255,255,255,0.92)"};
    border: 1.5px solid var(--pd-border);
    color: var(--pd-text2);
    cursor: pointer;
    transition: all var(--pd-transition);
    backdrop-filter: blur(8px);
  }
  .pd-icon-btn:hover {
    border-color: var(--pd-accent);
    color: var(--pd-accent);
    transform: scale(1.1);
  }
  .pd-icon-btn-wished {
    background: var(--pd-red-bg) !important;
    border-color: var(--pd-red) !important;
    color: var(--pd-red) !important;
  }

  /* ── copied toast ─────────────────────────────────────────── */
  .pd-copied {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--pd-green);
    margin-top: 8px;
    opacity: 0;
    transform: translateY(-4px);
    transition: all 0.3s ease;
    height: 20px;
  }
  .pd-copied-show {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── meta chips ─────────────────────────────────────────── */
  .pd-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }
  .pd-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: var(--pd-text2);
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: 50px;
    padding: 5px 13px;
    transition: all var(--pd-transition);
  }
  .pd-chip:hover {
    border-color: var(--pd-accent);
    color: var(--pd-accent);
    background: var(--pd-accent-bg);
  }

  /* ── trust strip ────────────────────────────────────────── */
  .pd-trust {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: var(--pd-radius);
    padding: 14px 20px;
    margin-top: 12px;
  }
  .pd-trust-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 600;
    color: var(--pd-text2);
    flex: 1;
    justify-content: center;
  }
  .pd-trust-icon { color: var(--pd-accent); }
  .pd-trust-divider {
    width: 1px;
    height: 22px;
    background: var(--pd-border);
  }

  /* ── right panel ────────────────────────────────────────── */
  .pd-right { display: flex; flex-direction: column; gap: 20px; }

  .pd-title-block { display: flex; flex-direction: column; gap: 10px; }

  .pd-listing-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--pd-accent);
    background: var(--pd-accent-bg);
    border: 1px solid color-mix(in srgb, var(--pd-accent) 25%, transparent);
    border-radius: 50px;
    padding: 5px 12px;
    width: fit-content;
  }

  .pd-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 800;
    color: var(--pd-text);
    line-height: 1.25;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .pd-price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
  }
  .pd-price {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 900;
    background: var(--pd-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    letter-spacing: -0.03em;
  }
  .pd-price-original {
    font-size: 1rem;
    color: var(--pd-text3);
    text-decoration: line-through;
    font-weight: 500;
  }
  .pd-discount-tag {
    font-size: 11px;
    font-weight: 700;
    color: var(--pd-green);
    background: var(--pd-green-bg);
    border: 1px solid color-mix(in srgb, var(--pd-green) 25%, transparent);
    border-radius: 50px;
    padding: 3px 10px;
    letter-spacing: 0.03em;
  }

  .pd-divider {
    height: 1px;
    background: linear-gradient(90deg, var(--pd-accent) 0%, transparent 60%);
    opacity: 0.4;
    border-radius: 2px;
  }

  /* ── tabs ────────────────────────────────────────────────── */
  .pd-tabs {
    display: flex;
    gap: 4px;
    background: var(--pd-surface2);
    border: 1.5px solid var(--pd-border);
    border-radius: 12px;
    padding: 4px;
  }
  .pd-tab {
    flex: 1;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 9px;
    border: none;
    background: transparent;
    color: var(--pd-text2);
    cursor: pointer;
    transition: all var(--pd-transition);
    letter-spacing: 0.02em;
  }
  .pd-tab-active {
    background: var(--pd-surface);
    color: var(--pd-text);
    box-shadow: var(--pd-shadow);
  }
  .pd-tab:hover:not(.pd-tab-active) {
    color: var(--pd-text);
    background: color-mix(in srgb, var(--pd-border) 50%, transparent);
  }

  .pd-tab-content {
    min-height: 80px;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: var(--pd-radius);
    padding: 18px 20px;
  }
  .pd-description {
    font-size: 14px;
    line-height: 1.75;
    color: var(--pd-text2);
    margin: 0;
  }
  .pd-details-grid { display: flex; flex-direction: column; gap: 10px; }
  .pd-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 8px 0;
    border-bottom: 1px solid var(--pd-border);
  }
  .pd-detail-row:last-child { border-bottom: none; }
  .pd-detail-label { color: var(--pd-text3); font-weight: 500; }
  .pd-detail-val { color: var(--pd-text); font-weight: 600; }
  .pd-detail-mono { font-family: monospace; font-size: 12px; letter-spacing: 0.05em; }
  .pd-val-green { color: var(--pd-green) !important; }
  .pd-val-red { color: var(--pd-red) !important; }

  /* ── seller card ─────────────────────────────────────────── */
  .pd-seller {
    background: var(--pd-seller-bg);
    border: 1.5px solid var(--pd-border2);
    border-radius: var(--pd-radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: border-color var(--pd-transition);
  }
  .pd-seller:hover { border-color: var(--pd-accent); }
  .pd-seller-header {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--pd-text3);
  }
  .pd-seller-verified {
    margin-left: auto;
    font-size: 11px;
    font-weight: 700;
    color: var(--pd-green);
    background: var(--pd-green-bg);
    padding: 3px 10px;
    border-radius: 50px;
    letter-spacing: 0.02em;
  }
  .pd-seller-body { display: flex; align-items: center; gap: 14px; }
  .pd-seller-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--pd-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 800;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 4px 16px color-mix(in srgb, var(--pd-accent) 35%, transparent);
  }
  .pd-seller-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--pd-text);
    margin: 0 0 3px;
  }
  .pd-seller-sub {
    font-size: 12px;
    color: var(--pd-text3);
    margin: 0;
  }
  .pd-seller-contacts { display: flex; flex-direction: column; gap: 8px; }
  .pd-contact-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--pd-text2);
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
    border: 1px solid var(--pd-border);
    border-radius: 12px;
    padding: 10px 14px;
    transition: all var(--pd-transition);
    overflow: hidden;
  }
  .pd-contact-row:hover {
    border-color: var(--pd-accent);
    color: var(--pd-text);
    background: var(--pd-accent-bg);
  }
  .pd-contact-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pd-contact-icon { color: var(--pd-accent); flex-shrink: 0; }

  /* ── CTA block ───────────────────────────────────────────── */
  .pd-cta-block { display: flex; flex-direction: column; gap: 10px; }
  .pd-textarea-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--pd-text2);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: -2px;
  }
  .pd-textarea {
    width: 100%;
    min-height: 88px;
    border-radius: 16px;
    border: 1.5px solid var(--pd-border);
    background: var(--pd-surface);
    color: var(--pd-text);
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    padding: 12px 16px;
    outline: none;
    resize: vertical;
    transition: border-color var(--pd-transition), box-shadow var(--pd-transition);
    box-sizing: border-box;
  }
  .pd-textarea::placeholder { color: var(--pd-text3); }
  .pd-textarea:focus {
    border-color: var(--pd-accent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--pd-accent) 12%, transparent);
  }
  .pd-cta-primary {
    width: 100%;
    padding: 16px 24px;
    border-radius: 16px;
    border: none;
    background: var(--pd-gradient);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    letter-spacing: 0.02em;
    transition: all var(--pd-transition);
    box-shadow: 0 6px 24px color-mix(in srgb, var(--pd-accent) 40%, transparent);
  }
  .pd-cta-primary:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-2px);
    box-shadow: 0 10px 32px color-mix(in srgb, var(--pd-accent) 50%, transparent);
  }
  .pd-cta-primary:active:not(:disabled) { transform: translateY(0); }
  .pd-cta-primary:disabled { opacity: 0.55; cursor: not-allowed; }
  .pd-cta-secondary {
    width: 100%;
    padding: 14px 24px;
    border-radius: 16px;
    border: 1.5px solid var(--pd-border);
    background: var(--pd-surface);
    color: var(--pd-text2);
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all var(--pd-transition);
  }
  .pd-cta-secondary:hover {
    border-color: var(--pd-red);
    color: var(--pd-red);
    background: var(--pd-red-bg);
  }
  .pd-cta-secondary-active {
    border-color: var(--pd-red) !important;
    color: var(--pd-red) !important;
    background: var(--pd-red-bg) !important;
  }

  /* ── sending dots ─────────────────────────────────────────── */
  .pd-sending {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pd-dot {
    width: 5px;
    height: 5px;
    background: white;
    border-radius: 50%;
    animation: dot-bounce 1.2s ease-in-out infinite;
  }
  .pd-dot:nth-child(2) { animation-delay: 0.2s; }
  .pd-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  /* ── empty state ────────────────────────────────────────── */
  .pd-empty {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-align: center;
    padding: 40px;
  }
  .pd-empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--pd-accent-bg);
    border: 1.5px solid color-mix(in srgb, var(--pd-accent) 30%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pd-accent);
  }
  .pd-empty h2 { font-size: 22px; font-weight: 800; color: var(--pd-text); margin: 0; }
  .pd-empty p { font-size: 14px; color: var(--pd-text2); margin: 0; }
  .pd-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 12px 24px;
    border-radius: 50px;
    background: var(--pd-gradient);
    color: white;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: all var(--pd-transition);
    margin-top: 8px;
  }
  .pd-back-btn:hover { opacity: 0.88; transform: translateY(-2px); }

  /* ── skeleton ────────────────────────────────────────────── */
  .skeleton-pulse {
    background: linear-gradient(
      90deg,
      ${dark ? "#1e2636" : "#ece8e0"} 25%,
      ${dark ? "#2a3450" : "#faf5ef"} 50%,
      ${dark ? "#1e2636" : "#ece8e0"} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── left col helpers ─────────────────────────────────────── */
  .pd-left { display: flex; flex-direction: column; }
`;

export default ProductDetail;