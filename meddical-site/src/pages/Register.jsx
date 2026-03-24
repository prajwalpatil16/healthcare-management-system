import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Registration failed. Try using a different email.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12 relative overflow-hidden">

      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl p-10 md:p-14 relative z-10 border border-gray-100">

        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8 text-blue-600 font-bold hover:scale-105 transition-transform">
            <span className="text-2xl mr-2">«</span>
            Back to Home
          </Link>
          <h2 className="text-4xl font-extrabold text-[#1F2B6C] mb-3">
            Create Account
          </h2>
          <p className="text-gray-500 font-medium">
            Join our healthcare community today
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold text-sm border border-red-100 animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 p-6 bg-green-50 text-green-600 rounded-3xl text-center font-bold border border-green-100">
            <p className="text-lg">Registration successful! 🎉</p>
            <p className="text-sm font-medium opacity-80 mt-1">Redirecting you to login...</p>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 (234) 567"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

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

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Create Password</label>
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

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 bg-[#1F2B6C] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/10 hover:bg-[#2a3780] transition-all transform ${loading ? "opacity-70 cursor-not-allowed scale-95" : "hover:scale-[1.02]"
                }`}
            >
              {loading ? "Creating Account..." : "Sign Up Now"}
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline ml-1">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
