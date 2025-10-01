// src/pages/News.jsx
import { useState, useEffect, useRef, useCallback } from "react";
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

  const observer = useRef();

  // Fetch news
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

  // Initial load & query change
  useEffect(() => {
    setPage(1);
    fetchNews(1, query);
  }, [query]);

  // Infinite scroll
  const lastArticleRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && articles.length < totalResults) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, articles, totalResults]
  );

  // Fetch next page when page changes
  useEffect(() => {
    if (page === 1) return;
    fetchNews(page, query);
  }, [page]);

  return (
    <div className="min-h-screen px-4 md:px-6 py-10 bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <h1 className="text-4xl font-bold mb-6 text-center">News</h1>

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
        {articles.map((article, index) => {
          if (index === articles.length - 1) {
            return (
              <div
                ref={lastArticleRef}
                key={index}
                className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden transition-colors duration-300"
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
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
            );
          }

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden transition-colors duration-300"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
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
          );
        })}
      </div>

      {loading && <p className="text-center mt-6">Loading more articles...</p>}
      {error && <p className="text-center mt-6 text-red-500">{error}</p>}
    </div>
  );
};

export default News;
