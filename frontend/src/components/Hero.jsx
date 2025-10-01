// src/components/Hero.jsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-l from-rose-100 to-rose-300 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Share your stories
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8">
          Everyone has a story worth telling. Write,
          share, and connect with others who feel the same and put your voice out there.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/Write"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Start writing
          </Link>
          <Link
            to="/stories"
            className="px-6 py-3 border border-black text-black bg-transparent rounded-lg hover:bg-black hover:text-white transition dark:border-gray-300 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            See stories
          </Link>
        </div>
      </div>
    </section>
  );
}
