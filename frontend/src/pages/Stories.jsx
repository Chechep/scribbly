// src/pages/Stories.jsx
import PostCard from "../components/PostCard";
import postsData from "../data/posts";

const Stories = () => {
  return (
    <div className="bg-rose-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
          Posts
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsData.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stories;
