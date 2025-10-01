// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect after signup
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-rose-100 to-rose-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="bg-white dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-handwritten text-rose-700 dark:text-rose-300 text-center mb-6">
          Scriblly
        </h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-800 dark:text-gray-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-800 dark:text-gray-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-800 dark:text-gray-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition font-semibold"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600 transition"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="text-gray-700 dark:text-gray-200">Sign up with Google</span>
        </button>

        <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-rose-500 hover:underline dark:text-rose-300">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
