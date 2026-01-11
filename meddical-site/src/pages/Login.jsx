import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // SECURE: Store both user info and the JWT token
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (data.user.role === "patient") {
          navigate("/patient/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12 relative overflow-hidden">

      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 md:p-14 relative z-10 border border-gray-100">

        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8 text-blue-600 font-bold hover:scale-105 transition-transform">
            <span className="text-2xl mr-2">«</span>
            Back to Home
          </Link>
          <h2 className="text-4xl font-extrabold text-[#1F2B6C] mb-3">
            Welcome Back
          </h2>
          <p className="text-gray-500 font-medium">
            Login to access your healthcare dashboard
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold text-sm border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-blue-600 font-bold hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-[#1F2B6C] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/10 hover:bg-[#2a3780] transition-all transform ${loading ? "opacity-70 cursor-not-allowed scale-95" : "hover:scale-[1.02]"
              }`}
          >
            {loading ? "Authenticating..." : "Login to Account"}
          </button>
        </form>

        

        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-500 font-medium">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
