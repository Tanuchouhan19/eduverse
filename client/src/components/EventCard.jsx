import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";

const EventCard = ({ event }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <Link
      to={`/event/${event.id}`}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 transition-all duration-300 hover:scale-105 hover:shadow-neon-green"
    >
      <div className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
            Upcoming
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-secondary transition-colors duration-300">
          {event.title}
        </h3>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-secondary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
