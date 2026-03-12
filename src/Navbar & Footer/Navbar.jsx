import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "About Us", path: "/about", icon: "👥" },
    { name: "Dashboard", path: "/dashboard", icon: "⚡", badge: "AI" },
    { name: "Mock Interview", path: "/interview", icon: "🎤" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#06060d] border-t border-purple-500/15">
      <div className="max-w-7xl  mx-auto px-6 h-[64px] flex items-center justify-between">

        {/* Logo */}
         <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm">
                🎯
              </div>
              <span className="text-base font-medium text-gray-100">
                Career<span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Coach</span>
              </span>
            </Link>
          </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name} className="relative group">
                <Link
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200
                    ${isActive
                      ? "text-white bg-white/10 border border-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/6"
                    }`}
                >
                  <span className="text-[13px]">{link.icon}</span>
                  {link.name}
                  {link.badge && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white text-black">
                      {link.badge}
                    </span>
                  )}
                </Link>

                {/* Dot hover indicator */}
                {!isActive && (
                  <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-white/40 hover:text-white hover:bg-white/6 rounded-full transition-all duration-200"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started →
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white/40 hover:text-white transition-colors"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#050508] border-t border-white/5 px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm transition-all
                ${location.pathname === link.path
                  ? "text-white bg-white/10 border border-white/10"
                  : "text-white/40 hover:text-white hover:bg-white/6"
                }`}
            >
              <span className="text-[13px]">{link.icon}</span>
              {link.name}
            </Link>
          ))}
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2 text-sm text-white/40 hover:text-white rounded-full hover:bg-white/6 transition-all"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2 text-sm font-medium text-black bg-white rounded-full"
            >
              Get Started →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;