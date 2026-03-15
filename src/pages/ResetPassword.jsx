import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import instance from "../utils/axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match ❌");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters ❌");
    }

    setLoading(true);
    try {
      await instance.post("/auth/reset-password", { token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong ❌");
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-4">❌</p>
          <p className="text-white font-medium mb-2">Invalid Reset Link</p>
          <p className="text-white/30 text-sm mb-6">This link is invalid or has expired</p>
          <Link to="/forgot-password" className="text-white/50 hover:text-white text-sm transition-colors">
            Request a new link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-2xl mx-auto mb-4">
            🔒
          </div>
          <h1 className="text-2xl font-medium text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-white/30 text-sm mt-2">
            Enter your new password below
          </p>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
          {success ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-4">✅</p>
              <p className="text-base font-medium text-white mb-2">Password Reset!</p>
              <p className="text-sm text-white/30">
                Your password has been reset successfully. Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-white/40">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="enter new password"
                  required
                  className="bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-white/40">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="confirm new password"
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
                {loading ? "Resetting..." : "Reset Password →"}
              </button>

            </form>
          )}
        </div>

        <p className="text-center text-sm text-white/20 mt-6">
          <Link to="/login" className="text-white/50 hover:text-white transition-colors">
            ← Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;