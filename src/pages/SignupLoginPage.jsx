import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EmpressNavbar from "../components/EmpressNavbar";
import Footer from "../components/Footer";
import LetterGlitch from '../../src/components/LetterGlitch/LetterGlitch';


export default function SignupLoginPage() {
  const { login, register, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      
      if (mode === "login") {
        // Login
        result = await login({
          email: form.email,
          password: form.password,
        });
      } else {
        // Sign up
        if (!form.name.trim()) {
          setError("Please enter your name to sign up.");
          setLoading(false);
          return;
        }
        
        result = await register({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      }

      if (result.success) {
        // Check if user is admin and redirect accordingly
        if (isAdmin()) {
          navigate("/admin");
        } else {
          navigate("/account");
        }
      } else {
        setError(result.message || "Authentication failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <EmpressNavbar />
      <div className="min-h-[65vh] flex items-center justify-center px-4 py-8">
        {/* Background */}
        <div className="fixed inset-0 z-[-10]">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
          />
          {/* Enhanced gradient overlay for better depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
        </div>

        <div className="w-full max-w-md relative">
          {/* Go Back Button - Modern floating style */}
          <div className="absolute -top-16 left-0">
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 
                         bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 
                         px-4 py-2.5 rounded-full font-medium text-sm
                         hover:scale-105 hover:shadow-lg hover:shadow-white/10"
              disabled={loading}
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>
          </div>

          {/* Main Card - Glassmorphism design */}
          <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-3xl p-8 
                          shadow-2xl shadow-black/40 hover:shadow-black/60 transition-all duration-500
                          before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br 
                          before:from-white/10 before:to-transparent before:opacity-50 before:pointer-events-none
                          relative overflow-hidden">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-white/60 font-medium">
                {mode === "login" ? "Sign in to your account" : "Join us today"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-xl border border-red-400/30 
                             text-red-200 rounded-2xl text-sm font-medium
                             animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div className="group">
                  <label className="block text-white/80 text-sm font-semibold mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange("name")}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/30 
                               rounded-2xl text-white placeholder-white/50 font-medium
                               focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 
                               hover:bg-white/15 hover:border-white/40
                               transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/10"
                    required
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className="group">
                <label className="block text-white/80 text-sm font-semibold mb-2 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/30 
                             rounded-2xl text-white placeholder-white/50 font-medium
                             focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 
                             hover:bg-white/15 hover:border-white/40
                             transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/10"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="group">
                <label className="block text-white/80 text-sm font-semibold mb-2 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/30 
                             rounded-2xl text-white placeholder-white/50 font-medium
                             focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 
                             hover:bg-white/15 hover:border-white/40
                             transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/10"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 font-bold text-lg rounded-2xl transition-all duration-300 
                           relative overflow-hidden group mt-8 ${
                  loading
                    ? "bg-white/20 cursor-not-allowed text-white/40"
                    : "bg-gradient-to-r from-[#F47C5A] to-orange-500 hover:from-[#e66b49] hover:to-orange-600 text-white shadow-xl hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white/60 rounded-full animate-spin"></div>
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                )}
              </button>
            </form>

            {mode === "login" && (
              <div className="text-center mt-6">
                <button className="text-blue-300 hover:text-blue-200 font-semibold text-sm 
                                 hover:underline transition-colors duration-300">
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="px-4 text-white/60 font-medium text-sm">OR</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Mode Toggle */}
            {mode === "login" ? (
              <div className="text-center">
                <p className="text-white/70 mb-4 font-medium">Don't have an account?</p>
                <button
                  onClick={() => setMode("signup")}
                  disabled={loading}
                  className="w-full bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/30 
                             text-white font-bold py-4 rounded-2xl transition-all duration-300 
                             hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create New Account
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white/70 mb-4 font-medium">Already have an account?</p>
                <button
                  onClick={() => setMode("login")}
                  disabled={loading}
                  className="w-full bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/30 
                             text-white font-bold py-4 rounded-2xl transition-all duration-300 
                             hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign In Instead
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}