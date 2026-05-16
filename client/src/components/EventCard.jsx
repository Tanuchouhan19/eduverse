import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowUpRight, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const EventCard = ({ event }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formatDate = (d) => {
    if (!d) return "TBA";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const seats = parseInt(event.availableSeats) || 0;
  const seatsLabel =
    seats === 0 ? "Sold Out" : seats < 20 ? "Almost Full" : `${seats} left`;
  const seatsBg =
    seats === 0
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : seats < 20
      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
      : isDark
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
      : "bg-emerald-600/10 text-emerald-700 border-emerald-600/20";

  const cardBase = isDark
    ? "bg-white/[0.04] border-white/[0.08] hover:border-violet-500/40 hover:bg-white/[0.07]"
    : "bg-white/90 border-amber-200/40 hover:border-amber-400/50 hover:bg-white";

  const titleColor = isDark
    ? "text-slate-100 group-hover:text-violet-300"
    : "text-stone-900 group-hover:text-amber-700";

  const metaColor = isDark ? "text-slate-400" : "text-stone-500";
  const footerBorder = isDark ? "border-white/[0.06]" : "border-stone-100";
  const orgColor = isDark ? "text-slate-400" : "text-stone-500";
  const viewColor = isDark
    ? "text-violet-400 group-hover:text-violet-300"
    : "text-amber-600 group-hover:text-amber-700";

  const glowClass = isDark
    ? "hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(124,108,240,0.12)]"
    : "hover:shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_24px_rgba(201,124,26,0.1)]";

  const statusBg = isDark
    ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
    : "bg-amber-500/15 text-amber-700 border-amber-500/25";

  return (
    <Link
      to={`/auth/event/${event._id}`}
      className={`
        group relative flex flex-col rounded-2xl overflow-hidden border
        backdrop-blur-md transition-all duration-300 cursor-pointer
        hover:-translate-y-2
        ${cardBase} ${glowClass}
      `}
    >
      {/* Hover glow sweep */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100
        transition-opacity duration-500 pointer-events-none rounded-2xl
        ${isDark
          ? "bg-gradient-to-br from-violet-600/[0.06] via-transparent to-cyan-500/[0.04]"
          : "bg-gradient-to-br from-amber-400/[0.06] via-transparent to-orange-300/[0.04]"
        }
      `} />

      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        {event.eventImage ? (
          <img
            src={event.eventImage}
            alt={event.eventName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-5xl
            ${isDark ? "bg-slate-800" : "bg-amber-50"}`}>
            🎉
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
            text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md
            ${statusBg}
          `}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {event.status || "Upcoming"}
          </span>
        </div>

        {/* Seats badge */}
        <div className="absolute top-3 right-3">
          <span className={`
            inline-flex items-center gap-1 px-2.5 py-1 rounded-full
            text-[10px] font-semibold border backdrop-blur-md
            ${seatsBg}
          `}>
            <Users className="w-3 h-3" />
            {seatsLabel}
          </span>
        </div>

        {/* Category chip */}
        {event.category && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <Sparkles className="w-3 h-3 opacity-70" />
              {event.category}
            </span>
          </div>
        )}

        {/* Price chip */}
        {event.price !== undefined && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[11px] font-bold text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {event.price === 0 || event.price === "0" ? "Free" : `₹${event.price}`}
            </span>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Title */}
        <h3 className={`text-[15px] font-bold leading-snug line-clamp-2 transition-colors duration-200 ${titleColor}`}>
          {event.eventName}
        </h3>

        {/* Description */}
        {event.eventDescription && (
          <p className={`text-[12px] leading-relaxed line-clamp-2 ${metaColor}`}>
            {event.eventDescription}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-col gap-1.5 mt-auto pt-1">
          <div className={`flex items-center gap-2 text-[12px] ${metaColor}`}>
            <Calendar className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-violet-400" : "text-amber-600"}`} />
            <span>{formatDate(event.eventDate)}</span>
            {event.time && (
              <>
                <span className="opacity-30">·</span>
                <span>{event.time}</span>
              </>
            )}
          </div>

          <div className={`flex items-center gap-2 text-[12px] ${metaColor}`}>
            <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-cyan-400" : "text-emerald-600"}`} />
            <span className="truncate">{event.location || "Location TBA"}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`px-5 pb-4 pt-3 border-t flex items-center justify-between gap-3 ${footerBorder}`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className={`
            w-7 h-7 rounded-full flex items-center justify-center
            text-[10px] font-black text-white flex-shrink-0
            ${isDark
              ? "bg-gradient-to-br from-violet-500 to-cyan-500"
              : "bg-gradient-to-br from-amber-500 to-orange-500"
            }
          `}>
            {(event.organizer || "?").slice(0, 2).toUpperCase()}
          </div>
          <span className={`text-[11px] truncate max-w-[110px] font-medium ${orgColor}`}>
            {event.organizer || "Organizer"}
          </span>
        </div>

        <div className={`flex items-center gap-1 text-[12px] font-semibold flex-shrink-0 transition-all duration-200 group-hover:gap-1.5 ${viewColor}`}>
          <span>View</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
