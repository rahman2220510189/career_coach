import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "CV Analysis", path: "/dashboard" },
      { name: "Skill Gap Report", path: "/dashboard" },
      { name: "Mock Interview", path: "/interview" },
      { name: "Dashboard", path: "/dashboard" },
    ],
    Company: [
      { name: "About Us", path: "/about" },
      { name: "Blog", path: "/blog" },
      { name: "Careers", path: "/careers" },
      { name: "Contact", path: "/contact" },
    ],
    Legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
    ],
  };

  const socialLinks = [
    { name: "GH", url: "https://github.com" },
    { name: "in", url: "https://linkedin.com" },
    { name: "X", url: "https://twitter.com" },
    { name: "fb", url: "https://facebook.com" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-6">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm">
                🎯
              </div>
              <span className="text-base font-medium text-gray-900">
                Career<span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Coach</span>
              </span>
            </Link>

            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-[260px]">
              AI-powered career mentor that analyzes your CV, finds skill gaps, and prepares you for interviews — completely free.
            </p>

            {/* Status */}
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"></span>
              All systems operational
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-700 hover:text-purple-600 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-5" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 CareerCoach. Made with{" "}
            <span className="text-purple-500">♥</span>{" "}
            for job seekers.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-600 hover:bg-purple-100 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;