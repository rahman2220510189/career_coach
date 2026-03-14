import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import instance from "../utils/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobUrl, setJobUrl] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      setError("");
    } else {
      setError("Please upload a PDF file ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!cvFile) return setError("Please upload your CV ❌");
    if (!jobUrl) return setError("Please enter job URL ❌");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("jobUrl", jobUrl);
      const res = await instance.post("/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong ❌");
    }
    setLoading(false);
  };

  const importanceStyle = (importance) => {
    if (importance === "high")
      return "bg-red-500/10 text-red-400 border-red-500/20";
    if (importance === "medium")
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-green-500/10 text-green-400 border-green-500/20";
  };

  return (
    <div
      className="min-h-screen bg-[#06060d]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Subtle ambient glow top */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] rounded-full bg-purple-600/[0.07] blur-[90px]" />

      <div className="relative max-w-[860px] mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" />
            <span className="text-[11px] tracking-[0.7px] uppercase text-white/30 font-medium">
              AI Analysis
            </span>
          </div>
          <h1
            className="text-2xl sm:text-[28px] font-semibold text-white tracking-[-0.7px]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.name}
            </span>{" "}
            👋
          </h1>
          <p className="text-[13px] text-white/25 mt-2 leading-relaxed">
            Upload your CV and job URL to get AI-powered skill gap analysis
          </p>
        </div>

        {/* ══ FORM ══ */}
        {!result && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* CV Upload */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-6 hover:border-white/[0.11] transition-colors duration-300">
              <p className="text-[10.5px] font-semibold tracking-[0.9px] uppercase text-white/25 mb-3 flex items-center gap-1.5">
                <span>📄</span> Your CV
              </p>
              <div
                onClick={() => document.getElementById("cvInput").click()}
                className="border border-dashed border-white/[0.09] rounded-xl p-6 sm:p-9 text-center cursor-pointer hover:border-purple-500/30 hover:bg-purple-500/[0.03] transition-all duration-300 group"
              >
                <input
                  id="cvInput"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {cvFile ? (
                  <div className="flex items-center justify-center gap-2 py-2 bg-green-500/[0.06] border border-green-500/[0.15] rounded-xl px-4">
                    <span className="text-green-400 text-sm truncate max-w-[200px] sm:max-w-none">
                      ✅ {cvFile.name}
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">⬆</p>
                    <p className="text-sm text-white/25 group-hover:text-white/40 transition-colors">
                      Click to upload your CV
                    </p>
                    <p className="text-xs text-white/10 mt-1">PDF only · Max 10MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Job URL */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-6 hover:border-white/[0.11] transition-colors duration-300">
              <p className="text-[10.5px] font-semibold tracking-[0.9px] uppercase text-white/25 mb-3 flex items-center gap-1.5">
                <span>💼</span> Job Posting URL
              </p>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://linkedin.com/jobs/view/..."
                className="w-full bg-[#06060d] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 focus:bg-purple-500/[0.03] transition-all duration-200"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden py-[14px] rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-1 group"
            >
              <span className="relative z-10">
                {loading ? "🤖 AI Analyzing..." : "Analyze My CV →"}
              </span>
              {!loading && (
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>

          </form>
        )}

        {/* ══ RESULTS ══ */}
        {result && (
          <div className="flex flex-col gap-4">

            {/* Score Card */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
              {/* Ring */}
              <div className="relative w-[88px] h-[88px] flex-shrink-0">
                <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
                  <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                  <circle
                    cx="44" cy="44" r="36" fill="none"
                    stroke={
                      result.matchScore >= 70
                        ? "#4ade80"
                        : result.matchScore >= 40
                        ? "#facc15"
                        : "#f87171"
                    }
                    strokeWidth="7"
                    strokeDasharray={`${result.matchScore * 2.262} 226`}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 6px ${result.matchScore >= 70 ? "#4ade8066" : result.matchScore >= 40 ? "#facc1566" : "#f8717166"})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  {result.matchScore}%
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  className="text-[18px] font-semibold text-white tracking-[-0.4px]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {result.candidateName}
                </h2>
                <p className="text-xs text-white/25 mt-1 flex items-center gap-1 justify-center sm:justify-start">
                  <span>→</span>
                  <span>{result.jobTitle}</span>
                </p>
                <p className="text-xs text-white/30 mt-3 leading-relaxed max-w-[480px]">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Strengths + Gap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-6 hover:border-white/[0.1] transition-colors duration-300">
                <p className="text-[10.5px] font-semibold tracking-[0.9px] uppercase text-white/25 mb-4 flex items-center gap-1.5">
                  <span>✅</span> Strengths
                </p>
                <div className="flex flex-col gap-2">
                  {result.strengths?.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-white/45 pb-2.5 border-b border-white/[0.05] last:border-0 last:pb-0"
                    >
                      <span className="text-green-400 flex-shrink-0 mt-0.5 text-xs">●</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-6 hover:border-white/[0.1] transition-colors duration-300">
                <p className="text-[10.5px] font-semibold tracking-[0.9px] uppercase text-white/25 mb-4 flex items-center gap-1.5">
                  <span>📊</span> Experience Gap
                </p>
                <p className="text-sm text-white/35 leading-relaxed">
                  {result.experienceGap}
                </p>
              </div>

            </div>

            {/* Missing Skills */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-6 hover:border-white/[0.1] transition-colors duration-300">
              <p className="text-[10.5px] font-semibold tracking-[0.9px] uppercase text-white/25 mb-4 flex items-center gap-1.5">
                <span>🚨</span> Missing Skills
              </p>
              <div className="flex flex-col gap-2">
                {result.missingSkills?.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-white/[0.025] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
                  >
                    <span
                      className={`text-[9px] font-semibold px-2 py-1 rounded-md border flex-shrink-0 mt-0.5 tracking-[0.6px] ${importanceStyle(skill.importance)}`}
                    >
                      {skill.importance?.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-white/70 font-medium">{skill.skill}</p>
                      <p className="text-xs text-white/25 mt-1 leading-relaxed">💡 {skill.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Topics */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-6 hover:border-white/[0.1] transition-colors duration-300">
              <p className="text-[10.5px] font-semibold tracking-[0.9px] uppercase text-white/25 mb-4 flex items-center gap-1.5">
                <span>🎤</span> Interview Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {result.interviewTopics?.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs text-white/30 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full hover:bg-white/[0.07] hover:text-white/50 hover:border-purple-500/20 transition-all duration-200 cursor-default"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <button
                onClick={() => setResult(null)}
                className="flex-1 py-3 rounded-xl text-sm text-white/30 border border-white/[0.08] hover:text-white/60 hover:border-white/[0.15] hover:bg-white/[0.03] transition-all duration-200"
              >
                ← Analyze Another
              </button>
              <button
                onClick={() => navigate("/interview", { state: { analysis: result } })}
                className="relative overflow-hidden flex-1 py-3 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-200 group"
              >
                <span className="relative z-10">Start Mock Interview →</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;