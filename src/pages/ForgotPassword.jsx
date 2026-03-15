import { useState } from "react";
import { Link } from "react-router-dom";
import instance from "../utils/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await instance.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong ❌");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-2xl mx-auto mb-4">
            🔑
          </div>
          <h1 className="text-2xl font-medium text-white tracking-tight">
            Forgot Password
          </h1>
          <p className="text-white/30 text-sm mt-2">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
          {success ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-4">📧</p>
              <p className="text-base font-medium text-white mb-2">Check your email!</p>
              <p className="text-sm text-white/30 leading-relaxed">
                We've sent a password reset link to <span className="text-white/50">{email}</span>. Check your inbox and spam folder.
              </p>
              <p className="text-xs text-white/20 mt-4">Link expires in 1 hour</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-white/40">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email"
                  required
                  className="bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
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
                className="mt-2 py-3 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link →"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-white/20 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-white/50 hover:text-white transition-colors">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;