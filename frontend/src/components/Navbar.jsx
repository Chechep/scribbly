// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search, Home, Pencil } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import posts from "../data/posts";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Filter posts by search
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      p.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-white/20 dark:border-gray-700/30 
      bg-white/30 dark:bg-gray-900/30 backdrop-blur-md transition-colors duration-500">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-handwritten text-gray-700 dark:text-gray-100">
              scriblly
            </h1>
            <Link to="/" className="flex items-center text-black dark:text-gray-100">
              <Home className="w-6 h-6" />
            </Link>
          </div>

          {/* Center (Search bar) */}
          <div className="hidden md:flex flex-1 justify-center relative">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search an article..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm 
                  focus:outline-none focus:ring-2 focus:ring-rose-500 
                  dark:bg-gray-800/70 dark:border-gray-600 dark:text-gray-200 
                  bg-white/70 backdrop-blur-sm"
              />
            </div>

            {/* Dropdown Results */}
            {query && (
              <div className="absolute top-12 bg-white/80 dark:bg-gray-800/80 
                backdrop-blur-md border rounded-lg shadow-lg w-full max-w-md z-50 
                max-h-60 overflow-y-auto animate-fadeIn">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((p) => (
                    <Link
                      key={p.id}
                      to={`/post/${p.id}`}
                      className="block px-4 py-2 hover:bg-rose-100 dark:hover:bg-gray-700 
                        text-gray-700 dark:text-gray-200"
                      onClick={() => setQuery("")}
                    >
                      {p.title}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    No results found
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg 
              bg-gray-100/70 hover:bg-gray-200 dark:bg-gray-700/70 dark:hover:bg-gray-600 
              text-gray-700 dark:text-gray-200">
              <Pencil className="w-4 h-4" />
              Write
            </button>
            <button className="px-4 py-2 rounded-lg bg-black/80 text-white hover:bg-black">
              Get Started
            </button>
            <DarkModeToggle />
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 space-y-4 
            bg-white/50 dark:bg-gray-900/50 backdrop-blur-md 
            border-t border-white/20 dark:border-gray-700/30 
            animate-slideDown"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
              text-gray-600 dark:text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search an article..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm 
                focus:outline-none focus:ring-2 focus:ring-rose-500 
                dark:bg-gray-800/70 dark:border-gray-600 dark:text-gray-200 
                bg-white/70 backdrop-blur-sm"
            />
          </div>

          {/* Write */}
          <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg 
            bg-gray-100/70 hover:bg-gray-200 dark:bg-gray-700/70 dark:hover:bg-gray-600 
            text-gray-700 dark:text-gray-200">
            <Pencil className="w-4 h-4" />
            Write
          </button>

          {/* Get Started */}
          <button className="w-full px-4 py-2 rounded-lg bg-black/80 text-white hover:bg-black">
            Get Started
          </button>

          {/* Dark Mode */}
          <DarkModeToggle />

          {/* Home link */}
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200 
              hover:text-black dark:hover:text-white"
            onClick={() => setOpen(false)}
          >
            <Home className="w-5 h-5" /> Home
          </Link>
        </div>
      )}
    </nav>
  );
}
