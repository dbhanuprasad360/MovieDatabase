import { Link } from "react-router-dom";

function SignUp() {
  function handleSubmit(e) {
    e.preventDefault();
    if (username && email && password) {
      setIsLoggedIn(true);
      navigate("/");
    }
  }
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-1"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba)",
        }}
      ></div>

      {/* Green + dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute inset-0 bg-green-900/30"></div>

      {/* SignUp Card */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-green-500/20">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎬</div>
          <h2 className="text-2xl font-bold text-green-400">Create Account</h2>
          <p className="text-gray-400 text-sm">Sign up to explore movies</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email ID"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400"
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition duration-300 text-white font-semibold py-3 rounded-lg shadow-lg shadow-green-500/30"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 cursor-pointer hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
