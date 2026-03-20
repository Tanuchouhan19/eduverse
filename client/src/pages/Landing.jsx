import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Calendar, DollarSign, Zap, Users, Sparkles } from "lucide-react";
import { products } from "../data/products.js";
import { events } from "../data/events.js";
import ProductCard from "../components/ProductCard.jsx";
import EventCard from "../components/EventCard.jsx";
import Footer from "../components/Footer.jsx";

const Landing = () => {
  const featuredProducts = products.slice(0, 4);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
          
          {/* Floating Shapes */}
          <div className="absolute top-32 right-20 w-20 h-20 border-2 border-primary/30 rounded-2xl rotate-12 animate-float" />
          <div className="absolute bottom-32 left-20 w-16 h-16 border-2 border-secondary/30 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-accent/20 rounded-lg rotate-45 animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Campus Life, Elevated</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
            <span className="text-foreground text-pink-500">Flip Your</span>
            <br />
            <span className="text-primary text-pink-300">Old Stuff.</span>
            <br />
            <span className="text-secondary bg-purple-200 rounded-xl p-2">Catch Campus</span>
            <br />
            <span className="text-accent bg-purple-200 rounded-xl p-2">Chaos.🚀</span>
          </h1>

          {/* Subtext */}
          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            The ultimate student marketplace & events hub. 
            Buy, sell, trade — and never miss what's happening on campus.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="bg-cyan-300 hover:bg-cyan-500 hover:text-white group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-neon-purple"
            >
              <ShoppingBag className="w-5 h-5 " />
              Explore Marketplace
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/events"
              className="bg-cyan-300 hover:bg-cyan-500 hover:text-white group flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-neon-green"
            >
              <Calendar className="w-5 h-5" />
              View Events
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary bg-cyan-100 p-2">500+</p>
              <p className="text-muted-foreground bg-cyan-100">Active Listings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-secondary bg-cyan-100 p-2">50+</p>
              <p className="text-muted-foreground bg-cyan-100">Events Monthly</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-accent bg-cyan-100 p-2">5K+</p>
              <p className="text-muted-foreground bg-cyan-100">Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              What You Can Do
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Everything you need for campus life, in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8  ">
            {/* Feature 1 */}
            <div className=" bg-pink-100 group p-8 bg-background rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 border-gray-400 shadow-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 ">Buy & Sell on Campus</h3>
              <p className="text-muted-foreground">
                Find amazing deals from fellow students. Electronics, books, furniture — everything you need.
              </p>
            </div>

            {/* Feature 2 */}
            <div className=" bg-pink-100 group p-8 bg-background rounded-3xl border border-border hover:border-secondary/50 transition-all duration-300 hover:scale-105 border-gray-400 shadow-xl">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Turn Old Stuff into Cash</h3>
              <p className="text-muted-foreground">
                List your items in seconds. Reach thousands of students looking for exactly what you have.
              </p>
            </div>

            {/* Feature 3 */}
            <div className=" bg-pink-100 group p-8 bg-background rounded-3xl border border-border hover:border-accent/50 transition-all duration-300 hover:scale-105 border-gray-400 shadow-xl">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Never Miss College Events</h3>
              <p className="text-muted-foreground">
                Stay updated with fests, workshops, parties, and more. Comment and connect with others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Featured Products
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hot picks from the marketplace
              </p>
            </div>
            <Link
              to="/marketplace"
              className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Upcoming Events
              </h2>
              <p className="mt-2 text-muted-foreground">
                Don't miss what's happening
              </p>
            </div>
            <Link
              to="/events"
              className="hidden sm:flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors"
            >
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl border border-border bg-pink-200">
            <Users className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Join the Community
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Connect with thousands of students. Start buying, selling, and experiencing campus life like never before.
            </p>
            <Link
              to="/login"
              className=" inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-neon-purple"
            >
              <h2 className="bg-cyan-700 p-3 rounded-xl hover:bg-cyan-900 text-white hover:text-white hover:text-bold">Get Started Free</h2>
              <ArrowRight className="w-5 h-5 bg-cyan-700 text-white" />
            </Link>
          </div>
        </div>
      </section>
<Footer/>
    </div>
  );
};

export default Landing;
