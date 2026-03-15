import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Dashboard", path: "/dashboard", icon: "⚡", badge: "AI" },
    { name: "Mock Interview", path: "/interview", icon: "🎤" },
    { name: "CV Builder", path: "/cv-builder", icon: "📝" },
    { name: "About Us", path: "/about", icon: "👥" },
    // Admin only
    ...(user?.role === "admin" ? [{ name: "Admin", path: "/admin", icon: "👑" }] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 50;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-root.scrolled .nav-inner {
          background: rgba(6, 6, 13, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(139, 92, 246, 0.12);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(139,92,246,0.08);
        }

        .nav-inner {
          background: rgba(6, 6, 13, 0.95);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .logo-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px rgba(139,92,246,0.3), 0 4px 12px rgba(139,92,246,0.25);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .logo-link:hover .logo-icon-wrap {
          transform: rotate(-6deg) scale(1.05);
          box-shadow: 0 0 0 1px rgba(139,92,246,0.5), 0 4px 20px rgba(139,92,246,0.4);
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 600;
          color: #f0f0f5;
          letter-spacing: -0.3px;
        }

        .logo-text span {
          background: linear-gradient(90deg, #a78bfa, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .desktop-links {
          display: none;
          align-items: center;
          gap: 2px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 100px;
          padding: 4px;
        }

        @media (min-width: 768px) {
          .desktop-links { display: flex; }
        }

        .nav-link-item { position: relative; }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 100px;
          font-size: 13.5px;
          font-weight: 400;
          letter-spacing: 0.1px;
          text-decoration: none;
          color: rgba(255,255,255,0.45);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-link:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }

        .nav-link.active {
          color: #ffffff;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          font-weight: 500;
        }

        .nav-link.admin-link {
          color: #a78bfa;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.2);
        }

        .nav-link.admin-link:hover {
          background: rgba(139,92,246,0.18);
          color: #c4b5fd;
        }

        .nav-icon { font-size: 12px; opacity: 0.8; }

        .nav-badge {
          font-size: 8.5px;
          font-weight: 600;
          padding: 2px 5px;
          border-radius: 100px;
          background: linear-gradient(90deg, #8b5cf6, #06b6d4);
          color: #fff;
          letter-spacing: 0.5px;
        }

        .dot-indicator {
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .nav-link-item:hover .dot-indicator { opacity: 1; }

        .right-buttons {
          display: none;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .right-buttons { display: flex; }
        }

        .btn-login {
          padding: 8px 16px;
          font-size: 13.5px;
          color: rgba(255,255,255,0.35);
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-login:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
        }

        .btn-cta {
          position: relative;
          overflow: hidden;
          padding: 8px 18px;
          font-size: 13.5px;
          font-weight: 500;
          color: #000;
          background: #ffffff;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .btn-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(255,255,255,0.15);
        }

        /* User Avatar */
        .user-avatar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 6px;
          border-radius: 100px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: default;
        }

        .avatar-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
        }

        .avatar-name {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-logout {
          padding: 8px 14px;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.07);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-logout:hover {
          color: #f87171;
          border-color: rgba(248,113,113,0.3);
          background: rgba(248,113,113,0.06);
        }

        .hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 15px;
        }

        .hamburger:hover {
          background: rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.9);
        }

        @media (min-width: 768px) {
          .hamburger { display: none; }
        }

        .mobile-menu {
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(5,5,10,0.98);
          backdrop-filter: blur(20px);
          padding: 12px 16px 16px;
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 12px;
          font-size: 14px;
          text-decoration: none;
          color: rgba(255,255,255,0.35);
          transition: all 0.18s ease;
        }

        .mobile-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
        }

        .mobile-link.active {
          color: #fff;
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.09);
        }

        .mobile-link.admin-mobile {
          color: #a78bfa;
          background: rgba(139,92,246,0.08);
          border: 1px solid rgba(139,92,246,0.15);
        }

        .mobile-icon { font-size: 13px; opacity: 0.7; width: 18px; text-align: center; }

        .mobile-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          margin-bottom: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
        }

        .mobile-btn-login {
          flex: 1;
          text-align: center;
          padding: 10px;
          font-size: 13.5px;
          color: rgba(255,255,255,0.35);
          border-radius: 100px;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.2s ease;
        }

        .mobile-btn-login:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.06);
        }

        .mobile-btn-cta {
          flex: 1;
          text-align: center;
          padding: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #000;
          background: #ffffff;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .mobile-btn-logout {
          flex: 1;
          text-align: center;
          padding: 10px;
          font-size: 13.5px;
          color: #f87171;
          border-radius: 100px;
          border: 1px solid rgba(248,113,113,0.2);
          background: rgba(248,113,113,0.06);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
        }
      `}</style>

      <nav className={`nav-root${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-container">

            {/* Logo */}
            <Link to="/" className="logo-link">
              <div className="logo-icon-wrap">🎯</div>
              <span className="logo-text">Career<span>Coach</span></span>
            </Link>

            {/* Desktop Links */}
            <ul className="desktop-links" style={{ listStyle: "none", margin: 0, padding: "4px" }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const isAdmin = link.path === "/admin";
                return (
                  <li key={link.name} className="nav-link-item">
                    <Link
                      to={link.path}
                      className={`nav-link${isActive ? " active" : ""}${isAdmin ? " admin-link" : ""}`}
                    >
                      <span className="nav-icon">{link.icon}</span>
                      {link.name}
                      {link.badge && <span className="nav-badge">{link.badge}</span>}
                    </Link>
                    {!isActive && <span className="dot-indicator" />}
                  </li>
                );
              })}
            </ul>

            {/* Right Buttons */}
            <div className="right-buttons">
              {user ? (
                <>
                  {/* User Avatar */}
                  <div className="user-avatar">
                    <div className="avatar-circle">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="avatar-name">{user.name}</span>
                  </div>
                  {/* Logout */}
                  <button onClick={handleLogout} className="btn-logout">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-login">Log in</Link>
                  <Link to="/signup" className="btn-cta">Get Started →</Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button onClick={() => setIsOpen(!isOpen)} className="hamburger">
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu">

            {/* Mobile User Info */}
            {user && (
              <div className="mobile-user-info">
                <div className="avatar-circle">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{user.name}</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "2px" }}>{user.email}</p>
                </div>
                {user.role === "admin" && (
                  <span style={{ marginLeft: "auto", fontSize: "9px", color: "#a78bfa", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", padding: "2px 8px", borderRadius: "20px" }}>
                    Admin
                  </span>
                )}
              </div>
            )}

            <div className="mobile-links">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`mobile-link${location.pathname === link.path ? " active" : ""}${link.path === "/admin" ? " admin-mobile" : ""}`}
                >
                  <span className="mobile-icon">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mobile-actions">
              {user ? (
                <button onClick={handleLogout} className="mobile-btn-logout">
                  Logout →
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="mobile-btn-login">Log in</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="mobile-btn-cta">Get Started →</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;