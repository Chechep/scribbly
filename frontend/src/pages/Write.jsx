import { useState } from "react";
import toast from "react-hot-toast";

export default function Write({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePublish = () => {
    if (!title || !content) {
      toast.error("Please enter a title and content before publishing.");
      return;
    }

    // Here you would normally save the post to your backend/database
    toast.success(`Post titled "${title}" published successfully!`);

    // Reset form
    setTitle("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-rose-100 to-rose-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          Write Your Story
        </h1>

        <input
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg text-gray-900 dark:text-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />

        <textarea
          placeholder="Start writing your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full mb-4 px-4 py-2 border rounded-lg text-gray-900 dark:text-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
        />

        <button
          onClick={handlePublish}
          className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
