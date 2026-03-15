import { useState } from "react";
import instance from "../utils/axios";

const About = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await instance.post("/contact", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong ❌");
    }
    setLoading(false);
  };

  const team = [
    { initials: "NRR", name: "Naymur Rahman Riyad", role: "Founder & Full Stack Developer", desc: "Passionate about using AI to solve real-world career problems" },
    { initials: "AI", name: "AI Assistant", role: "Powered by Groq & LLaMA", desc: "Advanced AI that analyzes CVs, conducts interviews, and builds CVs" },
  ];

  const values = [
    { icon: "🎯", title: "Mission", desc: "To help every job seeker in Bangladesh and beyond land their dream job using the power of AI" },
    { icon: "👁️", title: "Vision", desc: "A world where no talented person is rejected just because they didn't know how to present themselves" },
    { icon: "💡", title: "Innovation", desc: "We use cutting-edge AI technology to provide personalized career guidance that was previously only available to the privileged few" },
    { icon: "🤝", title: "Commitment", desc: "We are committed to keeping CareerCoach free and accessible to everyone, regardless of their background" },
  ];

  const inputCls = "w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-all";
  const labelCls = "text-xs text-white/30 mb-1.5 block";

  return (
    <div className="bg-[#080808]">

      {/* ── HERO ── */}
      <section className="relative text-center px-6 py-20 overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
        <div className="relative max-w-[600px] mx-auto">
          <p className="text-[11px] font-medium tracking-[1.5px] uppercase text-white/20 mb-3">
            About Us
          </p>
          <h1 className="text-3xl sm:text-[48px] font-medium text-white tracking-[-1.5px] leading-[1.1] mb-4">
            We Help You Land<br />Your Dream Job
          </h1>
          <p className="text-sm text-white/30 leading-relaxed">
            CareerCoach was built by a developer who struggled to get interviews.
            We believe every talented person deserves a fair shot — regardless of background.
          </p>
        </div>
      </section>

      {/* ── MISSION & VALUES ── */}
      <section className="max-w-[1000px] mx-auto px-6 py-16 sm:py-20">
        <p className="text-[11px] font-medium tracking-[1.5px] uppercase text-white/20 text-center mb-2">
          Our Values
        </p>
        <h2 className="text-2xl sm:text-[36px] font-medium text-white tracking-[-0.8px] text-center mb-3">
          Why We Built This
        </h2>
        <p className="text-sm text-white/30 text-center max-w-md mx-auto mb-12 leading-relaxed">
          Every year, thousands of talented people in Bangladesh get rejected not because they lack skills — but because they don't know how to present themselves
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {values.map((val, i) => (
            <div key={i} className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-lg mb-4">
                {val.icon}
              </div>
              <p className="text-[15px] font-medium text-white mb-2">{val.title}</p>
              <p className="text-xs text-white/30 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-white/[0.06]" />

      {/* ── STORY ── */}
      <section className="max-w-[700px] mx-auto px-6 py-16 sm:py-20">
        <p className="text-[11px] font-medium tracking-[1.5px] uppercase text-white/20 text-center mb-2">
          Our Story
        </p>
        <h2 className="text-2xl sm:text-[36px] font-medium text-white tracking-[-0.8px] text-center mb-8">
          Built From Frustration
        </h2>

        <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 sm:p-8">
          <p className="text-sm text-white/40 leading-relaxed mb-4">
            "I graduated with a Computer Science degree and applied to over 50 jobs. I got almost no responses. I didn't understand why — my skills were good, my projects were real.
          </p>
          <p className="text-sm text-white/40 leading-relaxed mb-4">
            Then I discovered that most companies use ATS systems that automatically reject CVs that don't match their keywords. And when I did get interviews, I froze — because I had never practiced.
          </p>
          <p className="text-sm text-white/40 leading-relaxed mb-4">
            That's when I decided to build CareerCoach — a tool that does what a career coach does, but for free. It analyzes your CV against job postings, tells you exactly what's missing, and lets you practice interviews with AI.
          </p>
          <p className="text-sm text-white/40 leading-relaxed">
            If this tool helps even one person land their dream job, it was worth building."
          </p>
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/[0.06]">
            <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center text-sm font-medium text-white/50">
              NRR
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Naymur Rahman Riyad</p>
              <p className="text-xs text-white/25">Founder, CareerCoach</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-white/[0.06]" />

      {/* ── TEAM ── */}
      <section className="max-w-[1000px] mx-auto px-6 py-16 sm:py-20">
        <p className="text-[11px] font-medium tracking-[1.5px] uppercase text-white/20 text-center mb-2">
          Team
        </p>
        <h2 className="text-2xl sm:text-[36px] font-medium text-white tracking-[-0.8px] text-center mb-12">
          Who Built This
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[600px] mx-auto">
          {team.map((member, i) => (
            <div key={i} className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-lg font-medium text-white/40 mx-auto mb-4">
                {member.initials}
              </div>
              <p className="text-[15px] font-medium text-white mb-1">{member.name}</p>
              <p className="text-xs text-white/30 mb-3">{member.role}</p>
              <p className="text-xs text-white/25 leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-white/[0.06]" />

      {/* ── CONTACT ── */}
      <section className="max-w-[700px] mx-auto px-6 py-16 sm:py-20" id="contact">
        <p className="text-[11px] font-medium tracking-[1.5px] uppercase text-white/20 text-center mb-2">
          Contact Us
        </p>
        <h2 className="text-2xl sm:text-[36px] font-medium text-white tracking-[-0.8px] text-center mb-3">
          Get In Touch
        </h2>
        <p className="text-sm text-white/30 text-center max-w-md mx-auto mb-10 leading-relaxed">
          Have a question, suggestion, or just want to say hi? We'd love to hear from you
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { icon: "📧", label: "Email", value: "naymurrahmanriyad4@gmail.com" },
            { icon: "📍", label: "Location", value: "Dhaka, Bangladesh" },
            { icon: "⏰", label: "Response Time", value: "Within 24 hours" },
          ].map((info, i) => (
            <div key={i} className="bg-[#0f0f0f] border border-white/[0.07] rounded-xl p-4 text-center">
              <p className="text-xl mb-2">{info.icon}</p>
              <p className="text-xs text-white/25 mb-1">{info.label}</p>
              <p className="text-xs text-white/50">{info.value}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 sm:p-8">

          {success ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-4">✅</p>
              <p className="text-lg font-medium text-white mb-2">Message Sent!</p>
              <p className="text-sm text-white/30 mb-6">We'll get back to you within 24 hours</p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 rounded-xl text-sm text-white/40 border border-white/[0.08] hover:text-white/60 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="enter your full name"
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="enter your email"
                    required
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Subject *</label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  required
                  rows={5}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="py-3.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message →"}
              </button>

            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default About;
