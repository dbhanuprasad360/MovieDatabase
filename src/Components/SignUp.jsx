import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "./MovieContext";
import bg from "../assets/Background.jpg";

function SignUp() {
  const { setIsLoggedIn } = useContext(MovieContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    else if (username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ username, email }));
      setIsLoggedIn(true);
      navigate("/");
      setLoading(false);
    }, 800);
  }

  // password strength
  function getStrength() {
    if (password.length === 0) return { level: 0, label: "", color: "" };
    if (password.length < 3)
      return { level: 1, label: "Too short", color: "bg-red-500" };
    if (password.length < 6)
      return { level: 2, label: "Weak", color: "bg-yellow-500" };
    if (password.length < 9)
      return { level: 3, label: "Fair", color: "bg-blue-500" };
    return { level: 4, label: "Strong 💪", color: "bg-green-500" };
  }

  const strength = getStrength();

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden py-10">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 bg-gray-900/90
        backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/[0.08]"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600
              rounded-lg flex items-center justify-center
              shadow-[0_0_12px_rgba(34,197,94,0.3)]"
            >
              🎬
            </div>
            <span
              className="text-white font-black text-2xl tracking-[3px]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              CINE<span className="text-green-400">DB</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">
            Sign up to explore movies
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs font-medium tracking-wide uppercase">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((p) => ({ ...p, username: "" }));
              }}
              placeholder="Choose a username"
              className={`w-full p-3 rounded-lg bg-white/[0.06] text-white
                border transition-colors outline-none placeholder-gray-600
                focus:border-green-500/60 focus:bg-white/[0.08]
                ${errors.username ? "border-red-500/60" : "border-white/[0.1]"}`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-0.5">⚠ {errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs font-medium tracking-wide uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: "" }));
              }}
              placeholder="Enter your email"
              className={`w-full p-3 rounded-lg bg-white/[0.06] text-white
                border transition-colors outline-none placeholder-gray-600
                focus:border-green-500/60 focus:bg-white/[0.08]
                ${errors.email ? "border-red-500/60" : "border-white/[0.1]"}`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-0.5">⚠ {errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs font-medium tracking-wide uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: "" }));
                }}
                placeholder="Create a password"
                className={`w-full p-3 pr-12 rounded-lg bg-white/[0.06] text-white
                  border transition-colors outline-none placeholder-gray-600
                  focus:border-green-500/60 focus:bg-white/[0.08]
                  ${errors.password ? "border-red-500/60" : "border-white/[0.1]"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-500 hover:text-gray-300 transition-colors text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-0.5">⚠ {errors.password}</p>
            )}

            {/* Password strength bar */}
            {password && (
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all
                        ${strength.level >= level ? strength.color : "bg-white/10"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs font-medium tracking-wide uppercase">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((p) => ({ ...p, confirmPassword: "" }));
                }}
                placeholder="Repeat your password"
                className={`w-full p-3 pr-12 rounded-lg bg-white/[0.06] text-white
                  border transition-colors outline-none placeholder-gray-600
                  focus:border-green-500/60 focus:bg-white/[0.08]
                  ${errors.confirmPassword ? "border-red-500/60" : "border-white/[0.1]"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-500 hover:text-gray-300 transition-colors text-sm"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-0.5">
                ⚠ {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600
            hover:from-green-600 hover:to-green-700 text-white font-semibold
            py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)]
            disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
