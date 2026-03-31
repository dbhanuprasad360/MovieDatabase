import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "./MovieContext";
import bg from "../assets/Background.jpg";
import { useSearchParams } from "react-router-dom";

function Login() {
  const { setIsLoggedIn, setIsAdmin } = useContext(MovieContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get("type") || "user";
  const isAdminLogin = loginType === "admin";

  function validate() {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
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
      setIsLoggedIn(true);
      setIsAdmin(isAdminLogin); // ← set admin status
      if (rememberMe) localStorage.setItem("rememberedUser", username);
      navigate("/");
      setLoading(false);
    }, 800);
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden">
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
          <h2 className="text-2xl font-bold text-white">
            {isAdminLogin ? "Admin Login" : "Welcome"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isAdminLogin ? "Login as administrator" : "Login to your account"}
          </p>
          {/* {isAdminLogin && (
            <div
              className="inline-flex items-center  bg-green-500/10
    border border-green-500/30 text-green-400 text-xs px-3 py-1
    rounded-full mb-3"
            >
              🔐 Admin Access
            </div>
          )} */}
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
                setErrors((prev) => ({ ...prev, username: "" }));
              }}
              placeholder="Enter your username"
              className={`w-full p-3 rounded-lg bg-white/[0.06] text-white
                border transition-colors outline-none placeholder-gray-600
                focus:border-green-500/60 focus:bg-white/[0.08]
                ${errors.username ? "border-red-500/60" : "border-white/[0.1]"}`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-0.5">⚠ {errors.username}</p>
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
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="Enter your password"
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
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-green-500 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-gray-400 text-sm cursor-pointer"
            >
              Remember me
            </label>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-gray-500 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-400 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
