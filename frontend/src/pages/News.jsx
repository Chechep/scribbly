// src/pages/News.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const News = () => {
  const API_KEY = "c6d42c4ca019470a9ab3f412227c7422"; // replace with your NewsAPI key
  const PAGE_SIZE = 10;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState("");

  const fetchNews = async (pageNumber = 1, searchQuery = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=${PAGE_SIZE}&page=${pageNumber}&apiKey=${API_KEY}${searchQuery ? `&q=${searchQuery}` : ""}`;
      const response = await axios.get(url);
      setArticles((prev) =>
        pageNumber === 1 ? response.data.articles : [...prev, ...response.data.articles]
      );
      setTotalResults(response.data.totalResults);
    } catch (err) {
      setError("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchNews(1, query);
  }, [query]);

  const loadMore = () => {
    if (articles.length < totalResults) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, query);
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-6 py-10 bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <h1 className="text-4xl font-bold mb-6 text-center">Top Headlines</h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 border-gray-300"
          />
        </div>
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-xl hover:brightness-105"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-105"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {article.description || "No description available."}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 hover:underline"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {articles.length < totalResults && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-transform duration-200 hover:scale-105"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {error && <p className="text-center mt-6 text-red-500">{error}</p>}
    </div>
  );
};

export default News;
