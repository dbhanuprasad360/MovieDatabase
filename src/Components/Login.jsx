import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "./MovieContext";

function Login() {
  const { setIsLoggedIn } = useContext(MovieContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (username && password) {
      setIsLoggedIn(true);
      navigate("/");
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-1"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba)",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute inset-0 bg-green-900/30"></div>

      <div className="relative z-10 w-full max-w-md mx-4 bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-green-500/20">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎬</div>
          <h2 className="text-2xl font-bold text-green-400">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Login to explore movies</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition duration-300 text-white font-semibold py-3 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
