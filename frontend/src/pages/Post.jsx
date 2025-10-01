// src/pages/Post.jsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaHeart, FaRegComment, FaReply, FaArrowLeft } from "react-icons/fa";
import posts from "../data/posts";

const Post = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  const [likes, setLikes] = useState(post?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const fakeNames = [
    "Alex Mwangi", "Maya Jerop", "Ethan Kemboi", "Olivia Moraa",
    "Liam Mwaniki", "Sophia Njeri", "Noah Ochieng", "Ava Adhiambo",
    "James Sifuna", "Emma Wanjiku"
  ];

  // Update darkMode if the html class changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Load from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(`post-${id}`));
    if (savedData) {
      setLikes(savedData.likes);
      setLiked(savedData.liked);
      setComments(savedData.comments);
    }
  }, [id]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      `post-${id}`,
      JSON.stringify({ likes, liked, comments })
    );
  }, [likes, liked, comments, id]);

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    setComments([...comments, { id: Date.now(), name, text: newComment, replies: [] }]);
    setNewComment("");
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, { id: Date.now(), name, text: replyText }] }
          : c
      )
    );
    setReplyText("");
    setReplyingTo(null);
  };

  const formatContent = (text) => {
    const words = text.split(" ");
    const paragraphs = [];
    for (let i = 0; i < words.length; i += 100) {
      paragraphs.push(words.slice(i, i + 100).join(" "));
    }
    return paragraphs;
  };

  if (!post) return <p className="text-center mt-10">Post not found</p>;

  // Suggestions without images
  const suggestions = posts.filter((p) => p.id !== id).slice(0, 4);

  return (
    <div className={`${darkMode ? "bg-black text-gray-100" : "bg-white text-gray-900"} min-h-screen w-full transition-colors duration-500 px-4 md:px-6 py-10`}>
      
      {/* Back Button */}
      <Link
        to="/"
        className="flex items-center gap-2 text-rose-600 hover:underline mb-6"
      >
        <FaArrowLeft /> Back
      </Link>

      {/* Post Image */}
      <img
        src={post.image}
        alt={post.title}
        className="w-full max-h-[400px] object-cover rounded-lg shadow-md mb-6"
      />

      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>{post.date}</p>

      {/* Content */}
      <div className={`${darkMode ? "prose prose-invert" : "prose"} max-w-none mb-8`}>
        {formatContent(post.content).map((para, i) => (
          <p key={i} className="mb-4">{para}</p>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-6 items-center mb-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-rose-500 hover:text-rose-600"
        >
          <FaHeart className={liked ? "text-rose-600" : ""} /> {likes}
        </button>
        <div className={`${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-2`}>
          <FaRegComment /> {comments.length}
        </div>
      </div>

      {/* Comments */}
      <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-300"} pt-4 mb-10`}>
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className={`flex-1 px-3 py-2 rounded-md border ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"}`}
          />
          <button
            onClick={handleAddComment}
            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-md"
          >
            Post
          </button>
        </div>

        {comments.map((comment) => (
          <div key={comment.id} className="mb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.name}:</span>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>{comment.text}</p>
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs text-rose-500 flex items-center gap-1 ml-2"
              >
                <FaReply /> Reply
              </button>
            </div>

            {replyingTo === comment.id && (
              <div className="flex gap-2 mt-2 ml-6">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className={`flex-1 px-3 py-2 rounded-md border ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                  autoFocus
                />
                <button
                  onClick={() => handleAddReply(comment.id)}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-md"
                >
                  Reply
                </button>
              </div>
            )}

            {comment.replies.length > 0 && (
              <div className="ml-6 mt-2 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{reply.name}:</span>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>{reply.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Suggested Posts */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {posts.filter((p) => p.id !== id).slice(0, 4).map((s) => (
            <li key={s.id}>
              <Link
                to={`/post/${s.id}`}
                className={`hover:text-rose-500 transition ${darkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Post;
