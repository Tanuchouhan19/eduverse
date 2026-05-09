import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Tag, User, CheckCircle, XCircle, Sparkles, ShoppingBag, Share2, Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../features/products/productSlice.js";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { pid } = useParams();                              // ✅ pid — App.jsx se match
  const dispatch = useDispatch();
  const { allProducts, productLoading, productError, productSuccess, productErrorMessage} = useSelector((state) => state.products);
  const product = allProducts?.find((p) => p._id === pid); // ✅ _id se find
  const [wished, setWished] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getProducts(pid));

    }
    if (productLoading) return (<Loader />);

    if(productError && productErrorMessage){
      return toast.error(productErrorMessage)
    }
    
  }, [pid ,productError , productErrorMessage ]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground text-gray-800">Loading...</h1>
          <Link
            to="/auth/marketplace"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const initials = product.user?.name
    ? product.user.name.slice(0, 2).toUpperCase()
    : "NA";

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <Link
          to="/auth/marketplace"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-all duration-300 group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT — Image */}
          <div className="space-y-4">
            <div className="relative mt-20 mr-15 rounded-3xl overflow-hidden bg-white border-2 border-purple-400/30 aspect-square flex items-center justify-center group hover:border-purple-400/70 transition-all duration-500">
              <img
                src={product.itemImage}
                alt={product.title}
                className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-black/10 transition-all duration-500" />

              {/* Availability */}
              <div className="absolute top-4 left-4">
                {product.isAvailable ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold border border-green-300">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Available
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-semibold border border-red-300">
                    <XCircle className="w-3.5 h-3.5" />
                    Sold Out
                  </span>
                )}
              </div>

              {/* Hot badge */}
              {product.prize > 10000 && (
                <div className="absolute top-4 right-4">
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold border border-orange-300 animate-bounce">
                    <Sparkles className="w-3 h-3" />
                    Hot Deal
                  </span>
                </div>
              )}

              {/* Hover action buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <button
                  onClick={(e) => { e.preventDefault(); setWished(!wished); }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    wished ? "bg-red-500 border-red-500 text-white scale-110" : "bg-white/90 border-white text-gray-600 hover:bg-red-50"
                  }`}
                >
                  <Heart className="w-4 h-4" fill={wished ? "white" : "none"} />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); handleShare(); }}
                  className="w-9 h-9 rounded-full bg-white/90 border border-white flex items-center justify-center text-gray-600 hover:bg-purple-50 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Copied toast */}
            <div className={`text-center text-xs text-green-600 font-medium transition-all duration-300 ${copied ? "opacity-100" : "opacity-0"}`}>
              Link copied to clipboard!
            </div>

            {/* Category chip */}
            <div className="flex items-center gap-2 px-4 py-3 bg-purple-50 border border-purple-200 rounded-2xl hover:bg-purple-100 transition-all duration-300">
              <Tag className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-700 font-medium">
                {product.category || "For Sale"}
              </span>
            </div>
          </div>

          {/* RIGHT — Info */}
          <div className="space-y-6">

            {/* Badge + Title + Price */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Student Listing
              </div>
              <h1 className="text-3xl sm:text-4xl font-            text-foreground leading-tight">
                {product.title}
              </h1>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  ₹{product.prize?.toLocaleString()}
                </p>
                <span className="text-sm text-muted-foreground mb-2 line-through opacity-50">
                  ₹{Math.round(Number(product.prize) * 1.2).toLocaleString()}
                </span>
                <span className="mb-2 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                  20% off
                </span>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-purple-300 via-pink-300 to-transparent" />

            {/* Description */}
            <div className="bg-card border border-border rounded-2xl p-5 hover:border-purple-300/50 transition-all duration-300">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Description
              </h2>
              <p className="text-foreground leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Seller Card */}
            <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border border-purple-200/60 rounded-2xl p-5 space-y-4 overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-purple-200/30 group-hover:scale-150 transition-transform duration-500" />
              <h2 className="text-xs font-semibold text-purple-800 uppercase tracking-widest flex items-center gap-2 relative">
                <User className="w-4 h-4" />
                Seller Details
              </h2>
              <div className="flex items-center gap-3 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="font-bold text-foreground">{product?.user?.name || "Unknown"}</p>
                  <p className="text-xs text-green-600 font-medium">✓ Verified Student Seller</p>
                </div>
              </div>
              <div className="space-y-2 relative">
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/80 rounded-xl px-4 py-2.5 hover:bg-white transition-colors duration-200">
                  <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span className="truncate">{product.user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/80 rounded-xl px-4 py-2.5 hover:bg-white transition-colors duration-200">
                  <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>{product.user?.phone}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button className="w-full py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg">
                Contact Seller
              </button>
              <button
                onClick={() => setWished(!wished)}
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm border-2 flex items-center justify-center gap-2 transition-all duration-300 ${
                  wished ? "bg-red-50 border-red-300 text-red-600" : "bg-card border-border text-muted-foreground hover:border-red-300 hover:text-red-500"
                }`}
              >
                <Heart className="w-4 h-4" fill={wished ? "currentColor" : "none"} />
                {wished ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;