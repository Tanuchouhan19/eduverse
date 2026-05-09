import { useEffect, useState } from "react";
import { Search, Filter, ChevronDown, Sparkles, TrendingUp, Package } from "lucide-react";
import { categories } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/products/productSlice.js";
import Loader from "../components/Loader.jsx";
import { toast } from "react-hot-toast";

const categoryIcons = {
  All: "🏪",
  Electronics: "⚡",
  Books: "📚",
  Furniture: "🪑",
  Stationery: "✏️",
  Clothing: "👗",
};

const Marketplace = () => {
  const { allProducts, productLoading, productError, productErrorMessage } = useSelector(
    (state) => state.products
  );
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-5000", label: "Under ₹5,000" },
    { value: "5000-15000", label: "₹5,000 – ₹15,000" },
    { value: "15000-30000", label: "₹15,000 – ₹30,000" },
    { value: "30000+", label: "Above ₹30,000" },
  ];

  const sortOptions = [
    { value: "default", label: "✦ Default" },
    { value: "low-high", label: "↑ Price: Low to High" },
    { value: "high-low", label: "↓ Price: High to Low" },
  ];

  const filteredProducts = (allProducts || [])
    .filter((product) => {
      const matchesSearch = product?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      let matchesPrice = true;
      if (priceRange === "0-5000") matchesPrice = product.prize < 5000;
      else if (priceRange === "5000-15000") matchesPrice = product.prize >= 5000 && product.prize < 15000;
      else if (priceRange === "15000-30000") matchesPrice = product.prize >= 15000 && product.prize < 30000;
      else if (priceRange === "30000+") matchesPrice = product.prize >= 30000;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.prize - b.prize;
      if (sortOrder === "high-low") return b.prize - a.prize;
      return 0;
    });

  // ✅ FIX: fetch only once on mount
  useEffect(() => {
    dispatch(getProducts());
  }, []);

  // ✅ FIX: show error separately, only when it changes
  useEffect(() => {
    if (productError && productErrorMessage) {
      toast.error(productErrorMessage);
    }
  }, [productError, productErrorMessage]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=Outfit:wght@300;400;500;600;700&display=swap');

        .mkt-root {
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          background: #fffaf3;
          position: relative;
          overflow-x: hidden;
        }

        .mkt-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 70% 50% at 10% 20%, rgba(255,215,100,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 60% at 90% 10%, rgba(255,160,80,0.14) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 50% 90%, rgba(255,190,80,0.12) 0%, transparent 70%),
            #fffaf3;
        }

        .dust {
          position: fixed;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,215,80,0.7), transparent);
          pointer-events: none;
          z-index: 0;
          animation: float-up linear infinite;
        }
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { transform: translateY(-120vh) scale(0.6); opacity: 0; }
        }

        .mkt-hero {
          position: relative;
          padding: 56px 0 40px;
          text-align: center;
        }

        .mkt-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          font-weight: 700;
          line-height: 1.1;
          background: linear-gradient(135deg, #b45309 0%, #d97706 40%, #f59e0b 70%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.01em;
        }

        .mkt-subtitle {
          font-size: 1rem;
          color: #92400e;
          font-weight: 400;
          opacity: 0.75;
          margin-top: 8px;
          letter-spacing: 0.03em;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 18px;
          border-radius: 99px;
          background: linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15));
          border: 1px solid rgba(251,191,36,0.4);
          color: #92400e;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .stat-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(251,191,36,0.3);
          border-radius: 14px;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 12px rgba(200,130,30,0.08);
        }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #b45309;
        }

        .stat-label {
          font-size: 11px;
          color: #92400e;
          opacity: 0.7;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .search-wrap { position: relative; }

        .search-input {
          width: 100%;
          padding: 16px 20px 16px 52px;
          border-radius: 20px;
          border: 1.5px solid rgba(251,191,36,0.35);
          background: rgba(255,255,255,0.9);
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          color: #5c2d00;
          outline: none;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(200,130,30,0.08);
        }

        .search-input::placeholder { color: #c8997a; }

        .search-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 4px rgba(251,191,36,0.15), 0 4px 20px rgba(200,130,30,0.1);
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #d97706;
        }

        .filter-select {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border-radius: 14px;
          border: 1.5px solid rgba(251,191,36,0.3);
          background: rgba(255,255,255,0.85);
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px;
          color: #7c3a00;
          appearance: none;
          cursor: pointer;
          outline: none;
          transition: all 0.3s;
          box-shadow: 0 2px 10px rgba(200,130,30,0.06);
        }

        .filter-select:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(251,191,36,0.15);
        }

        .filter-wrap { position: relative; }

        .filter-chevron {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #d97706;
        }

        .cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
          border: 1.5px solid rgba(251,191,36,0.25);
          background: rgba(255,255,255,0.7);
          color: #92400e;
          white-space: nowrap;
        }

        .cat-pill:hover {
          border-color: rgba(245,158,11,0.5);
          background: rgba(255,255,255,0.95);
          transform: translateY(-1px);
        }

        .cat-pill.active {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 16px rgba(245,158,11,0.4);
          transform: translateY(-2px);
        }

        .results-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1));
          border: 1.5px solid rgba(251,191,36,0.3);
          font-size: 13px;
          font-weight: 600;
          color: #92400e;
        }

        .empty-state {
          text-align: center;
          padding: 80px 24px;
          background: rgba(255,255,255,0.7);
          border-radius: 32px;
          border: 1.5px dashed rgba(251,191,36,0.4);
        }

        .ornament-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          color: rgba(217,119,6,0.5);
          font-size: 12px;
          letter-spacing: 0.1em;
          margin: 8px 0;
        }

        .ornament-divider::before,
        .ornament-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(251,191,36,0.4), transparent);
        }

        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.85);
          border: 1.5px solid rgba(251,191,36,0.3);
          color: #92400e;
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-toggle-btn:hover {
          background: rgba(255,255,255,0.98);
          border-color: rgba(245,158,11,0.5);
        }

        /* ✅ Skeleton shimmer */
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f3e8d0 25%, #fdf3e3 50%, #f3e8d0 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
          border-radius: 12px;
        }
      `}</style>

      <div className="mkt-bg" />

      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="dust"
          style={{
            width: `${Math.random() * 5 + 2}px`,
            height: `${Math.random() * 5 + 2}px`,
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 30}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}

      <div className="mkt-root">
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">

          {/* ── HERO ── */}
          <div className="mkt-hero">
            <div className="hero-badge">
              <Sparkles size={12} />
              Student Marketplace
            </div>
            <h1 className="mkt-title">EduVerse Bazaar</h1>
            <p className="mkt-subtitle">Discover · Buy · Sell — within your campus community</p>

            <div className="stats-row">
              <div className="stat-chip">
                <Package size={16} style={{ color: "#d97706" }} />
                <div>
                  <div className="stat-number">{(allProducts || []).length}</div>
                  <div className="stat-label">Listings</div>
                </div>
              </div>
              <div className="stat-chip">
                <TrendingUp size={16} style={{ color: "#d97706" }} />
                <div>
                  <div className="stat-number">{filteredProducts.length}</div>
                  <div className="stat-label">Matching</div>
                </div>
              </div>
              <div className="stat-chip">
                <span style={{ fontSize: "16px" }}>🎓</span>
                <div>
                  <div className="stat-number">{categories.length}</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
            </div>
          </div>

          <div className="ornament-divider my-6"><span>✦ ✦ ✦</span></div>

          {/* ── SEARCH ── */}
          <div className="search-wrap mb-5">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books, laptops, chairs, notes..."
              className="search-input"
            />
          </div>

          {/* ── MOBILE FILTER TOGGLE ── */}
          <button
            className="filter-toggle-btn lg:hidden mb-4"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={15} />
            Filters & Sort
            <ChevronDown
              size={14}
              style={{ transition: "transform 0.3s", transform: showFilters ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          {/* ── FILTERS ROW ── */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${showFilters ? "block" : "hidden lg:grid"}`}>
            <div className="filter-wrap">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{categoryIcons[cat] || "🏷️"} {cat}</option>
                ))}
              </select>
              <ChevronDown size={15} className="filter-chevron" />
            </div>

            <div className="filter-wrap">
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="filter-select">
                {priceRanges.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="filter-chevron" />
            </div>

            <div className="filter-wrap">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filter-select">
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="filter-chevron" />
            </div>

            <div className="results-chip">
              <Sparkles size={15} style={{ color: "#d97706" }} />
              <span>{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found</span>
            </div>
          </div>

          {/* ── CATEGORY PILLS ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
              >
                <span>{categoryIcons[cat] || "🏷️"}</span>
                {cat}
              </button>
            ))}
          </div>

          {/* ── SECTION LABEL ── */}
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 700, color: "#b45309" }}>
              {selectedCategory === "All" ? "All Listings" : `${categoryIcons[selectedCategory] || ""} ${selectedCategory}`}
            </h2>
            {searchQuery && (
              <span className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Results for "{searchQuery}"
              </span>
            )}
          </div>

          {/* ── PRODUCTS GRID — skeleton while loading, real cards after ── */}
          {productLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(251,191,36,0.2)", background: "rgba(255,255,255,0.7)" }}>
                  <div className="skeleton" style={{ height: 200 }} />
                  <div style={{ padding: 16 }}>
                    <div className="skeleton" style={{ height: 12, width: "70%", marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 10, width: "90%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: "50%", marginBottom: 16 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div className="skeleton" style={{ height: 20, width: "35%" }} />
                      <div className="skeleton" style={{ height: 32, width: "28%", borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="text-6xl mb-5">🔍</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 700, color: "#b45309", marginBottom: "8px" }}>
                Nothing found
              </h3>
              <p style={{ color: "#92400e", opacity: 0.7, fontSize: "14px" }}>
                Try different keywords or adjust your filters
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setPriceRange("all"); setSortOrder("default"); }}
                style={{ marginTop: "20px", padding: "10px 24px", borderRadius: "12px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px" }}
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Marketplace;