import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search, Home, Pencil } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import posts from "../data/posts";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Navbar({ user }) {
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPosts = posts.filter(
    (p) => p.title.toLowerCase().includes(query.toLowerCase()) ||
           p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
           p.content.toLowerCase().includes(query.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleWriteClick = () => {
    if (user) navigate("/write");
    else navigate("/login", { state: { from: "/write" } });
  };

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Left */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-handwritten text-gray-700 dark:text-gray-100">scriblly</h1>
            <Link to="/" className="flex items-center text-black dark:text-gray-100">
              <Home className="w-6 h-6" />
            </Link>
          </div>

          {/* Center Search */}
          <div className="flex-1 mx-4 relative max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search an article..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-300 dark:bg-gray-800/10 dark:border-gray-600 dark:text-gray-200 bg-white/70 backdrop-blur-sm"
              />
            </div>
            {query && (
              <div className="absolute top-12 left-0 right-0 mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border rounded-lg shadow-lg w-full max-w-lg z-50 max-h-60 overflow-y-auto animate-fadeIn">
                {filteredPosts.length ? filteredPosts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/post/${p.id}`}
                    className="block px-4 py-2 hover:bg-rose-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    onClick={() => setQuery("")}
                  >
                    {p.title}
                  </Link>
                )) : <p className="px-4 py-2 text-gray-500 dark:text-gray-400">No results found</p>}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center space-x-3">
            {/* Write button: full on md+, icon only on sm */}
            <button
              onClick={handleWriteClick}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Pencil className="w-4 h-4" /> Write
            </button>
            <button
              onClick={handleWriteClick}
              className="flex md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200"
            >
              <Pencil className="w-5 h-5" />
            </button>

            {user ? (
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center rounded-full bg-black/10 hover:bg-black transition p-1">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <span className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center font-bold text-white">
                      {user.displayName?.[0] || "U"}
                    </span>
                  )}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900/80 backdrop-blur-md border rounded-lg shadow-lg z-50 py-2">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-rose-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-rose-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-full bg-black/80 text-white hover:bg-black">Login</Link>
            )}

            <DarkModeToggle />
          </div>

        </div>
      </div>
    </nav>
  );
}
