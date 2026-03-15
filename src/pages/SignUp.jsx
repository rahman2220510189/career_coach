import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import instance from "../utils/axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match ❌");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters ❌");
    }

    setLoading(true);

    try {
      const res = await instance.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-purple-200">
            🎯
          </div>
          <h1 className="text-2xl font-medium text-gray-900 tracking-tight">
            Create account
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Start your AI-powered career journey
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="enter your full name"
                required
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-400 focus:bg-purple-50 transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="enter your email"
                required
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-400 focus:bg-purple-50 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="enter a strong password"
                required
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-400 focus:bg-purple-50 transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="enter password again"
                required
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-400 focus:bg-purple-50 transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-200"
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:text-purple-700 transition-colors font-medium">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignUp;