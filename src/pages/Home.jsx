import { Link } from "react-router-dom";

const Home = () => {
  const steps = [
    { num: "01", icon: "📄", title: "Upload Your CV", desc: "Upload your PDF CV and paste the job posting URL you want to apply for" },
    { num: "02", icon: "🤖", title: "AI Analyzes", desc: "Our AI compares your CV with the job requirements and finds your skill gaps instantly" },
    { num: "03", icon: "🎤", title: "Practice Interview", desc: "Get personalized interview questions, answer them, and receive real-time feedback and scores" },
    { num: "04", icon: "📝", title: "Build ATS CV", desc: "Create an ATS-optimized CV that passes automated screening systems at top companies" },
  ];

  const features = [
    { icon: "🔍", title: "Skill Gap Analysis", desc: "AI compares your CV with any job posting and tells you exactly what skills you're missing and how to learn them" },
    { icon: "🎤", title: "Mock Interview Bot", desc: "Practice with an AI interviewer that asks real questions, scores your answers, and gives detailed feedback" },
    { icon: "📝", title: "ATS CV Builder", desc: "Build a professional CV that passes ATS systems. Supports Bangladesh education format — SSC, HSC, University" },
    { icon: "📊", title: "Match Score", desc: "Get a percentage score showing how well your profile matches the job requirements" },
    { icon: "📈", title: "Interview History", desc: "Track your progress over time. See how your interview scores improve with each practice session" },
    { icon: "⚡", title: "Instant Results", desc: "Get your complete analysis in under 60 seconds. No waiting, no manual review needed" },
  ];

  const testimonials = [
    { initials: "RA", name: "Rahim Ahmed", role: "Software Engineer · Dhaka", text: "I applied to 20 jobs and got no response. After using CareerCoach, I understood what was missing. Got 3 interview calls in the first week!" },
    { initials: "SB", name: "Sumaiya Begum", role: "Frontend Developer · Chittagong", text: "The mock interview feature is incredible. It asked me exactly the questions I got in my real interview. Landed my first job at a top company!" },
    { initials: "MK", name: "Mamun Khan", role: "Recent Graduate · Rajshahi", text: "As a fresh graduate with no experience, the ATS CV builder helped me create a professional CV that actually gets noticed. Highly recommended!" },
  ];

  const stats = [
    { num: "10,000+", label: "CVs Analyzed" },
    { num: "85%", label: "Interview Success Rate" },
    { num: "500+", label: "Jobs Landed" },
    { num: "100%", label: "Free to Use" },
  ];

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(139,92,246,0.07)_0%,transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%)",
          }}
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs text-purple-600 mb-6 tracking-[0.5px]">
          ✦ AI-Powered Career Mentor
          <span className="text-purple-300">|</span>
          Free to use
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-[64px] font-medium text-gray-900 tracking-[-2px] leading-[1.1] max-w-[800px] mb-5">
          Land Your{" "}
          <span className="bg-gradient-to-b from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Dream Job
          </span>
          <br />
          With AI Guidance
        </h1>

        <p className="text-sm sm:text-base text-gray-500 max-w-[480px] leading-relaxed mb-8">
          Upload your CV, paste a job URL — our AI finds your skill gaps, prepares you for interviews, and builds an ATS-friendly CV in minutes.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md shadow-purple-200"
          >
            Analyze My CV →
          </Link>
          <Link
            to="/cv-builder"
            className="px-6 py-3 rounded-xl text-sm text-gray-600 border border-gray-200 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            Build ATS CV
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-8 sm:gap-12 mt-12 pt-8 border-t border-gray-200 flex-wrap justify-center">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl sm:text-2xl font-medium text-gray-900">{stat.num}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-[1000px] mx-auto px-6 py-16 sm:py-20">
        <p className="text-[11px] font-medium tracking-[1.5px] uppercase text-gray-400 text-center mb-2">
          How it works
        </p>
        <h2 className="text-2xl sm:text-[36px] font-medium text-gray-900 tracking-[-0.8px] text-center mb-3">
          3 Steps to Your Dream Job
        </h2>
        <p className="text-sm text-gray-500 text-center max-w-md mx-auto mb-12 leading-relaxed">
          From CV upload to interview-ready in under 10 minutes
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
          {steps.map((step, i) => (
            <div key={i} className="bg-white hover:bg-gray-50 transition-colors p-6 sm:p-7">
              <p className="text-[11px] font-medium text-gray-400 tracking-[1px] mb-4">{step.num}</p>
              <p className="text-2xl mb-3">{step.icon}</p>
              <p className="text-[15px] font-medium text-gray-900 mb-2">{step.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── FEATURES ── */}
      <section className="max-w-[1000px] mx-auto px-6 py-16 sm:py-20">
        <p className="text-[11px] font-medium tracking-[1.5px] uppercase text-gray-400 text-center mb-2">
          Features
        </p>
        <h2 className="text-2xl sm:text-[36px] font-medium text-gray-900 tracking-[-0.8px] text-center mb-3">
          Everything You Need
        </h2>
        <p className="text-sm text-gray-500 text-center max-w-md mx-auto mb-12 leading-relaxed">
          All the tools to land your next job, completely free
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-sm hover:shadow-purple-100 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-lg mb-4">
                {feature.icon}
              </div>
              <p className="text-[15px] font-medium text-gray-900 mb-2">{feature.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-[1000px] mx-auto px-6 py-16 sm:py-20">
        <p className="text-[11px] font-medium tracking-[1.5px] uppercase text-gray-400 text-center mb-2">
          Testimonials
        </p>
        <h2 className="text-2xl sm:text-[36px] font-medium text-gray-900 tracking-[-0.8px] text-center mb-3">
          What People Say
        </h2>
        <p className="text-sm text-gray-500 text-center max-w-md mx-auto mb-12 leading-relaxed">
          Real stories from job seekers who landed their dream jobs
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-all">
              <p className="text-xs text-yellow-400 mb-3">★★★★★</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-600">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gray-50 border-t border-b border-gray-200 py-16 sm:py-20 px-6 text-center">
        <h2 className="text-2xl sm:text-[36px] font-medium text-gray-900 tracking-[-0.8px] mb-3">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Join thousands of job seekers who found their perfect role with CareerCoach
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md shadow-purple-200"
        >
          Get Started for Free →
        </Link>
      </section>

    </div>
  );
};

export default Home;