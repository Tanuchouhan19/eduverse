import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-primary">Campus</span>
              <span className="text-secondary">Hub</span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Your one-stop destination for campus life. Buy, sell, and never miss an event. 
              Built by students, for students.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-neon-pink hover:bg-neon-pink/10 transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-secondary transition-colors duration-300">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>support@campushub.edu</li>
              <li>Student Center, Room 101</li>
              <li>Mon - Fri: 9AM - 6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>© 2024 CampusHub. Made with 💜 by students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
