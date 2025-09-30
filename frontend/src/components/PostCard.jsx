// src/components/PostCard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegComment, FaHeart, FaReply } from "react-icons/fa";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fakeNames = [
    "Alex Mwangi", "Maya Jerop", "Ethan Kemboi", "Olivia Moraa",
    "Liam Mwaniki", "Sophia Njeri", "Noah Ochieng", "Ava Adhiambo",
    "James Sifuna", "Emma Wanjiku"
  ];

  // 🔹 Generate excerpt (50 words max)
  const generateExcerpt = (text, wordLimit = 50) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Use provided excerpt OR auto-generate
  const excerpt = post.excerpt || generateExcerpt(post.content);

  // 🔹 Load saved state from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(`post-${post.id}`));
    if (savedData) {
      setLikes(savedData.likes);
      setLiked(savedData.liked);
      setComments(savedData.comments);
    }
  }, [post.id]);

  // 🔹 Save state to localStorage
  useEffect(() => {
    localStorage.setItem(
      `post-${post.id}`,
      JSON.stringify({ likes, liked, comments })
    );
  }, [likes, liked, comments, post.id]);

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    setComments([
      ...comments,
      { id: Date.now(), name, text: newComment, replies: [] },
    ]);
    setNewComment("");
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [...c.replies, { id: Date.now(), name, text: replyText }],
            }
          : c
      )
    );
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="bg-white dark:bg-darkBg p-6 rounded-lg shadow-md hover:shadow-xl transition text-gray-900 dark:text-darkText">
      {/* Image */}
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-60 object-cover rounded-md mb-4"
      />

      {/* Title & Excerpt */}
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{excerpt}</p>

      {/* Actions */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-4 items-center text-gray-500 dark:text-gray-400">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-rose-600"
          >
            <FaHeart className={liked ? "text-rose-500" : ""} /> {likes}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 hover:text-rose-600"
          >
            <FaRegComment /> {comments.length}
          </button>
        </div>
        <Link
          to={`/post/${post.id}`}
          className="text-rose-600 font-semibold hover:underline"
        >
          Read more →
        </Link>
      </div>

      {/* Date */}
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">{post.date}</p>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
          {/* Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={handleAddComment}
              className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-md"
            >
              Post
            </button>
          </div>

          {/* Comment List */}
          {comments.map((comment) => (
            <div key={comment.id} className="mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.name}:</span>
                <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-xs text-rose-500 flex items-center gap-1 ml-2"
                >
                  <FaReply /> Reply
                </button>
              </div>

              {/* Reply Input */}
              {replyingTo === comment.id && (
                <div className="flex gap-2 mt-2 ml-6">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="font-semibold">{reply.name}:</span>
                      <p className="text-gray-700 dark:text-gray-300">
                        {reply.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
