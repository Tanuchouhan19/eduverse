import { Link } from "react-router-dom";

const categoryConfig = {
  Electronics: { acc: "#7c5aff", accLight: "#c2560a", icon: "⚡" },
  Books:       { acc: "#ff6b35", accLight: "#d4821e", icon: "📚" },
  Furniture:   { acc: "#00c9a7", accLight: "#0e7c5e", icon: "🪑" },
  Stationery:  { acc: "#7c5aff", accLight: "#c2560a", icon: "✏️" },
  Clothing:    { acc: "#ff6b35", accLight: "#d4821e", icon: "👗" },
};

const defaultConfig = { acc: "#7c5aff", accLight: "#c2560a", icon: "🏷️" };

const ProductCard = ({ product, theme = "dark" }) => {
  const isDark = theme === "dark";
  const cfg = categoryConfig[product.category] || defaultConfig;
  const acc = isDark ? cfg.acc : cfg.accLight;

  const T = {
    bg:      isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
    border:  isDark ? "rgba(255,255,255,0.08)" : "rgba(180,140,90,0.2)",
    borderH: isDark ? acc + "66"               : acc + "88",
    fg:      isDark ? "#f0eeff"                : "#1a1208",
    fg2:     isDark ? "#9490b8"                : "#6b5740",
    fg3:     isDark ? "#4e4a6e"                : "#b09c88",
    imgBg:   isDark ? acc + "18"               : acc + "14",
    shadow:  isDark ? `0 4px 24px ${acc}22`    : `0 4px 24px ${acc}18`,
  };

  const initials = product.user?.name
    ? product.user.name.slice(0, 2).toUpperCase()
    : "NA";
  const isAvailable = product.isAvailable !== false;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

        .pc-card {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid ${T.border};
          background: ${T.bg};
          backdrop-filter: blur(12px);
          box-shadow: ${T.shadow};
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          text-decoration: none;
          display: block;
          font-family: 'DM Sans', sans-serif;
        }
        .pc-card:hover {
          transform: translateY(-6px);
          border-color: ${T.borderH};
          box-shadow: 0 20px 60px ${acc}28;
        }
        .pc-shine::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transform: skewX(-20deg);
          transition: left 0.6s ease;
        }
        .pc-card:hover .pc-shine::after { left: 150%; }

        .pc-sparkle {
          position: absolute;
          border-radius: 50%;
          animation: pc-sparkle-pop 2.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes pc-sparkle-pop {
          0%,100% { opacity:0; transform:scale(0); }
          50%      { opacity:1; transform:scale(1); }
        }
        .pc-top-bar {
          position: absolute; top:0; left:0; right:0; height:2px;
          background: linear-gradient(90deg, transparent, ${acc}, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .pc-card:hover .pc-top-bar { opacity: 1; }
      `}</style>

      <Link to={`/auth/marketplace/${product._id}`} className="pc-card">

        <span className="pc-sparkle" style={{ width:6,height:6,background:acc,top:"12%",left:"8%",animationDelay:"0s",opacity:0.5 }} />
        <span className="pc-sparkle" style={{ width:4,height:4,background:acc,top:"30%",right:"10%",animationDelay:"0.8s",opacity:0.4 }} />
        <span className="pc-sparkle" style={{ width:5,height:5,background:acc,bottom:"25%",left:"12%",animationDelay:"1.6s",opacity:0.4 }} />

        {/* Image */}
        <div className="pc-shine" style={{ position:"relative",height:200,overflow:"hidden",background:T.imgBg }}>
          <div className="pc-top-bar" />
          <img
            src={product.itemImage}
            alt={product.title}
            style={{ width:"100%",height:"100%",objectFit:"contain",padding:16,position:"relative",zIndex:1,transition:"transform 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />

          {/* availability badge */}
          <span style={{
            position:"absolute",top:10,left:10,zIndex:2,
            fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,
            background: acc + "22", color: acc,
            border: `1px solid ${acc}44`, backdropFilter:"blur(4px)"
          }}>
            {cfg.icon} {isAvailable ? "Available" : "Sold Out"}
          </span>

          {/* condition badge */}
          {product.condition && (
            <span style={{
              position:"absolute",top:10,right:10,zIndex:2,
              fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:100,
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              color: T.fg2, border:`1px solid ${T.border}`, backdropFilter:"blur(4px)"
            }}>
              {product.condition}
            </span>
          )}

          {/* bottom fade */}
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:40,
            background:`linear-gradient(to top, ${isDark?"rgba(8,8,16,0.6)":"rgba(255,255,255,0.5)"}, transparent)`,
            zIndex:1
          }} />
        </div>

        {/* Body */}
        <div style={{ padding:"14px 16px" }}>

          {/* seller row */}
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12,paddingBottom:10,
            borderBottom:`1px dashed ${acc}30`
          }}>
            <div style={{
              width:28,height:28,borderRadius:"50%",flexShrink:0,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:10,fontWeight:700,color:"#fff",
              background:`linear-gradient(135deg, ${acc}, ${acc}aa)`,
              boxShadow:`0 2px 8px ${acc}44`
            }}>
              {initials}
            </div>
            <span style={{ fontSize:12,color:T.fg2,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
              {product.user?.name || "Anonymous"}
            </span>
            <span style={{ marginLeft:"auto",width:8,height:8,borderRadius:"50%",background:acc,flexShrink:0,boxShadow:`0 0 6px ${acc}` }} />
          </div>

          {/* title */}
          <h3 style={{ fontSize:14,fontWeight:600,color:T.fg,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'Bricolage Grotesque',sans-serif" }}>
            {product.title}
          </h3>

          {/* description */}
          <p style={{ fontSize:12,color:T.fg3,marginBottom:14,lineHeight:1.6,
            display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"
          }}>
            {product.description}
          </p>

          {/* price + cta */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div>
              <span style={{ fontSize:10,color:T.fg3,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.8px",display:"block" }}>Price</span>
              <span style={{ fontSize:20,fontWeight:800,color:acc,fontFamily:"'Bricolage Grotesque',sans-serif" }}>
                ₹{product.prize?.toLocaleString("en-IN")}
              </span>
            </div>
            <span style={{
              fontSize:12,fontWeight:600,padding:"7px 16px",borderRadius:100,
              background:`linear-gradient(135deg, ${acc}, ${acc}bb)`,
              color:"#fff",transition:"all 0.25s",boxShadow:`0 4px 14px ${acc}44`
            }}>
              View →
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
