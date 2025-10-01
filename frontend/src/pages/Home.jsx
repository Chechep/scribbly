import { useState } from "react";
import Hero from "../components/Hero";
import PostCard from "../components/PostCard";
import initialPosts from "../data/posts";

const Home = ({ user }) => {
  const [posts, setPosts] = useState(initialPosts);

  // Function to add a new post dynamically
  const addPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]); // Add to beginning
  };

  return (
    <div className="bg-rose-50 dark:bg-gray-900 min-h-screen transition-colors duration-500">
      {/* Hero Section only for non-logged-in users */}
      {!user && <Hero onPublish={addPost} />}

      {/* Latest Posts Section */}
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          Latest Posts
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
