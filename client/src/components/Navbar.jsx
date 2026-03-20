import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Calendar, User, LogOutIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const navLinks = [
    { path: "/", label: "Home", icon: null },
    { path: "/auth/marketplace", label: "Marketplace", icon: ShoppingBag },
    { path: "/auth/events", label: "Events", icon: Calendar },

    user
      ? {
        type: "fragment",
        items: [
          {
            type: "link",
            path: user.isAdmin ? "/auth/admin" : "/auth/myprofile",

            label: `Welcome ${user.name} !`,
            icon: User,
          },
          {
            type: "button",
            label: "Logout",
            icon: LogOutIcon,
            onClick: () => handleLogout(),
          },
        ],
      }
      : {
        type: "link",
        path: "/login",
        label: "Login",
        icon: User,
        
      },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b  border-gray-300 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            aria-label="EduVerse home"
            className="flex items-center gap-3 text-2xl font-bold transition-all duration-300 hover:scale-105"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-cyan-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg rounded-xl">
              <span className="text-white font-bold text-xl">EV</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-primary text-cyan-500 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-pink-500">Edu</span>
              <span className="text-secondary text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-pink-500">Verse </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8  ">
            {navLinks.map((link, index) => {
              if (link.type === "fragment") {
                return (
                  <div key={index} className="flex items-center gap-4 ">
                    {link.items.map((item, i) =>
                      item.type === "button" ? (
                        <button
                          key={i}
                          onClick={item.onClick}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold
                         text-red-500 hover:bg-red-500 hover:text-white transition-all  "
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          key={i}
                          to={item.path}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg
                         font-semibold text-cyan-500 hover:underline hover:bg-green-500 hover:text-white "
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
                );
              }

              // Normal single link or button
              return link.type === "button" ? (
                <button
                  key={index}
                  onClick={link.onClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold
                 text-red-500 hover:bg-red-500 hover:text-white  "
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold hover:bg-pink-500 hover:text-white "
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-all duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => {
                // ✅ HANDLE FRAGMENT (LOGGED-IN USER)
                if (link.type === "fragment") {
                  return (
                    <div key={index} className="flex flex-col gap-2">
                      {link.items.map((item, i) =>
                        item.type === "button" ? (
                          <button
                            key={i}
                            onClick={() => {
                              item.onClick();
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg
                               text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            key={i}
                            to={item.path || "/profile"}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg
                               font-semibold text-cyan-500 hover:bg-cyan-600 hover:text-white"
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </Link>
                        )
                      )}
                    </div>
                  );
                }

                // ✅ NORMAL BUTTON
                if (link.type === "button") {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        link.onClick();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg
                         text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </button>
                  );
                }

                // ✅ NORMAL LINK
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg
                       hover:bg-cyan-600 hover:text-white"
                  >
                    {link.icon && <link.icon className="w-5 h-5" />}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// desktop navigation-------------------------------------------------------------
//  { path: "/login", label: "Login", icon: User },
// { path: "/logout", label: "Logout", icon: LogOutIcon},

// {navLinks.map((link) => (
//           <Link
//             key={link.path}
//             to={link.path}
//             className={`  flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
//               isActive(link.path)
//                 ? "text-primary bg-primary/10 shadow-neon-purple"
//                 : "text-muted-foreground  bg-cyan-300  hover:text-white hover:bg-cyan-600 "
//             }`}
//           >
//             {link.icon && <link.icon className="w-4 h-4" />}
//             {link.label}
//           </Link>
//         ))}

// mobile menu ----------------------------------------------------------
//  {navLinks.map((link) => (
//             <Link
//               key={link.path}
//               to={link.path}
//               onClick={() => setIsOpen(false)}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
//                   isActive(link.path)
//                     ? "text-primary bg-primary/10"
//                     : "text-muted-foreground hover:text-white hover:bg-cyan-600"
//                 }`}
//             >
//               {link.icon && <link.icon className="w-5 h-5" />}
//               {link.label}
//             </Link>
//           ))}
// hidden md:flex items-center gap-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-pink-700 